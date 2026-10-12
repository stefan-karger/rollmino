# Rollmino V1 implementation plan

Status: agreed product contract, confirmed by the user on 2026-10-12. This is the current implementation specification. [The decision record](docs/DECISIONS.md) preserves the interview answers. [PLAN.md](PLAN.md) and [the research](docs/RESEARCH.md) are historical analysis; their earlier feature proposals do not override this plan. Changes remain possible through an explicit revision of the affected decision.

This handoff contains a reference engine, fixtures and tests. It does not yet contain a playable website. This planning pass changes documentation only. Implement the slices below when implementation is requested.

Execution is divided into detailed tasks in [docs/tickets/README.md](docs/tickets/README.md). That short tracker owns ticket status, blockers and next-task selection; this plan remains the agreed behavior/architecture contract. Completing the ticket documentation does not complete any implementation ticket.

## 1. Product and scope

Build **Rollmino**, a free, English-only, always-timed solo puzzle website. Phones drive the controls and layout. Desktop displays the same compact layout centered on the page. Use a clean dark interface, flat identifiable colored pieces and original SVG/CSS artwork.

The public repository is `stefan-karger/rollmino`. Initial hosting is GitHub Pages at `https://stefan-karger.github.io/rollmino/`, without a custom domain. Deliver a responsive website only.

[T00](docs/tickets/00-repository-setup.md) covers early repository creation, its description, local initialization/baseline, origin/upstream and first source push. The existing local directory may keep its name. Repository source synchronization is separate from the website deployment in T14; blocked GitHub access does not prevent local code work after the local baseline is established.

| Required for V1 | Behavior |
| --- | --- |
| Five difficulties | Starter, Junior, Expert, Master and Wizard are available immediately. Show the current contact restriction. |
| Hidden ready screen | Display the level, Start and a blank board. Do not reveal blocker coordinates or enable piece editing before Start. |
| Always-timed play | Start reveals the puzzle and starts timing. Background, lock time, confirmations and Undo count. There is no pause. |
| Fresh and practice runs | Fresh physical rolls can rank. Deliberate replay is timed practice, clearly labeled, and cannot rank. |
| Complete controls | Touch/mouse dragging, immediate tap/click placement, visible Rotate/Flip/Remove, keyboard input and full-run Undo. |
| Safe transitions | Confirm before New game, Replay or a level change abandons an active run. Replay clears pieces and waits behind Start again. |
| Valid completion | Validate committed placements, freeze the completed board/time and consider saving the run exactly once. |
| Personal records | Best five ranked runs for each level in this browser, with time and completion date. Clear the selected level with confirmation. |
| Testing and deployment | Pure rules/session/record tests, deterministic browser tests, mobile emulation, accessibility checks and a tested static build. |

Visual polish beyond clear feedback and an original simple favicon is nice to have and does not delay V1. Exclude hints, solution buttons, pause, Redo, in-progress restoration, record-layout inspection, record replay, accounts, cloud synchronization, global leaderboards, multiplayer, daily challenges, guided tutorials, shareable puzzles, analytics, sound, elaborate animations, PWA/service workers, install prompts and Android packages. Do not add any of them as an unstated dependency of the required features.

## 2. Technical decision and trade-offs

Use plain TypeScript, Vite, SVG, plain CSS and native HTML controls. Keep rules and run transitions independent of the DOM. Use Node's built-in test runner for pure code and Playwright Test with axe for browser verification. This choice was evaluated against the game's needs and then confirmed by the user.

| Choice | Why it fits | Trade-off / alternative considered |
| --- | --- | --- |
| TypeScript with Vite | Reuses the pure engine, gives development reloads and produces a static build. | Requires a build tool and separate strict type checking. Browser JavaScript without a build would give up the existing typed rules. |
| SVG visuals with HTML controls | Nine discrete shapes and 36 cells need no frame loop. Shared grid coordinates keep drawing and hit testing understandable. HTML provides names, focus and activation. | Align the SVG and semantic grid carefully. Canvas would require a separate accessible interaction layer and more hit testing. |
| Local DOM wiring | The UI has one game, a tray, controls and a small records list. | Maintain stable nodes and explicit rendering. React/Svelte could help a larger UI, but do not justify another runtime here. |
| Plain CSS | A single compact phone layout and dark theme need little styling machinery. | Maintain the small stylesheet directly. Astro/Tailwind conventions from the portfolio are not requirements for this game. |
| Node tests plus Playwright/axe | Pure invariants stay fast; browsers exercise input, storage, focus and the built artifact. | Browser binaries are development dependencies. Emulation does not establish real-device or screen-reader results. |

Follow [CODING_GUIDELINES.md](CODING_GUIDELINES.md). Extract modules for meaningful current responsibilities, not a target file length. There is one authoritative committed `Game`; previews are drafts. Do not add a state library, generic command framework, renderer adapter, event bus or future framework migration interface.

