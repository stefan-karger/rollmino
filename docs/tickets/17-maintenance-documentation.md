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

- [ ] One current contract replaces overlapping specifications without changing V1 behavior.
- [ ] Setup and agent instructions describe implemented maintenance with no stale slice execution.
- [ ] Sources, regressions and actual release/verification limits remain accessible.
- [ ] All references work; evidence records retained files and actual size reduction.

## Completion evidence

Add dated implementation and verification results before marking the tracker done.
