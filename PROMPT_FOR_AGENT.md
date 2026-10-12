# Future implementation handoff prompt

Use this prompt when requesting implementation. The plan is already complete.

Implement Rollmino V1 according to `IMPLEMENTATION_PLAN.md`. Read `AGENTS.md`, `CODING_GUIDELINES.md` and the active handoff documents first. The user confirmed the contract on 2026-10-12; do not repeat the requirements interview or infer another stack from the archived research.

The product is a free English-only always-timed solo puzzle, with a phone-first dark UI and the same centered layout on desktop. Start reveals the hidden puzzle. Background time and Undo count. Fresh rolls can rank; deliberate Replay is timed practice and returns to hidden ready before Start. Completion freezes the run. Reload abandons unfinished play.

Use the agreed plain TypeScript/Vite/SVG/CSS stack with native HTML controls, Node tests and Playwright. Preserve the literal physical dice, nine-piece geometry, 28 orientations and five contact-rule groups. Repair the documented malformed-state defects before relying on completion. Reuse the canonical engine and deterministic fixtures; archives are provenance only.

Deliver immediate tap placement, required touch/mouse dragging, real Rotate/Flip transforms with occupied anchors, keyboard play, removal/own-slot return and unlimited active-run Undo without Redo. Implement the confirmed abandonment/replay/level-change behavior and best-five local records per difficulty. Store only elapsed milliseconds and completion timestamps. Handle unavailable storage without preventing play.

Pick ready tickets from `docs/tickets/README.md` and follow their scoped steps/checks, preserving the plan's playable milestones. Mark a ticket done in the central tracker only after recording actual completion evidence in its file. Verify the production artifact at both the root and `/rollmino/` path. Prepare the Pages workflow for public `stefan-karger/rollmino`. Use original artwork and no official logos. Keep code cohesive under the adopted KISS/YAGNI policy; no backend, hints, PWA, Android package or speculative architecture.

Update documentation with actual commands/results. Tests executable here are sufficient for the release gate. State any unavailable browser/hardware checks honestly; do not add a required physical-phone gate or claim unperformed device tests. Report completed behavior, verification and material limitations, with a concise list of any accepted deviations from the plan.
