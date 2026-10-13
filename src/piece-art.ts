import { ORIENTATIONS, RESTRICTED } from '../engine/core.ts';
import type { Level, PieceId } from '../engine/core.ts';

export const colors: Record<PieceId, string> = {
  navy: '#608bc0', brown: '#b58a67', orange: '#ff9b48', purple: '#b891ee',
  grey: '#b7c2cc', green: '#76bc83', cyan: '#65c8df', yellow: '#efd46e', red: '#ec7c7f',
};
export const names: Record<PieceId, string> = {
  navy: 'Navy square', brown: 'Brown domino', orange: 'Orange line', purple: 'Purple corner',
  grey: 'Grey line', green: 'Green square', cyan: 'Cyan L', yellow: 'Yellow T', red: 'Red zigzag',
};
export function rect(x: number, y: number, fill: string, extra = ''): string {
  return `<rect x="${x + .04}" y="${y + .04}" width=".92" height=".92" rx=".1" fill="${fill}" ${extra}/>`;
}
export function restrictionMark(id: PieceId, x: number, y: number, level: Level): string {
  return RESTRICTED[level].includes(id)
    ? `<rect class="restriction-mark" data-mark-piece="${id}" x="${x + .2}" y="${y + .2}" width=".6" height=".6"/>`
    : '';
}
export function pieceArt(id: PieceId, orientation: number, x: number, y: number, level: Level, extra = ''): string {
  return ORIENTATIONS[id][orientation].map(([dx, dy]) =>
    rect(x + dx, y + dy, colors[id], extra) + restrictionMark(id, x + dx, y + dy, level)).join('');
}
