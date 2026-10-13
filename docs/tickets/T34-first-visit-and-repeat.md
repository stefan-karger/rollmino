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

## Implementation evidence

Executed on 2026-10-13 after T33 was committed and its completed exercise evidence, the accepted persistence boundaries, records implementation/fault tests and affected Home/panel controls were reviewed. Home emphasizes the optional Tutorial and shows brief explanatory text when the separate flag is missing or invalid. Play stays immediately available. Choosing Play or Tutorial handles the offer in page memory and writes only the literal `handled` under `rollmino.onboarding.v1`. Records navigation and selected clearing neither handle nor reset it. Read/access/write failure leaves play and learning available; a reload can offer it again. No identity, lesson progress, level, layout, time or score is persisted.

Tutorial starts at the first panel on every entry/review. Try the exercise is now available from every panel. Existing completion Review tutorial and Redo exercise remain distinct from ordinary Replay and create clean lesson state. The Home invitation uses visibility without changing action placement, and emphasis changes only colors/border. Records/schema/normal timing code is unchanged.

- `pnpm install --frozen-lockfile` passed with no dependencies changed, and 73 fast tests passed before edits. Final `pnpm test` passed 75 cases and `pnpm run build` passed strict TypeScript/Vite.
- New pure cases check exact flag validation, one write per choice, no record/sentinel changes, independent records clearing, reload recognition, missing storage, throwing reads and failed writes with current-page handling.
- `pnpm run test:e2e --grep offer --workers=1 --max-failures=1` passed all 11 cases in 36.5 seconds. The first/returning/repeat flow runs in all five platforms. Shared cases separately check Play with forbidden RNG, records-only non-dismissal, pre/post handling clears, getter/get/set/corrupt faults, direct exercise, reload Starter and narrow reduced-motion Home axe. Existing exercise completion/review/redo coverage is reused rather than adding full solves for marker assertions.
- Collaborative-browser review at 320 by 568 CSS pixels observed the original three actions, cyan optional emphasis, readable invitation and direct first-panel exercise entry. Returning Home hid the invitation and preserved button positions at approximately y=295/351/407 CSS pixels. Only the handled flag was added by this choice. These are desktop-browser CSS observations, not physical-device or learning-effectiveness results.
- The changed-path selector retained pure/build/all-browser/artifact/exhaustive checks for the new onboarding module/spec. The policy remains conservative.

`pnpm run verify:all` independently validated all 62,208 Wizard answers in 50.07 seconds.

`pnpm run test:e2e --max-failures=1` passed all 136 cases without skips in 4.2 minutes. `pnpm run test:e2e:prod` passed all five cases in 8.8 seconds at both mounts against the final build, preserving asset/request exclusions and ordinary timing/practice/record behavior. Acceptance was checked against the implementation and regressions. Documentation consistency and local/staged diff checks passed before commit. No publication, physical-device, pen, screen-reader or learning-effectiveness pass is claimed.
