import test from 'node:test';
import assert from 'node:assert/strict';
import { tutorialOffer, ONBOARDING_KEY } from '../src/onboarding.ts';
import { Records, RECORDS_KEY } from '../src/records.ts';

test('only the literal handled flag suppresses an offer and one choice writes only that key', () => {
  for (const raw of [null, '', '{bad', 'true', 'false', 'null', '{"handled":true}', 'handled ']) {
    const values = new Map([[ONBOARDING_KEY, raw], ['sentinel', 'keep'], [RECORDS_KEY, '{"STARTER":[]}']]);
    const writes = [];
    const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => { writes.push([key, value]); values.set(key, value); } };
    const offer = tutorialOffer(storage);
    assert.equal(offer.offered, true);
    offer.handle(); offer.handle();
    assert.equal(offer.offered, false);
    assert.deepEqual(writes, [[ONBOARDING_KEY, 'handled']]);
    assert.equal(values.get(RECORDS_KEY), '{"STARTER":[]}');
    assert.equal(values.get('sentinel'), 'keep');
    const returning = tutorialOffer(storage);
    assert.equal(returning.offered, false);
    returning.handle();
    assert.equal(writes.length, 1);
    const records = new Records(storage);
    records.clear('STARTER');
    assert.equal(values.get(ONBOARDING_KEY), 'handled');
  }
});

test('missing, throwing reads and failed writes retain handling in page memory', () => {
  for (const storage of [undefined, { getItem() { throw Error('read'); }, setItem() { throw Error('write'); } }, { getItem() { return null; }, setItem() { throw Error('quota'); } }]) {
    const offer = tutorialOffer(storage);
    assert.equal(offer.offered, true);
    assert.doesNotThrow(() => offer.handle());
    assert.equal(offer.offered, false);
    assert.equal(tutorialOffer(storage).offered, true);
  }
});
