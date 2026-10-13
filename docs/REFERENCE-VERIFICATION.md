# Reference engine and verification evidence

Historical reference audit. Current maintenance follows the [contract](../IMPLEMENTATION_PLAN.md#verification); V1 is implemented and published. This file records earlier experiments and is retained until T26's archival cleanup.

## Model invariants

- Nine piece IDs cover 29 cells.
- Rotation/reflection deduplication produces 28 orientations.
- There are 625 in-bounds piece/orientation candidates on an unobstructed 6 by 6 board.
- Seven dice have six physical faces each, including repeated faces.
- Their disjoint distinct-coordinate sets partition 36 cells.
- There are 279,936 ordered face-index outcomes and 62,208 distinct blocker boards, with nonuniform board probabilities.

## What the existing checks establish

The maintained [exhaustive script](../scripts/verify-all.mjs) finds a non-null Wizard solution for each of the 62,208 boards and validates every answer through [tests/oracle.mjs](../tests/oracle.mjs). The checker uses a 6 by 6 cell array and direct coordinates to verify nine known unique IDs, integer orientations/coordinates, bounds, seven distinct blockers, overlaps, 29 piece cells, complete coverage and restricted edge contacts. It also compares any fixed placements with the answer.

The oracle imports only canonical orientation data from the engine. It does not call `canPlace`, `isSolved`, `validateDice` or use the engine's masks. Its restriction groups and ID list are separate literal expectations. [The core tests](../tests/core.test.mjs) guard the shared orientation data through literal base shapes, orientation counts and fixture ordering. [The oracle tests](../tests/oracle.test.mjs) reject deliberately broken answers and verify allowed diagonal/unrestricted contact and fixed-placement preservation.

The archived experiment tries lower levels only if Wizard fails. No Wizard failures occurred. It therefore does not provide separately executed exhaustive sweeps at the other levels. A valid Wizard solution satisfies every other level because all their restricted pairs are contained in Wizard's group. Master and Expert are nevertheless incomparable to one another.

On 2026-10-12, an additional handoff review audit checked all returned solutions with a separate cell-array checker for IDs, bounds, blockers, overlap, coverage and Wizard edge contact. All 62,208 passed. That checker reused canonical orientations and was a transient audit. T02 now supplies the maintained checker and command. [TEST-RESULTS.md](TEST-RESULTS.md) records both runs and their limits.

## Reproduce the maintained checks

```bash
pnpm test
pnpm run test:rules
pnpm run verify:all
pnpm install --frozen-lockfile && pnpm run typecheck
```

The archived log is historical evidence, not a substitute for rerunning the canonical engine. T01 repaired malformed-state validation and T02 added the independent answer oracle required by [IMPLEMENTATION_PLAN.md](../IMPLEMENTATION_PLAN.md). The fast default suite does not enumerate all boards; `verify:all` is the separate exhaustive command.

The sweep validates one returned solution per board. It does not count all solutions, measure human difficulty or enumerate all partial positions. The oracle verifies seven distinct in-board blocker coordinates; literal core tests and physical-die enumeration establish their physical model. Shared orientation data limits independence. These reference checks alone do not certify physical accuracy, browser input, storage, accessibility, layout or real devices. Browser/release evidence is separate in [TEST-RESULTS.md](TEST-RESULTS.md).
