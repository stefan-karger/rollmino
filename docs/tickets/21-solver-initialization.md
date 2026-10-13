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

- [x] Normal browser startup performs no solver candidate construction.
- [x] The reference solver preserves fixed placements and returns null for legal dead ends.
- [x] All 62,208 answers pass the independent oracle and fixtures remain unchanged.
- [x] Evidence confirms the initialization change and passing artifact checks.

## Completion evidence

2026-10-13. Ran all 60 fast tests before editing the reference and inspected candidate construction, committed-state validation and fixtures. Moved the unchanged 625-candidate construction into a private `candidatesByCell()` function in `engine/core.ts`. Only `solve` calls it, after setup/fixed-state validation. A private retained array serves subsequent solves. No new module, API or generalized cache was added; dice, shapes, orientations, contacts, validation, masks and fixtures remain unchanged.

All 60 fast tests passed afterward, including malformed-state contracts, fixed placements/input immutability and the legal B6 dead end. Frozen installation and strict build passed. The production bundle contains no `Array.from` candidate-array initialization expression or top-level candidate loop; the unused solver-only construction is removed by the build. JS fell from 19,967 to 19,626 bytes, a 341-byte reduction. This is inspected unused-work/bundle evidence, not a measured startup/phone-speed claim.

The full policy gate passed: all 93 development cases in 2.5 minutes, all five root/subpath artifact cases in 12.5 seconds, and all 62,208 independent Wizard answer checks in 32.63 seconds. Documentation checks and `git diff --check` passed. No assistance appears in gameplay, and no physical-device or screen-reader check was performed.
