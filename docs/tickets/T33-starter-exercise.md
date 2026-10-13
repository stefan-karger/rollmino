# T33: untimed Starter exercise

Created on 2026-10-13 from the user's accepted onboarding plan. The [tracker](README.md) owns blockers and status. Read [the accepted revision](../../IMPLEMENTATION_PLAN.md#accepted-home-and-tutorial-revision), [T29's concrete exercise](T29-onboarding-and-home.md#concrete-starter-exercise) and T32's recorded tutorial evidence before implementation.

## Problem and scope

The explanation needs a short opportunity to use real controls without time pressure. Implement the mostly completed Starter exercise with six prepared fixed pieces, three learner pieces, Rotate/Flip, Undo, recovery and exact full-board completion.

Reuse canonical rules/transforms and current board/tray/input behavior. A cohesive tutorial controller is justified by steps, checkpoints and history; a second rules engine, generic lesson framework, ordinary-game hint system or paused ranked run is not.

Relevant implementation and checks are [core.ts](../../engine/core.ts), [session.ts](../../src/session.ts), [app.ts](../../src/app.ts), [the existing fixture](../../fixtures/rolls.json), [the independent oracle](../../tests/oracle.mjs), [transform tests](../../tests/transforms.test.mjs), [session tests](../../tests/session.test.mjs) and [input browser cases](../../e2e/input.spec.ts).

## Exercise data and intended path

Use `opening-seed` as verified planning evidence, interpreted at Starter. Its physical-die order is A1, B2, C3, F2, D6, E5, A6. Prepare these canonical placements:

| Piece | Orientation | x | y |
| --- | ---: | ---: | ---: |
| navy | 0 | 4 | 5 |
| yellow | 3 | 2 | 0 |
| purple | 0 | 0 | 1 |
| orange | 0 | 2 | 3 |
| red | 0 | 1 | 4 |
| green | 0 | 0 | 3 |

The six pieces cover 19 squares, leaving ten empty cells and Brown domino, Grey line and Cyan L in the tray. Ship intentional lesson data only, without importing the test fixture collection or oracle into runtime.

1. Select Brown domino and tap B1, filling B1/C1.
2. Undo that placement, then place Brown at B1 again.
3. Select Grey line, Rotate once and tap F3, filling F3 through F6.
4. Select Cyan L, Flip once, Rotate twice and tap E3. The transformed anchor is its bottom square; coverage is E1/F1/E2/E3.
5. Validate and celebrate the completed exercise. Equivalent transformations and correct early/out-of-order finishes are accepted.

## Acceptance

- Enter from the tutorial's working exercise action. Display Starter and explain the fixed prepared pieces. The six cannot move or enter learner Undo history; their labels/content remain readable and the grid remains navigable.
- The lesson has no timer, RNG draw, record insertion or active ordinary game behind it. Normal replay practice stays timed and unranked.
- One controller owns committed lesson placements. Use canonical `canPlace`, geometric anchor transforms and exact solved-state validation, preserving dense dice, IDs, geometry, blockers, overlap and coverage requirements.
- Use the actual tap/keyboard/native pointer placement and transform behavior, with no mandatory drag. Prepared cells cannot be moved through pointer, keyboard, Remove, own-slot return or Undo. The learner's three pieces retain normal legal move/removal behavior.
- Guide the intended tasks using text and distinct target highlights. Targets cannot impersonate the inset white restriction outlines; Starter has no restricted-piece marks.
- Successful learner actions commit once and retain history after the prepared baseline. Undo reverses successful actions without changing fixed placements. Invalid/no-op/cancelled attempts preserve committed play/history and do not advance the lesson.
- Legal off-step moves commit. Explain the requested task and offer Reset step rather than rejecting the move. Accept equivalent transformation sequences; progress reflects the actual task outcome, not orientation-index stepping or a mandatory click sequence.
- Reset step restores its board/history checkpoint and clears draft/gesture while retaining the six prepared pieces. Redo restores the initial baseline. Neither action enters normal-game history or records.
- A legal complete board ends successfully even if the learner skipped or reordered guidance. Freeze lesson editing at completion, with Play, Review tutorial and Redo exercise. Do not withhold success from a solved board to demand the example's exact input order.
- Home exits at any point. Tutorial Play prepares fresh hidden ordinary ready at the page's ordinary selected level; lesson targets, placements, draft and history are cleared. Start still controls the first ordinary RNG draw and timing.
- Preserve source/grab anchors, cancellation/late-event protection, stable focus, scoped shortcuts, polite outcome/instruction feedback and reduced motion. Complete the intended exercise with taps and keyboard, with representative existing native pointer coverage retained.
- Independently check the literal prepared state, fixed-placement preservation and complete answer with the oracle. No reference solver call or mutable test API enters runtime, preview or completion.

## Verification

Run fast tests before any reference-data change. Use the [single verification policy](../../IMPLEMENTATION_PLAN.md#verification) with actual paths. New lesson modules/specs are unknown paths under the current selector, so expect the full sequence: frozen install, `pnpm test`, `pnpm run build`, `pnpm run test:e2e`, `pnpm run test:e2e:prod` and `pnpm run verify:all`, plus documentation checks and `git diff --check`.

Add meaningful pure checks for the fixed baseline, transactions, Undo/checkpoints, off-step legality, terminal completion and controller isolation. Verify the proposed answer with the independent oracle, including retained fixed placements. Add public-control tap/keyboard completion, representative pointer/cancel/focus tests, zero-record effects across time passage and clean transition to ordinary play. Build before both artifact mounts and run Playwright sequentially; retain artifact exclusions for test/provenance content.

Record actual dated commands/results, lesson behavior and limits before checking acceptance and changing tracker status. T29's planning script proved the proposed geometry; it did not test this controller, Undo/reset or browser lesson and is not a substitute for these checks.
