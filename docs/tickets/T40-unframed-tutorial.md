# T40: Tutorial and game action refinements

## Request and scope

On 2026-10-15 the user accepted the simplified tutorial arrangement and requested removal of the navigation card, a secondary Back button, primary Next button and plain progress text between them. Their follow-ups also remove the examples' card, restore their earlier spacing and keep only Tutorial as the header text without the Untimed/no-records subtitle. They then requested review of the game footer's action order, suggesting difficulty, New game, Replay, Home with mobile use in mind. [T39's completed evidence](T39-tutorial-navigation.md) establishes the current behavior.

Refine the CSS and header markup: use an unframed navigation row with secondary Back and the existing primary forward action; restore unframed examples and their earlier figure spacing. Remove the header subtitle and its unused style. Keep progress, final-step exercise access, keyboard focus and teaching behavior. Correct the existing narrow-screen assertion's fractional-scroll tolerance when needed.

The user's later exercise refinement removes Reset step in favor of Undo for individual actions and one compact Redo exercise button for starting over. Reset step previously restored a checkpoint, so it was distinct from Undo; full active Undo already supplies recovery. Remove its unused checkpoint/controller code and update instructions, pure recovery checks and native restart/gesture checks.

The subsequent button audit asks for a single primary style matching exercise Play and a single secondary style matching Review tutorial. Remove context-specific action skins and the tutorial offer's special button treatment. Keep the optional invitation emphasized through its text. Preserve usable full-size controls on narrow phones. The final header refinement renames Personal bests to Highscores and shares its existing heading color, size and weight with Tutorial; both use Tutorial's text-only Home link. Keep stored records and root-history navigation intact.

The next follow-up asks for a clearer distinction between available and already placed pieces. Replace opacity-only dimming with muted outer cell outlines and a decorative check mark for placed tray pieces; available pieces retain solid colors. Keep restriction marks, accessible state names, selection and native occupied-square hit regions.

## Acceptance

- The navigation and examples have no surrounding card background, padding or rounded frame.
- Back has the shared secondary style; Next and the final exercise action use the shared primary style, with plain progress between the controls.
- The header reads Tutorial without the Untimed/no-records subtitle; Home remains available.
- The game footer follows difficulty → New game → Replay → Home in both visual and native keyboard order, with usable phone targets.
- The exercise has one compact Redo exercise action without the full-width action bar or Reset step. Undo recovers individual learner actions; Redo restores the initial lesson, board and empty history and cancels a held gesture.
- All labeled action buttons share primary or secondary styling, including toolbar, footer, Home, tutorial, exercise, Highscores and dialogs. Board-cell and piece-slot inputs preserve their geometry and states.
- Highscores replaces Personal bests in current UI/copy. Highscores and Tutorial have identical heading typography and text-only Home links, with existing records and history behavior preserved.
- Placed tray pieces are clearly distinguished by outline rendering and a check mark. Available pieces stay solid; selection, repositioning, Remove/Undo and fixed exercise protection still work.
- Existing narrow-width, zoom, accessibility and navigation checks pass, alongside the CSS change scope's required gates. Preserve the user's development server and record actual results/limits before completion.

## Implementation and evidence — 2026-10-15

Removed the tutorial navigation and example section frames, restored the figures' earlier spacing and removed the Untimed header subtitle. Back, plain progress and Next remain in one row, with Try exercise replacing Next on the final panel. The header now shares Highscores' original 1.8rem, 700-weight, `#e8edf3` typography. Both headers use the same unframed native Home link with a 44px target and visible keyboard focus. Explicit `tabindex="0"` retains these navigation stops in WebKit's native Tab order. Ordinary activation returns through the existing root-history controller; modified clicks retain native link behavior. Highscores replaces Personal bests in the entry action, page heading and current teaching/documentation copy, with no storage-key/data change.

Consolidated action skins into the default filled/bordered secondary style and one `.primary` class matching exercise Play. Removed the individual Home, tutorial, exercise, toolbar and footer button overrides. Primary actions are Play, Start, New game, Next, Try exercise and Confirm. The optional first-visit invitation keeps its emphasis in the text, with unchanged handling/storage semantics and stable Home button positions. The game footer follows Level, New game, Replay, Home in DOM and visual order. At up to 400px it uses two columns to retain the shared 16px type and 44px targets; toolbar columns accommodate each label's intrinsic width. Structural board cells and piece slots retain their own input styling.

The exercise now has one compact secondary Redo exercise button. Removed Reset step's handler, export, checkpoint snapshot and checkpoint updates. Undo still recovers learner moves/removals to the fixed baseline. Redo restarts the lesson and clears history/draft/held gestures. Updated the lesson text and existing pure/native browser recovery checks accordingly; independent fixed-baseline and legal completion checks remain.

Placed tray pieces now use muted outer cell outlines with a decorative check mark instead of opacity-only dimming. Available pieces retain their solid colors. Restriction marks, selected-piece focus, accessible placed/in-tray names, fixed exercise protection and occupied drag regions remain. The outline/check applies through the shared game/exercise tray. Existing art/hit diagnostics now report the offending piece, anchor and geometry. Firefox's stroked SVG client bounds extended 1.05 CSS pixels beyond the occupied rectangle in the 1024px vertical-grey scenario; the geometry comparison now transforms the actual SVG rectangle corners through `getScreenCTM`, retaining its subpixel threshold and native drag checks. A trial constant-pixel stroke did not resolve that measurement and was reverted. The focused Firefox check then passed at all three widths.

Shared-browser review inspected both headers at 390px: each reports the same 28.8px size, 700 weight and `rgb(232, 237, 243)` color, with a transparent, borderless Home anchor. A computed-style audit confirmed matching primary/secondary button colors, type, radius and padding, apart from disabled-state colors. The 320px game footer has two rows of 44px targets without horizontal overflow. Native preview clicks placed navy and brown, showed outline/check states beside solid available pieces, then selected the placed navy, removed it and used Undo: its solid/in-tray state and outlined/placed state restored correctly. Snapshots were inspected at phone and desktop CSS sizes; the compact desktop Redo action was also inspected before the later shared button restyling.

### Preliminary checks and corrections

The initial narrow tutorial check encountered native fractional scrolling at 568.21875px in a 568px viewport. Its assertion now allows one CSS pixel of native rounding while retaining same-row, 44px and horizontal-fit checks; three focused tutorial cases then passed in 5.9 seconds. Earlier complete-suite attempts were deliberately interrupted to incorporate the user's successive header, footer, exercise, button and piece-state requests. One provisional parallel run reached 63 passes before Firefox browser-context teardown returned a protocol error involving `_maybeDontRestoreTabs`; the application assertions had completed. Subsequent runs use the documented `--workers=1` resource-pressure fallback. After removing Reset step, seven focused Chromium/Firefox exercise cases passed in 17.7 seconds. The later outline run reached 85 passes before the Firefox paint-bounds assertion described above; diagnostics reproduced it, the stroke-width trial did not change it, and the corrected geometry check passed in 5.7 seconds. The next run reached 97 passes before WebKit's default Tab order skipped the new Home anchor after restarting the exercise. Adding explicit zero tab indices to both Home links fixed native keyboard navigation: the focused WebKit exercise and tutorial keyboard cases passed in 7.9 seconds. These provisional runs are separate from the final acceptance checks below.

### Final checks

| Command | Actual result |
| --- | --- |
| `pnpm install --frozen-lockfile` | Passed with pnpm 12.10.0; no dependency/lock changes |
| `pnpm exec playwright install chromium firefox webkit` | Passed |
| `pnpm test` | All 75 pure tests passed before edits and after the controller/tray changes |
| `pnpm run build` | Final strict TypeScript/Vite build passed, 15 modules: HTML 5.46kB, CSS 7.45kB, JavaScript 33.09kB |
| `pnpm run test:e2e --config=node_modules/.cache/rollmino/playwright.reuse.config.mjs e2e/layout.spec.ts --grep 'centered piece art' --project=desktop-firefox --workers=1 --max-failures=1` | Corrected geometry/native drag check passed at all three widths in 5.7 seconds |
| `pnpm run test:e2e --config=node_modules/.cache/rollmino/playwright.reuse.config.mjs e2e/exercise.spec.ts e2e/tutorial.spec.ts --grep 'keyboard exercise\|keyboard panels' --project=desktop-webkit --workers=1 --max-failures=1` | Both native keyboard cases passed in 7.9 seconds |
| `pnpm run test:e2e --config=node_modules/.cache/rollmino/playwright.reuse.config.mjs --workers=1 --max-failures=1` | All 145 cases passed without skips across five projects in 5.0 minutes |
| `pnpm run test:e2e:prod` | All five cases passed at root and `/rollmino/` in 8.8 seconds against the final preceding build |
| `pnpm run verify:all` | Independently validated all 62,208 Wizard answers in 67.14 seconds during a provisional browser run; engine, fixtures, verifier and oracle remained unchanged through later UI refinements, confirmed by `git diff --exit-code -- engine fixtures scripts/verify-all.mjs tests/oracle.mjs` |
| `pnpm run check:docs` and `git diff --check` | Passed after the final evidence and tracker updates |

The conservative path selector retained pure/build/all-browser/artifact/exhaustive checks for the controller/tutorial/new test paths. Playwright invocations ran sequentially. The ignored temporary wrapper imported the full repository matrix and reused the user's existing server; it was removed after verification. Process 15372 remains on port 5173. No application changes occurred during the final full run or after its tested build. No permanent test-config, dependency, model, oracle or publishing changes were made.

Acceptance is supported by shared-preview visual/computed-style inspection plus native browser input, state/clock/history, geometry, focus, contrast, axe, completion/records and both artifact-mount checks. Mobile projects and CSS-size previews are emulation; the magnified scenarios check CSS reflow rather than browser-chrome zoom. The held-drag Redo cleanup uses an explicitly synthetic click while retaining native mouse movement/release and subsequent dragging. No physical-device, pen, screen-reader, physical-set or deployment result is claimed.
