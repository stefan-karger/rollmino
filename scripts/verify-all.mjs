import assert from 'node:assert/strict';
import { DICE, SHAPES, ORIENTATIONS, PIECE_IDS, newGame, solve } from '../engine/core.ts';
import { assertSolution } from '../tests/oracle.mjs';

assert.equal(PIECE_IDS.reduce((sum, id) => sum + SHAPES[id].length, 0), 29);
assert.equal(PIECE_IDS.reduce((sum, id) => sum + ORIENTATIONS[id].length, 0), 28);
assert.equal(new Set(DICE.flat()).size, 36);
assert.ok(DICE.every(faces => faces.length === 6));
const uniqueDice = DICE.map(faces => [...new Set(faces)]);
assert.equal(uniqueDice.reduce((n, faces) => n * faces.length, 1), 62208);

const example = newGame(['A1','B2','C3','F2','D6','E5','A6'], 'WIZARD');
const complete = solve(example);
assert.ok(complete);
assertSolution(example, complete);

let checked = 0;
const start = performance.now();
for (const a of uniqueDice[0])
for (const b of uniqueDice[1])
for (const c of uniqueDice[2])
for (const d of uniqueDice[3])
for (const e of uniqueDice[4])
for (const f of uniqueDice[5])
for (const g of uniqueDice[6]) {
  const game = newGame([a,b,c,d,e,f,g], 'WIZARD');
  const solution = solve(game);
  assert.ok(solution, `Unsolvable Wizard roll: ${game.dice.join(' ')}`);
  assertSolution(game, solution);
  checked++;
}
assert.equal(checked, 62208);
console.log(`Independently validated ${checked} Wizard answers in ${((performance.now()-start)/1000).toFixed(2)} s.`);
