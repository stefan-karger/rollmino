import { ORIENTATIONS } from '../engine/core.ts';

const IDS = ['navy', 'brown', 'orange', 'purple', 'grey', 'green', 'cyan', 'yellow', 'red'];
const GROUPS = {
  STARTER: [],
  JUNIOR: ['navy', 'brown'],
  EXPERT: ['navy', 'brown', 'orange'],
  MASTER: ['brown', 'orange', 'purple'],
  WIZARD: ['navy', 'brown', 'orange', 'purple'],
};

/** Test-only oracle. Uses canonical orientations, but no engine legality checks or masks. */
export function assertSolution(game, solution) {
  const roll = Array.isArray(game?.dice) ? game.dice.join(' ') : '<missing dice>';
  function check(condition, message) {
    if (!condition) throw new Error(`Invalid answer for roll ${roll}: ${message}`);
  }

  check(game !== null && typeof game === 'object', 'missing game');
  check(typeof game.level === 'string' && Object.hasOwn(GROUPS, game.level), 'unknown level');
  check(Array.isArray(game.dice) && game.dice.length === 7, 'expected seven blockers');
  const board = Array.from({length:6}, () => Array(6).fill(null));
  for (let i = 0; i < 7; i++) {
    const face = game.dice[i];
    check(Object.hasOwn(game.dice, i) && typeof face === 'string' && /^[A-F][1-6]$/.test(face),
      `invalid blocker at die ${i + 1}`);
    const x = face.charCodeAt(0) - 65, y = Number(face[1]) - 1;
    check(board[y][x] === null, `duplicate blocker ${face}`);
    board[y][x] = 'blocker';
  }

  check(Array.isArray(solution) && solution.length === 9, 'expected exactly nine placements');
  const byId = new Map();
  let pieceCells = 0;
  for (let i = 0; i < 9; i++) {
    const p = solution[i];
    check(Object.hasOwn(solution, i) && p !== null && typeof p === 'object', `missing placement ${i}`);
    check(['id','orientation','x','y'].every(key => Object.hasOwn(p, key)), `missing placement fields at ${i}`);
    check(IDS.includes(p.id), `unknown piece ID ${String(p.id)}`);
    check(!byId.has(p.id), `duplicate piece ID ${p.id}`);
    check(Number.isInteger(p.orientation) && p.orientation >= 0 && p.orientation < ORIENTATIONS[p.id].length,
      `invalid orientation for ${p.id}`);
    check(Number.isInteger(p.x) && Number.isInteger(p.y), `non-integer coordinates for ${p.id}`);
    byId.set(p.id, p);
    for (const [dx,dy] of ORIENTATIONS[p.id][p.orientation]) {
      const x = p.x + dx, y = p.y + dy;
      check(x >= 0 && x < 6 && y >= 0 && y < 6, `out-of-bounds cell for ${p.id} at ${x},${y}`);
      check(board[y][x] !== 'blocker', `blocker overlap by ${p.id} at ${x},${y}`);
      check(board[y][x] === null, `piece overlap by ${p.id} with ${board[y][x]} at ${x},${y}`);
      board[y][x] = p.id;
      pieceCells++;
    }
  }
  check(IDS.every(id => byId.has(id)), 'missing piece IDs');

  for (let y = 0; y < 6; y++) for (let x = 0; x < 6; x++) {
    check(board[y][x] !== null, `uncovered cell at ${x},${y}`);
  }
  check(pieceCells === 29, `expected 29 piece cells, received ${pieceCells}`);

  const restricted = GROUPS[game.level];
  for (let y = 0; y < 6; y++) for (let x = 0; x < 6; x++) {
    const id = board[y][x];
    if (!restricted.includes(id)) continue;
    for (const [nx,ny] of [[x + 1,y],[x,y + 1]]) {
      if (nx >= 6 || ny >= 6) continue;
      const other = board[ny][nx];
      check(id === other || !restricted.includes(other), `forbidden edge contact between ${id} and ${other}`);
    }
  }

  check(game.placed !== null && typeof game.placed === 'object' && !Array.isArray(game.placed), 'invalid fixed map');
  const prototype = Object.getPrototypeOf(game.placed);
  check(prototype === null || prototype === Object.prototype, 'inherited fixed placements');
  for (const id of Reflect.ownKeys(game.placed)) {
    check(IDS.includes(id), `unknown fixed piece ID ${String(id)}`);
    const fixed = game.placed[id], result = byId.get(id);
    check(fixed !== null && typeof fixed === 'object'
      && ['id','orientation','x','y'].every(key => Object.hasOwn(fixed, key) && fixed[key] === result[key]),
    `changed fixed placement for ${id}`);
  }
}
