import test from 'node:test';
import assert from 'node:assert/strict';
import { newGame, isSolved } from '../engine/core.ts';
import { tutorialExample } from '../src/teaching-data.ts';
import { assertSolution } from './oracle.mjs';

test('the intentional complete tutorial illustration covers a legal physical Starter board', () => {
  const game = newGame(tutorialExample.dice, 'STARTER');
  game.placed = Object.fromEntries(tutorialExample.placements.map(p => [p.id, { ...p }]));
  assert.equal(isSolved(game), true);
  assertSolution(game, tutorialExample.placements);
});
