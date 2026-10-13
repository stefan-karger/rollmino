# T18. Reduce repeated browser-test executions

[Tracker and priority](README.md) | Blockers: [T15](15-cancelled-drag-click-suppression.md), [T16](16-tray-orientation-geometry.md), [T19](19-meaningful-test-assertions.md)

The review found 43 scenarios across five projects: 207 applicable cases, 8 CDP skips and about 80 completed development games. Production adds 12 complete games. Meaningful assertions and bug regressions must exist before reducing repetition.

Files: playwright.config.ts, playwright.production.config.ts, e2e and maintained test guidance.

## Work and checks

1. Keep all five platform configurations. Use ordinary project selection or a few clear tags and record a short scenario/platform coverage map.
2. Run all three fixtures in primary Chromium and one full fixture elsewhere. Retain native desktop keyboard/mouse/capture/focus, cross-engine confirmations, mobile tap play and mobile-Chromium CDP touch/cancellation/scrolling.
3. Run ranking/fault permutations, shared transaction cases, synthetic cleanup variants and full viewport/axe-state matrices primarily once. Keep representative storage/reload, narrow layout, grid and native focus coverage elsewhere.
4. Select CDP cases only for their applicable project. Retain both artifact mounts, assets/errors and representative built gameplay. Avoid completing every fixture repeatedly for unrelated assertions.

Run pnpm test, pnpm run build, the revised development suite and pnpm run test:e2e:prod. Compare counts/timings with the review baseline of 207 applicable cases and 6.9 minutes. About 90 to 110 cases is a planning estimate, not an acceptance quota; timings depend on the environment.

## Acceptance

- [x] Coverage maps retained V1 behavior to meaningful checks and applicable platforms.
- [x] T15/T16 regressions remain effective and no general failure is hidden by skips.
- [x] Native input, phone play, accessibility, records and both artifact mounts pass.
- [x] Evidence records removed repetitions, actual counts and measured savings.

## Completion evidence

2026-10-13. The [coverage map](../../IMPLEMENTATION_PLAN.md#browser-coverage-map) documents the three development tags and explicit project selection. The five configurations remain. Desktop Chromium runs 43 shared/native cases; desktop Firefox and WebKit each run 17 native/representative cases; mobile Chromium runs nine including both CDP cases; mobile WebKit runs seven. T15/T16 run in every project. CDP scenarios assert their expected platform and are selected only there, with no runtime skips.

Kept all three full fixtures in primary Chromium and first-fixture completion in every other project. That completion now checks reload/record retention as well as terminal time and replay. Full keyboard play, native mouse anchors/held transforms/capture/return/collision and native Escape/lost-capture cleanup run in all desktop engines. Narrow layout, grid/dialog focus and native confirmations remain cross-platform. Ranking/fault permutations, shared transactions, synthetic cleanup, axe-state and full viewport matrices run once in primary Chromium. Non-color glyph assertions place only restricted pieces instead of solving another game. Both artifact mounts still check assets/errors and full ranked/practice/reload behavior, while shared filesystem inspection runs once.

Actual commands passed: 60 pure tests, strict build, `pnpm run test:e2e --workers=2` with all 93 cases in 2.7 minutes and no skips, and `pnpm run test:e2e:prod --workers=1` with all five cases in 13.6 seconds. Development is 114 cases and 4.2 minutes below the review baseline of 207/6.9 minutes. Relative to T16 in this workspace with two workers, it is 124 cases and 5.2 minutes below 217/7.9 minutes. Timings are environment-dependent. Completed games fall from about 80 to 21 in development and from 12 to four in production. `--list`, strict checking, documentation checks and `git diff --check` passed. Runtime/model/oracle/fixtures are unchanged; no physical-device or screen-reader claim is added.
