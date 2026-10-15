# T39: Simplified tutorial navigation

## Request and scope

On 2026-10-15 the user requested an overhaul of tutorial navigation to match the simplified game board. They questioned the usefulness of Replay example and skipping directly to the exercise. [T38's completed evidence](T38-main-responsive-layout.md) establishes the shared game/exercise presentation.

Use a compact tutorial header, static examples in one shared section and a single Back/progress/Next navigation bar. Offer Try exercise as the forward action on the last panel. Remove example replay/highlighting and its timers, plus the early exercise shortcut. Group the exercise's existing reset/redo actions and retain its completion actions. Preserve the six explanations, literal geometry/level examples, untimed behavior, selected ordinary level, fixed exercise rules, keyboard focus, Home/review flow and records isolation.

## Acceptance

- Each explanation has one compact navigation row with progress, Back and a clear forward action; only the final panel offers the exercise.
- Replay example, transient highlighting and its timer/cleanup code are removed. Static explanations remain complete and readable.
- Header, example section and exercise actions use the simplified dark section style, with readable contrast and reachable native targets at narrow widths/zoom.
- Back/Next and final exercise work with keyboard/touch; review/re-entry starts at the first explanation; no teaching RNG, clock or records leak into ordinary play.
- Update affected tests/current instructions, run the selected checks, record actual results/limits and keep the user's development server available.

## Implementation and evidence — 2026-10-15

Tutorial now has a compact muted title/untimed header with Home, one rounded example section and one Back/progress/forward navigation bar using the board's dark section colors. Progress sits between the two navigation controls and reads `1 of 6` through `6 of 6`. Back is disabled initially. Next is replaced by Try exercise only on the last panel; returning to the previous panel restores Next. Heading focus follows each transition, and review/re-entry resets the first panel. The final explanation names both the untimed exercise and Home/Play paths.

Removed Replay example, its request handler, highlight class/CSS, reduced-motion replay branch, timeout and departure-cleanup API/calls. The six complete static explanations, literal Rotate/Flip anchors and exact level table remain. The exercise's existing Reset step and Redo exercise now share one control bar; its completion Play action uses the same forward-action accent. Its shared board/tray, fixed-piece protection, untimed controller and completion behavior remain.

Updated existing browser scenarios to follow the final exercise transition, including offer/storage-failure flows, review and both production mounts. The all-project walkthrough check verifies no replay button, static artwork through elapsed wall time, panel progress/focus, last-step-only exercise access and no teaching RNG/records leak. The narrow reduced-motion case checks two aligned 44px navigation controls on every panel, horizontal fit and axe, including the final exercise action. Magnified teaching checks now reach the shared navigation bar instead of an early exercise shortcut. Artifact inspection excludes removed replay/highlight strings as well as the earlier comparison controls.

| Command | Actual result |
| --- | --- |
| `pnpm install --frozen-lockfile` | Passed with pnpm 12.10.0, without dependency/lock changes |
| `pnpm exec playwright install chromium firefox webkit` | Passed |
| `pnpm test` | All 75 pure tests passed before edits and after implementation |
| `pnpm run build` | Strict TypeScript/Vite build passed, 15 modules |
| `pnpm run test:e2e --config=node_modules/.cache/rollmino/playwright.reuse.config.mjs e2e/tutorial.spec.ts e2e/accessibility.spec.ts --project=desktop-chromium --max-failures=1` | All 13 focused cases passed in 19.8 seconds, including 320px navigation, reduced-motion axe and 200% CSS zoom |
| `pnpm run test:e2e --config=node_modules/.cache/rollmino/playwright.reuse.config.mjs --max-failures=1` | All 145 cases passed without skips in 1.9 minutes |
| `pnpm run test:e2e:prod` | All five cases passed in 8.5 seconds at root and `/rollmino/`, reusing the preceding build |
| `pnpm run verify:all` | Independently validated all 62,208 Wizard answers in 62.28 seconds while the browser matrix ran |
| `pnpm run check:docs` and `git diff --check` | Passed after documentation updates |

The conservative selector retained pure/build/all browsers/artifact/independent checks for the tutorial module. Playwright invocations ran sequentially. The temporary ignored config imported the complete repository matrix and enabled reuse of the user's existing Vite server on port 5173, process 15372; it was removed after verification and that process remains running. No permanent test-config or dependency changes were needed. No application edits occurred during the final browser run.

Shared preview snapshot/evaluation requests returned client automation errors even after reopening the same tab, so no new screenshot or manual visual pass is claimed. Evidence here is the executable native-browser, geometry, contrast and axe checks. Mobile projects remain emulation and CSS zoom is reflow coverage, without physical-device, pen or screen-reader testing. These results support the acceptance criteria above as local verification; no deployment was performed.
