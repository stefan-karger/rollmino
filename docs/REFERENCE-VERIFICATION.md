# Reference engine and verification evidence

## Model invariants

- Nine piece IDs cover 29 cells.
- Rotation/reflection deduplication produces 28 orientations.
- There are 625 in-bounds piece/orientation candidates on an unobstructed 6 by 6 board.
- Seven dice have six physical faces each, including repeated faces.
- Their disjoint distinct-coordinate sets partition 36 cells.
- There are 279,936 ordered face-index outcomes and 62,208 distinct blocker boards, with nonuniform board probabilities.

## What the existing checks establish

The maintained exhaustive script finds a non-null Wizard solution for all 62,208 boards. It validates one example using `canPlace`/`isSolved`; the exhaustive loop does not yet independently validate each returned placement set.

The archived experiment tries lower levels only if Wizard fails. No Wizard failures occurred. It therefore does not provide separately executed exhaustive sweeps at the other levels. A valid Wizard solution satisfies every other level because all their restricted pairs are contained in Wizard's group. Master and Expert are nevertheless incomparable to one another.

On 2026-10-12, an additional review audit checked all returned solutions with a separate cell-array checker for IDs, bounds, blockers, overlap, coverage and Wizard edge contact. All 62,208 passed. The checker reused canonical orientations and was a transient audit, not a maintained command. [TEST-RESULTS.md](TEST-RESULTS.md) records its environment and limits.

## Reproduce the maintained baseline

```bash
npm test
npm run verify:all
npm install && npm run typecheck
```

The archived log is historical evidence, not a substitute for rerunning the canonical engine. [IMPLEMENTATION_PLAN.md](../IMPLEMENTATION_PLAN.md) first repairs known malformed-state validation defects and adds the independent answer oracle to the maintained exhaustive verifier.

These checks are bounded by the encoded model. They do not certify source-independent physical accuracy, browser input, storage, accessibility, layout, real devices or a finished app. No browser app has been implemented/tested in this planning pass.
