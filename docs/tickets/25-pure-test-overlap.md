# T25. Consolidate overlapping pure tests

[Tracker and priority](README.md) | Blockers: none

The pure suite took about 588 ms. Own-footprint/solved-state cases overlap, and core/oracle tests repeat solver fixture/fixed-placement loops. Large cuts would save little time and risk useful coverage.

Files: tests/core.test.mjs, tests/oracle.test.mjs, tests/transforms.test.mjs and existing fixtures only if required.

## Work and checks

1. Merge exact duplicates where readable. Retain named historical false-win/sparse-dice/unknown-level regressions, literal tables, contact groups, geometry/anchors and malformed-state contracts.
2. Consolidate repeated positive solver matrices while preserving independent legality, fixed placements, input immutability and output-alias checks. Keep the legal dead end distinct.
3. Move repeated whole-orientation immutability snapshots outside the anchor loop if simpler. Coordinate with T19's arithmetic-tautology removal.
4. Keep session/record tests and the oracle's separate literal IDs/groups. Avoid a generalized case-builder and implementation-derived expectations.

Run pnpm test before and after and compare behaviors, not counts alone. Run pnpm run verify:all if oracle behavior/solution validation changes; strict checking if TypeScript changes. Record modest actual savings honestly.

## Acceptance

- [x] Removed tests are exact overlaps with identifiable retained coverage.
- [x] Literal regressions, independent oracle checks and solver failure/immutability contracts survive.
- [x] Tests read more clearly without a framework or shared implementation expectations.
- [x] Evidence records coverage comparison and passing commands.

## Completion evidence

2026-10-13. Merged four overlapping core tests with identifiable retained checks. Valid/truncated/wrong-die validation is now in the richer malformed-dice matrix. Other-piece collision and own-footprint movement share one test, retaining the navy/brown collision and multi-cell self-overlap/no-op/immutability cases. Full-count blocker false wins are in the exact-ID/coverage test, whose missing-ID loop already checks incompleteness. The four named historical false-win/sparse-dice/unknown-level regressions remain unchanged.

Removed three redundant empty-solver calls from fixture replay and the core's 12-case positive fixed-placement solve matrix. The existing independent oracle matrix covers all three fixtures, five levels and fixed counts 0/1/4/9. It now freezes every input and checks returned-placement aliases after independent legality/fixed-position validation, retaining and broadening the removed matrix's contracts. Literal fixture placement through `canPlace`/`isSolved`, positive wins at all levels, non-enumerable fields and the distinct legal dead end remain. The oracle's implementation and separate literal IDs/groups are unchanged. Transform tests capture one orientation snapshot outside the anchor loop while still comparing immutability after every anchor. No case-builder was added; session/record tests are unchanged.

Before edits `pnpm test` passed 72 tests in 1.698 seconds; afterward all 68 passed in 0.871 seconds. Earlier unchanged 72-test runs were about 0.88 seconds, so this pair does not establish a stable whole-suite speedup. The concrete reduction is 15 duplicate solver calls plus repeated snapshot creation; the main benefit is clearer ownership of coverage. Documentation checks and `git diff --check` passed. No TypeScript, runtime or oracle behavior changed, so strict/browser/exhaustive checks were not repeated for these pure-test edits under the T24 policy.
