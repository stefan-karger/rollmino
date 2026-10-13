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

- [ ] Removed tests are exact overlaps with identifiable retained coverage.
- [ ] Literal regressions, independent oracle checks and solver failure/immutability contracts survive.
- [ ] Tests read more clearly without a framework or shared implementation expectations.
- [ ] Evidence records coverage comparison and passing commands.

## Completion evidence

Add dated implementation and verification results before marking the tracker done.
