# T30: Home and browser navigation

Created on 2026-10-13 from the user's accepted onboarding plan. The [tracker](README.md) owns blockers and status. Read [the accepted revision](../../IMPLEMENTATION_PLAN.md#accepted-home-and-tutorial-revision), [T29's navigation analysis](T29-onboarding-and-home.md#home-value-and-screen-flow) and the completed [T27 confirmation repair](../TEST-RESULTS.md#confirmation-race-repair) before implementation.

## Problem and scope

The app opens directly on puzzle controls. Add the separate Home screen chosen by the user, visible original branding, Play and a Home action from the game. Browser Back must navigate within the app without pausing, restarting or restoring an abandoned run.

Use native HTML, the current dark layout and original SVG art. Direct page-local screen state and browser History API are sufficient; do not add a router framework or generic store. Add Personal bests and Tutorial menu actions when their destinations are implemented in T31 and T32. Do not add disabled placeholders or claim the full batch is implemented here.

Relevant existing code and assertions are [index.html](../../index.html), [app.ts](../../src/app.ts), [styles.css](../../src/styles.css), [session.ts](../../src/session.ts), [favicon.svg](../../public/favicon.svg), [browser helpers](../../e2e/helpers.ts), [play](../../e2e/play.spec.ts), [accessibility](../../e2e/accessibility.spec.ts) and [production](../../e2e/production.spec.ts).

## Acceptance

- Load/reload shows Home with the original logo/name. Ordinary state is fresh hidden Starter; there is no restored run, timer, Undo history or level preference.
- Play opens hidden ready with level selection and focuses Start. Menu navigation consumes no RNG. Start alone reveals seven physical blockers and begins normal ranked timing.
- Preserve ordinary level selection within this page. Tutorial navigation added later cannot change it; reload still resets it.
- Home from ready/completed discards the prior layout without confirmation. A later Play prepares a fresh roll, including after leaving practice ready.
- Home from running cancels gestures and opens the specific native abandonment confirmation. Cancel preserves committed board/history, eligibility and wall time and restores initiating focus. Confirm discards the run before Home becomes available.
- Browser Back exercises the same running-game transition. Cancellation restores the current history position and prior game focus without starting again or resetting time. Forward cannot restore abandoned placements, history or eligibility.
- Back from root Home can leave the site; repeated internal returns create no duplicate Home loops. Reload at any internal history position returns Home/fresh Starter. Actual navigation away preserves the no-unload-prompt behavior.
- An ordinary run cannot remain active behind Home, Personal bests or Tutorial. History navigation cannot bypass a confirmation or make two screens/controllers active.
- Preserve T27's direct dialog resolution and transactional cancellation under rapid Back/Forward, Escape, Cancel and reopening. Late pointer/dialog events cannot commit into another screen or run.
- Hidden screens remove their controls from focus and the accessibility tree. Home and game entry/return focus is deliberate; the existing grid, shortcuts and completion focus remain stable.
- Home and original mark fit the existing one-column layout at 320 CSS pixels and short/landscape sizes. Actions become usable when initialization completes; no artificial logo delay or unhandled loading placeholder is added.
- Update startup/reload assertions and public-control helpers for the Home to Play to Start flow. Preserve physical face-index seeding and reset the test RNG before Start when needed.

## Verification

Use the [single verification policy](../../IMPLEMENTATION_PLAN.md#verification) with actual changed paths. App wiring requires frozen install, `pnpm test`, `pnpm run build`, `pnpm run test:e2e` and `pnpm run test:e2e:prod`, plus documentation checks and `git diff --check`. New navigation modules/specs are unknown paths today and therefore also select `pnpm run verify:all`; do not narrow the selector as part of this ticket.

Add focused regressions for native Home and browser-history abandonment, cancellation/time/focus preservation, safe Forward, root exit and reload. Reuse representative game completions and retain the existing input/confirmation regressions. Build before artifact tests and run all Playwright invocations sequentially. Use collaborative-browser inspection for original mark/layout review and label viewport resizing as CSS layout inspection.

Update the implemented startup/navigation portions of the contract and README with this change. Record actual dated commands/results, observed behavior and limits before checking acceptance and changing tracker status. Local checks do not establish publication.

## Implementation evidence

Executed on 2026-10-13 in the Windows workspace with Node 24.15.0 and pnpm 12.10.0.

Home uses the original cyan block/blocker favicon as a visible mark. Only Play is added in this slice. Hidden sections remove game controls from focus and accessibility. Play opens fresh hidden ready at the page's ordinary level, with Start focused. The history controller stores screen entries only, reconciles Back before confirmation, restores the initiating control on Cancel, and returns to the root entry on confirmation. Forward creates fresh hidden play. Reload discards the run and reconciles the internal cursor to Home with Starter internally. Returning from practice ready discards its retained dice.

- Read the contract, guidelines, tracker, T29 and completed T27/T28 evidence, then relevant app/session/input/accessibility/artifact code before edits. `pnpm install --frozen-lockfile` and `pnpm exec playwright install chromium firefox webkit` passed without dependency changes. All 68 fast tests passed before implementation and again after runtime changes.
- `pnpm run build` passed strict checking and Vite output for the final code. New navigation paths selected pure/build/full-browser/artifact/exhaustive checks through `node scripts/verification-scope.mjs pull_request` with the actual changed paths. The selector was not changed.
- Focused checks exposed an offscreen native drag source when Home occupied a new row. Putting Home beside the title repaired it; the occupied-anchor regression then passed all three desktop engines. WebKit exposed click-focus differences; retaining the initiating Home control repaired cancellation. The first broad run was interrupted during those repairs and supplies no full-pass claim.
- The final `pnpm run test:e2e` passed all 104 selected cases with no skips in 3.1 minutes. Added scenarios check native Home/browser Back cancellation, board/history/time/focus preservation, hidden-screen semantics, fresh Forward, reload, root site exit after repeated returns, no navigation RNG, rapid dialog/history events and discarded practice ready. Existing pointer, touch, transform, completion, storage, reflow and axe cases remain. After changing the existing keyboard completion to enter Play by Tab/Enter, its focused three-desktop invocation passed all three cases in 42.9 seconds.
- `pnpm run test:e2e:prod` passed all five cases at `/` and `/rollmino/` against the preceding final build, including Home entry, hidden startup, ordinary/practice completion and reload retention. It reused dist.
- `pnpm run verify:all` independently validated all 62,208 Wizard answers in 51.23 seconds. Rules, fixtures and solver were unchanged; unknown navigation paths conservatively required this check.
- T3 collaborative-browser inspection of the built app at 320 by 568 and 667 by 375 CSS pixels verified the original mark, compact heading, vertical landscape scrolling, no horizontal overflow, hidden 36-cell ready, Start entry focus and Play return focus. Initial preview navigation timed out; a fresh collaborative tab using the explicit local preview URL succeeded. This was CSS layout inspection, not a physical-phone check.

Acceptance was checked against the implementation and executable regressions. The final documentation consistency check and `git diff --check` passed before committing. No publication, physical-device, pen or screen-reader pass is claimed. Personal bests and Tutorial destinations remain for their own tickets.
