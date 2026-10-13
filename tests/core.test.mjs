import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  DICE, SHAPES, PIECE_IDS, ORIENTATIONS, RESTRICTED,
  newGame, validateDice, rollDice, canPlace, isSolved, solve,
} from '../engine/core.ts';

const fixtures = JSON.parse(readFileSync(new URL('../fixtures/rolls.json', import.meta.url), 'utf8'));
const roll = fixtures[0].dice;
const levels = ['STARTER', 'JUNIOR', 'EXPERT', 'MASTER', 'WIZARD'];

function completedGame() {
  const game = newGame(roll, 'WIZARD');
  for (const p of fixtures[0].solution) game.placed[p.id] = {...p};
  return game;
}

test('a completed fixture with truncated dice is not solved', () => {
  const game = completedGame();
  game.dice = ['A1'];
  assert.equal(isSolved(game), false);
});

test('a completed fixture with swapped map keys and IDs is not solved', () => {
  const game = completedGame();
  game.placed.navy = {...game.placed.brown};
  game.placed.brown = {id:'navy', orientation:0, x:1, y:0};
  assert.equal(isSolved(game), false);
});

test('sparse dice are rejected', () => {
  assert.throws(() => validateDice(Array(7)), /physical dice order/);
});

test('unknown runtime levels are rejected by newGame', () => {
  assert.throws(() => newGame(roll, 'INVALID'), /level/i);
});

function cells(p) {
  return ORIENTATIONS[p.id][p.orientation].map(([dx,dy]) => [dx+p.x,dy+p.y]);
}
function overlap(a,b) {
  return cells(a).some(([x,y]) => cells(b).some(([u,v]) => x===u && y===v));
}
function touchEdge(a,b) {
  return cells(a).some(([x,y]) => cells(b).some(([u,v]) => Math.abs(x-u)+Math.abs(y-v)===1));
}
function findContact(firstId, secondId, contact = touchEdge) {
  const blank = newGame(roll,'STARTER');
  function* candidates(id) {
    for (let orientation=0; orientation<ORIENTATIONS[id].length; orientation++) {
      for (let y=0;y<6;y++) for (let x=0;x<6;x++) {
        const p={id,orientation,x,y};
        if (canPlace(blank,p)) yield p;
      }
    }
  }
  for (const a of candidates(firstId)) {
    for (const b of candidates(secondId)) {
      if (!overlap(a,b) && contact(a,b)) return [a,b];
    }
  }
  throw new Error(`No contact pair ${firstId}/${secondId}`);
}

test('7 physical dice, 42 faces and partition of 36 board coordinates', () => {
  assert.deepEqual(DICE, [
    ['A1','C1','D1','D2','E2','F3'],
    ['A2','B2','C2','A3','B1','B3'],
    ['C3','D3','E3','B4','C4','D4'],
    ['E1','F2','F2','B6','A5','A5'],
    ['A4','B5','C6','C5','D6','F6'],
    ['E4','F4','E5','F5','D5','E6'],
    ['F1','F1','F1','A6','A6','A6'],
  ]);
  assert.equal(DICE.length,7);
  assert.ok(DICE.every(d=>d.length===6));
  assert.equal(new Set(DICE.flat()).size,36);
  const uniqueCoords = DICE.map(d=>[...new Set(d)]);
  const board = [...'ABCDEF'].flatMap(column => [1,2,3,4,5,6].map(row => `${column}${row}`));
  assert.deepEqual(uniqueCoords.flat().sort(), board);
  assert.deepEqual(uniqueCoords.map(d=>d.length),[6,6,6,4,6,6,2]);
  assert.equal(uniqueCoords.reduce((p,d)=>p*d.length,1),62208);
  assert.equal(DICE[3].filter(f=>f==='F2').length,2);
  assert.equal(DICE[3].filter(f=>f==='A5').length,2);
  assert.equal(DICE[6].filter(f=>f==='F1').length,3);
  assert.equal(DICE[6].filter(f=>f==='A6').length,3);
});

