# Rollmino agent instructions

V1 is implemented and published. [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) is the single current contract, confirmed on 2026-10-12. The interview is closed. Preserve behavior; identify a concrete conflict before proposing a user-visible revision. Historical material does not override the contract.

## Read and choose work

Read [README.md](README.md), the contract and [CODING_GUIDELINES.md](CODING_GUIDELINES.md), then the [tracker](docs/tickets/README.md), current ticket and completed blocker evidence. Consult [dated live evidence](docs/TEST-RESULTS.md#public-pages-release-verification) for hosting work. Read relevant code/tests/fixtures before edits; run fast tests before reference changes.

Choose the first todo ticket whose blockers are done. Keep status only in the tracker. Record dated behavior, actual commands/results and limits before checking acceptance and marking done. Do not implement without a current user request or repeat completed slices. Shared-file overlap alone is not a blocker.

## Correctness and engineering

1. Preserve six actual faces per die with duplicates, seven distinct physical blockers, nine IDs/29 squares/28 orientations and exact contact groups.
2. Master is not a superset of Expert; diagonal contact is legal. Rotate/Flip transform cells and occupied anchors geometrically, never by index stepping.
3. Keep one committed game, transactional rejection/cancellation and full active Undo. Wins require exact IDs, legal placements and full coverage.
4. Preserve hidden Start, wall time through background/confirmations/Undo, fresh/practice separation, terminal completion and single ranked consideration.
5. Preserve complete tap/keyboard/native pointer play, stable focus, storage notices and selected-level clearing.
6. The reference solver preserves fixed placements and returns null for legal dead ends. Preserve malformed-state regressions and independent checks. No assistance ships.

Use TypeScript/Vite/SVG/CSS/native HTML, Node tests and Playwright. Follow KISS/YAGNI for readable cohesive responsibilities, not mechanical file/dependency minimums. Use pinned pnpm/frozen installs and only `pnpm-lock.yaml`. Avoid backend/auth/generic engines/stores/speculative APIs.

Use original art; never publish official graphics or provenance assets. Correct verified discrepancies with model/tests/evidence. Provenance/checksums remain historical until T26's authorized cleanup.

## Verification and publication

Follow the [verification policy](IMPLEMENTATION_PLAN.md#verification). Until T24 revises it, runtime/build edits require frozen installation, pure tests, strict build, five development projects, both production mounts and 62,208 independently checked answers. Docs-only edits require local-file/anchor/command consistency and `git diff --check`.

Build before production tests, which reuse dist. Run Playwright invocations sequentially. Executable checks here are the gate. Report emulation, synthetic cleanup and CSS reflow honestly; do not invent physical-device/pen/game/screen-reader passes or gates.

PRs cannot publish. Main/manual deployment passes full gates and deploys their tested artifact. Keep read-only build permissions, dependent deployment and non-cancelling serialized publication. Local readiness does not prove deployment. Report concrete blockers and next actions.
