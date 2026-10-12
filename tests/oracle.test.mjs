import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ORIENTATIONS, solve } from '../engine/core.ts';
import { assertSolution } from './oracle.mjs';

const fixtures = JSON.parse(readFileSync(new URL('../fixtures/rolls.json', import.meta.url), 'utf8'));
const levels = ['STARTER','JUNIOR','EXPERT','MASTER','WIZARD'];
const fixture = fixtures[0];

function gameFor(fixture, level = fixture.level) {
  return {dice:[...fixture.dice], level, placed:{}};
}

function solution() {
  return structuredClone(fixture.solution);
}

function reject(answer, reason, game = gameFor(fixture)) {
  assert.throws(() => assertSolution(game, answer), error => {
    assert.ok(error instanceof Error);
    assert.ok(error.message.includes(`roll ${game.dice.join(' ')}`), error.message);
    assert.match(error.message, reason);
    return true;
  });
}

test('oracle accepts all stored Wizard fixtures at every level without changing inputs', () => {
  for (const fixture of fixtures) for (const level of levels) {
    const game = gameFor(fixture,level);
    const answer = structuredClone(fixture.solution);
    for (const p of answer) Object.freeze(p);
    Object.freeze(answer);
    Object.freeze(game.dice);
    Object.freeze(game.placed);
    Object.freeze(game);
    assert.doesNotThrow(() => assertSolution(game,answer));
    assert.deepEqual(answer, fixture.solution);
  }
});

test('oracle independently checks solver answers and fixed placements for every fixture and level', () => {
  for (const fixture of fixtures) for (const level of levels) for (const count of [0,1,4,9]) {
    const game = gameFor(fixture,level);
    for (const p of fixture.solution.slice(0,count)) game.placed[p.id] = {...p};
    const before = structuredClone(game);
    const answer = solve(game);
    assert.ok(answer);
    assertSolution(game,answer);
    assert.deepEqual(game,before);
  }
});

test('oracle rejects missing, duplicate, unknown and inherited piece IDs', () => {
  reject(fixture.solution.slice(0,8), /exactly nine/);
  reject([...solution(), {...fixture.solution[0]}], /exactly nine/);
  const duplicate = solution();
  duplicate[1] = {...duplicate[0]};
  reject(duplicate, /duplicate piece ID navy/);
  for (const id of ['unknown','toString','constructor','__proto__', null]) {
    const answer = solution();
    answer[0].id = id;
    reject(answer, /unknown piece ID/);
  }
  const inherited = solution();
  inherited[0] = Object.create(inherited[0]);
  reject(inherited, /missing placement fields/);
});

test('oracle rejects malformed and sparse answer arrays', () => {
  for (const answer of [null, undefined, {}, Array(9)]) reject(answer, /nine placements|missing placement/);
  for (const p of [undefined, null, {}, 'navy']) {
    const answer = solution();
    answer[0] = p;
    reject(answer, /missing placement/);
  }
  const answer = solution();
  delete answer[4];
  reject(answer, /missing placement 4/);
});

test('oracle rejects non-integer and out-of-range orientations', () => {
  for (const orientation of [-1, 1, 0.5, NaN, Infinity, undefined, '0']) {
    const answer = solution();
    answer[0].orientation = orientation;
    reject(answer, /invalid orientation for navy/);
  }
});

test('oracle rejects missing or non-integer coordinates', () => {
  for (const key of ['x','y']) {
    const missing = solution();
    delete missing[0][key];
    reject(missing, /missing placement fields/);
    for (const value of [0.5, NaN, Infinity, null, undefined, '0']) {
      const answer = solution();
      answer[0][key] = value;
      reject(answer, /non-integer coordinates for navy/);
    }
  }
});

test('oracle rejects out-of-bounds cells, including a shape extending past the board', () => {
  for (const [x,y] of [[-1,5],[6,5],[4,-1],[4,6]]) {
    const answer = solution();
    Object.assign(answer[0],{x,y});
    reject(answer, /out-of-bounds cell for navy/);
  }
  const answer = solution();
  answer.find(p => p.id === 'brown').x = 5;
  reject(answer, /out-of-bounds cell for brown/);
});

