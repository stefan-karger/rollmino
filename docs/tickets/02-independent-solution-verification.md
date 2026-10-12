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

- [ ] Deliberately invalid answers fail the oracle and valid fixtures pass.
- [ ] Every exhaustive answer receives an independent occupancy/contact check.
- [ ] The sweep passes for exactly 62,208 boards without changing the physical model.
- [ ] Evidence states the oracle's limits, including reuse of orientation data.
- [ ] No oracle/archive code enters the runtime and the fast default test does not run the exhaustive sweep.

## Completion evidence

Not yet recorded. Add the actual changes, command results, checks and code reference here before setting this ticket to `done` in the tracker. Follow the [completion rules](README.md#working-and-completing-tickets).
