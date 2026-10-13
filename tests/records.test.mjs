import test from 'node:test';
import assert from 'node:assert/strict';
import { Records, RECORDS_KEY } from '../src/records.ts';
import { formatTime } from '../src/session.ts';
const levels = ['STARTER', 'JUNIOR', 'EXPERT', 'MASTER', 'WIZARD'];
const entry = (elapsedMs = 1000, finishedAt = 1700000000000) => ({ elapsedMs, finishedAt });
function storage(payload) {
  const values = new Map([['sentinel', 'keep']]);
  if (payload !== undefined) values.set(RECORDS_KEY, payload);
  return { values, getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
}

test('top five are independent at all levels and use raw milliseconds then oldest completion', () => {
  const records = new Records(storage());
  for (const level of levels) {
    for (const ms of [1009, 2000, 1001, 3000, 999, 4000, 5000]) records.insert(level, entry(ms));
    assert.deepEqual(records.lists[level].map(record => record.elapsedMs), [999, 1001, 1009, 2000, 3000]);
  }
  assert.equal(formatTime(1001), formatTime(1009));
  records.clear('STARTER');
  for (const date of [30, 20, 10, 20]) records.insert('STARTER', entry(1000, date));
  assert.deepEqual(records.lists.STARTER.map(record => record.finishedAt), [10, 20, 20, 30]);
  const first = records.lists.STARTER[1];
  records.insert('STARTER', entry(1000, 20));
  assert.equal(records.lists.STARTER[1].finishedAt, first.finishedAt);
  const memory = new Records();
  memory.insert('STARTER', entry());
  const older = memory.lists.STARTER[0];
  memory.insert('STARTER', entry());
  assert.equal(memory.lists.STARTER[0], older);
});

test('validation normalizes missing lists, strips extra fields, sorts and caps valid records', () => {
  const store = storage(JSON.stringify({ STARTER: [entry(300), { ...entry(100), dice: ['A1'] }, ...Array.from({ length: 6 }, (_, i) => entry(200 + i))], unknown: ['drop'] }));
  const records = new Records(store);
  assert.deepEqual(records.lists.STARTER.map(record => record.elapsedMs), [100, 200, 201, 202, 203]);
  assert.deepEqual(records.lists.WIZARD, []);
  records.insert('WIZARD', entry());
  const payload = JSON.parse(store.getItem(RECORDS_KEY));
  assert.deepEqual(Object.keys(payload), levels);
  for (const list of Object.values(payload)) for (const record of list) {
    assert.deepEqual(Object.keys(record), ['elapsedMs', 'finishedAt']);
  }
});

test('malformed JSON and payloads recover to empty lists with a notice', () => {
  for (const raw of ['{', 'null', 'true', '3', '[]', '"text"', '{"STARTER":{}}', '{"STARTER":null}']) {
    const records = new Records(storage(raw));
    assert.ok(records.notice.includes('discarded'));
    assert.ok(Object.values(records.lists).every(list => list.length === 0));
  }
  const records = new Records(storage());
  assert.equal(records.notice, '');
});

test('bad durations and dates are discarded while valid entries survive', () => {
  const bad = [null, {}, [], entry(-1), entry(.5), entry(Infinity), entry(NaN), entry(1, .5), entry(1, 8640000000000001), entry(1, 'today'), { elapsedMs: '1', finishedAt: 1 }];
  const records = new Records(storage(JSON.stringify({ STARTER: [...bad, entry()] })));
  assert.deepEqual(records.lists.STARTER, [entry()]);
  assert.ok(records.notice.includes('discarded'));
  assert.throws(() => records.insert('STARTER', entry(-1)), /valid/);
});

test('insertion and clear read current data and preserve other levels and unrelated keys', () => {
  const store = storage();
  const records = new Records(store);
  store.setItem(RECORDS_KEY, JSON.stringify({ WIZARD: [entry(50)], STARTER: [entry(20)] }));
  records.insert('JUNIOR', entry(10));
  assert.deepEqual(records.lists.WIZARD, [entry(50)]);
  store.setItem(RECORDS_KEY, JSON.stringify({ ...records.lists, EXPERT: [entry(30)] }));
  records.clear('STARTER');
  assert.deepEqual(records.lists.STARTER, []);
  assert.deepEqual(records.lists.EXPERT, [entry(30)]);
  assert.equal(store.getItem('sentinel'), 'keep');
  assert.deepEqual(new Records(store).lists, records.lists);
});

test('unavailable access and throwing reads/writes retain records in memory with a notice', () => {
  for (const store of [undefined, { getItem() { throw Error('blocked'); }, setItem() { throw Error('blocked'); } }, { getItem() { return null; }, setItem() { throw Error('quota'); } }]) {
    const records = new Records(store);
    records.insert('STARTER', entry(20));
    records.insert('WIZARD', entry(30));
    records.insert('STARTER', entry(10));
    assert.deepEqual(records.lists.STARTER, [entry(10), entry(20)]);
    assert.ok(records.notice.includes('will not survive reload'));
    records.clear('STARTER');
    assert.deepEqual(records.lists.WIZARD, [entry(30)]);
  }
  const store = storage();
  const records = new Records(store);
  records.insert('STARTER', entry());
  store.getItem = () => { throw Error('later failure'); };
  records.insert('STARTER', entry(50));
  assert.deepEqual(records.lists.STARTER, [entry(50), entry()]);
});
