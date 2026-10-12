# T07. Deliver the complete timed game through tap and keyboard

[Tracker](README.md) | [Product specification](../../IMPLEMENTATION_PLAN.md) | [Coding guidelines](../../CODING_GUIDELINES.md)

## Blockers

- [T02](02-independent-solution-verification.md)
- [T04](04-geometric-transforms.md)
- [T05](05-session-timing-undo.md)

Plan coverage: sections 5 through 7 and 12; completes Slice 1's first playable game.

## Outcome

A user can Start a hidden puzzle, solve it without dragging, use full-run Undo and Replay it as timed practice. Records and direct dragging are supplied by later tickets.

## Scope and files

Extend `src/app.ts`, `src/styles.css` and `index.html`. Consume the existing core, transform helpers and session module. Add `e2e/helpers.ts`; extend `e2e/play.spec.ts` and `e2e/input.spec.ts`. Keep one committed Game and separate selection/draft state.

## Implementation steps

1. Render a shared six-cell SVG board plus synchronized native HTML grid. Put A–F/1–6 labels outside the board coordinate rectangle. Provide six rows/36 named cell buttons, one roving Tab stop, and an aria-hidden visual SVG with pointer-transparent previews.
2. Keep nine persistent named tray slots. Placed pieces stay selectable with dimmed shapes/readable labels and their committed orientation; unplaced pieces show orientation zero. Identify the numbered restriction pieces and current level rule.
3. Implement selection and immediate tap/click placement using the first occupied row-major anchor. Selecting copies committed geometry or starts at orientation zero. Rotate/Flip update only the draft/anchor. Successful placement clears selection; rejection keeps it without a committed/history change. With no selection a board-piece tap selects it; with selection any board tap attempts placement.
4. Wire Start, all five levels, New game, Replay, Remove and Undo through the pure session functions. Fresh and practice ready hide blockers in visuals and accessible labels. Start reveals and begins timing in one handler.
5. Use a native confirmation dialog before active New/Replay/level changes. Cancel restores focus, game/time and the level select value. Confirm enters the appropriate hidden ready and focuses Start. No unload prompt, pause or automatic replay timer.
6. Refresh only timer text about every 100 ms from `Date.now()`; do not rebuild focused DOM nodes. A solving commit freezes board/time and announces once. Time counts background/confirmation/Undo; no solver/dead-end veto.
7. Implement Arrows, Home/End, Ctrl+Home/End, Enter/Space, R/F, Delete and Escape within the game widget. Avoid duplicate native activation and shortcuts from selects/dialogs/unrelated controls. Start focuses the grid; completion does not steal focus.
8. Add a polite atomic action status, visible focus and text/shape rejection cues. Enable all operations needed for complete non-drag play.
9. Seed RNG before startup and reset its test queue before Start if tooling consumes randomness. For `opening-seed`, face indices are `[0,1,0,1,4,2,3]`, using `(index + 0.5) / 6`. Test helpers complete fixtures via actual transforms/cell controls, never injected placements or a global game API.

## Verification

```bash
npm test
npm run build
npm run test:e2e -- --project=desktop-chromium --project=mobile-chromium
```

Install Playwright's clock before navigation for timing cases. Complete all three fixtures through controls, with at least one complete keyboard-only run. Test illegal taps, own-footprint movement, chiral flips, placement/removal Undo to empty, ready secrecy, repeated Start/solve events, active confirmation cancel/confirm, practice replay, fresh level changes and reload abandonment. Include a deterministic changed second roll and a coincidental repeated fresh roll. A legal Wizard B6 dead end must be accepted.

## Done when

- [ ] Full games complete through tap/click and keyboard, with real transforms and named stable controls.
- [ ] Hidden Start, timing, confirmations, fresh/practice transitions and unlimited active Undo match the plan.
- [ ] Completion freezes once and no later action edits/reopens it.
- [ ] Invalid/no-op attempts do not change committed state/history.
- [ ] The selected browser projects pass using public UI actions; there is no assistance UI, test cheat panel or duplicate writable board state.

## Completion evidence

Not yet recorded. Add the actual changes, command results, checks and code reference here before setting this ticket to `done` in the tracker. Follow the [completion rules](README.md#working-and-completing-tickets).
