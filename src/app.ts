import './styles.css';
import { ORIENTATIONS, PIECE_IDS, RESTRICTED, canPlace, firstAnchor, transformPiece } from '../engine/core.ts';
import type { Cell, Level, PieceId, Placement } from '../engine/core.ts';
import { elapsed, formatTime, freshSession, place, remove, replay, start, undo } from './session.ts';
import type { Session } from './session.ts';

function element<T extends HTMLElement>(id: string): T {
  const found = document.getElementById(id);
  if (!found) throw Error(`Missing element ${id}`);
  return found as T;
}
const gameWidget = element('game');
const grid = element('grid');
const tray = element('tray');
const art = document.querySelector<SVGSVGElement>('#board-art')!;
const levelControl = element<HTMLSelectElement>('level');
const startButton = element<HTMLButtonElement>('start');
const dialog = element<HTMLDialogElement>('confirm-dialog');
const status = element('status');
const timer = element('timer');
const colors: Record<PieceId, string> = {
  navy: '#4c78af', brown: '#b58a67', orange: '#ff9b48', purple: '#b891ee',
  grey: '#b7c2cc', green: '#76bc83', cyan: '#65c8df', yellow: '#efd46e', red: '#ec7c7f',
};
const numbers: Partial<Record<PieceId, number>> = { navy: 1, brown: 2, orange: 3, purple: 4 };
const names: Record<PieceId, string> = {
  navy: 'Navy square', brown: 'Brown domino', orange: 'Orange line', purple: 'Purple corner',
  grey: 'Grey line', green: 'Green square', cyan: 'Cyan L', yellow: 'Yellow T', red: 'Red zigzag',
};
let session: Session = freshSession();
type Draft = { id: PieceId; orientation: number; anchor: Cell; target: Cell };
let draft: Draft | undefined;
let focusedCell = 0;
let pending: { accept: () => void; trigger: HTMLElement } | undefined;
const cells: HTMLButtonElement[] = [];
const slots = new Map<PieceId, HTMLButtonElement>();

for (const level of Object.keys(RESTRICTED)) {
  const option = document.createElement('option');
  option.value = level;
  option.textContent = level[0] + level.slice(1).toLowerCase();
  levelControl.append(option);
}
for (let y = 0; y < 6; y++) {
  const row = document.createElement('div');
  row.setAttribute('role', 'row');
  for (let x = 0; x < 6; x++) {
    const cell = document.createElement('div');
    cell.setAttribute('role', 'gridcell');
    const button = document.createElement('button');
    button.dataset.cell = String(y * 6 + x);
    button.addEventListener('click', () => activateCell(x, y));
    button.addEventListener('focus', () => {
      focusedCell = y * 6 + x;
      if (draft) draft.target = [x, y];
      render();
    });
    cells.push(button);
    cell.append(button);
    row.append(cell);
  }
  grid.append(row);
}
for (const id of PIECE_IDS) {
  const button = document.createElement('button');
  button.className = 'piece-slot';
  button.dataset.piece = id;
  button.innerHTML = `<svg viewBox="-0.15 -0.15 4.3 3.3" aria-hidden="true"></svg><span>${names[id]}${numbers[id] ? ` ${numbers[id]}` : ''}</span>`;
  button.addEventListener('click', () => selectPiece(id));
  slots.set(id, button);
  tray.append(button);
}

function coordinate(x: number, y: number): string { return `${String.fromCharCode(65 + x)}${y + 1}`; }
function owner(x: number, y: number): PieceId | undefined {
  if (session.phase === 'ready') return;
  const game = session.game;
  return PIECE_IDS.find(id => {
    const p = game.placed[id];
    return p && ORIENTATIONS[id][p.orientation].some(([dx, dy]) => p.x + dx === x && p.y + dy === y);
  });
}
function candidate(): Placement | undefined {
  if (!draft) return;
  return { id: draft.id, orientation: draft.orientation, x: draft.target[0] - draft.anchor[0], y: draft.target[1] - draft.anchor[1] };
}
function rect(x: number, y: number, fill: string, extra = ''): string {
  return `<rect x="${x + .04}" y="${y + .04}" width=".92" height=".92" rx=".1" fill="${fill}" ${extra}/>`;
}
function shape(id: PieceId, orientation: number, x = 0, y = 0, extra = ''): string {
  return ORIENTATIONS[id][orientation].map(([dx, dy]) => rect(x + dx, y + dy, colors[id], extra)).join('');
}
function announce(message: string): void { status.textContent = message; }
function updateTimer(): void { timer.textContent = formatTime(elapsed(session, Date.now())); }

