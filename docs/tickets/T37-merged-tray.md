# T37: Merged tray and responsive comparison

## Request and scope

On 2026-10-15 the user selected prototype 1's mobile placement, prototype 2's backgrounds and shared sections, and prototype 3's idea of a tray to the right on wider screens. They also reported barely readable options in the level dropdown. [T36's completed evidence](T36-game-prototypes.md) supplies the current prototype baseline.

Prototype 1 becomes the merged stacked comparison: board, controls, then all nine pieces in one three-by-three tray without individual cards. Prototype 2 uses the same mobile presentation and moves the shared tray to the right of the board/controls from 900 CSS pixels. Keep the numbered comparison switch, existing game state/input and remaining reference layouts. Give native selects/options opaque contrasting backgrounds and readable text.

## Acceptance

- Both merged candidates use three rows of three pieces and controls above the tray on phones, with the former prototype 2's backgrounds/section style.
- The responsive candidate places the tray to the right of both board and controls on landscape tablet/desktop sizes; essential targets remain visible and unobscured by the switch.
- Native game/records dropdowns have opaque option backgrounds and at least 4.5:1 computed text contrast.
- Preserve selection, time, Undo, URL/reload behavior and matching artwork/occupied hit regions through layout changes.
- Run the selected gates, document actual results/limits and keep the user's existing development server available.

## Implementation and evidence — 2026-10-15

Candidates 1 and 2 now share a three-by-three tray with transparent individual slot backgrounds. The single tray section retains the former rack's `#182230` background; the controls above it retain `#253346`. Existing selection/focus feedback, accessible names, occupied hit regions and geometric transforms remain. Candidate 1 keeps this stacked arrangement at all widths. Candidate 2 switches at 900 CSS pixels to a 260px shared tray to the right of both board and controls; its workspace width also follows available viewport height. References 3 and 4 retain their prior arrangements.

The game select now has an opaque dark background, and native options in both game and records use light text on an opaque `#253346` background. The all-project state regression checks at least 4.5:1 computed contrast for each select/option, rejects transparent option backgrounds, and retains native level-change/cancel/focus checks. Shared preview inspection confirmed the merged phone presentation and right-hand tray at 1024×768. Its page screenshots do not capture the operating system's option popup, so the option contrast evidence is computed browser styling.

The expanded layout case checks all four candidates at 320×568, 390×844, 1024×768 and 1366×768, plus the merged candidates at 1024×600. It verifies three rows of three pieces, transparent slots inside an opaque shared tray, controls above the mobile tray and the responsive tray to the right of board/controls. Essential targets stay in the viewport and clear of the fixed switch, with no horizontal overflow; the 390×844 axe checks pass. Native dragging/occupied hit-region checks in all three desktop engines now include the responsive tablet layout. Keyboard/state coverage in all five projects resizes the selected candidate between phone and tablet widths and retains committed artwork, draft, clock, Undo, URL/reload behavior and invalid-parameter fallback.

A preliminary extra 1024×600 check against unchanged reference 3 found its controls below that short viewport (`634 > 600`). That added short-tablet assertion is scoped to the two refined candidates; the reference layouts retain the contract's permitted short-window scrolling and remain checked at the other representative sizes. No application change was made to those references.

The user's development server remained on port 5173, process 15372. An ignored temporary JavaScript config imported the repository's complete Playwright config, enabled `reuseExistingServer`, and resolved `testDir`/`outputDir` back to the repository. This retained all five projects and 145 cases without stopping the user's process. An initial TypeScript wrapper was rejected by Node's restriction on stripping types inside `node_modules`; using `.mjs` resolved that setup issue. The temporary wrapper was removed after the checks.

| Command | Actual result |
| --- | --- |
| `pnpm install --frozen-lockfile` | Passed using pnpm 12.10.0 without dependency/lock changes |
| `pnpm exec playwright install chromium firefox webkit` | Passed |
| `pnpm test` | All 75 pure tests passed |
| `pnpm run build` | Strict TypeScript/Vite build passed, with 16 modules |
| `pnpm run test:e2e --config=node_modules/.cache/rollmino/playwright.reuse.config.mjs e2e/prototypes.spec.ts --project=desktop-chromium --max-failures=1` | All three focused cases passed in 10.3 seconds |
| `pnpm run test:e2e --config=node_modules/.cache/rollmino/playwright.reuse.config.mjs --max-failures=1` | All 145 cases passed without skips in 2.1 minutes |
| `pnpm run test:e2e:prod` | All five cases passed in 8.3 seconds at both artifact mounts, reusing the preceding build |
| `pnpm run verify:all` | Independently validated all 62,208 Wizard answers in 27.65 seconds |
| `pnpm run check:docs` and `git diff --check` | Passed |

The conservative selector retained the full sequence for the prototype CSS/browser-test paths. Playwright invocations ran sequentially. Mobile projects/shared-preview resizing remain emulation; native-popup physical-device, pen and screen-reader checks were not performed. These are optional layout comparisons, verified locally without publication. All acceptance criteria above are supported by these results; the original developer-owned server was still listening under the same process after verification.
