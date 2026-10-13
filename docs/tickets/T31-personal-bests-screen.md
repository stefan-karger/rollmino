# T31: dedicated Personal bests screen

Created on 2026-10-13 from the user's accepted onboarding plan. The [tracker](README.md) owns blockers and status. Read [the accepted revision](../../IMPLEMENTATION_PLAN.md#accepted-home-and-tutorial-revision), [T29's compatibility boundaries](T29-onboarding-and-home.md#engineering-and-compatibility-boundaries) and T30's recorded navigation evidence before implementation.

## Problem and scope

The complete records section currently sits below the game. Move it to a separate Personal bests screen reached from Home, keeping the game focused on play. Keep the finishing run's time, ranked/practice feedback and save-failure notice beside the board.

Retain the current records implementation and schema unless a concrete need requires a change. This is local Personal bests, with no global leaderboard, account, upload or synchronization.

Relevant code and tests are [records.ts](../../src/records.ts), [app.ts](../../src/app.ts), [index.html](../../index.html), [styles.css](../../src/styles.css), [record tests](../../tests/records.test.mjs), [records browser cases](../../e2e/records.spec.ts), [play](../../e2e/play.spec.ts), [accessibility](../../e2e/accessibility.spec.ts) and [production](../../e2e/production.spec.ts).

## Acceptance

- Home has a working Personal bests action. The separate screen contains level selection, that level's top-five times/dates, an empty state, Clear records and the browser-storage explanation.
- Full lists and clearing controls no longer appear on the game screen. Completion keeps its frozen time and ranked/practice feedback beside the board, without forced scrolling, modal or focus jump.
- A record save failure remains visible when the game finishes. Retain recovery/reload-loss notices on Personal bests; moving the section cannot hide a storage failure.
- Preserve `rollmino.records.v1`, validation, whole-millisecond ordering, stable ties, five-entry limit and English local dates. Rendering or opening the screen never inserts a record.
- Records navigation starts no clock, consumes no RNG and creates no game. Its level filter identifies exactly which list is displayed and cleared; inspecting it does not change the ordinary selected play level.
- Clearing confirms the displayed level specifically. Cancel restores focus and changes nothing. Confirm clears only that list in the app's records key, preserves other levels/keys and returns focus to Clear records.
- Preserve page-memory records when access/read/write fails and invalid-record recovery. Do not infer first visits from records or clear the future onboarding key.
- Ready/completed/running game navigation retains T30's rules. No records screen is exposed behind an active abandonment confirmation.
- All controls, lists, notices and Home/Back navigation remain usable with keyboard input, narrow/landscape layouts, visible focus and affected accessibility semantics. Browser Back returns through the existing app history without restoring a discarded game.
- Update existing completion/reload/clear/storage-fault assertions to inspect the new screen through public controls. Keep practice exclusion and single ranked consideration coverage without duplicating full fixture games for each records assertion.

## Verification

Use the [single verification policy](../../IMPLEMENTATION_PLAN.md#verification) with actual paths. App wiring selects frozen install, `pnpm test`, `pnpm run build`, the complete `pnpm run test:e2e` matrix and `pnpm run test:e2e:prod`, plus documentation checks and `git diff --check`. An unknown new module/spec selects the full sequence including `pnpm run verify:all`.

Add focused checks for screen-level filtering/clearing, completion-time save faults, preserved other keys and public navigation. Retain current normalization/ranking/fault tests. Build once before the root/subpath artifact checks and run Playwright sequentially.

Update implemented records/layout documentation. Record dated commands/results, notices, focused behavior and any limits before checking acceptance and changing tracker status. No new deployment claim follows from local checks.
