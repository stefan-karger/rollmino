# T38: Permanent responsive game layout

## Request and scope

On 2026-10-15 the user chose the merged responsive comparison at number 2 as the main game screen and requested cleanup. [T37's completed evidence](T37-merged-tray.md) establishes the selected layout and readable dropdown styling.

Promote that layout to the default using static HTML and shared game-widget styles. Remove the numbered switch, URL handling, alternative layouts and temporary control movement. Preserve the compact three-by-three shared tray below the controls on phones, its placement to the right of board/controls from 900 CSS pixels, section colors and accessible native controls. Preserve teaching, game rules, state, time, Undo and input behavior. The user's follow-up explicitly includes the exercise in the new presentation; share its centered artwork, tray, controls and wide-screen placement while retaining the lesson instructions and fixed-piece behavior.

## Acceptance

- The default game uses the selected responsive presentation without a query parameter, visible title or individual piece cards/names.
- Time, board, controls and all nine pieces fit representative phone, landscape tablet and desktop viewports; short windows retain scrolling without horizontal overflow.
- Secondary actions/help remain below play; native dropdowns remain readable; accessible names, focus, lesson instructions and artwork/hit-region alignment remain intact. The exercise uses the same compact responsive widget.
- Remove prototype runtime code/styles, switching UI and obsolete active instructions; retain dated evidence for completed work.
- Verify the affected behavior and artifact mounts, record actual commands/results/limits and keep the user's development server available.

## Implementation and evidence — 2026-10-15

The selected responsive design is now the default without a layout parameter. Static HTML places the clock above play and Home/level/run actions plus collapsed rules/keyboard help below it. The shared widget contains board, controls, tray, meaningful draft feedback and storage notices in their final DOM order. Its single CSS layout stacks the compact three-by-three tray below controls on phones and places it to the right of board/controls from 900 CSS pixels. Workspace sizing still follows available height. The tray/control backgrounds remain `#182230`/`#253346`, with transparent individual slots and contrasting native selects/options.

The exercise uses that same widget styling and centered artwork, including wide-screen placement. Visible piece-label elements are removed; native accessible names and hover titles remain. Fixed prepared slots retain their dimming, disabled state and names. Lesson instructions, targets, Reset step, Redo exercise and completion actions remain. Artwork and occupied drag regions share their computed SVG origin. Rules, session, navigation, timer and teaching controllers retain their existing behavior.

Removed the fixed numbered switch, prototype query handling/reload hook, alternative styles, prototype stylesheet import/file and temporary DOM markers/control movement. Replaced comparison tests with default-layout reflow/state/focus/contrast checks in all five projects, native centered-art/occupied-region dragging in three desktop engines and a shared game/exercise layout/axe case. Existing input regressions now use slot padding and own-slot targets instead of removed labels. The artifact check also excludes comparison controls/code. Current README/contract instructions describe the permanent layout; earlier comparison tickets/results remain dated evidence.

The shared game/exercise layout case checks 320×568, 390×844, 1024×600, 1024×768 and 1366×768, including the 3×3 arrangement, shared background, transparent slots, controls above the mobile tray, right-hand placement at wider sizes and no horizontal overflow. Ordinary essentials fit from the top; the exercise's longer instructions may scroll, so its shared widget is checked after scrolling it into view. A one-CSS-pixel tolerance accounts for native fractional scroll rounding. Both surfaces pass the 390×844 axe checks. State tests preserve the committed board, draft, focus, clock and Undo across reflow, then check native level cancellation and at least 4.5:1 computed contrast for every select/option. Complete keyboard/tap exercise and prepared-piece native-drag protection remain in the full matrix.

Preliminary checks corrected two new assertion assumptions: exercise `scrollIntoView` yielded a `-0.09375px` top, and WebKit does not focus a button on mouse click. The focus test now establishes keyboard focus explicitly and opens/closes help with Enter. A later full run was interrupted when a trailing-blank-line cleanup triggered Vite reloads; its missing-pointer-target failure was discarded and the unchanged application was rebuilt and tested in a clean full run. No application edits occurred during that final run.

The user's existing port-5173 Vite server, process 15372, was reused through an ignored temporary `.mjs` Playwright wrapper importing all repository projects and resolving the normal test/output directories. Only `reuseExistingServer` differed. The wrapper was removed after testing; the developer's process remains running. No dependency, lockfile or permanent test-config change was needed.

| Command | Actual result |
| --- | --- |
| `pnpm install --frozen-lockfile` | Passed with pnpm 12.10.0, without dependency/lock changes |
| `pnpm exec playwright install chromium firefox webkit` | Passed |
| `pnpm test` | All 75 pure tests passed before edits and after implementation |
| `pnpm run build` | Strict TypeScript/Vite build passed, 15 modules |
| `pnpm run test:e2e --config=node_modules/.cache/rollmino/playwright.reuse.config.mjs e2e/layout.spec.ts e2e/input.spec.ts e2e/tutorial.spec.ts --project=desktop-chromium --max-failures=1` | All 27 focused cases passed in 23.3 seconds after the fractional-scroll assertion correction |
| `pnpm run test:e2e --config=node_modules/.cache/rollmino/playwright.reuse.config.mjs e2e/layout.spec.ts --project=desktop-webkit --project=mobile-webkit --max-failures=1` | All three focused cases passed in 8.4 seconds after the keyboard-focus assertion correction |
| `pnpm run test:e2e --config=node_modules/.cache/rollmino/playwright.reuse.config.mjs --max-failures=1` | Final clean run: all 145 cases passed without skips in 2.0 minutes |
| `pnpm run test:e2e:prod` | All five cases passed in 8.5 seconds against the preceding build at both artifact mounts |
| `pnpm run verify:all` | Independently validated all 62,208 Wizard answers in 56.05 seconds while the browser matrix ran |
| `pnpm run check:docs` and `git diff --check` | Passed after documentation updates and whitespace cleanup |

The conservative selector retained pure/build/all browsers/artifact/independent checks for the new browser-test path. Playwright invocations ran sequentially. Shared preview DOM inspection confirmed transparent exercise slots, retained names/disabled fixed pieces, section colors and a right-hand tray at 1024×768. A main-screen desktop screenshot was inspected; later snapshot requests returned a client snapshot error, so no successful new exercise/phone screenshots are claimed. Mobile projects and preview resizing remain emulation; native popup appearance, physical devices, pen and screen-reader behavior were not manually verified. This work is locally verified and has not been published. The recorded checks support all acceptance criteria above.