test('roll samples physical sides, retaining repeated-face likelihood', () => {
  assert.deepEqual(rollDice(()=>0),DICE.map(d=>d[0]));
  assert.deepEqual(rollDice(()=>0.9999999),DICE.map(d=>d[5]));
  assert.equal(rollDice(()=>0.34)[6],'F1'); // third of six faces (0-based 2)
  assert.equal(rollDice(()=>0.84)[6],'A6'); // sixth of six faces (0-based 5)
  for (let face = 0; face < 6; face++) {
    assert.deepEqual(rollDice(() => (face + 0.5) / 6), DICE.map(d => d[face]));
    assert.deepEqual(rollDice(() => face / 6), DICE.map(d => d[face]));
  }
  const indices = [0,1,0,1,4,2,3];
  let calls = 0;
  assert.deepEqual(rollDice(() => (indices[calls++] + 0.5) / 6), roll);
  assert.equal(calls, 7);
  assert.deepEqual(rollDice(() => 0), rollDice(() => 0), 'fresh rolls may repeat');
});

test('invalid random values are rejected on every die', () => {
  for (const value of [NaN, Infinity, -Infinity, -0.1, 1, 2, undefined, null, '0.5', true]) {
    for (let badDie = 0; badDie < 7; badDie++) {
      let calls = 0;
      assert.throws(() => rollDice(() => calls++ === badDie ? value : 0.5), /random number/);
    }
  }
});

test('9 pieces, 29 squares, 28 orientations and 625 candidate placements', () => {
  assert.deepEqual(SHAPES, {
    navy: [[0,0]],
    brown: [[0,0],[1,0]],
    orange: [[0,0],[1,0],[2,0]],
    purple: [[0,0],[0,1],[1,1]],
    grey: [[0,0],[1,0],[2,0],[3,0]],
    green: [[0,0],[1,0],[0,1],[1,1]],
    cyan: [[0,0],[0,1],[0,2],[1,2]],
    yellow: [[1,0],[0,1],[1,1],[2,1]],
    red: [[0,1],[1,1],[1,0],[2,0]],
  });
  assert.deepEqual(PIECE_IDS, ['navy','brown','orange','purple','grey','green','cyan','yellow','red']);
  assert.equal(PIECE_IDS.length,9);
  assert.equal(PIECE_IDS.reduce((sum,id)=>sum+SHAPES[id].length,0),29);
  assert.deepEqual(PIECE_IDS.map(id=>ORIENTATIONS[id].length),[1,2,2,4,2,1,8,4,4]);
  let inBounds=0;
  for(const id of PIECE_IDS) for(const orientation of ORIENTATIONS[id]) {
    assert.equal(new Set(orientation.map(([x,y])=>`${x},${y}`)).size,orientation.length);
    assert.equal(Math.min(...orientation.map(([x])=>x)),0);
    assert.equal(Math.min(...orientation.map(([,y])=>y)),0);
    const width = 1+Math.max(...orientation.map(([x])=>x));
    const height = 1+Math.max(...orientation.map(([,y])=>y));
    inBounds += (7-width)*(7-height);
  }
  assert.equal(inBounds,625);
});

test('level restrictions are correctly specified (Master differs from Expert)', () => {
  assert.deepEqual(RESTRICTED.STARTER,[]);
  assert.deepEqual(RESTRICTED.JUNIOR,['navy','brown']);
  assert.deepEqual(RESTRICTED.EXPERT,['navy','brown','orange']);
  assert.deepEqual(RESTRICTED.MASTER,['brown','orange','purple']);
  assert.deepEqual(RESTRICTED.WIZARD,['navy','brown','orange','purple']);
});

