# T21. Remove solver initialization from normal play

[Tracker and priority](README.md) | Blockers: none

The core builds BY_CELL at import time. Its 625-candidate construction loop survives in production JavaScript even though gameplay never calls solve. The review established unused work, not a measured user-visible startup delay.

Files: engine/core.ts, solver-related tests and a solver-only module only if it gives a clearer boundary.

## Work and checks

1. Run fast tests before reference edits. Inspect current candidate construction, fixed-state validation and fixtures.
2. Initialize candidates only when solving is first requested. Prefer a small local change and efficient reuse across the exhaustive sweep; avoid generalized caching/adapters.
3. Preserve exact orientation order, legality/failure contracts, fixed placements, input immutability, legal dead ends and independent answer verification. Keep solver assistance out of gameplay.
4. Inspect built JavaScript to confirm candidate initialization no longer runs on normal app import.

Run pnpm test before and after, pnpm run build, pnpm run verify:all and production root/subpath checks. Record bundle evidence and sweep timing without claiming unmeasured phone/startup improvements.

## Acceptance

- [ ] Normal browser startup performs no solver candidate construction.
- [ ] The reference solver preserves fixed placements and returns null for legal dead ends.
- [ ] All 62,208 answers pass the independent oracle and fixtures remain unchanged.
- [ ] Evidence confirms the initialization change and passing artifact checks.

## Completion evidence

Add dated implementation and verification results before marking the tracker done.
