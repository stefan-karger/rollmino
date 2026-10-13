import { ORIENTATIONS, RESTRICTED, firstAnchor, transformPiece } from '../engine/core.ts';
import type { Cell, Level, PieceId, Placement } from '../engine/core.ts';
import { names, pieceArt, rect } from './piece-art.ts';

// Intentional teaching artwork, independent of any ordinary roll or test fixture import.
export const tutorialExample: { dice: readonly string[]; placements: readonly Placement[] } = {
  dice: ['A1', 'B2', 'C3', 'F2', 'D6', 'E5', 'A6'],
  placements: [
    { id: 'navy', orientation: 0, x: 4, y: 5 },
    { id: 'grey', orientation: 1, x: 5, y: 2 },
    { id: 'brown', orientation: 0, x: 1, y: 0 },
    { id: 'cyan', orientation: 6, x: 4, y: 0 },
    { id: 'yellow', orientation: 3, x: 2, y: 0 },
    { id: 'purple', orientation: 0, x: 0, y: 1 },
    { id: 'orange', orientation: 0, x: 2, y: 3 },
    { id: 'red', orientation: 0, x: 1, y: 4 },
    { id: 'green', orientation: 0, x: 0, y: 3 },
  ],
};

function figure(caption: string, art: string, viewBox = '0 0 6 6', extra = ''): string {
  return `<figure ${extra}><svg viewBox="${viewBox}" aria-hidden="true">${art}</svg><figcaption>${caption}</figcaption></figure>`;
}
function board(placements: readonly Placement[], attempt = false): string {
  let art = Array.from({ length: 36 }, (_, i) => rect(i % 6, Math.floor(i / 6), '#202c3b')).join('');
  art += tutorialExample.dice.map(face => `<circle cx="${face.charCodeAt(0) - 65 + .5}" cy="${Number(face[1]) - .5}" r=".32" fill="#0c1118" stroke="#95a7bc" stroke-width=".045"/>`).join('');
  art += placements.map(p => pieceArt(p.id, p.orientation, p.x, p.y, 'STARTER', `data-example-piece="${p.id}"`)).join('');
  if (attempt) art += `<g opacity=".6">${pieceArt('brown', 0, 0, 0, 'STARTER', 'stroke="#ffb7b7" stroke-width=".08" stroke-dasharray=".13 .08"')}<text x=".5" y=".65" text-anchor="middle" class="anchor-mark">×</text></g>`;
  return art;
}
function glyph(id: PieceId, orientation = 0, level: Level = 'STARTER', anchor?: Cell): string {
  return pieceArt(id, orientation, 0, 0, level, `data-example-piece="${id}"`)
    + (anchor ? `<text data-example-anchor="${anchor.join(',')}" x="${anchor[0] + .5}" y="${anchor[1] + .65}" text-anchor="middle" class="anchor-mark">+</text>` : '');
}
const brown = tutorialExample.placements.find(p => p.id === 'brown')!;
const cyan = { orientation: 0, anchor: firstAnchor('cyan', 0) };
const rotated = transformPiece('cyan', cyan.orientation, cyan.anchor, 'rotate');
const flipped = transformPiece('cyan', cyan.orientation, cyan.anchor, 'flip');