test('blocker overlap and leaving 6x6 board are illegal', () => {
  const g = newGame(roll);
  assert.equal(canPlace(g,{id:'navy',orientation:0,x:0,y:0}),false); // A1 blocker
  assert.equal(canPlace(g,{id:'navy',orientation:0,x:6,y:0}),false);
  assert.equal(canPlace(g,{id:'brown',orientation:0,x:5,y:5}),false);
  assert.equal(canPlace(g,{id:'navy',orientation:99,x:2,y:3}),false);
  assert.equal(canPlace(g,{id:'navy',orientation:0,x:1.5,y:3}),false);
});

test('edge contact is restricted only at the appropriate levels', () => {
  const cases = [
    ['navy','brown', ['JUNIOR','EXPERT','WIZARD']],
    ['navy','orange', ['EXPERT','WIZARD']],
    ['navy','purple', ['WIZARD']],
    ['brown','orange', ['EXPERT','MASTER','WIZARD']],
    ['brown','purple', ['MASTER','WIZARD']],
    ['orange','purple', ['MASTER','WIZARD']],
  ];
  for (const [firstId,secondId,reject] of cases) {
    const [a,b] = findContact(firstId,secondId);
    for (const level of levels) for (const [fixed, proposed] of [[a,b], [b,a]]) {
      const game = newGame(roll,level);
      game.placed[fixed.id] = fixed;
      assert.equal(canPlace(game,proposed), !reject.includes(level), `${level}: ${fixed.id}/${proposed.id}`);
    }
  }
});

test('diagonal-only touching is legal even in Wizard', () => {
  const ids = ['navy','brown','orange','purple'];
  for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) {
    const [a,b] = findContact(ids[i],ids[j], (a,b) => !touchEdge(a,b)
      && cells(a).some(([x,y]) => cells(b).some(([u,v]) => Math.abs(x-u) === 1 && Math.abs(y-v) === 1)));
    for (const level of levels) for (const [fixed,proposed] of [[a,b],[b,a]]) {
      const game = newGame(roll,level);
      game.placed[fixed.id] = fixed;
      assert.equal(canPlace(game,proposed),true, `${level}: diagonal ${fixed.id}/${proposed.id}`);
    }
  }
});

test('fixtures are reproducibly solvable with complete, legal Wizard boards', () => {
  assert.ok(fixtures.length >= 3);
  for(const fixture of fixtures) {
    const game = newGame(fixture.dice,fixture.level);
    assert.equal(isSolved(game),false);
    assert.equal(fixture.solution.length,9);
    for(const p of fixture.solution) {
      assert.equal(canPlace(game,p),true,`${fixture.id}: ${p.id}`);
      game.placed[p.id]=p;
    }
    assert.equal(isSolved(game),true,`fixture ${fixture.id}`);
  }
});

test('placement checks do not mutate committed state or the proposal', () => {
  const fixture=fixtures[0];
  const game = newGame(fixture.dice,'WIZARD');
  for(const p of fixture.solution.slice(0,4)) game.placed[p.id]=p;
  const before = structuredClone(game);
  const proposed = Object.freeze({...fixture.solution[4]});
  assert.equal(canPlace(game, proposed), true);
  assert.equal(isSolved(game), false);
  assert.deepEqual(game, before);
});

test('a legal but unsolvable partial position returns null without mutation', () => {
  const game = newGame(roll,'WIZARD');
  const p={id:'navy',orientation:0,x:1,y:5}; // B6 free, but forces a Wizard dead end
  assert.equal(canPlace(game,p),true);
  game.placed.navy=p;
  const before = structuredClone(game);
  assert.equal(solve(game),null);
  assert.deepEqual(game,before);
});

