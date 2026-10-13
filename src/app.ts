import './styles.css';
import { ORIENTATIONS, PIECE_IDS, RESTRICTED, canPlace, firstAnchor, transformPiece } from '../engine/core.ts';
import type { Cell, Level, PieceId, Placement } from '../engine/core.ts';
import { elapsed, formatTime, freshSession, place, remove, replay, start, undo } from './session.ts';
import type { Session } from './session.ts';
import { Records } from './records.ts';

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
let storage: Storage | undefined;
try { storage = window.localStorage; } catch { /* The records module supplies the page-only notice. */ }
const records = new Records(storage);
const dateFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: 'numeric' });
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
type Gesture = {
  pointerId: number; phase: 'armed' | 'dragging'; source: Draft;
  startX: number; startY: number; clientX: number; clientY: number;
};
let gesture: Gesture | undefined;
let suppressClick = false;
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
      if (draft && !gesture) draft.target = [x, y];
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
  button.innerHTML = `<span class="piece-art" aria-hidden="true"><svg viewBox="-0.15 -0.15 4.3 3.3"></svg><span class="grab-regions"></span></span><span class="piece-label">${names[id]}${numbers[id] ? ` ${numbers[id]}` : ''}</span>`;
  button.addEventListener('click', () => { selectPiece(id); button.focus({ preventScroll: true }); });
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
    button.classList.toggle('draggable-source', active && Boolean(id));
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
    const anchor = firstAnchor(id, orientation);
    // HTML hit regions match only occupied SVG squares. SVG touch-action is inconsistent across engines.
    // Keep the implicit touch-capture source mounted while capture transfers to the game.
    if (!gesture) {
      button.querySelector('svg')!.innerHTML = `${shape(id, orientation)}<text x="${anchor[0] + .5}" y="${anchor[1] + .66}" text-anchor="middle" class="anchor-mark">+</text>`;
      button.querySelector('.grab-regions')!.innerHTML = ORIENTATIONS[id][orientation].map(([x, y]) =>
        `<span data-anchor="${x},${y}" class="grab-square ${active ? 'draggable-source' : ''}" style="left:${(x + .19) / 4.3 * 100}%;top:${(y + .19) / 3.3 * 100}%;width:${.92 / 4.3 * 100}%;height:${.92 / 3.3 * 100}%"></span>`).join('');
    }
  }
  for (const id of ['rotate', 'flip', 'remove']) element<HTMLButtonElement>(id).disabled = !active || !draft;
  for (const id of ['rotate', 'flip']) element<HTMLButtonElement>(id).disabled ||= Boolean(gesture);
  element<HTMLButtonElement>('undo').disabled = session.phase !== 'running' || session.history.length === 0;
  element<HTMLButtonElement>('replay').disabled = session.phase === 'ready';
  const list = element('records-list');
  list.replaceChildren(...records.lists[session.level].map(record => {
    const item = document.createElement('li');
    const time = document.createElement('span');
    time.textContent = formatTime(record.elapsedMs);
    const date = document.createElement('span');
    date.textContent = dateFormat.format(record.finishedAt);
    item.append(time, date);
    return item;
  }));
  element('records-empty').hidden = records.lists[session.level].length > 0;
  element('storage-notice').textContent = records.notice;
  element('storage-notice').hidden = !records.notice;
  updateTimer();
}

