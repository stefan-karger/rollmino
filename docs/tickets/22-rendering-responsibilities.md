# T22. Limit rendering to the state that changed

[Tracker and priority](README.md) | Blockers: [T15](15-cancelled-drag-click-suppression.md), [T16](16-tray-orientation-geometry.md)

Every drag movement calls the complete render, including records, rule/mode text and committed board markup. A 20-step drag replaced an unchanged records list 21 times. Gesture exceptions keep touch source nodes mounted. Bug regressions must protect this refactor first.

Files: src/app.ts, current input/layout/record tests and a small board module only if ownership becomes clearer.

## Work and checks

1. Give committed board/tray, draft/ghost feedback and records updates direct responsibilities. Begin in the current file; avoid stores, event buses, renderer adapters and generic dirty flags.
2. Update records on initial load, level changes, insertion and clearing. Pointer movement and timer refresh must not replace unchanged records.
3. Keep HTML controls, capture sources and board geometry stable. Derive committed content from the existing authoritative game; drafts remain transient.
4. Preserve selection, transforms, cancel/restore, single release commits, focus, confirmations and any completed T20 feedback.

Run pnpm test, pnpm run build, native input checks, representative records/layout tests and production checks. Use a bounded observation to confirm a multi-step drag no longer replaces unchanged records; avoid fragile DOM-operation quotas.

## Acceptance

- [x] Draft movement updates only related preview/control state.
- [x] Records stay stable during dragging/ticks and refresh on actual record/level changes.
- [x] T15/T16 regressions and native touch/capture/focus checks remain effective.
- [x] Evidence explains the simpler responsibilities and observed DOM reduction.

## Completion evidence

2026-10-13. Kept rendering in `src/app.ts` with three direct responsibilities: committed game/tray updates, draft/ghost/control updates and records updates. The axes, background and board-coordinate group now mount once, with separate committed and ghost groups. Successful transactions/run transitions update committed content; selection, focus, transforms, pointer movement and rejection/cancellation update only drafts. Records refresh on initial load, changed level, ranked insertion and selected clearing. Timer ticks update only time. No store, adapter, event bus, generic dirty flags or second game was added.

The bounded native regression failed before repair because a records row detached during a 20-step drag. After repair the same records row, committed numbered-piece node and occupied capture source remained connected through dragging and a five-second clock advance. An invalid blocker drop also preserved those committed nodes. Changing level deliberately refreshed the row and showed the other level's record. This demonstrates stable unrelated DOM without prescribing a fragile operation quota. The old gesture-specific tray-render exception is unnecessary because draft updates do not rebuild capture sources.

Strict checking first caught a session narrowing issue, corrected before browser verification. The final build passed. All 12 focused stability/T15/T16/native-touch cases passed in 34.1 seconds. Frozen installation and 60 pure tests passed. All 94 development cases passed in 2.5 minutes, including records insertion/clear/faults, native desktop capture/transforms/cancel, native mobile CDP touch and T20 phone feedback. All five artifact cases passed in 12.3 seconds; all 62,208 independent answers passed in 30.51 seconds. Documentation checks and `git diff --check` passed. No physical-device or screen-reader claim is added.
