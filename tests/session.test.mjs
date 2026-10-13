import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DICE, isSolved } from '../engine/core.ts';
import { freshSession, start, elapsed, formatTime, place, remove, undo, replay } from '../src/session.ts';

const fixtures = JSON.parse(readFileSync(new URL('../fixtures/rolls.json', import.meta.url)));
function begin(fixture = fixtures[0], now = 1000) {
  let die = 0;
  return start(freshSession(fixture.level), now, () => (DICE[die].indexOf(fixture.dice[die++]) + .5) / 6);
}

test('fresh ready hides dice, Start draws exactly seven faces and repeated starts do nothing', () => {
  const ready = freshSession();
  assert.deepEqual(ready, { phase: 'ready', mode: 'ranked', level: 'STARTER' });
  let calls = 0;
  const running = start(ready, 100, () => { calls++; return .1; });
  assert.equal(calls, 7);
  assert.equal(start(running, 200, () => { throw Error('unexpected draw'); }), running);
  assert.equal(place(ready, fixtures[0].solution[0], 500), ready);
  assert.equal(undo(ready), ready);
  assert.equal(replay(ready), ready);
});

test('transactions copy proposals, reject invalid/no-op actions, and Undo restores movement/removal', () => {
  let session = begin();
  const proposal = { ...fixtures[0].solution[0] };
  const empty = session;
  session = place(session, proposal, 2000);
  proposal.x = 0;
  assert.equal(session.game.placed.navy.x, 4);
  assert.equal(session.history.length, 1);
  assert.equal(place(session, fixtures[0].solution[0], 3000), session);
  assert.equal(place(session, { ...proposal, x: -1 }, 3000), session);
  assert.equal(remove(session, 'cyan', 4000), session);
  const placed = session;
  session = place(session, { ...fixtures[0].solution[0], x: 1 }, 5000);
  const moved = session;
  session = remove(session, 'navy', 6000);
  assert.equal(session.history.length, 3);
  session = undo(session);
  assert.deepEqual(session.game, moved.game);
  session = undo(session);
  assert.deepEqual(session.game, placed.game);
  session = undo(session);
  assert.deepEqual(session.game, empty.game);
  assert.equal(undo(session), session);
  assert.equal(session.startedAt, 1000);
  assert.equal(session.mode, 'ranked');
  assert.equal(elapsed(session, 100000), 99000);
});

test('active Undo has no arbitrary history limit', () => {
  let session = begin();
  for (let i = 0; i < 150; i++) {
    session = place(session, { ...fixtures[0].solution[0], x: i % 2 ? 4 : 1 }, 2000 + i);
  }
  assert.equal(session.history.length, 150);
  for (let i = 0; i < 150; i++) session = undo(session);
  assert.deepEqual(session.game.placed, {});
});

test('every fixture completes through commits, freezes once, and rejects all further editing', () => {
  for (const fixture of fixtures) {
    let session = begin(fixture);
    for (const [i, placement] of fixture.solution.entries()) {
      session = place(session, placement, 1000 + (i + 1) * 1234);
    }
    assert.equal(session.phase, 'completed');
    assert.ok(isSolved(session.game));
    assert.equal(session.elapsedMs, 11106);
    assert.equal(session.finishedAt, 12106);
    assert.ok(!Object.hasOwn(session, 'history'));
    assert.equal(elapsed(session, 999999), 11106);
    assert.equal(place(session, fixture.solution[0], 99999), session);
    assert.equal(remove(session, 'navy', 99999), session);
    assert.equal(undo(session), session);
    assert.equal(start(session, 99999), session);
  }
});

test('replay keeps only the layout/level and starts practice without RNG or an old timer', () => {
  const running = place(begin(), fixtures[0].solution[0], 2000);
  const ready = replay(running);
  assert.deepEqual(ready, { phase: 'ready', mode: 'practice', level: 'WIZARD', dice: fixtures[0].dice });
  assert.equal(elapsed(ready, 100000), 0);
  const practice = start(ready, 100000, () => { throw Error('practice must not roll'); });
  assert.equal(practice.mode, 'practice');
  assert.deepEqual(practice.game.placed, {});
  assert.deepEqual(practice.history, []);
  assert.equal(practice.startedAt, 100000);
  assert.deepEqual(freshSession(practice.level), { phase: 'ready', mode: 'ranked', level: 'WIZARD' });
  assert.deepEqual(freshSession('MASTER'), { phase: 'ready', mode: 'ranked', level: 'MASTER' });
});

test('wall time includes delayed callbacks, background and confirmation periods; formatting floors', () => {
  const session = begin();
  assert.equal(elapsed(session, 7500), 6500);
  assert.equal(elapsed(session, 367500), 366500);
  assert.equal(elapsed(session, 0), 0);
  for (const [ms, text] of [[0, '00:00.00'], [9, '00:00.00'], [10, '00:00.01'], [59999, '00:59.99'], [60000, '01:00.00'], [6000000, '100:00.00']]) {
    assert.equal(formatTime(ms), text);
  }
});
