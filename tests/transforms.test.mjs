import test from 'node:test';
import assert from 'node:assert/strict';
import { ORIENTATIONS, PIECE_IDS, firstAnchor, transformPiece } from '../engine/core.ts';

test('every orientation and occupied anchor closes after four rotations and two flips', () => {
  for (const id of PIECE_IDS) {
    ORIENTATIONS[id].forEach((shape, orientation) => {
      for (const anchor of shape) {
        const before = structuredClone(ORIENTATIONS);
        for (const [action, count] of [['rotate', 4], ['flip', 2]]) {
          let draft = { orientation, anchor };
          for (let i = 0; i < count; i++) {
            draft = transformPiece(id, draft.orientation, draft.anchor, action);
            assert.ok(ORIENTATIONS[id][draft.orientation].some(cell =>
              cell[0] === draft.anchor[0] && cell[1] === draft.anchor[1]));
          }
          assert.deepEqual(draft, { orientation, anchor });
        }
        assert.deepEqual(ORIENTATIONS, before);
      }
      assert.deepEqual(firstAnchor(id, orientation), shape[0]);
    });
  }
});

test('clockwise rotation and left-right reflection match literal geometry', () => {
  const rotate = transformPiece('cyan', 0, [0, 0], 'rotate');
  assert.deepEqual(ORIENTATIONS.cyan[rotate.orientation], [[0, 0], [1, 0], [2, 0], [0, 1]]);
  assert.deepEqual(rotate.anchor, [2, 0]);
  const flip = transformPiece('cyan', 0, [0, 0], 'flip');
  assert.deepEqual(ORIENTATIONS.cyan[flip.orientation], [[1, 0], [1, 1], [0, 2], [1, 2]]);
  assert.deepEqual(flip.anchor, [1, 0]);
  for (const id of ['cyan', 'red']) {
    const rotations = new Set();
    let draft = { orientation: 0, anchor: firstAnchor(id, 0) };
    for (let i = 0; i < 4; i++) {
      rotations.add(draft.orientation);
      draft = transformPiece(id, draft.orientation, draft.anchor, 'rotate');
    }
    assert.ok(!rotations.has(transformPiece(id, 0, firstAnchor(id, 0), 'flip').orientation));
  }
});

test('symmetric geometry still transforms the occupied anchor and holes are rejected', () => {
  assert.deepEqual(transformPiece('green', 0, [0, 0], 'rotate'), { orientation: 0, anchor: [1, 0] });
  assert.deepEqual(transformPiece('brown', 0, [0, 0], 'flip'), { orientation: 0, anchor: [1, 0] });
  assert.deepEqual(firstAnchor('yellow', 0), [1, 0]);
  assert.deepEqual(firstAnchor('red', 0), [1, 0]);
  assert.throws(() => transformPiece('yellow', 0, [0, 0], 'rotate'), /occupied anchor/);
});
