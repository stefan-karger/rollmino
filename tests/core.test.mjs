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

function cells(p) {
  return ORIENTATIONS[p.id][p.orientation].map(([dx,dy]) => [dx+p.x,dy+p.y]);
}
function overlap(a,b) {
  return cells(a).some(([x,y]) => cells(b).some(([u,v]) => x===u && y===v));
}
function touchEdge(a,b) {
  return cells(a).some(([x,y]) => cells(b).some(([u,v]) => Math.abs(x-u)+Math.abs(y-v)===1));
}
function findContact(firstId, secondId) {
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
      if (!overlap(a,b) && touchEdge(a,b)) return [a,b];
    }
  }
  throw new Error(`No edge-adjacent pair ${firstId}/${secondId}`);
}

test('7 physical dice, 42 faces and partition of 36 board coordinates', () => {
  assert.equal(DICE.length,7);
  assert.ok(DICE.every(d=>d.length===6));
  assert.equal(new Set(DICE.flat()).size,36);
  const uniqueCoords = DICE.map(d=>[...new Set(d)]);
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
});

test('validates each die independently and rejects bad rolls', () => {
  assert.doesNotThrow(()=>validateDice(roll));
  assert.throws(()=>validateDice(roll.slice(0,6)));
  assert.throws(()=>validateDice(['A1','A1',...roll.slice(2)]));
});

test('9 pieces, 29 squares, 28 orientations and 625 candidate placements', () => {
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

test('overlap of two pieces is illegal; moving a piece ignores its own old footprint', () => {
  const g=newGame(roll);
  g.placed.navy={id:'navy',orientation:0,x:3,y:0};
  assert.equal(canPlace(g,{id:'navy',orientation:0,x:3,y:0}),true);
  assert.equal(canPlace(g,{id:'brown',orientation:0,x:3,y:0}),false);
});

test('edge contact is restricted only at the appropriate levels', () => {
  const cases = [
    {pair:['navy','brown'], allow:['STARTER'], reject:['JUNIOR','EXPERT','WIZARD']},
    {pair:['navy','orange'],allow:['STARTER','JUNIOR','MASTER'],reject:['EXPERT','WIZARD']},
    {pair:['brown','purple'],allow:['STARTER','JUNIOR','EXPERT'],reject:['MASTER','WIZARD']},
    {pair:['navy','purple'],allow:['STARTER','JUNIOR','EXPERT','MASTER'],reject:['WIZARD']},
  ];
  for (const {pair:[firstId,secondId],allow,reject} of cases) {
    const [a,b] = findContact(firstId,secondId);
    for (const level of allow) {
      const game = newGame(roll,level);game.placed[a.id]=a;
      assert.equal(canPlace(game,b),true,`${level}: ${firstId}/${secondId} should be allowed`);
    }
    for (const level of reject) {
      const game = newGame(roll,level);game.placed[a.id]=a;
      assert.equal(canPlace(game,b),false,`${level}: ${firstId}/${secondId} should be rejected`);
    }
  }
});

test('diagonal-only touching is legal even in Wizard', () => {
  const game = newGame(roll,'WIZARD');
  game.placed.navy = {id:'navy',orientation:0,x:3,y:0}; // D1
  const vertical = ORIENTATIONS.brown.findIndex(s=>new Set(s.map(([x,y])=>`${x},${y}`)).has('0,1'));
  assert.ok(vertical>=0);
  assert.equal(canPlace(game,{id:'brown',orientation:vertical,x:4,y:1}),true); // E2-E3
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
    assert.ok(solve(newGame(fixture.dice,fixture.level)));
  }
});

test('hint solver preserves player fixed pieces', () => {
  const fixture=fixtures[0];
  const game = newGame(fixture.dice,'WIZARD');
  for(const p of fixture.solution.slice(0,4)) game.placed[p.id]=p;
  const result=solve(game);
  assert.ok(result);
  for(const [id,p] of Object.entries(game.placed)) {
    assert.deepEqual(result.find(x=>x.id===id),p);
  }
  for (const p of result) game.placed[p.id]=p;
  assert.equal(isSolved(game),true);
});

test('a legal but unsolvable partial position returns no hint', () => {
  const game = newGame(roll,'WIZARD');
  const p={id:'navy',orientation:0,x:1,y:5}; // B6 free, but forces a Wizard dead end
  assert.equal(canPlace(game,p),true);
  game.placed.navy=p;
  assert.equal(solve(game),null);
});

test('winning is checked from state, not just piece count', () => {
  const fixture=fixtures[0];
  const game = newGame(fixture.dice,'WIZARD');
  for(const p of fixture.solution) game.placed[p.id]={...p};
  assert.equal(isSolved(game),true);
  game.placed.navy={id:'navy',orientation:0,x:0,y:0}; // on A1 blocker
  assert.equal(isSolved(game),false);
  delete game.placed.navy;
  assert.equal(isSolved(game),false);
});
