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

/** Throws on invalid dice data rather than silently producing bad puzzles. */
export function validateDice(dice: readonly string[]): void {
  if (dice.length !== 7 || dice.some((face, i) => !DICE[i].includes(face))) {
    throw new Error('Expected exactly one valid face in physical dice order.');
  }
}

export function rollDice(random: () => number = Math.random): string[] {
  return DICE.map(faces => faces[Math.floor(random() * 6)]);
}

export function newGame(dice: readonly string[], level: Level = 'STARTER'): Game {
  validateDice(dice);
  return { dice: [...dice], level, placed: {} };
}

function bit(index: number): bigint { return 1n << BigInt(index); }
function index(x: number, y: number): number { return y * 6 + x; }
function position(coord: string): number {
  return index(coord.charCodeAt(0) - 65, Number(coord[1]) - 1);
}

function cellsOf(p: Placement): number[] | null {
  const shape = ORIENTATIONS[p.id]?.[p.orientation];
  if (!shape || !Number.isInteger(p.x) || !Number.isInteger(p.y)) return null;
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

/** Check a proposed placement against blockers and all *other* placed pieces. */
export function canPlace(game: Game, p: Placement): boolean {
  const a = cellsOf(p);
  if (!a || a.length !== SHAPES[p.id]?.length) return false;
  const myMask = cellMask(a);
  for (const face of game.dice) if ((myMask & bit(position(face))) !== 0n) return false;
  const restricted = RESTRICTED[game.level];
  const myNeighbors = restricted.includes(p.id) ? neighborMask(a) : 0n;
  for (const id of PIECE_IDS) {
    if (id === p.id) continue; // Move an existing piece transactionally.
    const other = game.placed[id];
    if (!other) continue;
    const b = cellsOf(other);
    if (!b) return false;
    const theirMask = cellMask(b);
    if ((myMask & theirMask) !== 0n) return false;
    if (restricted.includes(id) && (myNeighbors & theirMask) !== 0n) return false;
  }
  return true;
}

export function isSolved(game: Game): boolean {
  if (PIECE_IDS.some(id => !game.placed[id])) return false;
  const placed: Game = { ...game, placed: {} };
  for (const id of PIECE_IDS) {
    const p = game.placed[id]!;
    if (!canPlace(placed, p)) return false;
    placed.placed[id] = p;
  }
  return true; // 29 uniquely occupied cells + 7 distinct blockers = 36.
}

interface Candidate extends Placement {
  i: number;
  mask: bigint;
  neighbors: bigint;
}
const BY_CELL: Candidate[][] = Array.from({ length: 36 }, () => []);
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
        for (const cell of cells) BY_CELL[cell].push(candidate);
      }
    }
  });
}
const FULL = (1n << 36n) - 1n;

/** Find a solution consistent with the pieces the player has already placed.
 *  Returns null if that partial board cannot be completed. */
export function solve(game: Game): Placement[] | null {
  validateDice(game.dice);
  const restricted = new Set(RESTRICTED[game.level]);
  let occupied = cellMask(game.dice.map(position));
  let used = 0;
  const selected: Candidate[] = [];

  for (const id of PIECE_IDS) {
    const placement = game.placed[id];
    if (!placement) continue;
    if (!canPlace(game, placement)) return null;
    const cells = cellsOf(placement)!;
    const i = PIECE_IDS.indexOf(id);
    occupied |= cellMask(cells);
    used |= 1 << i;
    selected.push({ ...placement, i, mask: cellMask(cells), neighbors: neighborMask(cells) });
  }

  function visit(mask: bigint, usedBits: number): boolean {
    if (mask === FULL) return true;
    // Choose the empty square with the fewest legal candidate placements.
    let options: Candidate[] | null = null;
    for (let cell = 0; cell < 36; cell++) {
      if ((mask & bit(cell)) !== 0n) continue;
      const valid: Candidate[] = [];
      for (const p of BY_CELL[cell]) {
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