test('oracle rejects blocker overlaps and piece overlaps', () => {
  const blocked = solution();
  Object.assign(blocked[0],{x:0,y:0});
  reject(blocked, /blocker overlap by navy/);
  const overlap = solution();
  Object.assign(overlap[0],{x:5,y:5});
  reject(overlap, /piece overlap by grey with navy/);
});

test('oracle detects a coverage gap even if shared orientation data loses a cell', () => {
  const original = ORIENTATIONS.navy[0];
  try {
    // Fault injection isolates coverage after nine valid IDs and collision checks.
    ORIENTATIONS.navy[0] = [];
    reject(solution(), /uncovered cell at 4,5/);
  } finally {
    ORIENTATIONS.navy[0] = original;
  }
});

test('oracle rejects forbidden contact on a fully covered, non-overlapping board', () => {
  const touching = [
    {id:'navy',orientation:0,x:4,y:5},
    {id:'brown',orientation:1,x:5,y:4},
    {id:'orange',orientation:0,x:1,y:0},
    {id:'purple',orientation:1,x:4,y:0},
    {id:'cyan',orientation:2,x:2,y:1},
    {id:'green',orientation:0,x:4,y:2},
    {id:'grey',orientation:1,x:0,y:1},
    {id:'yellow',orientation:1,x:1,y:2},
    {id:'red',orientation:0,x:1,y:4},
  ];
  assert.doesNotThrow(() => assertSolution(gameFor(fixture,'STARTER'),touching));
  for (const level of ['JUNIOR','EXPERT','MASTER','WIZARD']) {
    reject(touching, /forbidden edge contact/, gameFor(fixture,level));
    reject([...touching].reverse(), /forbidden edge contact/, gameFor(fixture,level));
  }
});

test('oracle allows diagonal restricted contact and edges with unrestricted pieces', () => {
  const cells = id => {
    const p = fixture.solution.find(p => p.id === id);
    return ORIENTATIONS[id][p.orientation].map(([dx,dy]) => [p.x + dx,p.y + dy]);
  };
  assert.ok(cells('purple').some(([x,y]) => cells('orange').some(([u,v]) =>
    Math.abs(x-u) === 1 && Math.abs(y-v) === 1)));
  assert.ok(cells('navy').some(([x,y]) => cells('grey').some(([u,v]) =>
    Math.abs(x-u) + Math.abs(y-v) === 1)));
  assert.doesNotThrow(() => assertSolution(gameFor(fixture),fixture.solution));
});

test('oracle rejects changed fixed placements and malformed fixed maps', () => {
  const game = gameFor(fixture);
  const fixed = {...fixture.solution[0]};
  game.placed.navy = fixed;
  assert.doesNotThrow(() => assertSolution(game,solution()));
  for (const change of [{id:'brown'}, {orientation:1}, {x:3}, {y:4}]) {
    game.placed.navy = {...fixed,...change};
    reject(solution(), /changed fixed placement for navy/, game);
  }
  for (const placed of [undefined, null, [], {unknown:fixed}, {navy:null}, Object.create({navy:fixed})]) {
    reject(solution(), /fixed map|unknown fixed piece ID|changed fixed placement|inherited fixed placements/,
      {...game,placed});
  }
});

test('oracle rejects invalid blocker counts, coordinates, sparse dice and duplicate blockers', () => {
  for (const dice of [[], fixture.dice.slice(0,6), [...fixture.dice, 'A1']]) {
    reject(solution(), /seven blockers/, {...gameFor(fixture),dice});
  }
  const hole = [...fixture.dice];
  delete hole[0];
  for (const dice of [hole, ['G1',...fixture.dice.slice(1)], [null,...fixture.dice.slice(1)],
    ['A1','A1',...fixture.dice.slice(2)]]) {
    reject(solution(), /invalid blocker|duplicate blocker/, {...gameFor(fixture),dice});
  }
});

test('oracle rejects malformed setup and unknown or prototype-derived levels', () => {
  for (const game of [null, undefined, {}, {level:'WIZARD',dice:null}]) {
    assert.throws(() => assertSolution(game,solution()), /Invalid answer for roll/);
  }
  for (const level of ['INVALID','toString','constructor','__proto__', null]) {
    reject(solution(), /unknown level/, gameFor(fixture,level));
  }
});