function selectPiece(id: PieceId): void {
  if (session.phase !== 'running' || gesture) return;
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
    if (previous.phase === 'running' && session.phase === 'completed' && session.mode === 'ranked') {
      records.insert(session.level, { elapsedMs: session.elapsedMs, finishedAt: session.finishedAt });
    }
    announce(session.phase === 'completed' ? `Completed in ${formatTime(session.elapsedMs)}.` : `${names[p.id]} placed.`);
  }
  render();
}
function activateCell(x: number, y: number): void {
  if (session.phase !== 'running' || gesture) return;
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
  if (gesture?.phase === 'dragging') draft.target = boardCell(gesture.clientX, gesture.clientY);
  render();
}
function removeSelected(): void {
  cancelGesture();
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
  cancelGesture();
  session = next;
  draft = undefined;
  focusedCell = 0;
  announce('Puzzle hidden until Start.');
  render();
  startButton.focus();
}
function confirmAction(text: string, trigger: HTMLElement, accept: () => void, title = 'Abandon this run?'): void {
  cancelGesture();
  pending = { trigger, accept };
  element('confirm-title').textContent = title;
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
  cancelGesture();
  draft = undefined;
  const previous = session;
  session = undo(session);
  if (previous !== session) announce('Last action undone.');
  render();
});
element('new-game').addEventListener('click', event => transition('Start a fresh game and abandon this unfinished run?', event.currentTarget as HTMLElement, () => freshSession(session.level)));
element('replay').addEventListener('click', event => transition('Replay this layout as practice and abandon this unfinished run?', event.currentTarget as HTMLElement, () => replay(session)));
element('clear-records').addEventListener('click', event => {
  const trigger = event.currentTarget as HTMLElement;
  confirmAction(`Clear the saved ${session.level[0] + session.level.slice(1).toLowerCase()} records in this browser?`, trigger, () => {
    records.clear(session.level);
    announce('Records cleared for this level.');
    render();
    trigger.focus();
  }, 'Clear records?');
});
levelControl.addEventListener('change', () => {
  const chosen = levelControl.value as Level;
  if (chosen === session.level) return;
  levelControl.value = session.level;
  transition(`Change to ${chosen[0] + chosen.slice(1).toLowerCase()} and abandon this unfinished run?`, levelControl, () => freshSession(chosen));
});
gameWidget.addEventListener('keydown', event => {
  if (dialog.open || session.phase !== 'running') return;
  if (event.key === 'Escape' && gesture) {
    event.preventDefault();
    cancelGesture();
    return;
  }
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

/** The same six-cell SVG rectangle backs both pointer geometry and HTML cells. */
function boardCell(clientX: number, clientY: number): Cell {
  const group = art.querySelector<SVGGElement>('#board-coordinates')!;
  const matrix = group.getScreenCTM();
  if (!matrix) return [-1, -1];
  const point = new DOMPoint(clientX, clientY).matrixTransform(matrix.inverse());
  return [Math.floor(point.x), Math.floor(point.y)];
}
function releaseGesture(): Gesture | undefined {
  const held = gesture;
  gesture = undefined;
  if (held && gameWidget.hasPointerCapture(held.pointerId)) gameWidget.releasePointerCapture(held.pointerId);
  return held;
}
function cancelGesture(): void {
  const held = releaseGesture();
  if (!held) return;
  suppressClick = true;
  draft = held.phase === 'dragging' ? { ...held.source } : draft;
  render();
}

gameWidget.addEventListener('pointerdown', event => {
  if (!event.isPrimary || event.button !== 0 || gesture || session.phase !== 'running' || dialog.open) return;
  suppressClick = false;
  const target = event.target as Element;
  const slotButton = target.closest<HTMLButtonElement>('[data-piece]');
  let id: PieceId | undefined;
  let anchor: Cell | undefined;
  let orientation = 0;
  let world: Cell = [focusedCell % 6, Math.floor(focusedCell / 6)];
  if (slotButton) {
    const square = target.closest<HTMLElement>('[data-anchor]');
    if (!square) return;
    id = slotButton.dataset.piece as PieceId;
    const [x, y] = square.dataset.anchor!.split(',');
    anchor = [Number(x), Number(y)];
    orientation = session.game.placed[id]?.orientation ?? 0;
  } else {
    const button = target.closest<HTMLButtonElement>('[data-cell]');
    if (!button) return;
    const index = Number(button.dataset.cell);
    world = [index % 6, Math.floor(index / 6)];
    id = owner(...world);
    if (!id) return;
    const placement = session.game.placed[id]!;
    orientation = placement.orientation;
    anchor = [world[0] - placement.x, world[1] - placement.y];
  }
  gesture = {
    pointerId: event.pointerId, phase: 'armed', source: { id, orientation, anchor, target: world },
    startX: event.clientX, startY: event.clientY, clientX: event.clientX, clientY: event.clientY,
  };
  event.preventDefault();
  (slotButton ?? target.closest<HTMLButtonElement>('[data-cell]'))?.focus({ preventScroll: true });
  // Do not rebuild the pointer-down SVG before a below-threshold native click.
  element<HTMLButtonElement>('rotate').disabled = true;
  element<HTMLButtonElement>('flip').disabled = true;
});
window.addEventListener('pointermove', event => {
  if (!gesture || gesture.pointerId !== event.pointerId) return;
  if (gesture.phase === 'armed') {
    if (Math.hypot(event.clientX - gesture.startX, event.clientY - gesture.startY) <= 6) return;
    gesture.phase = 'dragging';
    gameWidget.setPointerCapture(event.pointerId);
    draft = { ...gesture.source };
  }
  gesture.clientX = event.clientX;
  gesture.clientY = event.clientY;
  draft!.target = boardCell(event.clientX, event.clientY);
  event.preventDefault();
  render();
});
window.addEventListener('pointerup', event => {
  if (!gesture || gesture.pointerId !== event.pointerId) return;
  const held = releaseGesture()!;
  if (held.phase === 'armed') {
    // Native click performs selection or the selected piece's destination tap once.
    for (const id of ['rotate', 'flip']) element<HTMLButtonElement>(id).disabled = !draft;
    return;
  }
  suppressClick = true;
  if (!draft || session.phase !== 'running') return;
  draft.target = boardCell(event.clientX, event.clientY);
  const pointed = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>('[data-piece]');
  if (pointed?.dataset.piece === held.source.id) {
    removeSelected();
    return;
  }
  const [x, y] = draft.target;
  const proposal = candidate()!;
  if (x >= 0 && x < 6 && y >= 0 && y < 6 && canPlace(session.game, proposal)) {
    acceptPlacement(proposal);
  } else {
    draft = { ...held.source };
    announce('Cannot drop here. Piece returned to its starting position.');
    render();
  }
});
window.addEventListener('pointercancel', event => {
  if (gesture?.pointerId === event.pointerId) cancelGesture();
});
gameWidget.addEventListener('lostpointercapture', event => {
  if (event.target === gameWidget && gesture?.pointerId === event.pointerId) cancelGesture();
});
gameWidget.addEventListener('click', event => {
  if (suppressClick && event.detail !== 0) {
    event.preventDefault();
    event.stopImmediatePropagation();
    suppressClick = false;
  }
}, true);
window.addEventListener('blur', cancelGesture);
document.addEventListener('visibilitychange', () => { if (document.hidden) cancelGesture(); });
new ResizeObserver(cancelGesture).observe(element('game').querySelector('.board-frame')!);
window.addEventListener('resize', cancelGesture);
setInterval(updateTimer, 100);
render();
