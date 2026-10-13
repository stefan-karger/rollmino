# T17. Consolidate the current maintenance documentation

[Tracker and priority](README.md) | Blockers: none

Before this ticket replacement, the review counted 31 Markdown files and 3,397 lines. Scope, decisions, interactions, test plans, handoffs and evidence repeat the same contract. The implementation plan still contains historical slice and command instructions.

Files: README.md, AGENTS.md, CODING_GUIDELINES.md, IMPLEMENTATION_PLAN.md, PROMPT_FOR_AGENT.md, active docs summaries and links in this batch.

## Work and checks

1. Create one concise current contract. Preserve exact rules/contact groups, hidden Start, timing, anchors/input, full active Undo, terminal completion, ranked/practice behavior, records/storage faults, reload and static hosting.
2. Retain short setup/deployment guidance and agent rules. Merge or remove duplicated scope/decision/UI/test/handoff documents. Prefer three or four permanent maintenance files totaling about 300 to 450 lines, excluding active tickets; do not discard requirements to meet a quota.
3. Retain source links, known validation regressions, reproducible independent verification, its limits and one dated V1 release reference. Separate historical results from current guidance.
4. Update every local link and agent reading path, including pending tickets. Keep the current verification policy until T24 revises it and provenance directories until T26 executes their removal.

Check relative files/anchors, documented commands against package.json and git diff --check. Compare the retained contract with the accepted plan/decisions before deleting superseded files. Runtime tests are unnecessary for documentation-only edits.

## Acceptance

- [x] One current contract replaces overlapping specifications without changing V1 behavior.
- [x] Setup and agent instructions describe implemented maintenance with no stale slice execution.
- [x] Sources, regressions and actual release/verification limits remain accessible.
- [x] All references work; evidence records retained files and actual size reduction.

## Completion evidence

2026-10-13. Retained four permanent maintenance files: README.md, AGENTS.md, CODING_GUIDELINES.md and IMPLEMENTATION_PLAN.md. They total 297 lines versus 1,056 lines across the ten preceding contract/setup/handoff files, a reduction of 759 lines. The contract path remains unchanged, so pending tickets retain valid specification links. Removed the duplicate prompt and scope/decisions/UI/test/source summaries. Their complete pre-consolidation text remains retrievable at `d74ac8a`.

Compared the old plan and decision table against the retained contract. It preserves all 42 physical faces, shape/orientation/contact tables, malformed-state/solver contracts, hidden fresh/practice phases, background/confirmation/Undo time, occupied anchors/geometric transforms, pointer cancellation/source regions, keyboard/focus, terminal completion, record ranking/ties/fields/faults/clearing/reload, exclusions and static deployment. Literal regression history, independent oracle method/limits, source/rights caveats and the dated V1 hosted run are retained. Historical evidence and provenance stay separate until T26. The full runtime/build verification policy remains unchanged until T24.

Added `pnpm run check:docs` with a dependency-free local file/anchor and documented-script checker. It passed all 21 maintained/historical Markdown files and 98 local links before this evidence update. A temporary missing-file link caused the expected failure, then restoration passed. Updated historical introductory links/wording without deleting their experiments. `git diff --check` passed. Runtime/browser tests were not repeated for this documentation and checker change; no app behavior or dependency changed.
