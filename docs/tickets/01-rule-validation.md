# T01. Harden rules and committed-state validation

Package-manager migration on 2026-10-12: commands in historical results below are current pnpm equivalents. Those earlier runs used the previous package manager; their original commands are preserved in commit `df3e241`. [Actual pnpm verification](../TEST-RESULTS.md#pnpm-migration-verification).

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
pnpm install --frozen-lockfile
pnpm test
pnpm run typecheck
pnpm run verify:all
```

At this point the exhaustive script may still check answer existence only; T02 owns its stronger oracle. Check literal 42-face data/multiplicities, the exact 36-cell partition, nine shapes/29 cells/28 orientations/625 candidates, and all six numbered-piece pairs at all five levels in both placement orders. Cover diagonal, blocker, boundary and unrestricted contact, plus no F-to-A edge wrapping.

Also cover null/missing values, sparse arrays, unknown/prototype-derived IDs, extra keys, fractional coordinates/orientations, overlap and incomplete wins. Reuse all three solutions. Wizard `opening-seed` with navy at B6 is legal but `solve` must return null.

## Done when

- [x] The four reproduced defects have regression tests that failed before repair and pass afterwards.
- [x] Failure behavior follows the contracts above without incidental crashes or false wins.
- [x] Exact model and contact cases pass; fixture orientation order and fair-roll probabilities are unchanged.
- [x] Fixed-placement, dead-end and input-immutability tests pass.
- [x] Fast tests, strict check and the existing exhaustive sweep pass; evidence distinguishes existence checks from independent answer validation.

## Completion evidence

Completed checks on 2026-10-12, Windows, Node 24.15.0, the pre-migration package manager 11.12.1 and TypeScript 5.8.3. [Detailed results](../TEST-RESULTS.md#t01-implementation-verification).

- [engine/core.ts](../../engine/core.ts) adds shared setup/placement guards and validates committed occupancy/contact before placement, completion or fixed-piece solving. Invalid setup throws only through the documented constructor/dice/solver contracts; predicate checks return false. Winning and solver termination require all nine IDs and full coverage. RNG injection rejects invalid numbers.
- [tests/core.test.mjs](../../tests/core.test.mjs) expands the fast suite from 13 to 30 tests. The four required regressions failed before repair and pass afterwards. Literal model tests, all six restricted pairs at five levels in both orders, diagonal/blocker/boundary/unrestricted contacts, malformed state, self-overlap moves, all fixtures, frozen solver input and the legal B6 dead end pass.
- `pnpm install --frozen-lockfile`, `pnpm test`, `pnpm run typecheck` and `git diff --check` passed. The final `pnpm run verify:all` returned answers for all 62,208 Wizard boards in 27.11 seconds and replay-validated one example through the engine.
- Dice order, orientation generation, fixtures and provenance copies remain unchanged. README and the active test summaries now describe the repaired validation and current test count.

The exhaustive loop still checks answer existence. It does not independently validate every returned answer; that is T02. This ticket has no browser UI, and no browser/device/screen-reader checks are claimed.
