# T15. Fix click suppression after cancelled dragging

[Tracker and priority](README.md) | Blockers: none

The review reproduced a consumed Start click in Chromium and Firefox. Cancellation sets suppressClick; release outside the widget never clears it, and ready-state pointer-down returns before the reset. The same probe worked on its first click in WebKit.

Files: src/app.ts, e2e/input.spec.ts and existing helpers as needed.

## Work and checks

1. Add a failing native-input regression: Start, begin dragging navy, press Escape while holding the mouse, release outside the game widget, choose New game, confirm, then click Start once. Require seven blockers and active play.
2. Scope suppression to the ending gesture and reset it on a new primary interaction. Preserve secondary-pointer handling and suppression of the trailing compatibility click after a real drag.
3. Check subsequent tap/keyboard play and ready transitions. Avoid timers, global event blocking and production test APIs.

Run pnpm test, pnpm run build and the focused input suite in desktop Chromium, Firefox and WebKit. Recheck native touch and drag completion's single commit/record. Observe the regression fail before repair.

## Acceptance

- [x] The reproduction starts on its first click in the affected engines.
- [x] Cancelled dragging preserves committed placements/history and permits subsequent play.
- [x] Trailing compatibility clicks never create a second action or record.
- [x] Evidence records the failing regression and passing native-input checks.

## Completion evidence

2026-10-13: the standalone retry `pnpm run test:e2e --workers=1` passed all 212 applicable cases in 11.9 minutes, with eight expected skips for CDP cases outside mobile Chromium. This includes the Start regression in all five projects, all cancellation paths, native mouse capture/anchors, native Chromium touch with secondary input/cancellation/scrolling, and single-record drag completion. The earlier socket error did not recur. Combined with the passing frozen installation, 59 pure tests, strict build, ten production cases and 62,208 independent answer checks below, this completes the local gate. `git diff --check` passed. No physical-device or screen-reader claim is added.

## Implementation and blocked verification

2026-10-13, Windows workspace, Node 24.15.0 and pnpm 12.10.0. Added the native mouse reproduction in `e2e/input.spec.ts`. Before repair, Chromium and Firefox revealed zero blockers after the first Start click, failing the expected seven-blocker assertion. WebKit passed. In `src/app.ts`, a new primary pointer-down now clears stale suppression before the running/dialog guards. Secondary pointers and held gestures still return before resetting suppression. Drag-release compatibility clicks remain suppressed.

Actual checks:

- `pnpm install --frozen-lockfile` passed with no lockfile/dependency changes.
- `pnpm test` passed all 59 tests before and after repair.
- `pnpm run build` passed strict checking and the production build.
- The focused input suite across desktop Chromium/Firefox/WebKit and mobile Chromium reported 75 passes, six expected CDP skips and three trace-file errors. The production suite was mistakenly started concurrently against the same `test-results/` directory, removing active trace files. Those errors are not gameplay assertion failures, but the run is not a passing gate.
- `pnpm run test:e2e:prod` passed all ten checks against the preceding build.
- `pnpm run verify:all` independently validated all 62,208 Wizard answers in 32.05 seconds.
- A subsequent standalone `pnpm run test:e2e` passed the new Start regression in desktop Chromium, Firefox and WebKit. It also passed native drag completion/single-record checks in Chromium and Firefox. However, Chromium's existing self-overlap case timed out before app initialization. Its Level selector had no options, and the browser trace reported `connect failed: 10055` from `net/socket/tcp_socket_win.cc`. The suite was interrupted after identifying this environmental blocker, as requested by the user. No full-suite pass is claimed.

The failed run's trace was at `test-results/input-multi-cell-moves-can-overlap-their-own-old-footprint-desktop-chromium/trace.zip`; the passing retry replaced that ignored output directory. Windows socket error 10055 indicated unavailable socket buffer/resources. The observed connection counts did not establish a specific resource leak or port-exhaustion cause. The user authorized retrying, and a standalone one-worker run passed without an operating-system restart. No later ticket had started at the interruption. Physical-device and screen-reader checks were not performed.