function levelTable(): string {
  function centeredGlyph(id: PieceId, level: Level): string {
    const cells = ORIENTATIONS[id][0];
    const width = Math.max(...cells.map(([x]) => x)) + 1;
    const height = Math.max(...cells.map(([, y]) => y)) + 1;
    return `<svg viewBox="-.15 -.15 4.3 3.3" aria-hidden="true"><g transform="translate(${(4 - width) / 2} ${(3 - height) / 2})">${glyph(id, 0, level)}</g></svg>`;
  }
  return `<table class="level-comparison"><caption>Pieces that cannot share an edge with one another</caption><thead><tr><th scope="col">Level</th><th scope="col">White-marked pieces</th></tr></thead><tbody>${Object.entries(RESTRICTED).map(([level, ids]) =>
    `<tr data-example-level="${level}"><th scope="row">${level[0] + level.slice(1).toLowerCase()}</th><td class="level-pieces">${ids.length ? ids.map(id => `<span data-example-restricted="${id}">${centeredGlyph(id, level as Level)}<span>${names[id]}</span></span>`).join('') : 'None'}</td></tr>`).join('')}</tbody></table>`;
}
const panels = [
  {
    title: 'Fill the board',
    text: 'Use all nine pieces to cover the empty cells around the seven blockers. Pieces cannot overlap or extend beyond the board.',
    art: () => figure('Example: seven blockers, 29 empty cells.', board([])) + figure('Example complete: all nine pieces cover the empty cells.', board(tutorialExample.placements)),
  },
  {
    title: 'Place and move',
    text: 'Select Brown domino, then tap B1. The square marked + lands on B1 and placement happens immediately. Select a placed piece to move it, or drag by an occupied square.',
    art: () => figure('Select Brown domino. Its + square is the tap anchor.', glyph('brown', 0, 'STARTER', firstAnchor('brown', 0)), '-.15 -.15 4.3 3.3')
      + figure('Example: tap B1 to cover B1 and C1.', board([brown]) + '<text x="1.5" y=".65" text-anchor="middle" class="anchor-mark">+</text>')
      + figure('Example: select the placed domino, then tap B4 to move it to B4/C4.', board([{ ...brown, y: 3 }]), '0 0 6 6', 'class="transform-example"'),
  },
  {
    title: 'Rotate and Flip',
    text: 'Rotate turns clockwise. Flip mirrors left to right. The + moves with the piece, so the transformed + still lands on the cell you select.',
    art: () => figure('Original Cyan L. The + is at its upper-left occupied square.', glyph('cyan', 0, 'STARTER', cyan.anchor), '-.15 -.15 4.3 3.3', 'class="transform-example" data-transform="original"')
      + figure('Rotate clockwise: the + moves to the right end of the top row.', glyph('cyan', rotated.orientation, 'STARTER', rotated.anchor), '-.15 -.15 4.3 3.3', 'class="transform-example" data-transform="rotate"')
      + figure('Flip left/right: the + moves to the upper-right occupied square.', glyph('cyan', flipped.orientation, 'STARTER', flipped.anchor), '-.15 -.15 4.3 3.3', 'class="transform-example" data-transform="flip"'),
  },
  {
    title: 'Undo and Remove',
    text: 'An invalid move leaves your board unchanged. Undo reverses the last successful action. Remove returns a selected piece to the tray. In normal games every placed piece can move. The exercise fixes six prepared pieces only to keep the lesson short.',
    art: () => figure('Example: moving Brown domino onto the A1 blocker is rejected.', board([brown], true))
      + figure('The committed domino stays at B1/C1. The invalid attempt adds no Undo action.', board([brown])),
  },
  {
    title: 'Choose a level',
    text: 'All five levels are available. White outlines mark the pieces that cannot share an edge with one another. Corners may touch. Marked pieces may touch blockers and unmarked pieces.',
    art: () => figure('Edge contact: not allowed between these Junior pieces.', pieceArt('navy', 0, 0, 0, 'JUNIOR') + pieceArt('brown', 0, 1, 0, 'JUNIOR'), '-.15 -.15 4.3 3.3')
      + figure('Corner contact: allowed.', pieceArt('navy', 0, 0, 0, 'JUNIOR') + pieceArt('brown', 0, 1, 1, 'JUNIOR'), '-.15 -.15 4.3 3.3'),
    detail: () => levelTable() + '<p class="help">Master swaps Navy square for Purple corner compared with Expert. Navy is unmarked in Master. The groups differ; Master does not include every Expert restriction.</p>',
  },
  {
    title: 'Start ordinary play',
    text: 'Start reveals the puzzle and starts the clock together. Time continues through Undo, confirmations and leaving the app in the background. Replay repeats a layout as timed practice and never enters Personal bests.',
    art: () => figure('Before Start: the ordinary puzzle is hidden.', Array.from({ length: 36 }, (_, i) => rect(i % 6, Math.floor(i / 6), '#182230')).join(''))
      + figure('After Start: seven blockers appear and timing begins.', board([])),
    detail: () => '<p>Return Home and choose Play when you are ready. The tutorial is untimed; ordinary ranked and practice games are always timed.</p>',
  },
];

/** Six deliberate panels; their examples never touch the ordinary game controller. */
export function tutorialPanels(announce: (text: string) => void) {
  const panel = document.getElementById('tutorial-panel')!;
  const back = document.getElementById('tutorial-back') as HTMLButtonElement;
  const next = document.getElementById('tutorial-next') as HTMLButtonElement;
  const replay = document.getElementById('replay-example') as HTMLButtonElement;
  let index = 0;
  let timeout: ReturnType<typeof setTimeout> | undefined;

  function cancelReplay(): void {
    clearTimeout(timeout);
    timeout = undefined;
    panel.querySelectorAll('.example-active').forEach(figure => figure.classList.remove('example-active'));
  }
  function render(): void {
    cancelReplay();
    const item = panels[index];
    panel.innerHTML = `<h2 id="tutorial-heading" tabindex="-1">${item.title}</h2><p>${item.text}</p><div class="tutorial-examples">${item.art()}</div>${item.detail?.() ?? ''}`;
    document.getElementById('tutorial-progress')!.textContent = `Panel ${index + 1} of ${panels.length}`;
    back.disabled = index === 0;
    next.disabled = index === panels.length - 1;
    document.getElementById('tutorial-heading')!.focus();
    announce('');
  }
  back.addEventListener('click', () => { if (index > 0) { index--; render(); } });
  next.addEventListener('click', () => { if (index < panels.length - 1) { index++; render(); } });
  replay.addEventListener('click', () => {
    cancelReplay();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      announce('Static example shown. ' + panels[index].text);
      return;
    }
    const figures = [...panel.querySelectorAll('figure')];
    function highlight(frame: number): void {
      figures.forEach((figure, i) => figure.classList.toggle('example-active', i === frame));
      if (frame < figures.length) timeout = setTimeout(() => highlight(frame + 1), 700);
      else { cancelReplay(); announce('Example replayed. ' + panels[index].text); }
    }
    highlight(0);
  });
  return { open() { index = 0; render(); }, close: cancelReplay };
}