function render(): void {
  const active = session.phase === 'running';
  levelControl.value = session.level;
  element('ready').hidden = session.phase !== 'ready';
  startButton.textContent = session.mode === 'practice' ? 'Start practice' : 'Start';
  element('mode').textContent = session.mode === 'practice' ? 'Practice replay. This run cannot rank.' : 'Fresh roll. Your time can rank.';
  const restricted = RESTRICTED[session.level];
  element('rule').textContent = restricted.length
    ? `Pieces ${restricted.map(id => numbers[id]).join(', ')} cannot share an edge. Corners may touch.`
    : 'Cover every empty cell with the nine pieces.';
  let svg = '';
  for (let i = 0; i < 6; i++) {
    svg += `<text x="${i + .5}" y="-.15" text-anchor="middle">${String.fromCharCode(65 + i)}</text><text x="-.2" y="${i + .6}" text-anchor="middle">${i + 1}</text>`;
  }
  let boardSvg = '';
  cells.forEach((button, i) => {
    const x = i % 6, y = Math.floor(i / 6);
    const id = owner(x, y);
    const blocker = session.phase !== 'ready' && session.game.dice.includes(coordinate(x, y));
    button.disabled = !active;
    button.tabIndex = i === focusedCell ? 0 : -1;
    button.setAttribute('aria-label', `${coordinate(x, y)}, ${session.phase === 'ready' ? 'hidden' : blocker ? 'blocker' : id ? `${id} piece${numbers[id] ? ` ${numbers[id]}` : ''}` : 'empty'}`);
    button.dataset.content = blocker ? 'blocker' : id ?? 'empty';
    boardSvg += rect(x, y, '#202c3b');
    if (blocker) boardSvg += `<circle cx="${x + .5}" cy="${y + .5}" r=".32" fill="#0c1118" stroke="#95a7bc" stroke-width=".045"/>`;
    if (id) {
      boardSvg += rect(x, y, colors[id]);
      if (numbers[id]) boardSvg += `<text class="piece-number" x="${x + .5}" y="${y + .63}" text-anchor="middle">${numbers[id]}</text>`;
    }
  });
  const p = candidate();
  let feedback = 'Select a piece, then a board cell.';
  if (p && draft && session.phase === 'running') {
    const legal = canPlace(session.game, p);
    boardSvg += `<g class="ghost">${shape(p.id, p.orientation, p.x, p.y, `stroke="${legal ? '#fff' : '#ffb7b7'}" stroke-width=".055" stroke-dasharray="${legal ? '0' : '.13 .08'}"`)}<text x="${draft.target[0] + .5}" y="${draft.target[1] + .65}" text-anchor="middle">${legal ? '+' : '×'}</text></g>`;
    feedback = `${names[p.id]} at ${coordinate(draft.target[0], draft.target[1])}: ${legal ? 'valid placement' : 'cannot place here'}. Anchor marked +.`;
  }
  art.innerHTML = `${svg}<g id="board-coordinates">${boardSvg}</g>`;
  element('preview').textContent = feedback;
  for (const [id, button] of slots) {
    const placed = session.phase !== 'ready' ? session.game.placed[id] : undefined;
    const orientation = placed?.orientation ?? 0;
    button.disabled = !active;
    button.classList.toggle('placed', Boolean(placed));
    button.setAttribute('aria-pressed', String(draft?.id === id));
    button.setAttribute('aria-label', `${names[id]}${numbers[id] ? ` piece ${numbers[id]}` : ''}, ${placed ? 'placed' : 'in tray'}`);
    const anchor = draft?.id === id ? draft.anchor : firstAnchor(id, orientation);
    const shown = draft?.id === id ? draft.orientation : orientation;
    button.querySelector('svg')!.innerHTML = `${shape(id, shown)}<text x="${anchor[0] + .5}" y="${anchor[1] + .66}" text-anchor="middle" class="anchor-mark">+</text>`;
  }
  for (const id of ['rotate', 'flip', 'remove']) element<HTMLButtonElement>(id).disabled = !active || !draft;
  element<HTMLButtonElement>('undo').disabled = session.phase !== 'running' || session.history.length === 0;
  element<HTMLButtonElement>('replay').disabled = session.phase === 'ready';
  updateTimer();
}

