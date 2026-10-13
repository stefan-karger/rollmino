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

- [ ] Coverage maps retained V1 behavior to meaningful checks and applicable platforms.
- [ ] T15/T16 regressions remain effective and no general failure is hidden by skips.
- [ ] Native input, phone play, accessibility, records and both artifact mounts pass.
- [ ] Evidence records removed repetitions, actual counts and measured savings.

## Completion evidence

Add dated implementation and verification results before marking the tracker done.
