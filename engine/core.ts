/**
 * Genius Square puzzle core. Pure TypeScript; no DOM, framework or dependencies.
 * Coordinate convention of the 2023 SmartGames board: letters are columns,
 * numbers are rows. All internal x/y coordinates are zero-based.
 */
export type Cell = readonly [x: number, y: number];
export type PieceId =
  | 'navy' | 'brown' | 'orange' | 'purple'
  | 'grey' | 'green' | 'cyan' | 'yellow' | 'red';
export type Level = 'STARTER' | 'JUNIOR' | 'EXPERT' | 'MASTER' | 'WIZARD';

/** Six physical faces per die. Intentional duplicates matter for probability. */
export const DICE: readonly (readonly string[])[] = [
  ['A1', 'C1', 'D1', 'D2', 'E2', 'F3'],
  ['A2', 'B2', 'C2', 'A3', 'B1', 'B3'],
  ['C3', 'D3', 'E3', 'B4', 'C4', 'D4'],
  ['E1', 'F2', 'F2', 'B6', 'A5', 'A5'],
  ['A4', 'B5', 'C6', 'C5', 'D6', 'F6'],
  ['E4', 'F4', 'E5', 'F5', 'D5', 'E6'],
  ['F1', 'F1', 'F1', 'A6', 'A6', 'A6'],
];

/** Canonical shapes. A cell is one unit square; pieces can rotate and flip. */
export const SHAPES: Record<PieceId, readonly Cell[]> = {
  navy: [[0, 0]],
  brown: [[0, 0], [1, 0]],
  orange: [[0, 0], [1, 0], [2, 0]],
  purple: [[0, 0], [0, 1], [1, 1]],
  grey: [[0, 0], [1, 0], [2, 0], [3, 0]],
  green: [[0, 0], [1, 0], [0, 1], [1, 1]],
  cyan: [[0, 0], [0, 1], [0, 2], [1, 2]],
  yellow: [[1, 0], [0, 1], [1, 1], [2, 1]],
  red: [[0, 1], [1, 1], [1, 0], [2, 0]],
};
export const PIECE_IDS = Object.keys(SHAPES) as PieceId[];

/** Numbered restriction groups: 1 navy, 2 brown, 3 orange, 4 purple. */
export const RESTRICTED: Record<Level, readonly PieceId[]> = {
  STARTER: [],
  JUNIOR: ['navy', 'brown'],
  EXPERT: ['navy', 'brown', 'orange'],
  MASTER: ['brown', 'orange', 'purple'],
  WIZARD: ['navy', 'brown', 'orange', 'purple'],
};

function normalize(cells: readonly Cell[]): Cell[] {
  const minX = Math.min(...cells.map(([x]) => x));
  const minY = Math.min(...cells.map(([, y]) => y));
  return cells.map(([x, y]) => [x - minX, y - minY] as Cell)
    .sort((a, b) => a[1] - b[1] || a[0] - b[0]);
}

/** Return each geometrically distinct orientation exactly once. */
export function uniqueOrientations(cells: readonly Cell[]): Cell[][] {
  const result: Cell[][] = [];
  const seen = new Set<string>();
  for (const flip of [false, true]) {
    for (let turns = 0; turns < 4; turns++) {
      let transformed: Cell[] = cells.map(([x, y]) => [flip ? -x : x, y]);
      for (let t = 0; t < turns; t++) {
        transformed = transformed.map(([x, y]) => [-y, x]);
      }
      const normalized = normalize(transformed);
      const key = JSON.stringify(normalized);
      if (!seen.has(key)) {
        seen.add(key);
        result.push(normalized);
      }
    }
  }
  return result;
}

export const ORIENTATIONS = Object.fromEntries(
  PIECE_IDS.map(id => [id, uniqueOrientations(SHAPES[id])]),
) as Record<PieceId, Cell[][]>;

/** Row-major occupied anchor for tap/keyboard selection. */
export function firstAnchor(id: PieceId, orientation: number): Cell {
  return [...ORIENTATIONS[id][orientation][0]] as Cell;
}

/** Transform geometry and its occupied grab anchor together. */
export function transformPiece(
  id: PieceId, orientation: number, anchor: Cell, action: 'rotate' | 'flip',
): { orientation: number; anchor: Cell } {
  const shape = ORIENTATIONS[id][orientation];
  if (!shape.some(([x, y]) => x === anchor[0] && y === anchor[1])) {
    throw new Error('Expected an occupied anchor.');
  }
  const transform = ([x, y]: Cell): Cell => action === 'rotate' ? [-y, x] : [-x, y];
  const cells = shape.map(transform);
  const minX = Math.min(...cells.map(([x]) => x));
  const minY = Math.min(...cells.map(([, y]) => y));
  const [ax, ay] = transform(anchor);
  const key = JSON.stringify(normalize(cells));
  return {
    orientation: ORIENTATIONS[id].findIndex(candidate => JSON.stringify(candidate) === key),
    anchor: [ax - minX, ay - minY],
  };
}