function selectPiece(id: PieceId): void {
  if (session.phase !== 'running') return;
  const orientation = session.game.placed[id]?.orientation ?? 0;
  draft = { id, orientation, anchor: firstAnchor(id, orientation), target: [focusedCell % 6, Math.floor(focusedCell / 6)] };
  render();
}
function acceptPlacement(p: Placement): void {
  const previous = session;
  session = place(session, p, Date.now());
  if (session === previous) {
    announce(session.phase === 'running' && canPlace(session.game, p) ? 'Piece is already there.' : 'Cannot place here. Try another cell or transform.');
  } else {
    draft = undefined;
    announce(session.phase === 'completed' ? `Completed in ${formatTime(session.elapsedMs)}.` : `${names[p.id]} placed.`);
  }
  render();
}
function activateCell(x: number, y: number): void {
  if (session.phase !== 'running') return;
  focusedCell = y * 6 + x;
  if (draft) {
    draft.target = [x, y];
    acceptPlacement(candidate()!);
  } else {
    const id = owner(x, y);
    if (id) selectPiece(id);
  }
}
function transform(action: 'rotate' | 'flip'): void {
  if (!draft || session.phase !== 'running') return;
  draft = { ...draft, ...transformPiece(draft.id, draft.orientation, draft.anchor, action) };
  render();
}
function removeSelected(): void {
  if (!draft) return;
  const id = draft.id;
  const previous = session;
  session = remove(session, id, Date.now());
  draft = undefined;
  announce(previous === session ? 'Selection cleared.' : `${names[id]} removed.`);
  render();
  slots.get(id)!.focus();
}
function enterReady(next: Session): void {
  session = next;
  draft = undefined;
  focusedCell = 0;
  announce('Puzzle hidden until Start.');
  render();
  startButton.focus();
}
function confirmAction(text: string, trigger: HTMLElement, accept: () => void): void {
  pending = { trigger, accept };
  element('confirm-text').textContent = text;
  dialog.showModal();
}
function transition(text: string, trigger: HTMLElement, next: () => Session): void {
  const accept = () => enterReady(next());
  if (session.phase === 'running') confirmAction(text, trigger, accept);
  else accept();
}
dialog.addEventListener('close', () => {
  const action = pending;
  pending = undefined;
  if (!action) return;
  if (dialog.returnValue === 'confirm') action.accept();
  else { render(); action.trigger.focus(); }
});
dialog.addEventListener('cancel', () => { dialog.returnValue = 'cancel'; });
startButton.addEventListener('click', () => {
  if (session.phase !== 'ready') return;
  session = start(session, Date.now());
  announce('Puzzle started. Select a piece.');
  render();
  cells[focusedCell].focus();
});
element('rotate').addEventListener('click', () => transform('rotate'));
element('flip').addEventListener('click', () => transform('flip'));
element('remove').addEventListener('click', removeSelected);
element('undo').addEventListener('click', () => {
  draft = undefined;
  const previous = session;
  session = undo(session);
  if (previous !== session) announce('Last action undone.');
  render();
});
element('new-game').addEventListener('click', event => transition('Start a fresh game and abandon this unfinished run?', event.currentTarget as HTMLElement, () => freshSession(session.level)));
element('replay').addEventListener('click', event => transition('Replay this layout as practice and abandon this unfinished run?', event.currentTarget as HTMLElement, () => replay(session)));
levelControl.addEventListener('change', () => {
  const chosen = levelControl.value as Level;
  if (chosen === session.level) return;
  levelControl.value = session.level;
  transition(`Change to ${chosen[0] + chosen.slice(1).toLowerCase()} and abandon this unfinished run?`, levelControl, () => freshSession(chosen));
});
gameWidget.addEventListener('keydown', event => {
  if (dialog.open || session.phase !== 'running') return;
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-cell]');
  if (button && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
    if (event.altKey || event.metaKey || event.shiftKey || (event.ctrlKey && !['Home', 'End'].includes(event.key))) return;
    event.preventDefault();
    let x = focusedCell % 6, y = Math.floor(focusedCell / 6);
    if (event.key === 'ArrowLeft') x = Math.max(0, x - 1);
    if (event.key === 'ArrowRight') x = Math.min(5, x + 1);
    if (event.key === 'ArrowUp') y = Math.max(0, y - 1);
    if (event.key === 'ArrowDown') y = Math.min(5, y + 1);
    if (event.key === 'Home') { x = 0; if (event.ctrlKey) y = 0; }
    if (event.key === 'End') { x = 5; if (event.ctrlKey) y = 5; }
    cells[y * 6 + x].focus();
    return;
  }
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  if (event.key.toLowerCase() === 'r') { event.preventDefault(); transform('rotate'); }
  if (event.key.toLowerCase() === 'f') { event.preventDefault(); transform('flip'); }
  if (event.key === 'Delete') { event.preventDefault(); removeSelected(); }
  if (event.key === 'Escape' && draft) {
    event.preventDefault();
    const id = draft.id;
    draft = undefined;
    render();
    slots.get(id)!.focus();
  }
});
setInterval(updateTimer, 100);
render();