Use Node 24 and pnpm for development and CI. pnpm is the user's confirmed default for web projects; `package.json` pins version 12.10.0. The existing reference suite also runs on Node 22.16+. Vite builds browser code; Node type stripping is only the pure test runner's mechanism. Keep the existing TypeScript compiler and add compatible Vite 8, Playwright Test, `@axe-core/playwright` and `@types/node` development dependencies. Commit `pnpm-lock.yaml` and use `pnpm install --frozen-lockfile` for repeatable checks. Vite transpilation does not replace `tsc --noEmit`. [Vite features](https://vite.dev/guide/features.html#transpile-only)

Configure strict TypeScript with `noEmit`, `target: ES2022`, `module: ESNext`, `moduleResolution: Bundler`, `allowImportingTsExtensions`, DOM libraries and Node types for configuration files. Include `engine/`, `src/` and browser/configuration TypeScript; exclude provenance directories. Use Vite `base: './'`, an ES2022 build target, and no router. Relative assets allow the same artifact to load at the root and the Pages project path. [Vite build](https://vite.dev/guide/build.html)

## 3. Exact puzzle model

Use these tables as literal regression expectations, not values regenerated from the implementation under test.

The board is 6 by 6. Columns A through F run left to right; rows 1 through 6 run top to bottom. Internal coordinates are zero-based: A1 is `(0,0)`, F6 is `(5,5)`.

### Physical dice

| Die | Six faces, in engine order |
| --- | --- |
| 1 | A1, C1, D1, D2, E2, F3 |
| 2 | A2, B2, C2, A3, B1, B3 |
| 3 | C3, D3, E3, B4, C4, D4 |
| 4 | E1, F2, F2, B6, A5, A5 |
| 5 | A4, B5, C6, C5, D6, F6 |
| 6 | E4, F4, E5, F5, D5, E6 |
| 7 | F1, F1, F1, A6, A6, A6 |

On fresh Start, independently sample one index from 0 through 5 for each die. Preserve repeated faces. Validate injected random values as finite numbers in `[0,1)`. Use `Math.random` for ordinary local play; cryptographic randomness is unnecessary for personal records.

The distinct coordinate sets of the seven dice are disjoint and partition all 36 cells. Every physical roll produces seven distinct blockers. There are 279,936 ordered face-index outcomes and 62,208 distinct blocker boards; boards are not equally likely. Do not sample arbitrary sets of seven cells, deduplicate faces before rolling or reroll to force a different board. A coincidental repeat remains a fresh eligible run.

### Pieces and restrictions

In the shape column, `#` is occupied, `.` is empty and `/` starts the next row. Orientation counts include geometrically distinct rotations and reflections.

| ID | Base shape | Cells | Orientations | Restriction number |
| --- | --- | ---: | ---: | --- |
| navy | `#` | 1 | 1 | 1 |
| brown | `##` | 2 | 2 | 2 |
| orange | `###` | 3 | 2 | 3 |
| purple | `#./##` | 3 | 4 | 4 |
| grey | `####` | 4 | 2 | none |
| green | `##/##` | 4 | 1 | none |
| cyan | `#./#./##` | 4 | 8 | none |
| yellow | `.#./###` | 4 | 4 | none |
| red | `.##/##.` | 4 | 4 | none |

Exactly nine IDs cover 29 cells and have 28 orientations in total. There are 625 in-bounds piece/orientation placements on an unobstructed board. Preserve the current deterministic orientation order because existing fixtures use it. The UI must transform geometry rather than cycle orientation indices.

| Level | Pieces that must be pairwise edge-separated |
| --- | --- |
| Starter | none |
| Junior | navy, brown |
| Expert | navy, brown, orange |
| Master | brown, orange, purple |
| Wizard | navy, brown, orange, purple |

Only contact between different pieces in the listed group is restricted. Diagonal contact is legal. These pieces may touch blockers, the board boundary and unrestricted pieces. Master is not a superset of Expert. Describe the restriction rather than claiming every later level is objectively harder.

The five-level diagram supports the board convention, shapes and groups. The full face table comes from the corrected first-hand dice report and agrees with the independent model's distinct sets; the official manual does not enumerate all 42 sides. This is the accepted handoff model, not a claim of manufacturer certification. [Official rulebook](https://d32bxxnq6qs937.cloudfront.net/sites/default/files/GRL%20SGHP001%20Genius%20Square%2020230714.pdf), [dice report](https://mangosgaming.uk/portfolio/review-genius-square/), [independent model](https://github.com/aCampello/genius-square)

## 4. Repair the reference before trusting completion

The current 13 tests pass, but the review reproduced boundary defects. Add failing regressions first, then repair `engine/core.ts` with small shared validation helpers.

| Reproduction | Required result |
| --- | --- |
| Complete `opening-seed`, then replace `game.dice` with `['A1']` | `isSolved` returns false. |
| Complete that fixture; put a copy of its brown placement under `placed.navy`, then put `{id:'navy',orientation:0,x:1,y:0}` under `placed.brown` | Reject key/ID mismatch; never report a win. |
| `validateDice(Array(7))` | Throw for missing faces. Check every own array index; `.some` alone skips holes. |
| `newGame(validDice, 'INVALID')` at runtime | Throw for an unknown level. |
| Unknown/prototype-derived IDs, fractional or missing orientation/coordinates, extra placement keys, null/malformed objects | Fail through the documented contracts, without an incidental crash or false win. |

`validateDice` requires a dense array of seven strings, each belonging to its corresponding die. `newGame` validates the level and copies dice. Placement validation requires known own IDs and integer orientation/x/y within their valid ranges. Committed maps must use known own keys matching their placement IDs.

`canPlace` and `isSolved` return false for malformed setup/state. Ignore only the proposed piece's old footprint when testing its legal replacement. `isSolved` requires all nine IDs exactly once, legal occupancy/contacts, 29 distinct piece cells and complete coverage of 36 cells with the seven blockers.

`solve` throws for malformed setup and returns null for invalid fixed placements or a legal dead end. It preserves every fixed placement and never mutates input. Its terminal condition requires full coverage and all nine used IDs. Keep its 36-bit BigInt masks; JavaScript number bitwise operations cover only 32 bits. No solver call participates in normal placement, previews or win detection.

Strengthen `scripts/verify-all.mjs` to validate every returned answer through a test-only cell-array oracle. The oracle checks IDs, bounds, blockers, overlap, coverage and restricted edge contacts without calling `canPlace`/`isSolved` or using their masks. It may reuse canonical orientation data; literal shape tests separately guard that data. Test the oracle with deliberately broken answers so its failures are meaningful.

Wizard solutions also satisfy every other level because its restriction pairs contain theirs. The archived experiment tried other levels only if Wizard failed, and none failed. Do not describe that as five separately executed exhaustive sweeps. [Reference evidence](docs/REFERENCE-VERIFICATION.md)

## 5. Run lifecycle and authoritative state

Keep a small discriminated session with `ready`, `running` and `completed` phases. Keep the chosen level and mode, `ranked` or `practice`. A running session owns its committed `Game`, start timestamp and placement history. A completed session owns the final game, frozen elapsed milliseconds and completion timestamp. Ready practice alone retains replay dice in memory. There is no fresh puzzle to expose until Start.

Keep selection, draft orientation, target anchor and pointer gesture outside committed placements. Never duplicate committed occupancy in a second writable model. Derive blockers, cell labels and piece footprints from the game.

| Current phase / action | Result |
| --- | --- |
| Page load or reload | Fresh ready at Starter; read completed records. Restore no session, layout or timer. |
| Ready / Start | Ranked: roll seven physical faces. Practice: use retained replay dice. Create an empty valid game, start timing and reveal blockers in the same handler. Ignore repeated Start events after the transition. |
| Running / legal placement, move or removal | Save the prior placement snapshot, commit once, then check solved state. |
| Running / invalid, cancelled or identical placement | Preserve committed state/history. Time continues. |
| Running / Undo | Cancel any draft, restore the last successful placement snapshot. Do not change time or eligibility. Empty history is a no-op. |
| Running / New game | Cancel the gesture and ask to abandon. Cancel preserves the run; confirm enters hidden fresh ready at the same level. |
| Running / Replay | Ask to abandon; confirm retains only that run's dice/level and enters hidden practice ready with no pieces/history. |
| Running / level change | Ask to abandon; confirm enters fresh ready at the new level. Cancel restores the select's displayed value. Never carry a known layout into a ranked run at another level. |
| Running / solved after a commit | Freeze board/time, discard history/draft, announce completion once. Consider a ranked record once; practice never writes a completion record. |
| Completed / New game or level change | Enter hidden fresh ready without abandonment confirmation. |
| Completed / Replay | Enter hidden practice ready at the same level/dice; timing starts only on Start. |
| Ready / level change or New game | Prepare fresh ready. No abandonment confirmation or random draw yet. |
| Any / clear selected level's records | Confirm, then clear only that list. Preserve the session and timer. |
| Hidden tab, blur, lock or resized layout | Cancel an active gesture if necessary. Preserve committed play and continue timing. |

Replay is enabled during running and completed phases. It is not a stored-record action. At ready, the Start label and nearby mode text make fresh versus practice clear. Before Start, do not leak retained practice coordinates through SVG, cell labels or coordinate output.

Use immutable placement objects and an array of prior `placed` snapshots for Undo. Include successful placement, movement and removal throughout the active run, without an arbitrary history limit. Selection, draft transforms, invalid attempts and no-ops add no entries. There is no Redo; abandoned and completed runs discard history. Undo cannot reopen completion.

### Timing and completion

Record `startedAt = Date.now()` on Start. Derive elapsed time as `Math.max(0, now - startedAt)`; a display interval of about 100 ms only refreshes text. Compute the frozen result from a new timestamp in the solving commit handler. Do not count interval callbacks or subtract hidden/confirmation periods. Date-based elapsed time includes device sleep across browser implementations; a `performance.now()`-only stopwatch has cross-platform sleep differences. System clock changes can affect personal times, which V1 does not attempt to police. [Timing and sleep](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now#ticking_during_sleep)

Display `mm:ss.ss`, flooring milliseconds to centiseconds. Minutes have at least two digits and can grow beyond 99; do not wrap. Store and compare whole milliseconds, including differences hidden by the display precision. Confirmation dialogs do not pause the clock.

Commit and validate before transitioning to completed. Only the `running` to `completed` transition invokes record consideration, using the timestamp captured for that completion. Subsequent renders, pointer releases, clicks, Clear records and storage failure notices cannot resave it. Show the frozen time for every completion, even if practice or outside the top five.

## 6. Selection, previews and placement

Use a persistent slot for every piece. A placed piece stays dimmed, named and selectable there; dim only its shape so its label remains readable. Show its committed orientation in the slot. An unplaced slot shows the canonical base orientation. Selecting a placed piece copies its committed orientation into the draft; otherwise begin at orientation zero.

For tap/keyboard selection, mark the first occupied cell in row-major order as the anchor. It is an occupied square, not necessarily the bounding box's `(0,0)`. A target cell positions this anchor. For dragging, the actual occupied square grabbed in the board or tray is the anchor. Tapping a tray label selects but does not arm a drag; empty areas in a piece's bounding box do not count as occupied drag sources.

| Interaction state / event | Effect |
| --- | --- |
| Idle / select tray piece or tap a board piece | Selected draft, with a visible anchor. No committed change. |
| Selected / Rotate or Flip | Transform draft geometry and anchor; update the ghost/legality. No committed change. |
| Selected / tap target cell | Attempt immediate commit. There is no Place button or second confirmation. |
| Selected / keyboard target movement | Move target anchor and preview; Enter/Space attempts commit. |
| Pointer down on an occupied source square | Arm one primary pointer with source geometry and grab anchor. Keep original committed placement. |
| Armed / movement exceeds 6 CSS px | Begin drag, capture the pointer on a stable game container and update target preview. |
| Armed / release before threshold | Perform ordinary selection/target tap behavior once. Do not accidentally place while selecting the source. |
| Dragging / move | Recompute candidate from current pointer geometry. Preview only. |
| Dragging / legal board release | Recompute from the release event and commit once. Clear gesture state before releasing capture. |
| Dragging / release over its own tray slot | Remove the piece as one successful action if it was placed. Unplaced pieces simply return to their slot. |
| Dragging / invalid board or other outside release | Restore committed state and the source draft; remain selected. Do not choose a nearest legal fit. |
| Selected / Remove or Delete | Remove committed piece as one action; clear selection. An unplaced piece just deselects. |
| Selected / Escape | Discard draft and return focus to its persistent slot. |
| Armed/dragging / cancel, lost capture, Escape, blur, hidden tab or layout resize | Discard gesture and restore committed state. No history entry and no timing change. |
| Any / Undo or run transition | Cancel gesture first. Late pointer events cannot commit into the next phase. |

When a piece is already selected, a tap on any board cell attempts that selected piece's placement. With no selection, tapping an occupied cell selects its piece. A drag that crosses the threshold selects its actual source piece. Keep these selection and destination paths distinct so pointer-down bookkeeping cannot turn a selecting tap into a move.

A successful placement clears selection. An invalid attempt keeps the selection/draft available and announces a concise rejection. Legal moves may create unsolvable partial boards and must still be accepted. There is no dead-end detection or assistance UI.

### Real transforms and pointer coordinates

Screen-clockwise rotation maps `(x,y)` to `(-y,x)`. Left/right reflection maps it to `(-x,y)`. Transform all occupied cells and the anchor, then subtract the transformed shape's minimum x/y from both. Match the normalized cells to the piece's canonical orientation. Preserve the anchor's board position when transforming an existing preview. Symmetric transformations may leave the shape unchanged; never interpret `orientation + 1` as Rotate.

During drag, map client coordinates through the inverse screen CTM of the SVG's board group. That group's local coordinates cover exactly `[0,6) × [0,6)`; axis labels sit outside it. Floor to the pointed board cell and subtract the local anchor. Use the same six-cell rectangle for HTML cell positions. Never clamp negative coordinates or out-of-board origins into a legal position. Recompute on release and after a draft transformation. [SVG coordinate systems](https://www.w3.org/TR/SVG2/coords.html)

Use Pointer Events for touch, mouse and pen. Handle `pointercancel` and `lostpointercapture`, ignore secondary pointers and suppress the compatibility click after a real drag. Capture on a node that remains mounted. Clear the stored pointer before explicit release so the resulting lost-capture event cannot roll back a committed move. Keep Rotate/Flip buttons visible but disable button activation while a pointer gesture is held; desktop R/F may transform the drag anchor. [Pointer Events](https://www.w3.org/TR/pointerevents3/)

Apply `touch-action: none` only to actual draggable source regions before pointer down. Leave document scrolling and zoom available elsewhere, including empty cells, gutters and text. Do not use native HTML drag-and-drop or a global touch-move blocker. No automatic scrolling or long-press mode is required. Complete tap placement remains usable on short screens.

## 7. Layout, keyboard and accessibility

Use a system font, a compact centered container of about 440 CSS px maximum width and one column at every device size. Place the title/level/timer above the labeled board; keep transform/Undo controls and the nine-slot tray adjacent below. Put New game, Replay and records below the main play controls. Use at least 44 CSS px targets for ordinary buttons where possible. Allow vertical scrolling on small heights and landscape; never hide required controls behind a forced fullscreen/orientation mode. Prevent horizontal page overflow at 320 CSS px.

SVG supplies flat piece/blocker geometry and the pointer-transparent ghost. Give each piece a text/shape identity; mark restricted pieces with their numbers and list the level's rule in words. Distinguish valid/invalid previews through outlines/marks and text as well as color. Use original simple SVG paths or generated cell rectangles; no official artwork, external font or icon package is needed.

Keep the visual SVG `aria-hidden` and provide a synchronized HTML grid: six semantic rows, six cells per row, one named native button in each cell. Use a roving tab stop rather than 36 consecutive Tab stops. Labels describe coordinates and committed content, such as `B2, blocker` or `E6, navy piece 1`. The ready screen says the puzzle is hidden and disables editing. Keep stable controls instead of rebuilding the entire DOM on timer ticks. [Accessible grid pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)

| Key, when focus is in the game widget | Action |
| --- | --- |
| Tab / Shift+Tab | Move among level, grid, piece slots and controls without a trap. |
| Arrows | Navigate grid cells; with a selected draft, move its target anchor and preview. No wrapping across edges. |
| Home / End | First/last cell of the current row. Ctrl+Home/Ctrl+End reaches the first/last board cell. |
| Enter / Space | Activate the focused tray/control or attempt placement at the focused board target. Handle native activation once. |
| R / F | Rotate clockwise / flip left-right. Ignore modified shortcuts. |
| Delete | Remove selected committed piece. |
| Escape | Cancel draft/gesture or cancel the confirmation dialog. |

Do not capture game shortcuts from the level select, dialogs or unrelated controls. Keep grid focus at its target after keyboard placement; returning/cancelling a piece can focus its slot. On Start, move focus to the grid. Completion uses a polite status announcement without a forced modal or focus jump.

Use one native confirmation dialog for abandonment and record clearing, with specific action text and Confirm/Cancel. Cancel restores the initiating control's focus. Confirmed run transitions focus Start; confirmed record clearing returns focus to Clear records. Preserve the timer during the dialog. Do not add an unload prompt for refresh/close.

A polite atomic status region announces successful placement, rejection, removal, Undo and completion. Timer ticks and pointer movement are not live announcements. Maintain visible focus, readable text/disabled states, contrast and reduced-motion support. Tap and keyboard must support complete play without dragging. [Dragging alternatives](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html)

## 8. Personal records and storage

Store only the five level lists under `rollmino.records.v1` in `localStorage`:

```ts
type RunRecord = { elapsedMs: number; finishedAt: number };
// Payload: known Level keys, each with up to five RunRecord entries.
// Both fields are whole milliseconds; finishedAt is an epoch timestamp.
```

On ranked completion, insert the candidate, sort by elapsed milliseconds ascending then completion timestamp ascending, and retain five. If both fields tie, stable insertion order keeps the older saved entry first. Display `mm:ss.ss` and a local completion date using English `Intl.DateTimeFormat`; do not display time-of-day, layouts or extra statistics. Identical displayed times may still sort differently because their stored milliseconds differ.

Show records for the selected level and a clear empty state. Practice completion does not insert a record. Clearing affects only the selected list inside this app key; never call `localStorage.clear()`. Do not persist dice, placements, sessions, Undo, preferences, usernames or unused IDs.

Use a small validator for the actual payload: known level keys, arrays, finite nonnegative integer elapsed values and valid integer date timestamps. Discard malformed entries, sort/cap valid ones and default missing lists to empty. Malformed JSON or an invalid payload shows a short recovery notice and empty records. Catch read/access/write exceptions. If persistence is unavailable, retain this page's records in memory, show that they will not survive reload, and keep the game playable. Read the current valid payload before an insertion/clear when storage works, reducing stale overwrites without adding a synchronization service. Automatic cross-tab refresh is outside V1.

Storage belongs to the origin and browser profile, can be blocked, and private-mode records may disappear. Serve over HTTP(S). A custom-domain move would use a different origin and does not include a migration feature in V1. The app does not upload run records. [localStorage behavior](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

## 9. Minimal file tree and reuse

Create files only when their slice needs them. This tree names concrete responsibilities; split board/input code later only if the implemented complexity warrants that boundary under the coding guidelines.

```text
index.html                         Semantic shell, title/metadata, app entry
src/
  app.ts                           Stable DOM/SVG rendering; pointer/keyboard/dialog wiring
  session.ts                       Pure phases, commits, Undo, time/completion transitions
  records.ts                       Ranking, payload validation, localStorage failure handling
  styles.css                       Phone layout, colors, focus, previews, responsive behavior
public/favicon.svg                 Small original asset
engine/core.ts                     REUSE; validation repairs and geometric transform helpers
fixtures/rolls.json                 REUSE; known dice/solutions, retain orientation order
tests/
  core.test.mjs                     REUSE and expand rules/regression tests
  transforms.test.mjs               Transform geometry and occupied-anchor cases
  session.test.mjs                  Lifecycle, transactions, history, timing, terminal state
  records.test.mjs                  Ranking, validation, storage exceptions and clearing
  oracle.mjs                       Test-only independent cell-array solution validator
  oracle.test.mjs                   Deliberately invalid answers test the validator
scripts/verify-all.mjs              REUSE; validate every exhaustive answer with oracle
e2e/
  helpers.ts                       Seed physical rolls and perform public UI actions
  play.spec.ts                     Start/replay/levels/fixture completion and timing
  input.spec.ts                    Tap, keyboard, native mouse/touch gestures and cancellation
  records.spec.ts                  Persistence, ranking, clearing and practice exclusion
  accessibility.spec.ts            Axe, focus, responsive and reduced-motion cases
  production.spec.ts               Built artifact, assets and fixture play at root/subpath
tsconfig.json                      Strict no-emit browser/configuration checks
vite.config.ts                     Relative base and explicit target
playwright.config.ts               Development server and five browser projects
playwright.production.config.ts    Two preview mounts; reuse already-built dist
.github/workflows/pages.yml        Test/build artifact, then deploy main through Pages
package.json / pnpm-lock.yaml   Scripts and reproducible development dependencies
```

Keep `AGENTS.md`, `CODING_GUIDELINES.md`, this plan and active docs as the handoff. Preserve `original-handoff/`, `research-archive/` and the original `SHA256SUMS.txt` as provenance; never import them into browser code or publish them in `dist/`. The manifest describes the initial archive, not this revised documentation. Do not maintain duplicate active engines. Extend `.gitignore` for Playwright reports/results. Update package name/description to Rollmino; `private: true` prevents accidental package publication and does not make the GitHub repository private.

Pure session functions accept timestamps supplied by their caller so tests need no real clock. `app.ts` supplies current timestamps, DOM events and the browser's storage object. Catch access to `window.localStorage` at that boundary; `records.ts` handles get/set failures through the small storage object it also accepts in tests. No generalized persistence adapter is needed. Export only consumed functions.

## 10. Commands and browser configurations

Only `test`, `verify:all` and the engine-only `typecheck` exist now. Add these scripts as the relevant files appear:

| Script | Command |
| --- | --- |
| `test` | `node --experimental-strip-types --test tests/*.test.mjs` |
| `test:rules` | `node --experimental-strip-types --test tests/core.test.mjs tests/oracle.test.mjs` |
| `test:transforms` | `node --experimental-strip-types --test tests/transforms.test.mjs` |
| `test:state` | `node --experimental-strip-types --test tests/session.test.mjs` |
| `test:records` | `node --experimental-strip-types --test tests/records.test.mjs` |
| `verify:all` | `node --experimental-strip-types scripts/verify-all.mjs` |
| `typecheck` | `tsc --noEmit` |
| `dev` | `vite --host 127.0.0.1 --port 5173 --strictPort` |
| `build` | `pnpm run typecheck && vite build` |
| `preview` | `vite preview --host 127.0.0.1 --port 4173 --strictPort` |
| `test:e2e` | `playwright test` |
| `test:e2e:prod` | `playwright test --config playwright.production.config.ts` |

Development Playwright projects are `desktop-chromium`, `desktop-firefox`, `desktop-webkit`, `mobile-chromium` and `mobile-webkit`. Mobile projects enable touch and use representative phone viewport/device settings. Have `webServer` start `pnpm run dev`; CI must not reuse an unrelated running server. Keep production tests out of the development suite through test matching.

Production configuration starts `pnpm run preview` at port 4173 and `pnpm run preview --port 4174 --base /rollmino/` for the second mount. Run the same production smoke/fixture tests in Chromium projects at `http://127.0.0.1:4173/` and `http://127.0.0.1:4174/rollmino/`. Navigate relative to the project base URL, not a hardcoded `/`. Neither config rebuilds: both serve the preceding `pnpm run build` artifact. Vite preview supports an explicit base and is only a verification server. [Vite CLI](https://vite.dev/guide/cli#vite-preview)

First installation after Slice 1 adds tooling:

```bash
pnpm add -D --save-exact vite@8 @playwright/test @axe-core/playwright @types/node@24
pnpm exec playwright install chromium firefox webkit
```

On Linux CI use `pnpm exec playwright install --with-deps chromium firefox webkit`. The complete release verification sequence is:

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm run build
pnpm run test:e2e
pnpm run test:e2e:prod
pnpm run verify:all
```

Keep the exhaustive check separate from fast `pnpm test`; run it for initial release and rule/solver changes. No physical phone is required to pass these checks.

## 11. Ordered implementation slices

### Slice 0. Make the reference trustworthy

Outcome: a rule core whose wins and solver answers survive malformed-state regressions. Dependency: existing handoff only.

Tasks: begin T00's repository setup and establish the local Git baseline before code changes; complete remote creation/description/sync when access is available. Then add the regressions in section 4; repair boundary validation and solved coverage; add the independent oracle and strengthen the exhaustive verifier. Preserve literal dice/shapes/groups and fixture orientation indices. Keep archive copies unchanged. Record results and corrections in `docs/TEST-RESULTS.md`.

Manual checks: inspect the key/ID and sparse-dice reproductions, and confirm the repaired functions follow their failure contracts. This slice has no browser UI yet.

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm run typecheck
pnpm run verify:all
```

Exit: all fast checks pass, all 62,208 returned Wizard solutions pass the oracle, and the four reproduced defects fail closed.

### Slice 1. Deliver a complete timed game through tap and keyboard

Outcome: start a hidden puzzle, solve it through public controls, use Undo, and replay as practice. Dependency: Slice 0.

Tasks: add tooling/configuration and the semantic/SVG board; implement real transform helpers and occupied anchors; build the pure session lifecycle and unlimited active-run history. Wire immediate tap/click placement, full keyboard play, Rotate/Flip/Remove, Start, New game, level changes, Replay and confirmations. Show running/frozen time and practice status. Completion is terminal; storage comes next. Add three-fixture browser helpers and completion tests as soon as play is possible.

Manual checks in an available browser: before Start, no blocker information is visible. Solve `opening-seed`; the final valid committed move alone ends the run. Try illegal taps, a move onto the piece's own old footprint, both chiral flips, Undo to the opening board, active replay confirmation and cancellation. Complete a keyboard-only game. Resize without changing placements.

```bash
pnpm run test:transforms
pnpm run test:state
pnpm test
pnpm run build
pnpm run test:e2e --project=desktop-chromium --project=mobile-chromium
```

Exit: both selected browser projects complete known fixtures through actual controls. Start/replay/background-time unit checks pass. Cancelled transitions and invalid attempts preserve committed play/history; solving freezes it once.

### Slice 2. Add personal top-five records

Outcome: fresh completions rank locally; practice never does. Dependency: Slice 1.

Tasks: implement section 8, selected-level record lists, local date/time formatting and confirmation before clearing. Connect record consideration only to completion transition. Handle corrupt and unavailable storage through a visible short notice with in-memory fallback. Reload retains records and returns to fresh Starter ready. Add ranking/tie/limit/failure tests and browser persistence tests.

Manual checks: finish a seeded fresh run, reload, and inspect its time/date. Replay and complete it without another record. Clear one level while another has records; cancel clearing first. Clear during an active run and check its clock/board continue. Trigger blocked storage in a test context and verify play still completes.

```bash
pnpm run test:records
pnpm run test:state
pnpm test
pnpm run build
pnpm run test:e2e e2e/records.spec.ts
```

Exit: top-five sorting uses raw milliseconds, exact ties retain the older completion, writes occur once per ranked finish, and no persisted payload contains puzzle/session data.

### Slice 3. Add transactional touch, mouse and pen dragging

Outcome: direct placement/movement and return-to-own-slot work with the same committed rules. Dependency: Slice 1; integrate with Slice 2's completion path.

Tasks: implement armed/dragging states, source hit testing, pointer capture, CTM conversion, grabbed anchors, previews, release validation and own-slot removal. Handle threshold taps without double activation, secondary pointers, click suppression and every cancellation path. Keep original placements until a successful release. Reuse session commit/remove functions, not separate drag mutation logic.

Manual checks in the available browser/emulation: grab different occupied cells of cyan/red, move from tray to board and between board positions, rotate with R/F during a mouse drag, and return to the original slot. Try blocker/edge/other-piece drops, another tray slot, release outside the board and cancelling mid-drag. Scroll outside draggable regions. Verify the tap alternative still works after every cancellation.

```bash
pnpm test
pnpm run build
pnpm run test:e2e e2e/input.spec.ts
```

Exit: native mouse and Chromium touch sequences cover placement, movement, return and cancellation; invalid/cancelled releases never change committed placement/history or create a record. Capture survives leaving the source element and cleans up after completion/new run.

### Slice 4. Finish responsive behavior and accessibility

Outcome: the complete V1 is usable in the browser matrix with both drag and non-drag input. Dependency: Slices 1 through 3.

Tasks: finish dark-theme contrast, numbered restriction cues, roving focus, modal focus restoration, status messages, narrow/short layout, reduced-motion rules and stable DOM updates. Add axe tests and explicit responsive/keyboard cases. Run all development projects. Fix browser differences before widening the design or adding dependencies.

Manual checks in available tools: inspect 320/390/768/1440 CSS px widths and a short landscape viewport; check no horizontal overflow or unreachable controls. Inspect 200% zoom, visible focus and concise announcements. Check that timer refreshes do not steal focus, and all placement/removal/transform actions work without dragging.

```bash
pnpm test
pnpm run build
pnpm run test:e2e
```

Exit: all configured projects pass their applicable cases; relevant axe failures are resolved; complete tap and keyboard fixtures work. Record emulation/browser versions honestly. Real Android Chrome checks are welcome later and are not a release dependency.

### Slice 5. Verify and deploy the exact static artifact

Outcome: a checked V1 artifact ready for the public Pages site. Dependency: all preceding slices.

Tasks: add production root/subpath tests and the Pages workflow below. Update README with clean setup, controls, record-storage behavior and actual test results. Inspect `dist/` for original app assets only. Verify T00's repository setup is complete, configure Pages, then deploy the artifact produced by the successful checks and add its verified URL to the repository homepage.

Manual checks: open both preview mounts, Start, solve the known fixture, reload retained records and confirm assets load. After deployment, inspect the live `/rollmino/` page for title/assets/Start and a representative placement; log this separately from local tests.

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm run build
pnpm run test:e2e
pnpm run test:e2e:prod
pnpm run verify:all
```

Exit: the gates below pass; the same tested `dist/` is the deployment artifact. Do not mark an inaccessible live deployment as verified.

## 12. Test strategy and fixtures

### Fast invariant and rules tests

- Assert the literal 42 faces, duplicate multiplicities, disjoint die sets and exact A1 through F6 partition. Exercise deterministic face indices, boundary random values and rejection of invalid random values.
- Assert literal base shapes, nine IDs, 29 cells, the orientation counts and 625 candidates. Test four rotations/two flips for every shape and occupied anchor; test cyan/red reflections and normalization.
- Test all six pairs among the numbered pieces at all five levels in both placement orders. Include diagonal-only contact, boundary/blocker contact, contact with unrestricted pieces and no adjacency wrapping from F to A.
- Test collisions, out-of-bounds/negative/fractional coordinates, own-footprint movement, invalid orientation/IDs, unknown map keys, mismatched IDs, holes in dice and unknown levels. Test the false-win reproductions and incomplete boards.
- Replay all three stored solutions; independently validate solver results. Verify fixed partial pieces are unchanged and input is not mutated. For `opening-seed` Wizard, navy at B6, `{id:'navy',orientation:0,x:1,y:5}`, is legal but has no completion. The app accepts that legal move.
- Run the strengthened exhaustive sweep separately. It validates one legal returned solution per board, not solution counts or human difficulty.

### Session and record tests

- Guard all phase transitions and repeated events. Ready stays hidden; ranked Start draws exactly seven faces, practice Start draws none. Replay/new/level-change clear history correctly; abandoned practice can start a new fresh ranked run.
- Valid commits/removals add one snapshot; invalid/no-op/cancelled actions add none. Undo reaches the entire active history, restores exact committed placements and never changes timing/eligibility. Completed sessions reject editing/Undo and cannot save again.
- Supply fixed timestamps to prove background periods, delayed display callbacks and confirmation time count. Freeze completion time once, test formatting boundaries and preserve the timer during record clearing. No test sleeps for a real run duration.
- Test more than five results, independent level lists, raw-millisecond ordering, exact ties, practice exclusion and reload behavior. Test malformed JSON/entries, read/write/access exceptions, selected-list clear, preservation of unrelated storage keys and absence of dice/session fields.

### Browser input, mobile emulation and accessibility

Seed `Math.random` before app startup with `page.addInitScript` and a sequence of physical face indices. For `opening-seed`, use `[0,1,0,1,4,2,3]` mapped to `(index + 0.5) / 6`. Reset the test RNG queue immediately before each Start if development tooling consumes randomness; this changes the test's RNG, not app state. Provide a deterministic second roll for changed-board assertions, plus a deliberate repeated fresh roll case. Do not expose a production cheat panel or global mutable session API.

Complete fixtures through actual tray, transform and cell controls. Helpers may inspect cell labels/DOM geometry and compute the R/F sequence needed for a fixture orientation, but may not inject committed placements. Install Playwright's clock before navigation for deterministic timers; advance it with clock APIs instead of blocking waits. [Playwright clock](https://playwright.dev/docs/clock)

Use native `page.mouse` down/move/up sequences for pointer capture and geometry checks. Playwright's touchscreen API provides taps, so use Chromium CDP `Input.dispatchTouchEvent` for native touch dragging/cancellation: `touchStart` and `touchMove` have active touch points with stable IDs; `touchEnd` and `touchCancel` have no points. Include a secondary-touch case. Run these cases only in Chromium; run mobile tap/transform/complete-game cases in both mobile projects. This is automated emulation, not a claimed physical-phone pass. [Touchscreen API](https://playwright.dev/docs/api/class-touchscreen), [CDP sessions](https://playwright.dev/docs/api/class-cdpsession), [touch protocol definition](https://github.com/ChromeDevTools/devtools-protocol/blob/master/json/browser_protocol.json)

Test grabbed anchors at scaling, holes in chiral bounding boxes, transform during mouse drag, threshold tap handling, legal self-overlap moves, own-slot removal, other-slot rejection, pointer cancellation, lost capture, blur/visibility cancellation and resize. Synthetic event cases may test a cleanup branch, but do not label them evidence of native touch support. Assert history/placements through visible behavior, such as Undo and subsequent legal placement.

Complete a keyboard-only fixture, test focus around dialogs/Start/completion, accessible names, restriction cues and relevant axe checks. Inspect narrow/landscape/desktop layouts, 200% zoom and reduced motion. Check that scrolling/zoom remain available outside source regions. Browser emulation and axe do not claim a screen-reader audit.

Production tests fail on page exceptions, unexpected error logs, missing app assets and app network/API dependencies. At both mounts, check hidden ready, deterministic Start, transformations, full fixture completion and record retention after reload. Only the built artifact is served.

## 13. Acceptance gates and Pages readiness

| Gate | Concrete pass condition |
| --- | --- |
| Model | Literal dice/shapes/groups and all pure tests pass; known malformed-state false wins are rejected. |
| Solver reference | All 62,208 Wizard answers pass the independent oracle; fixed-position/dead-end tests pass. No solver assistance appears in the UI. |
| Start and time | No layout leaks before Start; time includes hidden/confirmation/Undo periods; completion freezes one elapsed result. |
| Play and transactions | A public-control fixture completes. Invalid/cancelled attempts preserve committed state/history. Real transforms and occupied anchors work. |
| Inputs | Complete tap and keyboard play pass; native mouse and Chromium-emulated touch dragging/cancellation pass. Returning to the piece's own slot removes it. |
| Lifecycle | Active abandonment confirms; cancellation preserves the run. Replay is hidden practice until Start, level changes are fresh, reload abandons the session, completion cannot be edited. |
| Records | Best five per level, raw-ms ordering, older-first exact ties, practice exclusion, single consideration, selected-level clear and storage-failure behavior pass. |
| Layout/accessibility | Required actions remain reachable at tested sizes, no horizontal overflow, stable visible focus, named controls, non-color cues and relevant axe checks pass. |
| Static artifact | Strict type check/build, development browser suite and root/subpath artifact tests pass without page/asset errors or runtime service dependencies. |
| Reproduction | A clean lockfile installation can execute the documented commands with the documented Node/browser setup. |
| Assets/scope | Only original app assets ship; no copied official graphics, provenance archives, unused help UI or speculative infrastructure enters the build. |

The release gate is testing executable here. Do not require a physical phone, current physical game set or manual screen-reader sign-off. Report anything not exercised as unverified instead of inventing a pass. A verified model/source conflict must still be corrected before claiming the corresponding behavior is accurate.

Use one Pages workflow with test/build and deployment jobs. On pull requests, run checks without publishing. On pushes to `main` and manual dispatch, deploy after successful checks. Install the pinned pnpm version through `pnpm/action-setup` before `actions/setup-node` configures Node 24 and `cache: pnpm` with `cache-dependency-path: pnpm-lock.yaml`. Use `pnpm install --frozen-lockfile`, install Playwright browsers, and run the release sequence. Upload the exact tested `dist/` with `actions/upload-pages-artifact@v4`; do not rebuild in the deploy job. The build job uses read-only repository access. The deploy job needs the build job, `pages: write`, `id-token: write` and the `github-pages` environment. Use official checkout/setup-node/configure-pages/deploy-pages actions and the maintained pnpm setup action, with versions from the linked documentation, and serialize Pages deployments. Select GitHub Actions as the repository's Pages source. No branch-generated Jekyll site or secrets for application APIs are needed. [Pages workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [Node setup](https://github.com/actions/setup-node), [pnpm setup](https://github.com/pnpm/action-setup)

GitHub Free supports Pages from public repositories, matching the confirmed setup. Configure repository ownership/visibility and inspect for unintended private files before the first public push; the plan itself creates no repository or deployment. [Pages availability](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)

## 14. Bounded risks and deliberate omissions

| Risk / assumption | Chosen handling |
| --- | --- |
| Physical edition/face provenance | Use the agreed explicit model. Preserve source caveats; do not advertise manufacturer certification. Correct verified discrepancies with tests and documented data changes. |
| Known engine boundary defects | Fix in Slice 0 before trusting completion. Passing the old suite is insufficient. |
| Finger coverage and pointer anchoring | Preserve grabbed occupied cells, shared geometry and cancellation; provide complete immediate tap input. Emulation is the required evidence, real phones are optional. |
| Orientation canonicalization | Preserve fixture ordering and test actual transforms/anchors separately. Indices are storage details. |
| Stale solver hints | No hint UI or asynchronous solver requests exist in V1, so no stale-hint infrastructure is needed. Preserve fixed-placement correctness in reference tests. |
| Record persistence | Catch browser storage failures and explain in-memory fallback. Clearing site data/private sessions can erase records; no backup/sync promise. |
| Clock changes or record editing | Personal records use local wall time/storage. No anti-cheat, server clock, signing or tamper protection. |
| Brand and copyright | Rollmino is the chosen name, without a legal-clearance claim. Use original visuals and no official logos/manual imagery. A later naming concern can change title/assets without rewriting rules. |
| Untested hardware/assistive tools | Record the actual automated environment. Do not turn unavailable real-device checks into a release gate or claim them as completed. |

No backend, auth, database, physics, 3D, game engine, configurable board family, generalized state/store, worker, WASM, solver cache, hint queue or future-only API is justified. Nine-piece snapshots and direct session functions cover the current game. Add optimization only after a measured current problem. Keep useful pure boundaries even when they have one consumer; KISS is about readable, maintainable work, not mechanically fewer files.

There are no remaining open product decisions. Implementation may choose ordinary code/CSS details within this contract. A conflict that changes user-visible behavior should identify the affected decision and propose a focused revision rather than silently restoring an older proposal.
