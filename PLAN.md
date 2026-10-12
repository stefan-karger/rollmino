# Historical Genius Square web V1 proposal

Package-manager migration on 2026-10-12: commands in historical results below are current pnpm equivalents. Those earlier runs used the previous package manager; their original commands are preserved in commit `df3e241`. [Actual pnpm verification](docs/TEST-RESULTS.md#pnpm-migration-verification).

Status: superseded by the user-confirmed [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) on 2026-10-12. The entire proposal below is historical. Its optional timer/hints, short Undo, preview-then-Place, optional touch drag and physical-device release gates are not active requirements. [docs/DECISIONS.md](docs/DECISIONS.md) records the accepted choices. Preserve the analysis/audit evidence; execute the new plan.

Original review on 2026-10-12. The body preserves the initial proposals and verification findings, before the requirements interview closed. It did not build the browser app or change the reference engine. The confirmed plan carries forward the verified defects and useful evidence with the agreed scope.

Updated on 2026-10-12 to adopt the user's astro-portfolio KISS/YAGNI rules through [`CODING_GUIDELINES.md`](CODING_GUIDELINES.md). Those rules govern the choices in this proposal. The portfolio's Astro/Tailwind conventions remain specific to its existing UI.

## Initial assessment

The handoff provides a useful mathematical core and enough information to begin a playable version. The dice distribution, piece geometry and five restriction groups agree with the sources inspected. The engine keeps rules independent of the DOM, and its solver handles fixed placements and genuine dead ends. Reuse those parts instead of rewriting them around a UI library.

The missing work is substantial. There is no browser entry point, renderer, interaction controller, undo history, accessible board or production build. A working solver does not establish that moving a piece feels predictable, that touch controls remain usable or that a screen reader can inspect the board.

My proposed order is to repair the validation gaps, build a complete game through click/tap and keyboard controls, and then add mouse/pen dragging. Make undo a V1 requirement. Keep the timer and hints optional until ordinary play works. A legal move may create a dead end. The app should permit that move and offer honest assistance when requested, rather than require every move to preserve a solver completion.

Vite, plain TypeScript and SVG remain my preferred stack after considering alternatives. This follows from the small, discrete board and the limited surrounding UI. It does not follow merely from the presence of TypeScript in the archive. Native HTML controls should provide the board's interaction and accessibility semantics, with SVG providing the visual geometry.

## Applying the adopted coding guidelines

Use [`CODING_GUIDELINES.md`](CODING_GUIDELINES.md) as the local policy for future work. Compare designs by how easily the required behavior can be found, understood, edited and verified, including recurring maintenance and build costs. The proposed framework and file count are consequences of that comparison, not targets themselves.

Keep related code together and extract meaningful boundaries when they clarify current behavior. A tested rules module and a transaction boundary serve existing correctness requirements. A forwarding controller, generic action system or renderer adapter does not help unless it removes real complexity. A single consumer can justify a helper or asset file when it improves readability and editing. Small obvious duplication can be clearer than a premature shared abstraction.

Create files, exported APIs and state fields when the implementation slice needs them. In particular, the base game does not need a revision counter, solver job queue, hint cache or framework-migration interface. Add stale-result protection with the assistance feature that uses it. Keep the file tree below as a responsibility map and revise it if combining or splitting a module makes the actual code easier to maintain.

Vite provides useful development reloads and a static build; Playwright exercises real browser behavior. Those are concrete dependency benefits. A UI framework or styling library should be evaluated the same way if it reduces actual view/input complexity. There is no blanket rule that dependency-free UI code is easier to maintain.

## What was inspected and verified

The mandatory documents were read in the specified order. The remaining documents, fixtures, package scripts, tests and archived experiments were also inspected. All 26 entries in the supplied SHA-256 manifest matched before this review. The canonical engine and both archived engine copies were byte-identical. The original research copy also matched `docs/RESEARCH.md`; it is not separate corroborating evidence.

The folder is an unpacked handoff, not a Git repository. Before implementation, establish version control or preserve a baseline copy. Do not maintain three active copies of the engine. `original-handoff/` and `research-archive/` remain provenance only.

Fresh results on this Windows environment, using Node 24.15.0, the pre-migration package manager 11.12.1 and TypeScript 5.8.3:

| Check | Result and limit |
| --- | --- |
| `pnpm test` | All 13 reference tests passed. These test the rules engine, not a browser app. |
| `pnpm run verify:all` | All 62,208 Wizard configurations returned a non-null answer in 30.94 seconds. The maintained script validates one example answer, then checks only answer existence for the exhaustive loop. |
| `pnpm install --frozen-lockfile` followed by `pnpm run typecheck` | Installation and strict engine type checking passed. Installation generated the pre-migration lockfile; the current dependency lockfile is `pnpm-lock.yaml`. |
| Additional exhaustive audit | A separate cell-array checker validated every returned solution for nine distinct IDs, bounds, blockers, overlaps, complete coverage and Wizard adjacency. All 62,208 passed in 28.77 seconds. It reused the engine's orientation data, so it independently checks placement legality, not the physical provenance of those shapes. |
| Solver timing during that audit | The largest observed empty-board solve was 14.20 ms. This includes runtime noise and is not a worst-case guarantee. |
| Deterministic partial-position sample | A xorshift sample with seed `0x6a09e667` tested 200 legally constructed partial positions per level. The largest observed solve was 9.02 ms. Many partial positions were dead ends. This sample is not a measure of player difficulty or phone performance. |

The extra audit was a review experiment, not a maintained test command. Slice 0 incorporates its independent legality checks into the maintained verifier so future contributors can reproduce the stronger check.

## Findings that must precede UI implementation

### State validation needs repair

The reference functions work for well-formed states produced by the current fixtures. They do not consistently validate the assumptions on which winning depends.

1. `isSolved` accepts the complete `opening-seed` placements after replacing its dice with `['A1']`. It never validates the dice, so it accepts a board with six unaccounted-for squares.
2. `isSolved` can accept overlapping placements when a placement's `id` differs from its map key. Starting with the complete `opening-seed` fixture, assign the original brown placement to `placed.navy`, then assign `{ id: 'navy', orientation: 0, x: 1, y: 0 }` to `placed.brown`. It returns `true`. Identity-dependent self-collision skipping hides the overlap.
3. `validateDice(Array(7))` accepts a sparse array because `Array.some` skips holes. A later operation may crash or produce an invalid setup.
4. `newGame` accepts an unknown runtime level. A TypeScript union does not validate a DOM value or data loaded at runtime.

These are reproducible boundary defects, not evidence that the dice or physical rules are wrong. The engine remains unchanged in this analysis pass. Slice 0 adds failing regressions before repairing it. Do not carry these behaviors into V1.

The desired contracts are:

- `validateDice` rejects anything other than seven present strings belonging to their corresponding die. Check every index explicitly and retain physical die order.
- `newGame` rejects unknown levels and copies the validated dice array.
- Placement validation requires a known own piece ID, an integer orientation within that piece's range, and integer board coordinates. Reject unknown placement keys and any key/ID mismatch in committed state.
- `canPlace` returns `false` for malformed setup or placement data. It ignores only the moving piece's old footprint, after establishing its identity.
- `isSolved` returns `false` for malformed setup or placement maps. Require all nine own piece IDs exactly once, legal contacts, exactly 29 occupied piece cells and complete 36-cell coverage including seven distinct blockers.
- `solve` retains the existing exception contract for invalid setup, extended to invalid levels. Return `null` for invalid fixed placements or a legal partial position with no completion. Never mutate its input. Its completion condition must also require all nine IDs.

Keep these checks in the core, with small helpers. Do not add a schema library or a generalized validation system.

### Verification claims need more precise wording

- The maintained exhaustive script currently checks non-null answers on all rolls, not the legality of each returned answer. The extra audit closes that evidence gap for today's engine. Make the stronger check permanent in Slice 0.
- `docs/REFERENCE-VERIFICATION.md` says the archived experiment checked the other levels as well. Its code attempts those checks only after a Wizard failure, and there were no failures. Lower-level solvability follows from the subset relationship, rather than separate exhaustive execution for each level.
- `docs/V1-SCOPE.md` says Junior navy/brown "cannot touch edges". Clarify that they cannot share an edge with each other. They may touch the board boundary and blockers.
- A new fair roll can repeat the previous board. Test a changed board using a predetermined second roll, but do not add automatic rerolling to force a different result.

Preserve the original handoff files. Correct the active documentation and verification script when implementing Slice 0, and record the changes in `docs/TEST-RESULTS.md`.

## Physical model to preserve

Use the newer five-level SmartGames edition as the proposed target. The official English rules diagram confirms the board axes, nine shapes, marked pieces and restriction groups. The listed 42 die faces match the corrected first-hand dice report; the independent aCampello solver corroborates the distinct coordinate sets. The official rulebook does not enumerate all 42 physical sides. Comparing a current physical set or a complete manufacturer face table remains a release fidelity check. [Official rules](https://d32bxxnq6qs937.cloudfront.net/sites/default/files/GRL%20SGHP001%20Genius%20Square%2020230714.pdf), [first-hand dice report](https://mangosgaming.uk/portfolio/review-genius-square/), [independent model](https://github.com/aCampello/genius-square).

### Board and dice

The board has six columns A through F and six rows 1 through 6. A1 is `(0, 0)`, F6 is `(5, 5)`, and y increases downward.

| Die | Six physical faces in the canonical engine order |
| --- | --- |
| 1 | A1, C1, D1, D2, E2, F3 |
| 2 | A2, B2, C2, A3, B1, B3 |
| 3 | C3, D3, E3, B4, C4, D4 |
| 4 | E1, F2, F2, B6, A5, A5 |
| 5 | A4, B5, C6, C5, D6, F6 |
| 6 | E4, F4, E5, F5, D5, E6 |
| 7 | F1, F1, F1, A6, A6, A6 |

Sample one of six physical sides independently for each die. Do not deduplicate for rolling, choose seven arbitrary cells, or resample overlapping blockers. The seven distinct coordinate sets partition all 36 board cells, so a correct physical roll already gives seven different blockers.

There are 279,936 face-index outcomes and 62,208 distinct blocker boards. The boards are not equally likely. Die 4 gives F2 and A5 twice the probability of E1 and B6; die 7 gives F1 and A6 equally. Exhaustive existence checks may enumerate distinct coordinates because repeats do not change solvability. Random gameplay must preserve repeats.

### Pieces

The following rows specify the actual geometry. `#` is occupied, `.` is empty, and `/` separates rows. Keep the canonical engine IDs even if visible labels or palette values change.

| ID | Visible label | Base shape | Cells | Unique orientations |
| --- | --- | --- | ---: | ---: |
| navy | 1, single square | `#` | 1 | 1 |
| brown | 2, domino | `##` | 2 | 2 |
| orange | 3, short bar | `###` | 3 | 2 |
| purple | 4, small L | `#./##` | 3 | 4 |
| grey | Long bar | `####` | 4 | 2 |
| green | Square | `##/##` | 4 | 1 |
| cyan | Large L | `#./#./##` | 4 | 8 |
| yellow | T | `.#./###` | 4 | 4 |
| red | Zigzag | `.##/##.` | 4 | 4 |

Nine distinct IDs cover 29 cells and have 28 geometric orientations in total. The unobstructed board has 625 candidate placements. Preserve the cyan and red reflected orientations. Symmetric transformations may leave a piece unchanged; that is a correct result.

### Contact rules

| Level | Pieces that must not share an edge with one another |
| --- | --- |
| Starter | None |
| Junior | Navy and brown |
| Expert | Navy, brown and orange |
| Master | Brown, orange and purple |
| Wizard | Navy, brown, orange and purple |

Diagonal contact is allowed. These restrictions concern different pieces in the listed group. They do not prohibit contact with a board edge, blocker or unrestricted piece. Master and Expert are not nested rule sets. Wizard includes every prohibited pair used by the other levels, so a verified Wizard solution works at each of them. [Official English rules diagram](https://d32bxxnq6qs937.cloudfront.net/sites/default/files/GRL%20SGHP001%20Genius%20Square%2020230714.pdf).

## Technical decision

### Proposed stack

| Concern | Choice | Reason and trade-off |
| --- | --- | --- |
| UI framework | Plain TypeScript modules | One board and a small toolbar do not need a component runtime. We must manage DOM updates and focus deliberately. |
| Browser development/build | Vite | It supplies the TypeScript development server and a static production build. Retain a separate strict TypeScript check because transpilation does not check types. |
| Visual renderer | SVG for board, pieces and preview; ordinary CSS for layout | Geometry stays in board units and scales without a canvas redraw system. SVG coordinate conversion and layer order need tests. |
| Accessible controls | Native HTML buttons, select and status output | Use nine persistent piece buttons and a semantic board control grid. SVG is visual, with `aria-hidden="true"`, rather than the only accessible representation. |
| Pointer input | Pointer Events, explicit capture for mouse/pen drag | One path handles pointer IDs, cancellation and release. Do not use HTML drag-and-drop. Touch uses the complete tap path in the proposed base V1. |
| State | One `Game`, a small interaction object and bounded undo snapshots | Rules and rendering use the same committed placements. No duplicated occupancy store or state library. |
| Pure tests | Existing Node test runner | Reuse the reference suite and add DOM-free session and transform tests. No Vitest/Jest migration is needed. |
| Browser tests | Playwright plus axe integration | Test actual DOM input, browser engines and mobile emulation. Automated accessibility checks supplement keyboard and screen-reader checks. |
| Deployment | Static `dist/` | No runtime API, database or service is required. |

Vite's documented production output is static assets, and its TypeScript support is transpilation only. Playwright supports Chromium, Firefox, WebKit and device emulation. Those facts support the tool choice; they do not prove this app's future compatibility. [Vite guide](https://vite.dev/guide/), [Vite TypeScript behavior](https://vite.dev/guide/features.html#transpile-only), [Playwright installation](https://playwright.dev/docs/intro), [device emulation](https://playwright.dev/docs/emulation).

Keep Node 22.16+ as the documented reference-suite minimum. Use a current supported Node 24 installation for the proposed web development environment. Native Node type stripping remains a test execution detail. Browsers receive JavaScript compiled by Vite, not `.ts` source or Node flags.

The package registry returned Vite 8.3.4, Playwright 1.64.0, axe Playwright 4.13.0 and Node 24 type definitions 24.19.2 during this review. These are candidate pins, not dependencies installed by this pass. Install them in Slice 1, retain the current compiler initially, and verify compatibility before committing the lockfile. Recheck releases if implementation starts substantially later.

### Alternatives considered

| Alternative | When it helps | Why I would not choose it for this V1 |
| --- | --- | --- |
| Svelte with Vite | Declarative templates reduce manual UI synchronization. | It is a credible alternative if view/focus code becomes hard to follow. The present screen does not yet justify its compiler and reactive conventions. SvelteKit adds no required capability here. |
| Preact or React with Vite | A familiar component model can reduce development effort for a team that knows it. | There is no established team preference or existing React host. Do not add it solely for nine draggable shapes. |
| HTML/CSS as the entire renderer | Native cells and straightforward layout, with no SVG mapping. | It could work. Connected shapes, their tray previews and the dragging ghost need more positional DOM styling. SVG expresses those shapes directly. |
| Canvas | Direct drawing and a single visual bitmap. | It would add hit testing, resolution handling and a parallel accessible representation without reducing the rule or input work. |
| Plain `tsc` and a static development server | A small build with fewer tools. | It saves one dependency but adds development-server, import and asset configuration that Vite already handles. |
| Vitest | Convenient DOM mocks and test tooling. | Pure rules and session tests already run under Node. Browser interaction deserves browser tests rather than another simulated DOM. |
| Game engine, physics or 3D | Continuous animation or physics-heavy play. | This is a discrete placement puzzle with no game loop requirement. |

Svelte's compiler-based components and Preact's component model are documented alternatives. Choosing plain TypeScript is a project-complexity judgment, not a claim that those tools cannot build the game. [Svelte overview](https://svelte.dev/docs/svelte/overview), [Preact guide](https://preactjs.com/guide/v11/getting-started/).

Revisit the framework choice after the first playable slice if manual rendering obscures the state transitions. Replacing the view/controller at that point should leave the rules, fixtures and pure tests intact. Do not prebuild a renderer interface to prepare for that possibility.

## Explicit V1 scope

### Required

- One local single-player game with the exact physical roll distribution and five level choices.
- A labeled responsive board, seven displayed die coordinates, nine identifiable pieces, a compact rule legend and a visible selected-piece preview.
- Select, geometric clockwise rotation, left/right reflection, placement, movement and removal of every piece.
- Full play through click/tap controls and keyboard, plus mouse/pen drag with the same placement validator.
- Invalid previews and rejected commits with a specific readable reason. No partial committed move.
- Winning determined only from committed state. Announce the transition to solved once, rather than on every render.
- Undo up to 20 successful placement, movement or removal actions. Invalid attempts and no-op placements do not enter history.
- New roll, restart the same roll and a defined level-change behavior.
- Accessible control names, visible focus, readable non-color status, screen-reader board inspection and reduced-motion support.
- Unit, integration and browser checks, real-device verification, a static production build and contributor commands.

### Nice to have, outside the base acceptance gate

- Direct touch dragging, after checking finger occlusion and scrolling on actual devices. The required tap path already provides all game actions.
- An elapsed timer. If added, start at the first successful placement, stop at solve, reset for every restarted session and keep ticking through undo. It is informational, not a competitive score. Background time counts; timer updates are not undo actions or live announcements.
- A solver-backed hint that previews one unplaced piece, with explicit Apply and Dismiss controls. It must preserve all fixed pieces and report dead ends. No automatic whole-board fill.
- Small snap/solve effects that respect reduced motion. No animation is necessary to pass V1.

These are separate additions after the required play path passes. If a later decision promotes one to required scope, include its tests and device gate explicitly.

### Excluded

Accounts, backend, database, online multiplayer, leaderboards, telemetry infrastructure, daily challenges, saved games, best-time storage, URL sharing, sound, mandatory tutorial, AI/LLM solving, all-solution enumeration, arbitrary blockers, alternate board sizes, 3D dice and copied official imagery are excluded. Local offline reload support through a service worker is also excluded; a static client app is not automatically an installable or cached offline app.

Two worthwhile follow-ons are a shareable roll/level URL and a short interaction tutorial. Neither needs to influence the first implementation's architecture.

## State and rule ownership

Reuse `Game`, `Placement`, `PieceId` and `Level` from `engine/core.ts`. The session owns the committed `Game` and an undo array. Keep SVG nodes, pointer positions and focus out of `Game`. The base game has synchronous commits and explicitly cancels gestures before resets; it does not need a revision counter for a future solver feature.

`src/session.ts` exposes small functions for commit, remove, undo, restart, new roll and level change. Return a new session or a result containing the rejection reason. Copy incoming placements and history snapshots so later caller mutation cannot alter the board. No generic action dispatcher or reducer is needed.

Occupancy, used-piece markers, legal preview and solved status derive from `Game`. A move leaves the old placement in `Game` while the draft is edited. The validator excludes that piece's old footprint for the candidate. Only a successful commit replaces it. The renderer may dim the old piece while showing the draft; it never removes it from the authoritative state during a gesture.

Add a core placement-check result when readable error messages are introduced. Its reasons cover invalid data, bounds, blocker overlap, piece overlap and prohibited contact. `canPlace` delegates to this same check. Do not reproduce rules in the view to explain a failure.

Session controls have these semantics:

| Action | Dice | Level | Placements and undo | Interaction |
| --- | --- | --- | --- | --- |
| New roll | Sample seven fresh physical sides; repetition is allowed. | Keep current level. | Clear both. | Cancel any gesture or hint. |
| Restart same roll | Preserve exactly. | Preserve. | Clear both. | Cancel any gesture or hint. |
| Change level | Preserve exactly. | Apply selected level. | Clear both. | Cancel any gesture or hint. |
| Undo | Preserve. | Preserve. | Restore the previous placement snapshot. | Cancel drafts and hints first. |

Display "Changing level restarts this puzzle" beside the level selector. This proposal favors predictable legality over silently retaining placements that may violate the new group. Restart, new roll and level changes are not undoable in the base V1. Document that limit.

After every committed change, compute `isSolved(game)`. A solved board stops accepting edits until Undo, Restart or New roll. Keep those controls available and leave focus stable. Undoing a solution restores ordinary play. A later valid completion may produce a new win transition.

## Interaction state machine

Keep four explicit phases in the transient interaction object. A draft contains the piece ID, orientation, anchor cell, board anchor position, candidate placement and legality result. `armed` and `dragging` also contain the pointer ID and the original committed placement or tray origin.

| Current phase | Event | Next phase and effect |
| --- | --- | --- |
| Idle | Activate a tray piece or an occupied board cell | Selected. Create a draft from its committed placement or base orientation. |
| Selected | Activate a different tray piece | Selected with the other draft. Discard the previous draft without a game change. |
| Selected | Click/tap a board cell | Selected. Move the marked anchor to that cell and show the candidate and reason. |
| Selected | Arrow key in the board | Selected. Move the anchor one cell and recompute preview; no implicit fit adjustment. |
| Selected | Rotate or Flip | Selected. Transform cells and anchor geometrically and recompute preview. |
| Selected | Place button or Enter on the board, legal candidate | Idle. Commit one placement, record undo and check solved state. |
| Selected | Commit, illegal candidate | Selected. Announce rejection; committed placements and history remain identical. |
| Idle or Selected | Primary mouse/pen down on a draggable piece | Armed. Record source, occupied anchor and pointer ID. |
| Armed | Pointer travels at least 6 CSS px | Dragging. Capture the pointer on a stable app element and show the snapped draft. |
| Armed | Pointer release below threshold | Selected through the normal activation path. Do not place a piece accidentally. |
| Dragging | Pointer move | Dragging. Recompute candidate from current board coordinates. |
| Dragging | Rotate or Flip shortcut | Dragging. Transform the grabbed anchor together with the shape. |
| Dragging | Legal release inside board | Idle. Recompute from the release event, commit once, release capture and check solved state. |
| Dragging | Illegal or outside-board release | Selected with the source draft restored. Leave the old committed placement or tray state intact. |
| Armed or Dragging | Cancel, lost capture, Escape or layout change | Idle. Clear draft/capture; committed placements remain intact. |
| Selected | Escape | Idle. Discard draft and restore focus to its persistent piece button. |
| Selected | Remove or Delete | Idle. Remove a committed piece as one undoable action; an unplaced piece just deselects. |
| Any phase | Undo, restart, new roll or level change | Cancel interaction before the session action. No gesture may commit into a later session. |

Ignore secondary pointer IDs while a gesture is active. Make completion/cancellation idempotent: clear the active gesture before releasing capture, so the resulting `lostpointercapture` cannot roll back a successful commit. Suppress the synthetic click following an actual drag.

The proposed click/tap path deliberately uses preview followed by a visible Place button. This differs from the handoff's single target-tap commit proposal. It gives touch users a chance to inspect the shape and legality before committing. Test it in the first playable slice. If the extra tap proves cumbersome, switch to target-tap commit with undo; that change belongs to input handling and does not require new game state or rules.

### Anchor and transformation policy

- For an unplaced piece selected by button, mark its first occupied cell in the topmost occupied row as the initial anchor. The normalized bounding-box origin is not necessarily occupied, as the T piece demonstrates.
- The initial board anchor is the last focused cell, or the first unblocked cell on a fresh board. This is a predictable starting position, not an automatically legal placement.
- Selecting a placed piece starts at its committed orientation and anchor position. Starting a new drag from the board also starts from that committed geometry. A selected tray icon shows the current draft geometry, so it can be dragged after rotation.
- On direct dragging, determine the occupied unit cell grabbed using the source icon or board coordinate transform. Padding in a tray button falls back to the marked anchor.
- Convert `clientX/clientY` into board units with `DOMPoint` and the inverse screen matrix of the board's geometry group. Read the transform for the current layout, rather than assuming CSS pixels equal cells. A missing/noninvertible matrix cancels safely.
- Snap with `cellX = floor(boardPoint.x)` and `cellY = floor(boardPoint.y)`. Set placement origin to target cell minus the local occupied anchor. Do not clamp the piece back inside the board or search for a nearby legal location.
- Clockwise rotation in screen coordinates maps `(x, y)` to `(-y, x)`. Left/right reflection maps `(x, y)` to `(-x, y)`. Apply the operation to both the shape and its anchor, subtract the transformed shape's minimum x/y, then match the resulting normalized cells to a canonical orientation.
- Retain the board position of the anchor during a transformation. Recompute the placement origin from the new local anchor. Never rotate by incrementing the deduplicated orientation index.
- Keep the preview non-interactive. Recompute its legality after every position or orientation change, and again at commit.

Place these geometric helpers in `engine/transforms.ts`, with no DOM dependency. Test four rotations, two flips, symmetric shapes, chiral shapes and every occupied anchor. SVG viewports transform user coordinates, and Pointer Events capture routes subsequent events to the capture target. [SVG coordinate specification](https://www.w3.org/TR/SVG2/coords.html), [Pointer Events specification](https://www.w3.org/TR/pointerevents3/).

## UI and accessibility details

Build the board and control nodes once. Update their attributes, labels and SVG geometry without replacing the focused button or capture target on each render. Full replacement of the app's `innerHTML` during selection or dragging is unacceptable.

The board has a visual SVG layer and an aligned HTML grid with six semantic rows and six cells per row. Use `role="grid"`, `role="row"` and `role="gridcell"` on their containers, with a named native button inside each cell. Give the grid an accessible name and concise keyboard instructions. One cell button has `tabindex="0"`; the others have `tabindex="-1"`. Arrow navigation moves focus without wrapping at board edges. Keep blocker buttons focusable for inspection. Cell names describe committed state, such as "B1, brown domino" or "A1, blocker". Preview cells must not be announced as committed occupancy. [WAI grid pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/).

Keep all nine tray buttons in stable positions even after placement. Their labels state whether the piece is in the tray or on the board. This gives a reliable way to select any placed piece and avoids losing keyboard focus when an item leaves the tray.

Keyboard behavior:

- Tab moves between the board, tray buttons and toolbar controls without a trap.
- Enter/Space on a piece button selects it and moves focus to the board anchor.
- Without a selection, arrows navigate cells and Enter on an occupied cell selects its piece.
- With a selection, arrows move the preview and Enter commits it. Visible Place, Rotate, Flip and Remove buttons provide the same actions.
- Home/End move to the first/last cell in the row; Ctrl+Home/Ctrl+End move to A1/F6. With a draft, navigation moves its anchor with focus. Do not intercept modified shortcuts other than those explicitly supported.
- R and F act only while the game board or a piece control has focus and a draft exists. Do not install page-wide single-character shortcuts or intercept typing in other controls.
- Escape cancels. Delete removes the selected committed piece. Buttons remain the discoverable alternative to shortcuts.

After a successful Place-button action, focus the committed anchor's board button before disabling Place. A keyboard commit keeps focus on that board button. Remove and Escape return focus to the piece's persistent tray button. Undo restores board focus to the last active cell; restart, new roll and level change retain focus on their initiating control. Pointer movement does not repeatedly steal keyboard focus. When winning, preserve the final board focus and use the status region instead of an automatic modal.

Use a polite, atomic status region for placement, rejection, removal, undo, dead-end feedback and completion. Do not announce pointer movement, timer ticks or every render. Keep the numbered pieces identifiable through text and shape, with an active restriction marker and a short legend for the chosen level.

At narrow widths, put the board first, the selected-piece toolbar next and a three-column tray below. Allow vertical page scrolling and enough space for the pieces' labels. Do not force a two-row tray if it makes targets too small. Use system fonts and original SVG/CSS, with text contrast of at least 4.5:1 and visible control/focus boundaries. Aim for 44 CSS px controls and board cells at 320 CSS px width; verify the actual layout.

The base touch path retains native scrolling and pinch behavior. Do not set `touch-action: none` on the document. If touch dragging is added, assign its gesture regions' touch behavior before pointerdown; changing it midway through the gesture does not change the browser's decision. Keep scrolling available outside those regions. A keyboard alternative alone does not meet the single-pointer alternative requirement for dragging. [WCAG dragging movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html), [touch-action specification](https://www.w3.org/TR/pointerevents3/#the-touch-action-css-property), [target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

## Optional solver assistance

The solver remains in the engine even if no hint UI ships. Do not run it on every hover or use it to veto otherwise legal placements.

If the optional hint slice is adopted:

1. Cancel the current gesture. Retain the current committed `Game` object as the hint's source and pass a copy to the solver.
2. Call `solve` with every current placement fixed. Do not solve a fresh empty board and present that as a hint for the partial board.
3. For `null`, say "These placements have no completion. Undo or remove a piece." Do not identify a specific culprit without establishing one.
4. Otherwise choose the first unplaced piece in canonical piece order from that solution. Show its geometry as a separate preview with Apply and Dismiss. Apply uses the ordinary commit path and is undoable.
5. Clear the hint on any draft editing, committed change, undo, restart, roll or level change. Before applying, require its source `Game` object to still be current and revalidate the proposed placement. The immutable session updates already provide this identity check, so synchronous hints do not need a separate version field.
6. Distinguish unexpected solver errors from a proven dead end. A timeout would mean unknown, not unsolvable.

Start with synchronous solving on demand. Desktop observations do not justify a worker, but they also do not establish phone latency. Measure a fixed corpus of empty boards, solvable partial boards and dead ends on actual target phones. If a request causes noticeable input stalls or a measured task above 100 ms, move solving into one module worker. At that point add matching request IDs and a current-source check plus cancellation, with tests for stale responses. Do not add that infrastructure in the base game or mistake `setTimeout` for off-main-thread computation.

A full "Solve board" button is outside base V1. If later requested, define its assistance and undo behavior separately. Winning in this plan means validation after actual committed placements, including an explicitly applied hint if that feature exists.

## Minimal implementation tree

Existing archive directories stay in place. The runtime/test files are proposed below; create them only as their slices require them. These are meaningful responsibilities, not a mandatory number of modules. Start DOM wiring locally in `main.ts`; extract `input.ts` or `view.ts` when those boundaries clarify the implemented code. Keep exported APIs limited to actual consumers. Pure session and transformation logic must remain testable without DOM initialization, whether it stays in the named modules or fits clearly within an existing pure module.

```text
index.html                          Native page structure, app mount and instructions
package.json                        Existing reference scripts plus web/E2E commands
pnpm-lock.yaml                   Dependency pins, generated during verification
tsconfig.json                       Strict browser/core/config TypeScript check
vite.config.ts                      Static base path and explicit modern build target
playwright.config.ts                Development server and browser/device projects
playwright.production.config.ts     Production preview configuration and smoke tests
engine/
  core.ts                           Reuse and repair the canonical rules/solver
  transforms.ts                     New pure orientation and anchor transformations
src/
  main.ts                           Create session/view and wire DOM events
  session.ts                        Pure commits, removals, resets and undo
  input.ts                          Pointer/keyboard handling and coordinate conversion
  view.ts                           Stable SVG/HTML nodes, labels, focus and status
  styles.css                        Original palette, layout, focus and reduced motion
fixtures/
  rolls.json                        Reuse the three known Wizard rolls/solutions
  failure-cases.json                Named dead ends and malformed-state regressions
tests/
  core.test.mjs                     Reuse and expand existing invariant/rule tests
  transforms.test.mjs               Geometric operations and anchor preservation
  session.test.mjs                  Committed state transitions, rollback and history
  oracle.mjs                       Test-only cell-array solution legality checker
  e2e/
    helpers.ts                      Deterministic dice sampling and UI placement helpers
    play.spec.ts                    Complete UI games, level/reset/undo behavior
    input.spec.ts                   Pointer, cancellation, touch and keyboard behavior
    accessibility.spec.ts           Names, focus, announcements, axe and responsive cases
    static.spec.ts                  Production assets, errors and backend-free loading
scripts/
  verify-all.mjs                    Reuse; validate every returned answer with the oracle
docs/
  RESEARCH.md                       Preserve useful research, annotate corrected claims
  V1-SCOPE.md                       Align active wording/scope with accepted proposal
  TEST-PLAN.md                       Keep acceptance cases and command names current
  UI-AND-INTERACTIONS.md             Align with the chosen preview/commit policy
  SOURCES-AND-RISKS.md               Preserve source and fidelity/rights boundaries
  REFERENCE-VERIFICATION.md          Correct what the historical script actually checked
  TEST-RESULTS.md                    Fresh reproducible results and device evidence
README.md                           Install, run, test, build and static hosting steps
CODING_GUIDELINES.md                 Adopted KISS/YAGNI and decision rules
PLAN.md                             This proposal and its later accepted revisions
```

Keep the solver in `core.ts`. It is small enough that splitting it into a generalized solving subsystem would add indirection. `oracle.mjs` must not call `canPlace` or `isSolved`; it checks cells and pair contacts independently. It may use orientation coordinates after a separate geometry test establishes those coordinates against the shape table above.

Do not import archived experiments or fixture solutions into production. Keep the board and piece geometry generated from the small shape definitions. If substantial original SVG artwork or other opaque data appears, give it a dedicated asset file when that makes editing, previewing or review easier, even with one consumer. Keep selection/loading near its use and choose the simplest loader supported by the build. There is no requirement to keep substantial artwork in application code merely because SVG can express it inline.

## Commands to introduce during implementation

Keep `pnpm test` as the fast, DOM-free command. Add these scripts as the corresponding files appear:

| Script | Definition |
| --- | --- |
| `test` | `node --experimental-strip-types --test tests/*.test.mjs` |
| `test:rules` | `node --experimental-strip-types --test tests/core.test.mjs` |
| `test:transforms` | `node --experimental-strip-types --test tests/transforms.test.mjs` |
| `test:state` | `node --experimental-strip-types --test tests/session.test.mjs` |
| `verify:all` | Existing `node --experimental-strip-types scripts/verify-all.mjs`, strengthened in Slice 0 |
| `typecheck` | `tsc --noEmit`, using the new project configuration |
| `dev` | `vite --host 127.0.0.1` |
| `build` | `pnpm run typecheck && vite build` |
| `preview` | `vite preview --host 127.0.0.1 --port 4173 --strictPort` |
| `test:e2e` | `playwright test` |
| `test:e2e:prod` | `playwright test --config playwright.production.config.ts`, against the preceding `pnpm run build` output |

Configure TypeScript with strict checking, no emit, ES2022 and DOM libraries, bundler module resolution, TypeScript import-extension support and `resolveJsonModule` for test fixtures. Include `engine/`, `src/`, E2E helpers and the tool configuration files. Exclude the archived copies from compilation. The browser build should preserve native BigInt support rather than attempt a 32-bit mask fallback. Verify support in the actual browsers chosen for release.

Use Vite `base: './'` for the proposed single-page static app so its assets load from a subdirectory as well as a domain root. Add no router. Host `dist/` over HTTP(S), not by opening `index.html` through `file://`. Vite preview is a local verification server, not the production hosting service. [Vite production build](https://vite.dev/guide/build.html), [static deployment](https://vite.dev/guide/static-deploy.html).

Build once for a production verification pass and reuse that artifact for its browser checks. `test:e2e:prod` starts the preview server through Playwright configuration and requires a fresh `dist/`; it does not silently rebuild. This keeps the checked artifact consistent and avoids repeated build cost.

## Ordered implementation slices

### Slice 0: Establish a trustworthy reference baseline

Outcome: the rules command rejects the demonstrated false wins, and exhaustive verification checks actual completed boards. This is the only non-playable prerequisite slice.

Dependencies: existing handoff and a supported Node installation.

Tasks:

- Preserve the original files and establish a versioned baseline before changes.
- Add regression tests for sparse dice, missing blockers, unknown level, key/ID mismatch, unknown keys, invalid orientations and overlapping counterfeit completions. Confirm the relevant regressions fail on the original engine.
- Repair the core contracts described above without changing the physical model or orientation ordering.
- Add the independent cell-array oracle. Test it against intentional overlaps, missing coverage, illegal contacts and duplicate IDs so its own failure behavior is established.
- Run that oracle on every answer in `verify-all.mjs`; include the offending roll in a failure message.
- Correct active documentation wording and the historical verification claims. Store fresh results with the environment and exact commands.

Manual checks: compare the shape/restriction tables in this plan with the official English diagram. Replay the three existing solutions. Confirm the current model still supports board-edge contact and distinguishes Master from Expert.

Executable verification:

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm run typecheck
pnpm run verify:all
```

Exit gate: no false wins for the regressions; all three fixtures and all 62,208 independently validated Wizard answers pass. No dice, shape or rule change without evidence and a recorded correction.

### Slice 1: Display a real board and establish the web tooling

Outcome: a browser shows a fresh physical roll, the board, tray and current restriction legend. New roll, restart and level selection produce understandable fresh sessions.

Dependencies: Slice 0.

Tasks:

- Add Vite manually to this folder. Do not scaffold over or relocate the handoff files.
- Add the HTML entry, strict project config, composition module, stable view nodes and basic CSS.
- Render all coordinates, seven blockers, nine persistent tray buttons and original shape graphics from core data.
- Implement session creation, restart, new roll and level change, with the explicit clearing behavior above.
- Add Playwright browser projects and the initial render/reset checks. Exclude E2E files from the Node runner.
- Seed browser rolls in tests by replacing `Math.random` with an explicit face-sampling sequence using Playwright `page.addInitScript` before app startup. This also works against production without a cheat panel, URL parser or fixture import in the app.

Proposed dependency installation:

```bash
pnpm add -D --save-exact vite@8.3.4 @playwright/test@1.64.0 @axe-core/playwright@4.13.0 @types/node@24.19.2
pnpm exec playwright install chromium firefox webkit
```

Manual checks: launch at 390 px and desktop widths, inspect A1/F6, compare a seeded roll to its seven blockers, change levels and restart. Check that the board never needs a backend request.

Executable verification after scripts are added:

```bash
pnpm test
pnpm run build
pnpm run test:e2e tests/e2e/play.spec.ts --project=chromium
pnpm run dev
```

Exit gate: correct board/tray/setup in a browser; strict checking and production build pass; original reference checks still pass.

### Slice 2: Complete games through click/tap and keyboard

Outcome: a player can solve any of the five levels without dragging, transform and move pieces, reject illegal moves and see a validated win.

Dependencies: Slice 1.

Tasks:

- Implement pure orientation/anchor transforms, selection, target preview and Place/Remove controls.
- Add the shared core placement result so the UI explains blockers, overlap, bounds and contact restrictions without duplicating rules.
- Implement transactional session commits. Preserve original placements until a legal replacement commits.
- Add the semantic board grid, roving focus, scoped shortcuts, status region and completion transition.
- Complete fixture games through public UI controls. A helper may compute a rotation/flip action sequence for a fixture, but may not inject placements into app state.
- Check that an illegal but complete-looking painted preview never triggers a win. Only committed placements count.

Manual checks: finish `opening-seed` on a phone using tap, preview and Place. Finish it with keyboard only on desktop. Check an actual reflected cyan/red shape, an invalid placed-piece move and the different Expert/Master rule groups.

Executable verification:

```bash
pnpm test
pnpm run test:transforms
pnpm run test:state
pnpm run build
pnpm run test:e2e tests/e2e/play.spec.ts tests/e2e/input.spec.ts
```

Exit gate: known fixture completions work through mouse clicks, mobile-emulated taps and keyboard; each expected rule rejection leaves committed occupancy unchanged; one completion announcement per win transition.

### Slice 3: Add transactional mouse/pen dragging

Outcome: players can drag from the tray or move an existing piece, with a stable grabbed-cell anchor and safe rejection/cancellation.

Dependencies: Slice 2, especially tested transforms and session commits.

Tasks:

- Add the armed/dragging phases, six-pixel threshold, stable capture target and primary-pointer filtering.
- Convert pointer coordinates using the current SVG transform and snap around the grabbed occupied cell.
- Share preview and commit functions with the non-drag path. Recompute the final candidate from pointerup.
- Handle cancellation, capture loss, release outside the board, Escape and resize/orientation change. Cancel active drags on layout change rather than making the piece jump.
- Preserve the grabbed anchor under R/F and suppress click-after-drag double actions.
- Keep touch on the existing tap path in the base scope. Add direct touch dragging only if that optional feature is explicitly adopted and its device checks pass.

Manual checks: grab different cells of the cyan piece; rotate/flip it while dragging; try overlapping its own former footprint, another piece and a blocker. Release outside, scroll before a drag, resize during a drag and cancel a captured pointer. Every failure must restore committed state.

Executable verification:

```bash
pnpm test
pnpm run build
pnpm run test:e2e tests/e2e/input.spec.ts
```

Exit gate: successful release commits exactly once; unsuccessful/cancelled gestures make no placement or history change. Native mouse movement tests pass on Chromium, Firefox and WebKit.

### Slice 4: Add undo and finish responsive/accessibility behavior

Outcome: the required V1 is playable, recoverable and usable across the target screen/input matrix.

Dependencies: Slices 2 and 3.

Tasks:

- Add 20-entry placement snapshots for valid commits and removals. Restore placements exactly, clear drafts and recompute solved state on undo.
- Define focus after commit, removal, cancellation and undo. Preserve persistent tray and board controls.
- Finish narrow layouts, readable restriction labels, invalid-preview cues and reduced-motion behavior.
- Add axe checks and keyboard/status assertions. Record manual screen-reader and real-phone results with browser/device versions.
- Update README instructions and active scope/interaction documents to match the implemented behavior.

Manual checks: undo a moved piece, a removed piece and the final winning move. Inspect at 320, 390, 768 and 1440 CSS px widths, landscape and 200% zoom. Complete a game on actual iOS Safari and Android Chrome. Inspect the board and operate it with a desktop screen reader.

Executable verification:

```bash
pnpm test
pnpm run build
pnpm run test:e2e
```

Exit gate: no lost focus or state corruption, all required actions work without drag, no relevant automated accessibility violations remain, and the manual device cases are recorded as pass/fail. Emulation alone cannot close this gate.

### Optional slice: Timer and/or hints

Outcome: an informational timer or a reviewable single-piece hint assists play. Either can be adopted independently.

Dependencies: Slice 4. Neither feature blocks the base V1 release.

Tasks: implement only the adopted feature's behavior specified above. For hints, add fixed-position, dead-end, stale-source, Dismiss and Apply/Undo cases. For a timer, inject a clock into its small timing helper so tests do not wait on wall time. Record actual-phone solver latency before choosing whether a worker is needed.

Manual checks: try the existing Wizard dead end at B6, then undo/remove and request another hint. Change a placement or restart before applying a hint and confirm it clears. For the timer, verify backgrounding, completion, undo and restart behavior.

Executable verification:

```bash
pnpm test
pnpm run build
pnpm run test:e2e
```

Exit gate: adopted assistance preserves player placements, never describes unknown/failed computation as a solution or a dead-end proof, and has no unresolved phone responsiveness issue.

### Slice 5: Verify the production artifact and document deployment

Outcome: a contributor can reproduce and serve the completed V1 as static files.

Dependencies: Slice 4, plus any optional slice that was actually adopted.

Tasks:

- Add the production Playwright configuration against port 4173 and run fixture completion plus static smoke checks against the compiled app.
- Confirm root and subdirectory asset paths work, and that the production artifact does not include archived material, fixture solution data, official images or development controls.
- Capture console/page errors and failed asset requests. Confirm play continues after initial assets load when external network access is blocked.
- Document install, browser installation, test, development, build and static-host steps. Deploy only `dist/` when a host is chosen.
- Keep exhaustive checks outside the default fast test command. Require a fresh exhaustive pass when the core or dice/pieces/restriction data change and before the initial release.

Manual checks: load the production build through a plain static host at a subdirectory URL; refresh it; complete a game; verify labels, geometry and interactions match development. No API keys, account setup or database instructions should appear.

Executable verification:

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm run build
pnpm run test:e2e
pnpm run test:e2e:prod
pnpm run verify:all
```

Exit gate: all required acceptance checks below pass, documentation matches the commands, and `dist/` is ready for static hosting. This does not itself publish the app or establish permission to use the game title commercially.

## Test strategy and fixtures

### Pure invariants and rules

- Assert the exact 42-face table, six sides per die and a disjoint partition equal to all A1-F6 cells. Checking only a set size of 36 would not reject a wrong coordinate.
- Exercise each face-index boundary deterministically. Verify repeated entries' multiplicities without flaky statistical tests. For injected RNG values outside `[0, 1)`, define and test rejection rather than accepting `undefined` coordinates.
- Assert the nine literal shapes, their cell counts, normalized unique orientations, per-ID orientation counts and 625 placements. Independently compare generated cells with rotation/reflection of the shape rows in this plan.
- Test all six pairs among the four numbered pieces at every level, in both placement orders. Include legal board-edge contact, diagonal contact, contact with blockers/unrestricted pieces and the F-column/A-column row-wrap boundary.
- Test every bounds edge, blocker overlap, piece overlap, invalid orientation, fractional coordinate, malformed map and moving-piece self-footprint handling.
- Replay each existing complete Wizard solution, verify it at every level and check solver outputs through the independent oracle. Preserve orientation ordering or deliberately migrate fixture indices with a geometry comparison.
- Retain the legal Wizard dead end from `opening-seed`: navy at B6, `{ id: 'navy', orientation: 0, x: 1, y: 5 }`. `canPlace` must accept it and `solve` must return `null`.
- Test fixed solutions with one, four and eight placements. Verify those exact placement values survive solving and the input object remains unchanged.
- Expand `isSolved` failures to missing pieces, duplicate IDs, mismatched keys, missing/wrong blockers, overlaps, contacts, malformed orientation and complete-looking partial coverage.
- Run all 62,208 Wizard boards through the solver and oracle in the slow maintained command. This is existence under the verified model, not independent manufacturer certification.

### Session integration

Test place, move, remove, reject, cancel, no-op commit, undo, history limit, restart, new roll and level change. Assert deep committed-state equality after every rejected/cancelled action and the expected new committed state after successful actions. Verify that incoming placement objects and history snapshots cannot later mutate the board through shared references.

Selection, preview and transformations must not start a win or enter undo history. A ninth invalid placement must not solve the game. Undoing a completed game must restore the precise earlier board. A second valid completion should emit a new transition, while re-rendering a solved state should not.

If hints ship, test that applying a hint from a superseded source game is rejected even if the proposed cells happen to remain free. Test dead-end feedback, full-board requests, dismissal and ordinary undo of a hint application. Add stale worker-response tests only if a worker is introduced.

### Browser E2E

Use desktop Chromium, Firefox and WebKit projects, mobile Chrome emulation and mobile WebKit emulation. Name those projects explicitly in the configuration. Use accessible locators for actions and cell coordinates/data attributes for geometry assertions. Do not expose a public global that lets tests mutate placements.

Browser fixtures replace RNG before startup. The first opening roll may use physical face indices `[0, 1, 0, 1, 4, 2, 3]`; return `(index + 0.5) / 6` for each sample. The next seven values provide a second named fixture so New roll is deterministically different in that test. A separate case intentionally repeats the first roll to prove the app does not force novelty.

Cover initial board/tray, every level's restriction group, actual rotation/reflection, valid/invalid tap commits, placed-piece movement/removal, resets, undo, a complete fixture through controls and committed-state win announcements. Inspect board-cell labels/geometry after actions rather than trusting a displayed piece counter.

For drag tests, use native mouse down/move/up sequences. A generic HTML `dragTo` action does not establish Pointer Events behavior. Check grabbed-cell anchoring, outside release, R/F during drag, second-pointer filtering, pointer cancellation, capture loss and reset/resize during a gesture. Synthetic cancellation tests cover cleanup branches; real device/OS behavior still needs manual checks.

### Accessibility, responsive and real-device cases

- Complete the fixture by keyboard only, including a reflected shape and removal. Check stable focus, no traps, scoped shortcuts and access to all controls.
- Inspect meaningful cell/tray names, active restrictions, non-color legality cues and a single appropriate completion announcement. Use axe as a supplement; it cannot establish usable screen-reader gameplay.
- Complete tap-based play on mobile emulation and actual iOS Safari/Android Chrome. Confirm normal scrolling and zoom, visible Place/Rotate/Flip/Remove controls, and a predictable anchor marker.
- Check 320/390/768/1440 CSS px widths, phone landscape, 200% browser zoom and reduced motion. Verify no clipped controls or page-wide horizontal overflow at 320 CSS px. Committed coordinates must survive resize and device rotation unchanged.
- Record actual devices, browser versions, checks and failures in `docs/TEST-RESULTS.md`. If access to an actual device is missing, report that gate as unverified rather than claiming a mobile pass.

## Acceptance gates

| Gate | Concrete pass condition |
| --- | --- |
| Correct model | Exact dice/shapes/groups and all pure tests pass. The repaired false-win/sparse-input regressions fail closed. |
| Complete board | An independently checked fixture can be placed through public UI controls and triggers a win only after legal committed coverage. |
| Transactions | Invalid release, cancelled drag, invalid tap commit and invalid transformation commit leave committed placements/history unchanged. Valid moves replace one piece exactly once. |
| Transform fidelity | Four rotations and two flips return the original geometry/anchor. Cyan and red reach reflected shapes. Index stepping is not used as rotation. |
| Non-drag play | A complete game, movement and removal are possible with tap/click controls and keyboard. |
| Undo | Placement, move, removal and final-win undo restore exact snapshots. Invalid/no-op actions do not consume history. |
| Responsive/mobile | Required phone and responsive cases pass with recorded actual-device evidence. Optional touch drag is not silently treated as implemented. |
| Accessible interaction | Stable visible focus, named controls and inspectable board cells; no traps; readable errors/restrictions; appropriate status announcements; relevant axe issues resolved. |
| Solver trust | Fixed pieces are honored, known dead ends return no completion, and every exhaustive answer passes the independent oracle. Hint gates apply only if hints ship. |
| Production | Strict check, browser suites and compiled-app tests pass; no page/console errors or missing assets; root/subdirectory serving works without runtime APIs. |
| KISS/YAGNI | Added modules, APIs, dependencies and state fields serve current behavior or improve its readability/maintenance. There are no forwarding layers or unused future capabilities. Substantial opaque artwork has an editable asset boundary when useful. |
| Reproducibility | A clean `pnpm install --frozen-lockfile` installation with documented supported Node and Playwright browser installation can run the listed commands. |
| Distribution readiness | Original UI assets only; no copied official manual/art/logos or archived experiment data in `dist/`; title/branding and current physical-dice evidence are assessed before a fidelity-branded public release. |

## Risks, assumptions and unresolved decisions

| Issue | Current conclusion | Action or decision trigger |
| --- | --- | --- |
| Physical dice fidelity | The corrected first-hand table and independent distinct sets agree; the official manual omits a complete face table. | Compare the current physical set or an authoritative complete table before advertising exact current-edition fidelity. A verified conflict requires model/test/document corrections. |
| Malformed state | Demonstrated false wins and sparse-input acceptance exist. | Repair in Slice 0, before trusting win/hint state in the browser. |
| Phone ergonomics | Tap play is complete and avoids requiring finger-covered drag previews. Extra preview/Place taps may slow play. | Try the policy in Slice 2 on a phone and adjust input behavior if needed. Do not redesign rules/state around a preference. |
| Mobile pointer anchoring | Dragging a scaled piece across tray and board creates anchor/scroll risks. | Keep touch drag optional. If adopted, test each source anchor, transforms, scroll boundaries and cancellation on real devices. |
| SVG/HTML alignment | Visual geometry and semantic cell buttons must remain aligned at every size. | Use a shared six-cell board area and verify corner/center hit targets at resize and zoom. Cancel active drags when layout changes. |
| Orientation indices | Existing fixtures depend on current deterministic ordering. | Preserve order during repairs; test geometric transforms independently and migrate fixtures explicitly if ordering changes. |
| Hint latency/staleness | Desktop measurements favor on-demand synchronous solving; no phone performance promise follows. | Benchmark phones before shipping hints. Check the source game before applying assistance and introduce worker request matching only if measurements require a worker. |
| Human difficulty | Rule levels are defined; Master and Expert are incomparable subsets. Solution count does not establish player difficulty. | Explain active restrictions rather than claiming every later level or roll is objectively harder. |
| Branding and rights | No permission to redistribute official content is supplied. | Use original SVG/CSS and a clearly independent presentation. Confirm title/trademark and asset use before a public branded/commercial release. The official download page states reuse restrictions. |
| Hardware/browser access | Automated browser projects are available to build; actual phone and screen-reader evidence has not yet been collected. | Treat missing manual evidence as an open release gate, not a blocker to implementing the early slices. |
| Stack preference | No user preference or embedding requirement is established. | Adopt this small stack unless the first playable implementation shows a concrete advantage for a component framework. |

The product page restricts reuse of downloaded official content. This is a source-specific distribution constraint, not legal clearance for a clone or a reason to delay local technical exploration. [SmartGames product/download page](https://www.smartgames.com/uk/one-player-games/genius-square).

## Deliberate omissions

- No backend/auth layer. Local placement and finite solving require neither identity nor a service.
- No global state library, command hierarchy or event bus in the proposed V1. Explicit session functions and small snapshots cover its transitions. Change that design only if a current requirement makes another approach clearer.
- No duplicate cell occupancy state. Rendering and validation derive occupancy from blockers and committed placements.
- No generalized polyomino engine, plugin system, board-size configuration or alternate rules. The target has nine fixed pieces on one board.
- No preemptive worker, WebAssembly, SAT/DLX dependency or solution database. Measure the existing on-demand solver first.
- No continuous game loop. Render committed changes and update the dragging preview when pointer events arrive.
- No drag-only UI, global scroll lock or HTML drag-and-drop. The tap/keyboard path is a complete game path, and Pointer Events handle dragging.
- No imported component library, font service, icon package or physics/animation framework. Native controls and original SVG/CSS supply the required interface.
- No service worker, persistence or URL-state parser in V1. Each would add lifecycle or input-validation work without completing the basic play loop.
- No broad test-runner migration, snapshot-heavy suite or tests that only mirror implementation internals. Test physical invariants, state transitions, independent coverage and real browser behavior.
- No claim that a solver pass means a finished app, manufacturer-confirmed physical accuracy, universal phone performance or accessible gameplay. Each has a separate concrete gate above.