test('dice validation rejects missing, inherited, non-string and wrong-order faces', () => {
  assert.doesNotThrow(() => validateDice(roll));
  const hole = [...roll];
  delete hole[3];
  const inherited = [...roll];
  delete inherited[0];
  const prototype = Object.create(Array.prototype);
  prototype[0] = roll[0];
  Object.setPrototypeOf(inherited, prototype);
  for (const dice of [null, undefined, {}, 'A1', [], roll.slice(0,6), ['A1','A1',...roll.slice(2)], Array(7), hole, inherited,
    [...roll, 'A1'], [undefined, ...roll.slice(1)], [null, ...roll.slice(1)],
    [new String('A1'), ...roll.slice(1)], ['B2', 'A1', ...roll.slice(2)]]) {
    assert.throws(() => validateDice(dice), /physical dice order/);
    assert.throws(() => newGame(dice), /physical dice order/);
    const game = {...completedGame(), dice};
    assert.equal(canPlace(game, {id:'navy', orientation:0, x:1, y:0}), false);
    assert.equal(isSolved(game), false);
    assert.throws(() => solve(game), /physical dice/);
  }
});

test('newGame validates own level keys and copies the roll', () => {
  for (const level of ['INVALID', 'toString', 'constructor', '__proto__', null, 0, {}]) {
    assert.throws(() => newGame(roll, level), /level/);
  }
  for (const level of levels) {
    const dice = [...roll];
    const game = newGame(dice,level);
    dice[0] = 'C1';
    assert.deepEqual(game, {dice:roll, level, placed:{}});
  }
});

test('malformed setups fail closed and the solver throws a setup error', () => {
  const game = completedGame();
  for (const invalid of [null, undefined, [], {}, 0,
    {...game, level:undefined}, {...game, level:null}, {...game, level:'INVALID'},
    {...game, level:'toString'}, {...game, level:'constructor'}, {...game, level:'__proto__'},
    Object.create(game)]) {
    assert.equal(canPlace(invalid, {id:'navy', orientation:0, x:1, y:0}), false);
    assert.equal(isSolved(invalid), false);
    assert.throws(() => solve(invalid), /physical dice and a known level/);
  }
});

test('malformed proposals reject unknown or inherited IDs and non-integer geometry', () => {
  const game = newGame(roll);
  const valid = {id:'navy', orientation:0, x:1, y:0};
  const invalid = [null, undefined, {}, [], 'navy', Object.create(valid)];
  for (const id of ['unknown', 'toString', 'constructor', '__proto__', undefined, null]) {
    invalid.push({...valid, id});
  }
  for (const key of ['orientation', 'x', 'y']) {
    const missing = {...valid};
    delete missing[key];
    invalid.push(missing);
    for (const value of [undefined, null, NaN, Infinity, -Infinity, 0.5, '0', true, -1, 99]) {
      invalid.push({...valid, [key]:value});
    }
  }
  for (const proposal of invalid) assert.equal(canPlace(game,proposal), false);
  for (const id of PIECE_IDS) {
    assert.equal(canPlace(game,{...valid, id, orientation:ORIENTATIONS[id].length}), false);
  }
});

test('malformed committed maps return false or null, including the old footprint', () => {
  const valid = {id:'navy', orientation:0, x:1, y:0};
  const maps = [undefined, null, [], 'navy',
    {navy:undefined}, {navy:null}, {navy:{}}, {navy:Object.create(valid)},
    {navy:{...valid, orientation:0.5}}, {navy:{...valid, x:-1}},
    {navy:{...valid, id:'brown'}}, {navy:{...valid, id:'constructor'}},
    {unknown:valid}, {constructor:valid}, {['__proto__']:valid}, {[Symbol('piece')]:valid},
    Object.create({navy:valid}),
    Object.defineProperty({}, 'unknown', {value:valid}),
  ];
  for (const placed of maps) {
    const game = {...newGame(roll), placed};
    assert.equal(canPlace(game,valid),false);
    assert.equal(isSolved(game),false);
    assert.equal(solve(game),null);
  }
  const missing = newGame(roll);
  delete missing.placed;
  assert.equal(canPlace(missing,valid),false);
  assert.equal(isSolved(missing),false);
  assert.equal(solve(missing),null);
  const game = newGame(roll);
  game.placed = Object.create(null);
  assert.equal(canPlace(game,valid),true, 'an own-key map with no prototype is valid');
});

