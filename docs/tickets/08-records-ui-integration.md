# T08. Connect ranked completion to personal records

[Tracker](README.md) | [Product specification](../../IMPLEMENTATION_PLAN.md) | [Coding guidelines](../../CODING_GUIDELINES.md)

## Blockers

- [T06](06-record-ranking-storage.md)
- [T07](07-playable-tap-keyboard-game.md)

Plan coverage: sections 5 and 8; completes Slice 2.

## Outcome

Fresh completed runs can enter the selected level's top five. Practice never ranks, and clearing records does not disturb active play.

## Scope and files

Extend `src/app.ts`/`src/styles.css` using the records/session modules. Add `e2e/records.spec.ts` and extend session/browser tests where integration needs coverage. Do not add a second session model, background autosave or record layouts.

## Implementation steps

1. Safely acquire `window.localStorage`, including a getter that can throw. Load the records module's validated data and show selected-level records or an empty state.
2. Consider a record only on the `running -> completed` transition for ranked mode, using its frozen milliseconds/completion timestamp. A top-five insertion/save is attempted at most once. Re-rendering, trailing pointer/click events, later clearing or notices cannot resave that completion.
3. Show each result as `mm:ss.ss` plus an English-formatted local completion date. Reuse the game's time formatting; do not show time-of-day, statistics, layouts or entry replay controls.
4. Clearly label practice and show its frozen completion time without recording it. Fresh Start may fairly repeat a previous layout and remains ranked.
5. Add Clear records for the selected difficulty with specific Confirm/Cancel text in the existing native dialog. Preserve other lists/storage keys. Cancel changes nothing; confirmed clearing returns focus to Clear records and preserves game, clock and history.
6. Present a short corrupt-data recovery or unavailable-persistence notice. If storage fails, the page's records remain usable in memory; explain that reload loses them. A completed game remains complete even if saving fails.
7. Reload must keep successfully stored records while returning to fresh Starter ready with no session data.

## Verification

```bash
pnpm run test:records
pnpm run test:state
pnpm test
pnpm run build
pnpm run test:e2e e2e/records.spec.ts
```

Use deterministic physical rolls, public fixture completion and Playwright's clock. Test ranked insertion, repeated finish/render actions, more than five results, exact ties and millisecond ordering beneath equal displayed times. Seed localStorage history as browser storage when useful; never inject game placements.

Test practice completion, coincidental fresh repeats, level-isolated lists, reload, corrupted JSON and throwing getter/get/set operations. Clear during an active run after cancelling once; its board/history/elapsed time must continue. Clear after a completed run and ensure it does not reappear through another render.

## Done when

- [x] The selected difficulty displays only its best five time/date entries.
- [x] Ranked finish is considered once; practice is never inserted and fair repeat rolls remain eligible.
- [x] Confirmation/clearing preserves active state/time and other level/origin data.
- [x] Storage faults show a usable fallback without preventing play/completion.
- [x] Reload retains successful records only; integration tests pass in their applicable browser projects.

## Completion evidence

2026-10-13 work evidence, incomplete: Added selected-level record time/date UI, safe localStorage acquisition, ranked completion insertion on the single running-to-completed transition, confirmed clearing and notices. Added eight browser cases covering ranking, practice, persistence, clearing and getter/get/set/corrupt faults. `pnpm run test:records` passed 6 tests; `pnpm run test:state` passed 6 tests; `pnpm test` passed 59 tests; `pnpm run build` passed strict checking and Vite build. The five-project records suite did not pass: WebKit clock setup exposed a pause-at-install-time race, corrected to pause at a future timestamp; that correction still needs a clean rerun. Further cases failed in `browserContext.close` with `ENOSPC: no space left on device, write`. C: had 35,262,464 bytes free after stopping the run. Stopped the ticket loop at this concrete environment blocker. Free space on C: or relocate browser temporary files and test artifacts to a drive with space, then rerun all T08 verification and review the acceptance checklist before marking done/committing. T08 implementation remains uncommitted; T09 and later tickets have not started. Environment: Windows, Node 24.15.0, pnpm 12.10.0, Playwright 1.64.0.

Resumed and completed on 2026-10-13 after the user freed disk space. C: had about 8 GiB free. The corrected clock setup pauses at a fixed future timestamp; multi-completion record cases have a 60-second allowance for the slower Windows browser engines. All required checks passed: `pnpm run test:records` 6 tests, `pnpm run test:state` 6 tests, `pnpm test` 59 tests, strict `pnpm run build`, and `pnpm run test:e2e e2e/records.spec.ts` all 40 cases across desktop Chromium/Firefox/WebKit and mobile Chromium/WebKit in 2.4 minutes. Verified ranked single insertion, practice exclusion, fair repeat eligibility, top-five millisecond/tie ordering, reload retention, active clearing with continuous timing/history, selected-level and sentinel-key preservation, completed clearing without resaving, and getter/get/set/corrupt storage recovery. Prior disk/clock failures above are historical failed attempts, superseded by this complete rerun. No physical-device or screen-reader audit is claimed.