/** x/y is the upper-left corner of a normalized orientation. */
export interface Placement {
  id: PieceId;
  orientation: number;
  x: number;
  y: number;
}
export interface Game {
  dice: readonly string[];
  level: Level;
  placed: Partial<Record<PieceId, Placement>>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function isLevel(value: unknown): value is Level {
  return typeof value === 'string' && Object.hasOwn(RESTRICTED, value);
}

function isPieceId(value: unknown): value is PieceId {
  return typeof value === 'string' && Object.hasOwn(SHAPES, value);
}

function validDice(dice: unknown): dice is readonly string[] {
  if (!Array.isArray(dice) || dice.length !== 7) return false;
  for (let i = 0; i < 7; i++) {
    if (!Object.hasOwn(dice, i) || typeof dice[i] !== 'string' || !DICE[i].includes(dice[i])) {
      return false;
    }
  }
  return true;
}

function validSetup(game: unknown): game is Game {
  return isRecord(game) && Object.hasOwn(game, 'dice') && validDice(game.dice)
    && Object.hasOwn(game, 'level') && isLevel(game.level);
}

/** Throws on invalid dice data rather than silently producing bad puzzles. */
export function validateDice(dice: readonly string[]): void {
  if (!validDice(dice)) {
    throw new Error('Expected exactly one valid face in physical dice order.');
  }
}

export function rollDice(random: () => number = Math.random): string[] {
  return DICE.map(faces => {
    const value = random();
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value >= 1) {
      throw new Error('Expected a finite random number in [0, 1).');
    }
    return faces[Math.floor(value * 6)];
  });
}

export function newGame(dice: readonly string[], level: Level = 'STARTER'): Game {
  validateDice(dice);
  if (!isLevel(level)) throw new Error('Expected a known level.');
  return { dice: [...dice], level, placed: {} };
}

function bit(index: number): bigint { return 1n << BigInt(index); }
function index(x: number, y: number): number { return y * 6 + x; }
function position(coord: string): number {
  return index(coord.charCodeAt(0) - 65, Number(coord[1]) - 1);
}

function cellsOf(p: Placement): number[] | null {
  if (!isRecord(p) || !['id', 'orientation', 'x', 'y'].every(key => Object.hasOwn(p, key))
    || !isPieceId(p.id) || !Number.isInteger(p.orientation)
    || p.orientation < 0 || p.orientation >= ORIENTATIONS[p.id].length
    || !Number.isInteger(p.x) || !Number.isInteger(p.y)) return null;
  const shape = ORIENTATIONS[p.id][p.orientation];
  const result: number[] = [];
  for (const [dx, dy] of shape) {
    const x = p.x + dx, y = p.y + dy;
    if (x < 0 || x >= 6 || y < 0 || y >= 6) return null;
    result.push(index(x, y));
  }
  return result;
}

function neighborMask(indices: readonly number[]): bigint {
  let neighbors = 0n;
  for (const i of indices) {
    const x = i % 6, y = Math.floor(i / 6);
    if (x > 0) neighbors |= bit(i - 1);
    if (x < 5) neighbors |= bit(i + 1);
    if (y > 0) neighbors |= bit(i - 6);
    if (y < 5) neighbors |= bit(i + 6);
  }
  return neighbors;
}

function cellMask(indices: readonly number[]): bigint {
  let mask = 0n;
  for (const i of indices) mask |= bit(i);
  return mask;
}

/** Fail closed for malformed committed state; ignore only a validated old footprint. */
export function canPlace(game: Game, p: Placement): boolean {
  if (!validSetup(game)) return false;
  const state = committedState(game);
  if (!state) return false;
  const a = cellsOf(p);
  if (!a) return false;
  const myMask = cellMask(a);
  for (const face of game.dice) if ((myMask & bit(position(face))) !== 0n) return false;
  const restricted = RESTRICTED[game.level];
  const myNeighbors = restricted.includes(p.id) ? neighborMask(a) : 0n;
  for (const other of state.selected) {
    if (other.id === p.id) continue;
    if ((myMask & other.mask) !== 0n) return false;
    if (restricted.includes(other.id) && (myNeighbors & other.mask) !== 0n) return false;
  }
  return true;
}

