# T34: first-visit offer and repeat tutorial access

Created on 2026-10-13 from the user's accepted onboarding plan. The [tracker](README.md) owns blockers and status. Read [the accepted revision](../../IMPLEMENTATION_PLAN.md#accepted-home-and-tutorial-revision), [T29's first-visit boundaries](T29-onboarding-and-home.md#engineering-and-compatibility-boundaries) and T33's recorded exercise evidence before implementation.

## Problem and scope

Home needs an optional first-visit invitation and a complete route to review or redo the lesson later. Add the one remembered handled-offer flag and finish the repeat walkthrough/exercise entry flow, now that both parts exist.

This is a narrow persistence exception, not saved lesson progress or a settings system. Keep the original three menu positions and the distinction between normal Replay and Redo exercise.

Relevant code is [app.ts](../../src/app.ts), [index.html](../../index.html), [styles.css](../../src/styles.css), the tutorial implementation from T32/T33 and [records.ts](../../src/records.ts) for the existing storage boundaries. Read the [record fault tests](../../tests/records.test.mjs) and [browser record tests](../../e2e/records.spec.ts) before touching storage wiring.

## Acceptance

- With no valid handled-offer flag, Home highlights the optional Tutorial action with short explanatory text. Play remains available immediately; no forced lesson, modal or timer starts.
- Choosing Play or Tutorial handles the offer for the current page and safely saves one flag under a separate versioned local key, such as `rollmino.onboarding.v1`.
- Personal bests alone does not handle the offer. Clearing records neither resets the flag nor touches any other key; the flag never changes the records schema.
- Returning visits retain Home and all three working actions, with ordinary Tutorial styling after a handled offer. No menu actions shift positions when the emphasis disappears.
- Missing/malformed flags are treated as a new visit. Storage getter/read/write failure never blocks menu actions, tutorial or play. Keep page-memory handling for the current visit; private browsing or cleared/unavailable storage can repeat the offer after reload.
- Persist no user identity, level preference, active run, layout, lesson progress, completion score or tutorial timing. A flag does not imply that the player completed or understood the lesson.
- Tutorial always permits reviewing from the first panel or directly trying the exercise. Exercise completion exposes Review tutorial and Redo exercise; replaying examples and redoing the exercise cannot start normal practice or insert records.
- Exit/re-entry starts a clean tutorial/exercise state according to its action. Home is reachable throughout. No repeat access is added inside ready/running/completed game screens or through browser Forward that bypasses safe Home navigation.
- Choosing Play after learning still opens hidden ordinary ready. Restore no lesson placements/history and consume no RNG before Start. Normal play's selected page-local level is preserved; reload resets Starter.
- Verify first/returning visits, ordinary choice, partial tutorial exit, repeated review/redo and faults using public controls. Retain focus, reduced motion, narrow layouts and the game's existing record notices.

## Verification

Use the [single verification policy](../../IMPLEMENTATION_PLAN.md#verification) and actual changed paths. App wiring requires frozen install, `pnpm test`, `pnpm run build`, full `pnpm run test:e2e`, `pnpm run test:e2e:prod`, documentation checks and `git diff --check`. Any new onboarding module/spec is an unknown path today and also selects `pnpm run verify:all`.

Add focused flag read/write/fault and cross-key checks plus a public first-launch/reload/repeat flow. Test Play/Tutorial dismissal separately from Personal bests/clearing. Reuse T33's lesson completion where possible rather than solving every fixture again for each marker assertion. Check both artifact mounts after building and keep Playwright invocations sequential.

Update the implemented persistence/tutorial-entry contract and README. Record actual dated commands/results, observable offer behavior and limits before checking acceptance and changing tracker status. No physical-device or learning-effectiveness claim follows from storage or browser automation tests.
