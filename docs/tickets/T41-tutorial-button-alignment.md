# T41: Wrapped tutorial navigation alignment

## Request and scope

On 2026-10-15 the user reported a Linux CI failure in the narrow, reduced-motion tutorial check: the two navigation buttons' top edges differed by 6 CSS pixels, while the other 144 cases passed. [T40](T40-unframed-tutorial.md) records the preceding UI and local verification.

Investigate the navigation's response to different font metrics and wrapped forward-action text. Reproduce the height/alignment failure before fixing it, preserve the strict same-row assertion and make both controls share the tallest button's row height. Keep the plain progress text centered, the shared button skins, readable labels, native input and 44px minimum targets. Add larger-text coverage to the existing narrow tutorial regression and run the conservative required checks.

## Acceptance

- The current layout reproduces an alignment failure when the final exercise label wraps at a narrow width.
- Back and the forward action remain aligned with equal heights at default and enlarged text sizes, without truncating or shrinking the label.
- Progress stays centered; controls fit horizontally, remain reachable and retain their existing primary/secondary appearance.
- The existing strict geometry thresholds, six-panel navigation, final exercise access, focus and reduced-motion accessibility checks pass.
- Record actual commands, results and verification limits before marking the tracker complete. Preserve the user's port-5173 server.

## Implementation and reproduction — 2026-10-15

The navigation grid vertically centered its children independently. A wrapped forward label made its button taller than Back; centering then moved Back's top edge down. The reported Linux CI difference was 6px. In the local Windows Chromium reproduction, a 20px default text size at 320px width made Back 45px tall and Try exercise 72px tall, with two text lines and a 13.5px top-edge difference. The expanded existing tutorial check failed on that alignment assertion before the CSS fix.

Added only `align-self: stretch` to the navigation buttons. Both buttons now fill the existing grid row's height; the container still centers the plain progress text. Labels may wrap naturally, and no shared button colors, type sizes, minimum targets or navigation handlers change. Shared-preview measurement after the fix showed both buttons at top 392.0625px with 72px height, progress centered at 428.0625px and no horizontal overflow.

The existing six-panel reduced-motion/axe/narrow check retains its original less-than-1px alignment threshold and one-pixel native scrolling allowance. Its final panel now also uses a 20px root text size, verifies that Try exercise actually spans multiple text rectangles, and checks equal button heights/top edges, vertically centered progress, 44px minimum targets and viewport fit. The subsequent landscape/Home reachability check runs with that larger text too. The focused regression failed before the fix and passed after it in 4.4 seconds, including the strengthened wrapping/progress assertions.

## Verification — 2026-10-15

| Command | Actual result |
| --- | --- |
| `pnpm install --frozen-lockfile` | Passed with pnpm 12.10.0; no dependency/lock changes |
| `pnpm exec playwright install chromium firefox webkit` | Passed |
| `pnpm test` | All 75 pure tests passed before and after the change |
| `pnpm run build` | Strict TypeScript/Vite build passed, 15 modules |
| `pnpm run test:e2e --config=node_modules/.cache/rollmino/playwright.reuse.config.mjs e2e/tutorial.spec.ts --project=desktop-chromium --grep 'exact level groups' --workers=1 --max-failures=1` | Failed before the fix with the expected 13.5px offset; passed after the fix, including the final wrapping/progress assertions, in 4.4 seconds |
| `pnpm run test:e2e --config=node_modules/.cache/rollmino/playwright.reuse.config.mjs --workers=1 --max-failures=1` | All 145 cases passed without skips across five projects in 4.9 minutes |
| `pnpm run test:e2e:prod` | All five cases passed at root and `/rollmino/` in 8.8 seconds against the preceding build |
| `pnpm run verify:all` | Independently validated all 62,208 Wizard answers in 28.68 seconds while the browser matrix ran |
| `pnpm run check:docs`, `git diff --check` and `git diff --cached --check` | Passed after final evidence/tracker updates and staging |

The conservative selector chose pure/build/all-browser/artifact/exhaustive checks for the CSS and tutorial-test paths. Playwright invocations ran sequentially; the temporary ignored wrapper imported the repository's full matrix and reused the user's existing server. It was removed after verification, and process 15372 still listens on port 5173. No application changes occurred during the final full browser run or after its tested build.

Acceptance is supported by the failing-before/passing-after regression, measured shared-preview geometry and the complete local verification sequence. These runs used Windows; the larger-text reproduction recreates the wrapping condition rather than claiming the same Linux font or the exact reported 6px offset. The remote CI run has not been rerun here. Mobile projects remain emulation, text-size/CSS zoom checks cover reflow, and preview-injected larger text was reset after inspection. No physical-device, pen, screen-reader or publication pass is claimed.
