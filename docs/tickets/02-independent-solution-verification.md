# T02. Validate every exhaustive solver answer independently

[Tracker](README.md) | [Product specification](../../IMPLEMENTATION_PLAN.md) | [Coding guidelines](../../CODING_GUIDELINES.md)

## Blockers

- [T01](01-rule-validation.md)

Plan coverage: sections 4 and 12; completes Slice 0.

## Outcome

The maintained exhaustive command checks legality of every returned solution for all 62,208 Wizard blocker boards.

## Scope and files

Add `tests/oracle.mjs` and `tests/oracle.test.mjs`; update `scripts/verify-all.mjs`, package scripts and reference evidence docs. Reuse canonical orientation data and `fixtures/rolls.json`. Do not put the oracle into browser/runtime code.

## Implementation steps

1. Build a small test-only cell-array validator for a game and full solution. Require exactly nine known, unique IDs with valid orientations/integer coordinates. Expand their cells and reject bounds errors, blockers, overlaps, gaps and forbidden edge contacts.
2. Use direct coordinates/occupancy arrays rather than `canPlace`, `isSolved` or their BigInt masks. Compare any fixed placements with the returned answer. Reusing orientation data is allowed; literal geometry tests from T01 separately guard that data.
3. Test the validator with intentionally broken answers: duplicate/missing/unknown IDs, bad orientation, out-of-bounds cells, a blocker overlap, piece overlap, wrong coverage and a forbidden contact. Confirm it accepts valid fixtures and allowed diagonal/unrestricted contact.
4. Change the exhaustive loop to require a non-null answer and validate that answer on every board. Keep deterministic enumeration and assert exactly 62,208 checks. Deduplicating per-die coordinates is appropriate for exhaustive enumeration only; do not change physical roll sampling.
5. Add `test:rules` as `node --experimental-strip-types --test tests/core.test.mjs tests/oracle.test.mjs`. Retain `verify:all` as the slower non-default command.
6. Record the actual strengthened run in `docs/REFERENCE-VERIFICATION.md` and `docs/TEST-RESULTS.md`. Wizard solutions imply solvability for the other levels; the historical lower-level loops did not run separately.

## Verification

```bash
npm run test:rules
npm test
npm run typecheck
npm run verify:all
```

Inspect imports to confirm that the oracle does not delegate legality to the engine checks it verifies. Failure output should identify the roll and the invalid answer condition.

## Done when

- [x] Deliberately invalid answers fail the oracle and valid fixtures pass.
- [x] Every exhaustive answer receives an independent occupancy/contact check.
- [x] The sweep passes for exactly 62,208 boards without changing the physical model.
- [x] Evidence states the oracle's limits, including reuse of orientation data.
- [x] No oracle/archive code enters the runtime and the fast default test does not run the exhaustive sweep.

## Completion evidence

Completed checks on 2026-10-12, Windows, Node 24.15.0, npm 11.12.1 and TypeScript 5.8.3. [Detailed results](../TEST-RESULTS.md#t02-implementation-verification) and [verification method/limits](../REFERENCE-VERIFICATION.md).

- [tests/oracle.mjs](../../tests/oracle.mjs) independently validates answer IDs, geometry, bounds, blockers, overlap, coverage, restricted contacts and fixed-placement preservation with direct coordinates and a cell array. Failures name the roll and condition. Its only engine import is canonical orientation data.
- [tests/oracle.test.mjs](../../tests/oracle.test.mjs) adds 14 tests for valid fixtures, solver answers with fixed placements, deliberately invalid answers, forbidden contacts, allowed diagonal/unrestricted contact and coverage-gap fault injection. The shared geometry fault is restored immediately in `finally`.
- [scripts/verify-all.mjs](../../scripts/verify-all.mjs) validates every returned answer before counting the board, retains deterministic per-die enumeration and asserts 62,208 checks. [package.json](../../package.json) adds `test:rules`; the fast default suite remains separate from exhaustive verification.
- `npm run test:rules` and `npm test` each passed all 44 tests without skips. `npm run typecheck` and `git diff --check` passed. `npm run verify:all` independently validated all 62,208 Wizard answers in 29.17 seconds.
- README and the active reference/test documents now describe the maintained independent checks. The physical model, roll sampling, orientation indices, fixtures and archives remain unchanged.

The oracle reuses canonical orientations guarded by T01's literal tests. The sweep establishes one valid returned answer per encoded board, not counts, human difficulty, all partial-state behavior or independent physical-source certification. Other levels follow from Wizard's stronger contact restrictions; separate exhaustive lower-level sweeps were not run. No browser/runtime imports of the oracle exist, and no browser/device/screen-reader testing is claimed.
