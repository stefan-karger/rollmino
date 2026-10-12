# T01. Harden rules and committed-state validation

[Tracker](README.md) | [Product specification](../../IMPLEMENTATION_PLAN.md) | [Coding guidelines](../../CODING_GUIDELINES.md)

## Blockers

None.

Plan coverage: sections 3, 4 and 12; Slice 0.

## Outcome

The canonical engine rejects malformed inputs and reports a win only for nine legal committed pieces covering the complete board.

## Scope and files

Update `engine/core.ts` and `tests/core.test.mjs`. Preserve `fixtures/rolls.json`, die order and existing orientation indices. Record actual results in `docs/TEST-RESULTS.md`. The original/archive engine copies remain unchanged.

Use [the plan's exact model](../../IMPLEMENTATION_PLAN.md#3-exact-puzzle-model) as literal test expectations. No UI, solver assistance or schema library belongs in this ticket.

## Implementation steps

1. Run the existing fast suite and inspect the engine/fixtures. Use the local Git baseline from T00; repository creation, metadata and remote synchronization belong to that ticket. A blocked remote setup does not prevent local rule work once the baseline exists.
2. Add failing regressions before changing validation:
   - Replay `opening-seed`, replace dice with `['A1']`, and require `isSolved` to return false.
   - Replay it again, copy its brown placement into `placed.navy`, then assign `{id:'navy',orientation:0,x:1,y:0}` to `placed.brown`. Reject this key/ID mismatch.
   - Reject `validateDice(Array(7))` and unknown runtime levels in `newGame`.
3. Add small shared guards. Dice must be a dense seven-element array with an own string at each index belonging to its physical die. Levels and piece IDs must be known own keys. Require integer in-range orientations and integer coordinates; reject unknown placement keys and key/ID mismatches.
4. Make `canPlace` and `isSolved` fail closed for malformed setup/state. Moving a piece ignores only its own validated old footprint. Winning requires all nine IDs, 29 distinct piece cells, legal contacts and all 36 cells accounted for.
5. Keep `solve`'s contracts explicit: throw for malformed setup, return null for invalid fixed placements/dead ends, preserve fixed placements and never mutate input. Require nine used IDs as well as full coverage. Retain 36-bit BigInt masks.
6. Validate injected RNG values as finite numbers in `[0,1)`. Sample seven physical face indices independently without deduplication or forced novelty.
7. Expand literal model/contact tests and update evidence with actual commands/counts. Do not describe passing old tests as repair evidence.

## Verification

```bash
npm install
npm test
npm run typecheck
npm run verify:all
```

At this point the exhaustive script may still check answer existence only; T02 owns its stronger oracle. Check literal 42-face data/multiplicities, the exact 36-cell partition, nine shapes/29 cells/28 orientations/625 candidates, and all six numbered-piece pairs at all five levels in both placement orders. Cover diagonal, blocker, boundary and unrestricted contact, plus no F-to-A edge wrapping.

Also cover null/missing values, sparse arrays, unknown/prototype-derived IDs, extra keys, fractional coordinates/orientations, overlap and incomplete wins. Reuse all three solutions. Wizard `opening-seed` with navy at B6 is legal but `solve` must return null.

## Done when

- [ ] The four reproduced defects have regression tests that failed before repair and pass afterwards.
- [ ] Failure behavior follows the contracts above without incidental crashes or false wins.
- [ ] Exact model and contact cases pass; fixture orientation order and fair-roll probabilities are unchanged.
- [ ] Fixed-placement, dead-end and input-immutability tests pass.
- [ ] Fast tests, strict check and the existing exhaustive sweep pass; evidence distinguishes existence checks from independent answer validation.

## Completion evidence

Not yet recorded. Add the actual changes, command results, checks and code reference here before setting this ticket to `done` in the tracker. Follow the [completion rules](README.md#working-and-completing-tickets).