export function isSolved(game: Game): boolean {
  if (!validSetup(game)) return false;
  const state = committedState(game);
  return state !== null && state.used === ALL_PIECES && state.occupied === FULL
    && state.selected.reduce((sum, p) => sum + SHAPES[p.id].length, 0) === 29;
}

interface Candidate extends Placement {
  i: number;
  mask: bigint;
  neighbors: bigint;
}

/** Validate keys, geometry, occupancy and contacts once for each committed piece. */
function committedState(game: Game): { occupied: bigint; used: number; selected: Candidate[] } | null {
  if (!Object.hasOwn(game, 'placed') || !isRecord(game.placed)) return null;
  if (Reflect.ownKeys(game.placed).some(key => !isPieceId(key))) return null;
  let occupied = cellMask(game.dice.map(position));
  let used = 0;
  const selected: Candidate[] = [];
  const restricted = RESTRICTED[game.level];
  for (let i = 0; i < PIECE_IDS.length; i++) {
    const id = PIECE_IDS[i];
    if (!Object.hasOwn(game.placed, id)) continue;
    const p = game.placed[id];
    if (!p) return null;
    const cells = cellsOf(p);
    if (!cells || p.id !== id) return null;
    const mask = cellMask(cells), neighbors = neighborMask(cells);
    if ((occupied & mask) !== 0n) return null;
    if (restricted.includes(id) && selected.some(other =>
      restricted.includes(other.id) && (neighbors & other.mask) !== 0n)) return null;
    occupied |= mask;
    used |= 1 << i;
    selected.push({ id: p.id, orientation: p.orientation, x: p.x, y: p.y, i, mask, neighbors });
  }
  return { occupied, used, selected };
}
let solverCandidates: Candidate[][] | undefined;
/** Solver-only data is built once on demand, never during normal game imports. */
function candidatesByCell(): Candidate[][] {
  if (solverCandidates) return solverCandidates;
  const byCell: Candidate[][] = Array.from({ length: 36 }, () => []);
  for (let i = 0; i < PIECE_IDS.length; i++) {
    const id = PIECE_IDS[i];
    ORIENTATIONS[id].forEach((shape, orientation) => {
      const width = 1 + Math.max(...shape.map(([x]) => x));
      const height = 1 + Math.max(...shape.map(([, y]) => y));
      for (let y = 0; y <= 6 - height; y++) {
        for (let x = 0; x <= 6 - width; x++) {
          const cells = shape.map(([dx, dy]) => index(x + dx, y + dy));
          const candidate = {
            id, i, orientation, x, y,
            mask: cellMask(cells), neighbors: neighborMask(cells),
          };
          for (const cell of cells) byCell[cell].push(candidate);
        }
      }
    });
  }
  solverCandidates = byCell;
  return byCell;
}
const FULL = (1n << 36n) - 1n;
const ALL_PIECES = (1 << PIECE_IDS.length) - 1;

/** Preserve fixed pieces without mutating input. Throws for malformed dice/level;
 *  returns null for invalid fixed placements or a legal dead end. */
export function solve(game: Game): Placement[] | null {
  if (!validSetup(game)) throw new Error('Expected valid physical dice and a known level.');
  const state = committedState(game);
  if (!state) return null;
  const restricted = new Set(RESTRICTED[game.level]);
  const { occupied, used, selected } = state;
  const byCell = candidatesByCell();

  function visit(mask: bigint, usedBits: number): boolean {
    if (mask === FULL) return usedBits === ALL_PIECES;
    // Choose the empty square with the fewest legal candidate placements.
    let options: Candidate[] | null = null;
    for (let cell = 0; cell < 36; cell++) {
      if ((mask & bit(cell)) !== 0n) continue;
      const valid: Candidate[] = [];
      for (const p of byCell[cell]) {
        if ((usedBits & (1 << p.i)) !== 0 || (mask & p.mask) !== 0n) continue;
        if (restricted.has(p.id) && selected.some(other =>
          restricted.has(other.id) && (p.neighbors & other.mask) !== 0n)) continue;
        valid.push(p);
      }
      if (valid.length === 0) return false;
      if (options === null || valid.length < options.length) options = valid;
      if (valid.length === 1) break;
    }
    for (const p of options ?? []) {
      selected.push(p);
      if (visit(mask | p.mask, usedBits | (1 << p.i))) return true;
      selected.pop();
    }
    return false;
  }

  return visit(occupied, used) ? selected.map(({ id, orientation, x, y }) =>
    ({ id, orientation, x, y })) : null;
}
