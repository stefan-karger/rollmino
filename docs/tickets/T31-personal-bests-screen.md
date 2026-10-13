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

## Implementation evidence

Executed on 2026-10-13 in the Windows workspace. Read T30's completed evidence, the accepted revision/T29 compatibility boundaries, Records and the affected app/input/accessibility/artifact assertions before editing.

Personal bests is reached from Home and has its own records-level filter, top-five list, dates, empty state, selected clearing and storage explanation. Filtering preserves the ordinary play level. The game keeps frozen completion feedback and a storage notice beside the board. One persistent polite atomic status element moves between the current game and records containers. Browser Back closes any records confirmation before hiding its screen. Records/schema/ranking code was unchanged.

- `pnpm install --frozen-lockfile` passed without dependency changes. `pnpm test` passed all 68 tests, including existing ranking, normalization, current-storage reads, clear isolation and storage-fault checks. `pnpm run build` passed strict checking and Vite output for the final runtime.
- The changed-path selector retained pure/build/full-browser/artifact/exhaustive checks because the navigation module remains an unknown conservative path. No selector policy was narrowed.
- The first focused browser run reported 25 failures from the duplicate Level label and four passes. Renaming the records label to Records level resolved the ambiguity and identifies the list being inspected.
- `pnpm run test:e2e --workers=1 --max-failures=1` passed all 104 cases without skips in 4.6 minutes. Existing representative games now inspect records through public Home navigation. The storage scenarios retain single insertion, practice exclusion, raw ordering/ties, five-entry limits, invalid recovery and read/access/write failures. Clearing tests preserve other levels/keys, and active Home cancellation preserves board/history/time before records become reachable. The committed-art/record-node regression now verifies that changing the play level leaves the independently filtered record list mounted.
- Existing viewport/reflow checks now reach the separate records controls. Axe checks cover records and its clearing dialog in addition to the game states. T3 collaborative-browser review at 320 by 568 CSS pixels observed no overflow, readable controls/storage copy, heading entry focus and Tab reaching Records level, with exactly one polite live region. These are desktop-browser CSS checks, not physical-device or screen-reader results.
- `pnpm run test:e2e:prod` passed all five root/subpath cases against the preceding final build, with public Personal bests navigation and reload retention. `pnpm run verify:all` independently validated all 62,208 Wizard answers in 40.14 seconds.

Acceptance was checked against the implementation and these regressions. Documentation consistency and `git diff --check` passed before committing. No publication, physical-phone, pen or screen-reader pass is claimed. The unrelated-key clearing guarantee remains; first-visit offer behavior is implemented in its own ticket.
