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

- [ ] Draft movement updates only related preview/control state.
- [ ] Records stay stable during dragging/ticks and refresh on actual record/level changes.
- [ ] T15/T16 regressions and native touch/capture/focus checks remain effective.
- [ ] Evidence explains the simpler responsibilities and observed DOM reduction.

## Completion evidence

Add dated implementation and verification results before marking the tracker done.
