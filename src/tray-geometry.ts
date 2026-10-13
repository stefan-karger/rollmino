import type { Cell } from '../engine/core.ts';

/** Fit every occupied square into the tray's fixed, compact aspect ratio. */
export function trayBounds(cells: readonly Cell[]): { width: number; height: number } {
  const width = Math.max(...cells.map(([x]) => x)) + 1.3;
  const height = Math.max(...cells.map(([, y]) => y)) + 1.3;
  const scale = Math.max(1, width / 4.3, height / 3.3);
  return { width: 4.3 * scale, height: 3.3 * scale };
}