test('own non-enumerable placement fields retain their geometry during validation and solving', () => {
  const game = completedGame();
  const original = game.placed.navy;
  game.placed.navy = Object.defineProperties({}, Object.fromEntries(
    Object.entries(original).map(([key,value]) => [key, {value}]),
  ));
  assert.equal(isSolved(game),true);
  assert.deepEqual(solve(game).find(p => p.id === 'navy'),original);
});

test('invalid fixed occupancy and contacts cannot be repaired by ignoring the moved piece', () => {
  const navy = {id:'navy', orientation:0, x:1, y:0};
  for (const placed of [
    {navy:{...navy, x:0}}, // A1 blocker
    {navy, brown:{id:'brown', orientation:0, x:1, y:0}}, // overlap
    {navy, brown:{id:'brown', orientation:0, x:2, y:0}}, // forbidden edge
    {brown:{id:'brown', orientation:0, x:5, y:5}}, // out of bounds
  ]) {
    const game = {...newGame(roll,'WIZARD'), placed};
    assert.equal(canPlace(game,{...navy, x:4, y:5}),false);
    assert.equal(isSolved(game),false);
    assert.equal(solve(game),null);
  }
});

test('other-piece overlap rejects while own-footprint moves preserve the input', () => {
  const occupied = newGame(roll);
  occupied.placed.navy = {id:'navy', orientation:0, x:3, y:0};
  assert.equal(canPlace(occupied, {id:'brown', orientation:0, x:3, y:0}), false);
  const game = newGame(roll);
  game.placed.brown = {id:'brown', orientation:0, x:1, y:0};
  const before = structuredClone(game);
  assert.equal(canPlace(game,{id:'brown', orientation:0, x:2, y:0}),true);
  assert.equal(canPlace(game,game.placed.brown),true);
  assert.deepEqual(game,before);
});

test('restricted pieces may contact blockers, boundaries and every unrestricted piece', () => {
  const game = newGame(roll,'WIZARD');
  assert.equal(canPlace(game,{id:'navy', orientation:0, x:1, y:0}),true); // boundary, A1 and B2
  for (const special of ['navy','brown','orange','purple']) {
    for (const ordinary of ['grey','green','cyan','yellow','red']) {
      const [a,b] = findContact(special,ordinary);
      for (const [fixed,proposed] of [[a,b],[b,a]]) {
        const game = newGame(roll,'WIZARD');
        game.placed[fixed.id] = fixed;
        assert.equal(canPlace(game,proposed),true, `${fixed.id}/${proposed.id}`);
      }
    }
  }
});

test('F-to-A row boundaries never create a restricted contact', () => {
  const a = {id:'navy', orientation:0, x:5, y:3}; // F4
  const b = {id:'brown', orientation:0, x:0, y:4}; // A5-B5
  for (const [fixed,proposed] of [[a,b],[b,a]]) {
    const game = newGame(roll,'WIZARD');
    game.placed[fixed.id] = fixed;
    assert.equal(canPlace(game,proposed),true);
  }
});

test('complete wins require the exact nine IDs and full legal coverage', () => {
  const blocked = completedGame();
  blocked.placed.navy = {id:'navy', orientation:0, x:0, y:0}; // All nine IDs, but A1 is blocked.
  assert.equal(isSolved(blocked), false);
  for (const id of PIECE_IDS) {
    const game = completedGame();
    delete game.placed[id];
    assert.equal(isSolved(game),false);
  }
  for (const [key,value] of [['unknown', fixtures[0].solution[0]], ['navy', null]]) {
    const game = completedGame();
    game.placed[key] = value;
    assert.equal(isSolved(game),false);
    assert.equal(solve(game),null);
  }
  for (const fixture of fixtures) for (const level of levels) {
    const game = newGame(fixture.dice,level);
    for (const p of fixture.solution) game.placed[p.id] = {...p};
    assert.equal(isSolved(game),true);
  }
});
