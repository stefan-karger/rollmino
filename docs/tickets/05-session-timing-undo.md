# T05. Implement pure run lifecycle, wall-clock timing and Undo

[Tracker](README.md) | [Product specification](../../IMPLEMENTATION_PLAN.md) | [Coding guidelines](../../CODING_GUIDELINES.md)

## Blockers

- [T01](01-rule-validation.md)
- [T03](03-web-tooling.md)

Plan coverage: section 5 and session cases in section 12; state part of Slice 1.

## Outcome

A pure session module handles hidden ready, active play, terminal completion and practice replay without UI/storage side effects.

## Scope and files

Add `src/session.ts`, `tests/session.test.mjs` and `test:state`. Use the repaired canonical engine. T07 consumes these functions; no DOM, localStorage, pause, Redo or hint behavior belongs here.

## Implementation steps

1. Define a small discriminated `ready | running | completed` session. Track level and `ranked | practice` mode. Running owns the authoritative Game, start timestamp and placement snapshots; completed owns final Game, frozen milliseconds and completion timestamp.
2. Initialize fresh Starter ready. Fresh ready contains no rolled puzzle. Practice ready retains replay dice only in memory. Start draws seven physical faces for ranked play and none for practice, then creates an empty game and records the supplied start timestamp. Guard repeated/wrong-phase Start.
3. Implement validated place/move/remove transactions. Copy immutable placement values and save exactly one prior snapshot per successful change. Invalid, cancelled or identical actions leave state/history untouched.
4. Check completion after a valid commit. Only nine valid committed pieces/full coverage finish the run. Freeze result/time, clear history and reject further editing/Undo. Expose this phase transition for the UI's later single record consideration.
5. Implement unlimited active-run Undo, including movement/removal and returning to empty placements. No time/eligibility rewind, no Redo, no reopening completion.
6. Implement accepted New game, Replay and level-change transitions. The UI decides whether confirmation was accepted; Cancel must not call an abandonment transition. New/level changes enter fresh ready; Replay enters same-level/layout practice ready and starts no timer until Start.
7. Accept timestamps from callers. Derive elapsed as `Math.max(0, now - startedAt)`, freeze at completion and format `mm:ss.ss` by flooring to centiseconds with unbounded minute digits. Do not count callbacks or add a pause clock.
8. Add transition/failure tests and `test:state` as `node --experimental-strip-types --test tests/session.test.mjs`.

## Verification

```bash
pnpm run test:state
pnpm test
pnpm run typecheck
```

Use fixed timestamps and an injected RNG, never real-duration waits. Verify all three fixtures complete from successive commits. Include delayed/background periods, a long confirmation interval represented by advancing time, repeated completion events, invalid commits, exact no-ops, editing later drafts without changing snapshots, full-history Undo and abandoning practice for a fresh ranked run.

## Done when

- [x] Phase transitions match the plan, including hidden ready and zero draws on practice Start.
- [x] Successful changes alone affect history; Undo restores exact placements through the entire active run.
- [x] Elapsed values include time without display callbacks and freeze once on completion.
- [x] Completion is terminal and transition data supports one later record consideration.
- [x] No session/layout/timer/history persistence or UI dependency is introduced; pure tests and strict checking pass.

## Completion evidence

2026-10-13: Added `src/session.ts` with pure hidden-ready, ranked/practice Start, validated immutable transactions, unlimited Undo, terminal completion, accepted fresh/replay transitions and wall-clock formatting. `tests/session.test.mjs` covers all three fixture completions, 150-action Undo, no-ops, proposal copying, replay RNG exclusion and fixed-time background/confirmation intervals. `pnpm run test:state` passed 6 tests; `pnpm test` passed 53 tests; `pnpm run typecheck` passed on Windows with Node 24.15.0 and pnpm 12.10.0. Confirmation UI remains T07; no storage/DOM dependency was added.
