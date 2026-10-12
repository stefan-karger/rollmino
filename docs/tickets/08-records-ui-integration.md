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
npm run test:records
npm run test:state
npm test
npm run build
npm run test:e2e -- e2e/records.spec.ts
```

Use deterministic physical rolls, public fixture completion and Playwright's clock. Test ranked insertion, repeated finish/render actions, more than five results, exact ties and millisecond ordering beneath equal displayed times. Seed localStorage history as browser storage when useful; never inject game placements.

Test practice completion, coincidental fresh repeats, level-isolated lists, reload, corrupted JSON and throwing getter/get/set operations. Clear during an active run after cancelling once; its board/history/elapsed time must continue. Clear after a completed run and ensure it does not reappear through another render.

## Done when

- [ ] The selected difficulty displays only its best five time/date entries.
- [ ] Ranked finish is considered once; practice is never inserted and fair repeat rolls remain eligible.
- [ ] Confirmation/clearing preserves active state/time and other level/origin data.
- [ ] Storage faults show a usable fallback without preventing play/completion.
- [ ] Reload retains successful records only; integration tests pass in their applicable browser projects.

## Completion evidence

Not yet recorded. Add the actual changes, command results, checks and code reference here before setting this ticket to `done` in the tracker. Follow the [completion rules](README.md#working-and-completing-tickets).
