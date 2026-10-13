# Rollmino maintenance contract

The user confirmed V1 on 2026-10-12. V1 is implemented and [published](https://stefan-karger.github.io/rollmino/). This is the single behavior and engineering contract, including the accepted next revision below. [Tickets](docs/tickets/README.md) own implementation status and evidence. Change user-visible decisions explicitly; historical proposals do not override this contract.

## Accepted Home and tutorial revision

On 2026-10-13, the user requested analysis and a questioning session, confirmed the following choices, then requested implementation tickets. [T29](docs/tickets/T29-onboarding-and-home.md) records the current-UI audit and answers; T30 through T35 in the [tracker](docs/tickets/README.md) implement this revision. Creating these tickets does not implement or publish it. The remaining sections describe the implemented V1 baseline; this section explicitly revises only the behavior listed here for the next batch.

- Show a separate Home screen on every load/reload, with an original logo/name and Play, Tutorial and Personal bests. Prepare fresh hidden Starter internally. Restore no run, layout, timer, lesson progress or level preference.
- Play opens the hidden game board with level selection. Start still reveals the puzzle and starts timing together. Home/tutorial navigation draws no RNG. Retain ordinary level selection within the current page; a reload resets it to Starter.
- Provide Home from the game. Ready/completed return without confirmation and discard the prior layout. A running return cancels gestures and confirms abandonment before Home is exposed. Cancel preserves committed play, eligibility and wall time and restores initiating focus. A subsequent Play prepares a fresh roll.
- Browser Back navigates within the app, including confirmed running-game abandonment. Cancel reconciles history without restarting the run; Forward cannot restore abandoned play. Returning to root Home lets Back leave the site without duplicate Home loops. Actual navigation away retains the no-unload-prompt policy.
- Move full record lists, level filtering, storage explanation and selected-level clearing to Personal bests, reached from Home. Keep frozen completion time, ranked/practice feedback and any save-failure notice in the game. Preserve the existing record schema and ranking/storage behavior.
- Tutorial is available only from Home, never from ready, running or completed game screens. No ordinary running game survives behind it. Learning is untimed and never records a result.
- Begin with short self-paced illustrated panels and optional Replay example buttons. Teach the objective, tap anchor, moving, geometric Rotate/Flip, rejection, Undo/Remove, ordinary timing/practice and a small level comparison. All levels remain available; Master is not a superset of Expert. Retain exact groups and edge/corner rules.
- Follow with a short Starter exercise using six fixed prepared pieces and three learner-controlled pieces. Explain that fixed pieces are specific to the exercise. Teach placement, Rotate, Flip and Undo, then finish the board. Canonical legality and exact solved-state validation apply. Tutorial history begins after the prepared baseline.
- Accept legal off-step moves and equivalent transformation sequences. Explain the current task and offer Reset step, which restores its board/history checkpoint and clears draft/gesture. Invalid/no-op attempts remain transactional. A legal full-board solve completes the exercise even when steps occurred out of order.
- Permit tutorial exit at any point, repeated review and direct exercise entry from the tutorial screen. Redo exercise restores the prepared baseline. Tutorial Play opens fresh hidden ordinary ready, with no lesson placements, targets or history. Start remains necessary.
- Highlight Tutorial once per browser/site origin, stopping after Play or Tutorial is chosen. Personal bests alone does not dismiss it. Persist only this handled-offer flag in a separate versioned local key. Do not infer it from records; selected clearing cannot reset it. Missing, invalid, cleared or unavailable storage may repeat the offer and must not block play. Restore no lesson progress.

The teaching diagrams and fixed exercise guidance are narrow exceptions to deferred tutorials and no assistance; no reference solver call or hint/solution assistance enters ordinary games. Ranked and replay-practice runs remain timed. Retain complete tap/keyboard/native pointer play, focus, notices, original art, reduced motion and narrow-screen scrolling/reflow. No backend, global leaderboard, native app, splash-delay requirement, router framework, generic lesson engine or additional persisted preferences are introduced.

Implement scoped tickets with their own regressions and affected checks. Add menu actions only when their destinations work; do not publish a partial batch as the completed accepted flow. Update baseline sections as each behavior is implemented, without inventing publication evidence. [Verification](#verification) remains the single policy; new/unknown paths retain its conservative full scope. T35 consolidates the final contract and local readiness evidence. Publication requires the existing release gates and is outside this ticket-creation request.

## Product and rules

Rollmino is a free, English-only solo block puzzle. Every ordinary ranked or replay-practice run is timed. The Home tutorial explanation and Starter exercise are untimed and never consider records. Use a clean dark phone-first layout, centered on desktop, with original flat SVG/CSS artwork. All five levels are immediately available. The app runs on static hosting without an account or backend.

The board is 6 by 6. Columns A through F run left to right; rows 1 through 6 run top to bottom. A1 is `(0,0)` and F6 is `(5,5)` internally.

Sample one of six physical faces independently per die on fresh Start. Repeated faces affect probability. Never deduplicate faces, sample arbitrary blocker sets or reroll to force a different board. Injected random values must be finite in `[0,1)`.

| Die | Six faces in engine order |
| --- | --- |
| 1 | A1, C1, D1, D2, E2, F3 |
| 2 | A2, B2, C2, A3, B1, B3 |
| 3 | C3, D3, E3, B4, C4, D4 |
| 4 | E1, F2, F2, B6, A5, A5 |
| 5 | A4, B5, C6, C5, D6, F6 |
| 6 | E4, F4, E5, F5, D5, E6 |
| 7 | F1, F1, F1, A6, A6, A6 |

Distinct die sets partition all 36 cells, so every physical roll yields seven distinct blockers. There are 279,936 face-index outcomes and 62,208 distinct boards with nonuniform probabilities.

Here `#` is occupied, `.` is empty and `/` starts another row. Exactly nine IDs cover 29 cells with 28 geometric orientations and 625 in-bounds placement candidates. Preserve deterministic orientation order for fixtures.

| ID | Base shape | Cells | Orientations | Special piece |
| --- | --- | ---: | ---: | --- |
| navy | `#` | 1 | 1 | yes |
| brown | `##` | 2 | 2 | yes |
| orange | `###` | 3 | 2 | yes |
| purple | `#./##` | 3 | 4 | yes |
| grey | `####` | 4 | 2 | none |
| green | `##/##` | 4 | 1 | none |
| cyan | `#./#./##` | 4 | 8 | none |
| yellow | `.#./###` | 4 | 4 | none |
| red | `.##/##.` | 4 | 4 | none |

| Level | Pieces that cannot share an edge with each other |
| --- | --- |
| Starter | none |
| Junior | navy, brown |
| Expert | navy, brown, orange |
| Master | brown, orange, purple |
| Wizard | navy, brown, orange, purple |

Diagonal contact is legal. Restricted pieces may touch blockers, boundaries and unrestricted pieces. Master is not a superset of Expert. Describe restrictions without claiming objectively increasing human difficulty.

The user revised the indicators on 2026-10-13: replace piece numbers with inset white square outlines on each occupied square of a currently restricted piece, with the piece color visible inside, consistently in the tray, preview and committed board. Starter shows none; Master leaves navy unmarked. There is no display option. Accessible names identify restricted pieces and the rule text explains the marks. Keep the tap anchor and preview legality symbols inside the outline without overlapping its border. The rule tables and legality do not change.

## State validation and reference solver

Keep one authoritative committed `Game`. Derive occupancy from dice/placements; selection, preview and gestures are transient. Placement `x/y` is the upper-left of its normalized orientation. A move ignores only its validated old footprint.

`validateDice` requires seven own dense string entries in physical-die order and throws otherwise. `newGame` validates an own known level key and copies dice. Placements require own known IDs, integer orientation/x/y and a valid orientation. Map keys must match IDs. Reject unknown/inherited keys, missing/fractional geometry, null/malformed maps, bounds, blockers, overlaps and forbidden contacts.

`canPlace` and `isSolved` return false for malformed setup/state. A win requires all nine exact IDs, legal committed occupancy/contacts, 29 distinct piece squares and full 36-cell coverage with seven blockers. Paint and drop counts cannot establish a win.

Preserve named regressions: solved fixtures with truncated dice or swapped keys/IDs are not solved; `validateDice(Array(7))` and `newGame(validDice, 'INVALID')` throw. Retain inherited-field, non-enumerable own-field, malformed old-footprint and false-win checks.

The reference `solve` throws for malformed setup and returns null for invalid fixed placements or a legal dead end. Preserve fixed placements and input immutability. The terminal state requires full coverage and all nine IDs. Keep 36-bit BigInt masks. No solver assistance/call participates in gameplay, previews or wins.

`opening-seed` Wizard with navy at B6, `{id:'navy',orientation:0,x:1,y:5}`, is a legal dead end. Accept legal moves even when they make the puzzle unsolvable.

## Run lifecycle and time

The pure session has `ready`, `running` and `completed` phases, with `ranked` or `practice` mode. Handlers supply timestamps; pure tests use fixed times.

| Action | Required behavior |
| --- | --- |
| Load/reload | Show Home with the original logo/name, Play, Tutorial and Personal bests. Prepare hidden fresh Starter internally; retain only completed records. Restore no run, layout, preferences, timer or Undo history. |
| Home / Play | Play opens hidden ready at the ordinary level selected in this page and focuses Start. Home discards prior play; running return confirms abandonment and cancellation preserves play/time/focus. Browser Back uses the same confirmation, reconciles cancellation and returns to one root Home entry. Forward opens fresh hidden play. Navigation draws no RNG; actual departure has no unload prompt. |
| Start | Ranked rolls seven faces; practice uses replay dice without RNG. Reveal and start timing together. Ignore repeated Start after transition. |
| Legal placement/move/removal | Commit once, retain prior placement snapshot for Undo, then validate solved state. |
| Invalid/no-op/cancelled attempt | Preserve committed play/history. Time continues. |
| Undo | Cancel draft and restore last successful snapshot. Cover the whole active run without a limit; never rewind time or eligibility. |
| Active New game/Replay/level change | Cancel gesture and confirm abandonment. Cancel preserves play/time and restores initiating focus. |
| New game | Hidden fresh ready at current level; draw no RNG until Start. |
| Replay | Retain only dice/level; hidden practice ready with a new timer on Start. Available while running/completed, never from records. |
| Level change | Hidden fresh ready at chosen level. Never rank a known replay layout at another level. |
| Solving committed action | Freeze board/time, discard history/draft and consider ranked record once. Terminal completion rejects edits/Undo. |
| Completed transitions | New game/level change prepare fresh ready; Replay prepares practice ready. No abandonment confirmation. |
| Personal bests / Clear records | Home opens a separate records screen with an independent level filter. Confirm clearing the displayed level; preserve other lists/keys and restore Clear records focus. Return Home through the root history entry. No active run remains behind this screen. |
| Blur/hidden/lock/resize | Cancel gesture, preserve committed play and continue timing. |

Before Start reveal no puzzle coordinates through SVG, labels or other output, including retained practice dice. Disable editing and label fresh/practice. A coincidentally repeated fair roll is ranked; intentional replay never ranks.

Record `startedAt = Date.now()` and derive `Math.max(0, now - startedAt)`. A roughly 100ms display interval refreshes text only. Background, sleep, delayed callbacks, confirmations and Undo count. Capture a new timestamp on the solving commit and freeze elapsed time once. There is no pause.

Display `mm:ss.ss`, flooring to centiseconds. Minutes have at least two digits and can exceed 99. Store/compare whole milliseconds. System clock changes can affect local results; no anti-cheat service is planned.

## Input and layout

Keep nine persistent named slots. Placed shapes remain dimmed/selectable with committed orientation; labels remain readable. Unplaced slots show base orientation. Fit every orientation and occupied HTML hit region inside its SVG area, clear of labels.

Selection copies a placed orientation or starts at zero. Tap/keyboard uses the first occupied row-major square as marked anchor. Select a piece, then tap a cell to commit immediately, without a Place button. With no selection a board tap selects its piece; with selection it attempts placement. Success clears selection; rejection retains the draft and announces it.

Rotate maps `(x,y)` to `(-y,x)` for 90-degree screen-clockwise rotation; Flip maps to `(-x,y)` for left/right reflection. Transform occupied cells and anchor together, subtract minimum x/y and match canonical orientation. Keep the anchor's board target fixed during preview transforms. Never step indices. Symmetric shapes may retain orientation while their anchors change.

Pointer Events support touch/mouse/pen. Arm one primary pointer over an occupied source square and preserve the square grabbed. Labels/holes select without arming. Cross a 6 CSS px threshold to drag and capture on a stable container. Keep old committed placements until valid release. Ignore secondary pointers and suppress trailing drag clicks while allowing the next primary interaction.

Map client coordinates through the inverse SVG board-group CTM, floor the pointed cell and subtract the anchor. Never clamp outside coordinates. Recompute on release/transforms. Legal releases commit once; own-slot returns remove once. Invalid/outside/other-slot releases restore committed play and source draft. Below-threshold releases perform ordinary tap activation once.

Clear gesture state before releasing capture. Pointer cancellation, lost capture, Escape, blur, hidden document, resize, Undo and run transitions cancel without history/commit. Late events cannot commit into another phase. Disable held Rotate/Flip button activation; desktop R/F can transform a drag. Apply `touch-action: none` only to occupied sources. Scrolling/zoom remain available in holes, labels, empty cells and gutters. No native HTML drag/drop, global touch blocker, auto-scroll or long-press mode.

Use one column at every width, centered at about 440 CSS px maximum. Title/level/timer sit above the board; controls/tray are adjacent below. Keep ordinary targets about 44 CSS px where possible. Allow vertical scrolling on short/landscape screens and prevent horizontal overflow at 320 CSS px. Do not force fullscreen/orientation.

Visual SVG is `aria-hidden`, paired with six semantic HTML rows and named native cell buttons, one roving tab stop and stable focus. Name coordinates/content and pieces/shapes; show restrictions and preview legality beyond color. Visible Rotate, Flip, Remove and Undo support complete non-drag play.

| Key in game widget | Behavior |
| --- | --- |
| Tab/Shift+Tab | Reach level/grid/tray/controls without a trap. |
| Arrows | Move target without wrapping. |
| Home/End | Row ends; Ctrl+Home/End reaches board ends. |
| Enter/Space | Native activation or one placement at target. |
| R/F | Rotate/flip; ignore modified shortcuts. |
| Delete | Remove selected committed piece; unplaced selection clears. |
| Escape | Cancel draft/gesture/dialog; return draft focus to its slot. |

Do not capture shortcuts in selects/dialogs/unrelated controls. Start focuses grid; keyboard placement keeps target focus. Completion shows frozen time and ranked/practice feedback beside the board, replacing placement instructions. It announces once without a modal, forced scroll or focus jump. Use one polite atomic status region; timer ticks/pointer motion are not live announcements. Preserve visible focus, contrast, readable disabled controls and reduced-motion support.

Use one native confirmation with specific text and Confirm/Cancel. Cancel restores initiating focus; confirmed run transitions focus Start; confirmed clearing returns to Clear records. Do not add an unload prompt.

## Records

Store only level lists under `rollmino.records.v1` in localStorage. Entries contain whole-millisecond `elapsedMs` and valid epoch-date `finishedAt`. Keep at most five per level, ordered by fastest raw time then older date; identical ties retain stable insertion order. Display time and English local completion date only, without time-of-day/layouts/statistics/replay links.

Only a ranked running-to-completed transition considers a result. Rendering, release/click, clearing and notices cannot save again. Show frozen time even in practice or outside the top five. Keep ranked/practice feedback and storage-failure notices beside the board. Full lists, English local dates, the independent level filter, clearing and browser-storage explanation appear on Personal bests reached from Home. Inspecting records does not change the ordinary level or draw RNG.

Validate known lists, finite nonnegative integer durations and valid integer dates. Normalize missing lists, discard malformed entries, sort/cap and strip extra fields. Invalid JSON/payload recovers to empty with a notice. Catch storage access/read/write errors, retain page-memory records and show reload loss. Read current valid storage before insertion/clearing. Cross-tab automatic refresh is outside scope.

Clear only selected list within the app key, never `localStorage.clear()`. Preserve other levels/keys. Do not persist dice, placements, sessions, history, preferences, usernames or unused IDs. No upload/sync. Browser/private/site-data policies can erase records; changing origin has no migration promise. Serve through HTTP(S).

## Engineering

Use TypeScript/Vite/SVG/plain CSS/native HTML, Node tests and Playwright/axe. Follow [CODING_GUIDELINES.md](CODING_GUIDELINES.md). Keep pure rules, transactional sessions, deterministic fixtures and direct DOM handlers. Add modules for meaningful current responsibilities. Strict no-emit checking covers engine/source/browser tests/configuration. Node type stripping runs pure tests, not the browser build.

Use Node 24 and packageManager-pinned pnpm, one `pnpm-lock.yaml` and frozen verification/CI installs. Vite uses relative `base: './'`, ES2022 and no router/runtime service. Historical provenance/checksums stay in the [Git archive](docs/TEST-RESULTS.md#historical-archive), outside working-tree imports/dist. Never maintain another active engine copy.

Exclude ordinary-game hints/solution UI and Redo, in-progress persistence, saved-layout inspection/replay, auth, synchronization, global leaderboard, multiplayer, analytics, PWA/service worker, install prompts, Android packages, physics, 3D, generic engines/stores and speculative APIs. Sound, elaborate animations and other polish are deferred. The accepted Home revision adds a self-paced six-panel tutorial, with requested example replay and static reduced-motion explanations. Its diagrams use canonical geometric transforms, exact contact groups and original shared artwork; no tutorial call or guidance participates in an ordinary game. The Starter exercise reuses the board/tray/input widget with a separate untimed controller, six fixed prepared pieces, three learner pieces, full learner Undo and per-step board/history checkpoints. Legal off-step moves commit, Reset step restores the checkpoint, and every legal complete board ends successfully. Completion offers fresh hidden ordinary Play, Review tutorial and Redo exercise. The handled-offer behavior remains scoped to its implementation ticket. Do not reopen decisions without a concrete conflict.

## Verification

Use the same change scopes locally and on PRs. [scripts/verification-scope.mjs](scripts/verification-scope.mjs) selects them from explicit changed paths or a PR base/head comparison. Every scope runs `pnpm run check:docs`; local work also runs `git diff --check`. Install dependencies with the frozen lockfile before pure/build/exhaustive checks, and install browsers when selected. Tickets add focused regressions. Run fast tests before reference changes. [Setup](README.md#development) lists current package scripts.

| Changes | Required commands after documentation checks |
| --- | --- |
| Markdown, provenance and original checksum only | No app tests/build |
| Pure test assertions only | `pnpm test` |
| CSS, tray geometry, entry or original public assets | Pure tests, build, UI browser group and production tests |
| App wiring or session code | Pure tests, build, complete reduced browser matrix and production tests |
| Records implementation | Pure tests, build, records/gameplay browser group and production tests |
| Browser test assertions | Pure tests, strict build and affected browser group; production assertions select artifact tests |
| Rules/solver/fixtures | Full release sequence, including independent exhaustive verification |
| Oracle or exhaustive verifier only | Pure tests and independent exhaustive verification |
| Dependencies/configuration/CI or unknown paths | Full release sequence |
| Main push or manual release | Full release sequence regardless of changed paths |

UI browser group runs `pnpm run test:e2e e2e/play.spec.ts e2e/input.spec.ts e2e/accessibility.spec.ts`. Records group runs `pnpm run test:e2e e2e/play.spec.ts e2e/records.spec.ts`. The full group runs `pnpm run test:e2e`. Pure/build/artifact/exhaustive commands are `pnpm test`, `pnpm run build`, `pnpm run test:e2e:prod` and `pnpm run verify:all`. Mixed changes combine requirements; different browser groups become the full matrix. Renames include deletion/addition paths. Missing Git comparison information fails closed. Inspect a local selection with `node scripts/verification-scope.mjs pull_request README.md`, replacing paths with actual changes.

The CI `Test and build` job always runs, including documentation-only PRs, so required checks do not disappear through path filtering. Main/manual checks retain all release gates. Only successful runs on main can configure/upload/deploy Pages; PR selection never authorizes publication. Manual runs on other branches check without publishing. Preserve T23's failure diagnostics and conditional PR cancellation. A policy-only local edit needs selector tests, documentation checks and workflow lint, without rerunning unchanged app suites.

Production tests reuse preceding dist without rebuilding at `/` and `/rollmino/`. Build first. Never run concurrent Playwright invocations against the shared results directory. Seed physical face indices before startup and reset the test RNG before Start if tooling consumes it. Solve fixtures through public controls, without production cheats or mutable game test APIs.

Preserve literal model/malformed-state regressions, every occupied-anchor transform, session/time/Undo and record/fault tests. Browser coverage includes complete tap/keyboard play, native mouse/capture, mobile-Chromium CDP touch/cancel/secondary input/scrolling, confirmation focus, narrow/landscape/desktop layout, CSS zoom/reflow, relevant axe states, artifact assets/errors and record retention.

### Browser coverage map

Untagged scenarios run in all five projects. `@shared` runs only in desktop Chromium, `@desktop` in all three desktop engines, and `@touch` only in mobile Chromium. Selection happens in project configuration, without runtime skips. Use `pnpm run test:e2e --list` to inspect it.

| Checks | Platforms |
| --- | --- |
| Hidden startup, first fixture/tap completion, frozen time, replay, reload/records and native confirmations | All five |
| T15 first-click Start and T16 tray extents/hit regions/own-slot regression | All five |
| 320px reachability/alignment and grid/modal focus | All five |
| Full keyboard game, native mouse anchors/transforms/capture/collision/return, Escape/lost capture and CSS zoom alignment | Three desktop engines |
| All three fixtures, ranking/storage fault permutations, shared transactions/synthetic cleanup, game/records/dialog axe and complete viewport matrix | Desktop Chromium |
| Native CDP touch/move/return/secondary input/cancel and scrolling | Mobile Chromium |
| Built assets/errors, full first fixture, frozen time, practice exclusion and reload retention | Both artifact mounts; filesystem inspection once |

After T33, the development suite selects 125 cases, with nine exercise completions and 23 completed ordinary games including phone practice-completion feedback. Shared DOM-stability, queued-dialog-close and five-level marking regressions do not complete another game. The dialog regression forces rapid cancellation/reopening through DOM events in desktop Chromium; the native confirmation scenario remains in all five projects. Home/history regressions cover running cancellation/time/focus, fresh Forward, root exit after repeated returns/reload, rapid dialog/history events and discarded practice ready. The marking regression checks literal level groups, transformed previews, committed/tray marks and cancellation. Production selects five cases and four completed games. Fixture completion supplies representative persistence checks; non-color marking coverage uses only restricted pieces. Additional fixtures/shared permutations do not repeat for every unrelated assertion. Mobile projects remain emulation.

The [cell-array oracle](tests/oracle.mjs) checks unique IDs, integer geometry, bounds, blockers, overlap, 29 piece cells, coverage, contacts and fixed placements. It imports only canonical orientations, has separate literal IDs/groups and uses no engine legality calls/masks. Test deliberately broken answers. The [exhaustive verifier](scripts/verify-all.mjs) requires a non-null answer and oracle pass for each of 62,208 Wizard boards before counting. Keep it separate from fast tests.

Wizard answers satisfy every other level's subset of contact restrictions; this is not five separate sweeps. Shared orientation data limits oracle independence. The sweep proves one answer per encoded board, not solution counts, human difficulty, all partial-state completability or physical certification.

Executable checks here are the release gate. Mobile/CDP tests are emulation. Label synthetic cleanup and CSS zoom/reflow honestly. Real-phone, pen, physical-game and screen-reader checks are optional and cannot be claimed without execution.

## Static hosting and release reference

Public [stefan-karger/rollmino](https://github.com/stefan-karger/rollmino) uses Pages without a custom domain. Pages source is GitHub Actions and `github-pages` allows main only. PRs check without publishing; superseded runs in the same PR cancel. Main/manual releases build once, pass full gates, upload that tested dist and deploy through a dependent job. Build has read-only source/Pages access; only deployment has Pages write/ID-token write. Serialize publication without cancelling active deployment. Failed runs upload existing `test-results/` traces as a separate seven-day diagnostic artifact, never as deployable dist.

On 2026-10-13, [workflow 38363711259](https://github.com/stefan-karger/rollmino/actions/runs/38363711259) for [8105f41](https://github.com/stefan-karger/rollmino/commit/8105f41fd93139cae446945b959fb3c7267c9f18) passed 59 pure tests, build, 207 applicable browser cases, ten artifact cases and all 62,208 checked answers, then deployed. Live controls/assets/reload and matching CI artifact hashes were checked. [Dated evidence](docs/TEST-RESULTS.md#public-pages-release-verification) preserves details/limits. Follow-up local results do not claim a new deployment. Pre-consolidation contract/decision revisions remain in archived Git history.

## Sources and limits

The [SmartGames product](https://www.smartgames.com/uk/one-player-games/genius-square) and [2023 rulebook](https://d32bxxnq6qs937.cloudfront.net/sites/default/files/GRL%20SGHP001%20Genius%20Square%2020230714.pdf) support axes/shapes/groups. The manual does not enumerate all 42 faces. The corrected [first-hand dice report](https://mangosgaming.uk/portfolio/review-genius-square/) matches our table; [aCampello's model](https://github.com/aCampello/genius-square) corroborates distinct die sets. [Another solver](https://github.com/mitchblank/gsqsolve) and [older edition](https://manuals.plus/m/7bae49678d06d9344664adc4f299df047fb3d263d87fd8489a044bebef42675c.pdf) are comparisons, not active alternative rules. Correct verified discrepancies with model/tests/evidence.

Use original assets; never redistribute official logos, product/packaging/manual graphics or provenance as runtime assets. Rollmino is the accepted name without trademark-clearance claims. This model is accepted evidence, not manufacturer certification; physical sets are not release prerequisites.

Implementation references: [Vite](https://vite.dev/guide/build.html), [SVG](https://www.w3.org/TR/SVG2/coords.html), [Pointer Events](https://www.w3.org/TR/pointerevents3/), [grid](https://www.w3.org/WAI/ARIA/apg/patterns/grid/), [dragging alternatives](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html), [Playwright touch](https://playwright.dev/docs/api/class-touchscreen), [CDP](https://playwright.dev/docs/api/class-cdpsession), [clock](https://playwright.dev/docs/clock), [touch protocol](https://github.com/ChromeDevTools/devtools-protocol/blob/master/json/browser_protocol.json), [sleep timing](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now#ticking_during_sleep), [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), [Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [Node setup](https://github.com/actions/setup-node), [pnpm setup](https://github.com/pnpm/action-setup).
