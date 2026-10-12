# T09. Add transactional touch, mouse and pen dragging

[Tracker](README.md) | [Product specification](../../IMPLEMENTATION_PLAN.md) | [Coding guidelines](../../CODING_GUIDELINES.md)

## Blockers

- [T07](07-playable-tap-keyboard-game.md)

Plan coverage: section 6 and input cases in section 12; Slice 3.

## Outcome

Users can drag a piece from tray/board, move it and return it to its own slot while rejected or cancelled gestures preserve committed play.

## Scope and files

Extend pointer wiring/rendering in `src/app.ts` and targeted `src/styles.css` rules. Extend `e2e/helpers.ts`/`e2e/input.spec.ts`. Use T04's geometry and T05's same commit/remove functions. Coordinate shared app-file edits with T08 rather than building an adapter layer.

## Implementation steps

1. Hit-test an actual occupied source square. Tray text/hollow bounding-box areas select normally but do not arm a drag. Retain the grabbed occupied anchor, source orientation and committed placement.
2. Track one primary pointer with armed/dragging states. Cross a 6 CSS px movement threshold before dragging. A below-threshold release performs the correct single selecting/destination tap; it must not accidentally move the source.
3. Capture the pointer on a stable game node. Ignore secondary pointers; suppress the compatibility click after dragging. Keep the original Game unchanged until legal release.
4. Map client coordinates with the inverse board-group screen CTM. The local board is `[0,6) × [0,6)`, excluding labels. Floor the pointed cell and subtract the transformed local anchor. Do not clamp or choose a nearby legal fit.
5. Draw pointer-transparent legality previews. Desktop R/F transforms cells/anchor while preserving the world grab position. Keep transform buttons visible but disable button activation during a held gesture.
6. Recompute the candidate on release, then commit/remove once through session transactions. Only the piece's own tray slot removes a placed piece. Other outside/invalid releases restore its committed state and source draft.
7. Cancel cleanly for pointercancel, lost capture, Escape, blur, hidden tab, resize, Undo and run transitions. Clear stored pointer state before explicit capture release; late events must not alter a different/completed session.
8. Set `touch-action: none` before pointer down only on actual draggable source regions. Keep page scrolling/zoom outside them, including empty cells/text/gutters. No global touch blocker, HTML drag-and-drop, auto-scroll or long press.

## Verification

```bash
npm test
npm run build
npm run test:e2e -- e2e/input.spec.ts
```

Use native mouse down/move/up for geometry/capture. In mobile Chromium use CDP `Input.dispatchTouchEvent`: stable touch IDs on touchStart/touchMove, no touch points on touchEnd/touchCancel. Include a second touch. Playwright touchscreen taps alone do not prove dragging. Cross-engine mobile tap cases remain required; label synthetic cleanup cases separately.

Cover different anchors of cyan/red, tray-to-board and board-to-board moves, self-overlap, scaled geometry, R/F during mouse drag, own-slot return, another slot, blocker/edge/other-piece/outside rejection, threshold taps, cancellation/lost capture and a subsequent successful action. Check Undo after a valid release and no extra history entry after an invalid one. If T08 is already present, check no duplicate completion record.

## Done when

- [ ] Native mouse and Chromium-emulated touch placement/movement/return work with preserved occupied anchors.
- [ ] Every invalid/cancelled gesture leaves committed state/history unchanged.
- [ ] Capture cleans up without duplicate commits or late-session changes; secondary input and compatibility clicks are handled.
- [ ] Tap/keyboard still complete games and normal scrolling remains available outside source regions.
- [ ] Applicable input tests pass; evidence explicitly distinguishes emulation/synthetic branches from real hardware.

## Completion evidence

Not yet recorded. Add the actual changes, command results, checks and code reference here before setting this ticket to `done` in the tracker. Follow the [completion rules](README.md#working-and-completing-tickets).
