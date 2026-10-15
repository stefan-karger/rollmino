import test from 'node:test';
import assert from 'node:assert/strict';
import { canPlace, isSolved, ORIENTATIONS } from '../engine/core.ts';
import { beginExercise, exercisePlace, exerciseRemove, exerciseUndo, fixedPiece, exerciseTarget } from '../src/exercise.ts';
import { assertSolution } from './oracle.mjs';

const fixed = [
  { id: 'navy', orientation: 0, x: 4, y: 5 },
  { id: 'yellow', orientation: 3, x: 2, y: 0 },
  { id: 'purple', orientation: 0, x: 0, y: 1 },
  { id: 'orange', orientation: 0, x: 2, y: 3 },
  { id: 'red', orientation: 0, x: 1, y: 4 },
  { id: 'green', orientation: 0, x: 0, y: 3 },
];
const brown = { id: 'brown', orientation: 0, x: 1, y: 0 };
const grey = { id: 'grey', orientation: 1, x: 5, y: 2 };
const cyan = { id: 'cyan', orientation: 6, x: 4, y: 0 };
const answer = [...fixed, brown, grey, cyan];

test('literal six-piece Starter baseline leaves ten cells and independently preserves fixed placements', () => {
  const exercise = beginExercise();
  assert.deepEqual(exercise.game.dice, ['A1', 'B2', 'C3', 'F2', 'D6', 'E5', 'A6']);
  assert.equal(exercise.game.level, 'STARTER');
  assert.deepEqual(Object.values(exercise.game.placed), fixed);
  assert.equal(fixed.reduce((sum, p) => sum + ORIENTATIONS[p.id][p.orientation].length, 0), 19);
  assertSolution(exercise.game, answer);
  assert.deepEqual(exercise.history, []);
  assert.equal(isSolved(exercise.game), false);
  assert.equal(exerciseTarget(exercise), 'B1');
  assert.equal(Object.hasOwn(exercise, 'startedAt'), false);
  assert.equal(Object.hasOwn(exercise, 'mode'), false);
});

test('exercise transactions reject fixed, invalid and no-op edits while Undo stops at the baseline', () => {
  let exercise = beginExercise();
  const baseline = exercise;
  for (const p of fixed) {
    assert.equal(fixedPiece(p.id), true);
    assert.equal(exercisePlace(exercise, { ...p, x: 0 }), exercise);
    assert.equal(exerciseRemove(exercise, p.id), exercise);
  }
  assert.equal(exercisePlace(exercise, { ...brown, x: 0 }), exercise);
  assert.equal(exercisePlace(exercise, { ...brown, x: 5 }), exercise);
  assert.equal(exercisePlace(exercise, { ...brown, x: 2 }), exercise);
  assert.equal(exercisePlace(exercise, { ...brown, id: 'unknown' }), exercise);
  assert.equal(exerciseUndo(exercise), exercise);
  const proposal = { ...brown };
  exercise = exercisePlace(exercise, proposal);
  proposal.x = 0;
  assert.deepEqual(exercise.game.placed.brown, brown);
  assert.equal(exercise.history.length, 1);
  assert.equal(exercise.step, 1);
  assert.equal(exercisePlace(exercise, brown), exercise);
  exercise = exerciseUndo(exercise);
  assert.deepEqual(exercise.game, baseline.game);
  assert.equal(exercise.history.length, 0);
  assert.equal(exercise.step, 2);
  assert.equal(exerciseUndo(exercise), exercise);
  assert.deepEqual(baseline.game.placed, Object.fromEntries(fixed.map(p => [p.id, p])));
});

test('Undo recovers off-step moves and removals; restarting restores the initial lesson', () => {
  let exercise = beginExercise();
  const offStep = { id: 'brown', orientation: 1, x: 5, y: 2 };
  assert.equal(canPlace(exercise.game, offStep), true);
  exercise = exercisePlace(exercise, offStep);
  assert.equal(exercise.step, 0);
  assert.equal(exercise.history.length, 1);
  exercise = exerciseUndo(exercise);
  assert.deepEqual(exercise.game, beginExercise().game);
  assert.deepEqual(exercise.history, []);
  exercise = exerciseUndo(exercisePlace(exercise, brown));
  exercise = exercisePlace(exercise, brown);
  assert.equal(exercise.step, 3);
  assert.equal(exerciseTarget(exercise), 'F3');
  const beforeRemove = exercise;
  exercise = exerciseRemove(exercise, 'brown');
  assert.equal(exercise.step, 2);
  exercise = exerciseUndo(exercise);
  assert.equal(exercise.step, 3);
  assert.deepEqual(exercise.game, beforeRemove.game);
  assert.deepEqual(exercise.history, beforeRemove.history);
  const moved = exercisePlace(exercise, cyan);
  assert.equal(moved.step, 3);
  const recovered = exerciseUndo(moved);
  assert.deepEqual(recovered.game, exercise.game);
  assert.deepEqual(recovered.history, exercise.history);
  while (exercise.history.length) exercise = exerciseUndo(exercise);
  assert.deepEqual(exercise.game, beginExercise().game);
  assert.equal(exercise.step, 2);
  const restarted = beginExercise();
  assert.equal(restarted.step, 0);
  assert.deepEqual(restarted.history, []);
  assert.deepEqual(Object.values(restarted.game.placed), fixed);
  assert.deepEqual(Object.values(moved.game.placed).filter(p => fixedPiece(p.id)), fixed);
});

test('intended Undo path, early alternative finish and terminal editing use exact solved coverage', () => {
  let exercise = beginExercise();
  exercise = exercisePlace(exercise, brown);
  exercise = exerciseUndo(exercise);
  exercise = exercisePlace(exercise, brown);
  exercise = exercisePlace(exercise, grey);
  assert.equal(exercise.step, 4);
  assert.equal(exerciseTarget(exercise), 'E3');
  exercise = exercisePlace(exercise, cyan);
  assert.equal(exercise.phase, 'completed');
  assert.equal(isSolved(exercise.game), true);
  assertSolution(beginExercise().game, Object.values(exercise.game.placed));
  assert.equal(exercisePlace(exercise, brown), exercise);
  assert.equal(exerciseRemove(exercise, 'brown'), exercise);
  assert.equal(exerciseUndo(exercise), exercise);
  let reordered = beginExercise();
  for (const p of [cyan, grey, brown]) reordered = exercisePlace(reordered, p);
  assert.equal(reordered.phase, 'completed');
  assertSolution(reordered.game, answer);
  const fresh = beginExercise();
  fresh.game.placed.navy.x = 0;
  assert.equal(exercise.game.placed.navy.x, 4);
  assert.equal(beginExercise().game.placed.navy.x, 4);
});
