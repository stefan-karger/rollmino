# T04. Implement geometric transforms with occupied-cell anchors

[Tracker](README.md) | [Product specification](../../IMPLEMENTATION_PLAN.md) | [Coding guidelines](../../CODING_GUIDELINES.md)

## Blockers

None.

Plan coverage: sections 3, 6 and 12; geometry part of Slice 1.

## Outcome

Tap and drag consumers can rotate/reflect a piece and its occupied anchor predictably, using canonical geometry rather than orientation index stepping.

## Scope and files

Add small pure helpers to `engine/core.ts` and `tests/transforms.test.mjs`; add `test:transforms`. Preserve the existing orientation-generation order and fixtures. T01 also edits the core, so coordinate or sequence those edits even though there is no functional dependency.

## Implementation steps

1. Implement screen-clockwise rotation `(x,y) -> (-y,x)` and left/right reflection `(x,y) -> (-x,y)`.
2. Transform occupied cells and the local occupied anchor together. Subtract the transformed shape's minimum x/y from both; match the normalized cells to the canonical orientation.
3. Return only the geometry/orientation/anchor information actual selection/drag consumers need. Do not add a transform class, alternate board model or DOM code.
4. Provide the row-major first occupied square for tap selection. Bounding-box holes, especially in yellow/red, must never become a tap anchor.
5. Test every orientation and every occupied anchor. Verify literal clockwise/reflection examples as well as four-rotation and two-flip closure. Cyan/red must reach reflected geometry.
6. Test symmetric pieces too. A canonical orientation may remain unchanged while the transformed local anchor changes; do not discard anchor updates just because the orientation index is equal.
7. Ensure the caller can preserve a world anchor by setting origin to `targetCell - localAnchor`. Commit/legality remain outside these helpers.

## Verification

```bash
pnpm run test:transforms
pnpm test
pnpm run typecheck
```

Add `test:transforms` as `node --experimental-strip-types --test tests/transforms.test.mjs`. Review that existing orientation indices and fixture data did not move. If changing orientation generation/solver logic proves necessary, document why and also run `pnpm run verify:all`; ordinary helper additions should preserve both.

## Done when

- [x] Rotate/Flip use the stated geometric formulas with normalization.
- [x] All transformed anchors remain occupied and closure tests recover the original geometry/anchor.
- [x] Literal direction tests and chiral reflection tests pass.
- [x] Existing orientation order, shape counts and fixture solutions are unchanged.
- [x] Helpers are pure, narrowly exported and tested without DOM initialization.

## Completion evidence

2026-10-13: Added pure `firstAnchor` and `transformPiece` helpers in `engine/core.ts`, plus exhaustive occupied-anchor closure, literal direction, chiral reflection, symmetry and hole tests in `tests/transforms.test.mjs`. Orientation generation and fixture data are unchanged. `pnpm run test:transforms` passed 3 tests; `pnpm test` passed 47 tests; `pnpm run typecheck` passed. Environment: Windows, Node 24.15.0, pnpm 12.10.0. No DOM or solver behavior changed.
