# T36: Game screen prototypes

## Request and scope

The user requested four game layouts selected by a fixed bottom-right 1–4 switch and `?prototype=X`. The current named three-row tray and top information push essential pieces below the viewport. Prioritize time, board, controls and pieces; remove visible piece names and move secondary actions/help below play in these optional layouts.

The four approaches are a compact three-by-three tray, a centered five-plus-four rack, a side tray and pieces surrounding the board. Reuse the real board, committed game, controls, piece slots and geometric pointer input. Switching layouts preserves the active game, clock and Undo; direct URLs select a layout. Missing/invalid parameters retain the established screen layout. Home/tutorial/records and ordinary game rules remain available.

## Acceptance

- Fixed numbered links update the URL parameter, identify the current prototype and support keyboard activation.
- Four visibly distinct game arrangements use the shared playable widget, with no visible piece names.
- All nine pieces and essential controls are visible together at representative phone and desktop sizes without horizontal overflow; narrow/short windows remain scrollable.
- Tray art and occupied hit regions stay aligned in every orientation; tap, keyboard, native dragging, transforms and Undo still work.
- Prototype switching preserves a running game, time and Undo, with hidden ready and terminal completion preserved.
- Record actual commands, browser observations and limits, and satisfy the selected verification policy before completing this ticket.

## Implementation and evidence — 2026-10-15

The numbered native links replace the current URL's prototype parameter, preserve other parameters/path and expose the active link through `aria-current`. Selecting a layout from Home opens Play. The established layout remains available without a valid parameter. Four CSS arrangements reuse the existing widget: compact three-by-three cards; a centered five-plus-four rack above the controls; a phone side rail that expands into a desktop tray; and pieces on both sides of the board.

Visible piece names and the game title are omitted in prototypes; accessible names and hover titles remain. Home, level, New game/Replay, practice/completion text and collapsed rules/keyboard help move below play. Routine preview guidance is hidden until selection supplies useful feedback. Artwork is centered using SVG origins also applied to occupied HTML hit regions. No rule, solver, fixture, session or record implementation changed.

Shared Chromium preview inspection compared all four layouts with the same running board at 390×844 and inspected the desktop side tray at 1366×768. The focused browser regression additionally checks every prototype at 320×568, 390×844 and 1366×768: timer, board, controls and all nine slots remain inside the viewport, no essential target intersects the fixed switch and no horizontal overflow occurs. The three desktop engines check native Brown domino dragging by its second square and match all occupied tray regions to SVG rectangles, including the vertical Grey line; differences stay below one CSS pixel. Prototype axe checks pass at 390×844.

The cross-project regression verifies keyboard activation, unchanged committed artwork/grid node/draft, continuing wall time, retained Undo, footer level-confirmation cancellation, direct/invalid URLs and unrelated query preservation. The new cases add no full-game completions. Root and subpath artifact startup checks cycle all four prototypes with a committed piece, then reload and verify the requested layout, path and fresh hidden board.

After an initial 145-case pass, adding a reload assertion reproduced the Home-history issue with `pnpm run test:e2e e2e/prototypes.spec.ts --project=desktop-chromium --grep "prototype URLs" --max-failures=1`: expected prototype `4`, received root entry `1`. The startup history-ready callback now restores the requested valid prototype URL while preserving the existing fresh-Home reload behavior. The final full matrix and both artifact mounts passed after rebuilding this change.

| Command | Actual result |
| --- | --- |
| `pnpm install --frozen-lockfile` | Passed using pnpm 12.10.0, without dependency/lock changes |
| `pnpm exec playwright install chromium firefox webkit` | Passed |
| `pnpm test` | All 75 pure tests passed on the final runtime |
| `pnpm run build` | Strict TypeScript/Vite build passed; 16 modules, with the prototype CSS bundled |
| `pnpm run test:e2e e2e/prototypes.spec.ts --project=desktop-chromium --max-failures=1` | Initial three focused cases passed in 10.0 seconds; reload coverage was added subsequently |
| `pnpm run test:e2e --max-failures=1` | Final 145 cases passed without skips in 1.9 minutes, including the reload regression in all five projects |
| `pnpm run test:e2e:prod` | All five cases passed in 8.4 seconds at `/` and `/rollmino/`, reusing the final preceding build |
| `pnpm run verify:all` | Independently validated all 62,208 Wizard answers in 27.71 seconds |
| `pnpm run check:docs` and `git diff --check` | Passed |

The conservative changed-path selector chose the full sequence because the prototype CSS/browser-test paths are new. Playwright invocations ran sequentially. Phone projects and preview resizing are emulation; no physical phone, pen or screen-reader pass is claimed. Short/landscape windows may scroll, and the surrounding/side layouts deliberately reduce phone board width. These are optional comparisons; no final redesign was chosen or published.

All acceptance criteria above are supported by these results. The switch and geometry/interaction regressions exercise the live public controls; the shared committed session retains hidden Start, transactional edits, terminal completion and ranking behavior covered by the full suite.
