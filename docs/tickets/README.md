# Rollmino follow-up tickets

This is the only ticket status tracker. The user requested this batch on 2026-10-13 after the completed V1 review. Creating tickets does not implement their changes. Preserve the accepted contract in [IMPLEMENTATION_PLAN.md](../../IMPLEMENTATION_PLAN.md) and follow [CODING_GUIDELINES.md](../../CODING_GUIDELINES.md).

Completed T00 through T14 were removed from the working tree. Their instructions/evidence remain in the [V1 Git snapshot](https://github.com/stefan-karger/rollmino/tree/61454115b4cf1310ec0f72e50b3fc5e0ec38dd03/docs/tickets). [Integrated verification](../TEST-RESULTS.md#integrated-v1-local-release-verification) and [public release evidence](../TEST-RESULTS.md#public-pages-release-verification) remain current references.

## Review basis

Review of 6145411 passed 59 pure tests, strict build, 207 applicable browser cases with 8 intentional skips, 10 production cases and all 62,208 independent Wizard answer checks. Additional probes found the two bugs despite those passes. Tickets contain their own reproductions/evidence; the temporary review report is not a prerequisite.

P1 is next work, P2 is worthwhile follow-up, and P3 is optional cleanup. Small changes are local edits; medium changes affect several files or maintenance policy. Choose the first todo row whose blockers are done.

| State | Ticket | Priority | Impact | Size | Blockers / work note |
| --- | --- | --- | --- | --- | --- |
| done | [T15. Fix click suppression after cancelled dragging](15-cancelled-drag-click-suppression.md) | P1 | Next Start can require two clicks | Small | 212 browser cases, 59 pure tests, build, ten artifact cases and exhaustive checks passed; [evidence](15-cancelled-drag-click-suppression.md#completion-evidence) |
| todo | [T16. Fit every tray orientation and its drag regions](16-tray-orientation-geometry.md) | P1 | Grey clipping and invisible drag source | Small to medium | None |
| todo | [T17. Consolidate current maintenance documentation](17-maintenance-documentation.md) | P1 | Less repeated reading and obsolete guidance | Medium | None |
| todo | [T18. Reduce repeated browser-test executions](18-browser-test-coverage.md) | P1 | Faster checks with useful platform coverage | Medium | [T15](15-cancelled-drag-click-suppression.md), [T16](16-tray-orientation-geometry.md), [T19](19-meaningful-test-assertions.md) |
| todo | [T19. Repair weak and brittle test assertions](19-meaningful-test-assertions.md) | P2 | Better regressions and fewer incidental failures | Small | None |
| todo | [T20. Show completion feedback near the board](20-visible-completion-feedback.md) | P2 | Clear finished state on phones | Small | None |
| todo | [T21. Remove solver initialization from normal play](21-solver-initialization.md) | P2 | Avoid unused 625-candidate construction | Small | None |
| todo | [T22. Limit rendering to the state that changed](22-rendering-responsibilities.md) | P2 | Less unrelated DOM work and clearer ownership | Medium | [T15](15-cancelled-drag-click-suppression.md), [T16](16-tray-orientation-geometry.md) |
| todo | [T23. Retain CI diagnostics and cancel stale PR checks](23-ci-diagnostics-concurrency.md) | P2 | Easier debugging and less wasted CI work | Small | None |
| todo | [T24. Scope verification to changes and releases](24-verification-policy.md) | P2 | Avoid release checks for unrelated edits | Medium | [T17](17-maintenance-documentation.md), [T18](18-browser-test-coverage.md) |
| todo | [T25. Consolidate overlapping pure tests](25-pure-test-overlap.md) | P3 | Clearer tests with preserved coverage | Small | None |
| todo | [T26. Remove obsolete research/provenance duplicates](26-historical-material.md) | P3 | Smaller tree with preserved source evidence | Small to medium | [T17](17-maintenance-documentation.md) |

## Working rules

1. Read the ticket, completed blocker evidence and current contract. Set only this table's State to doing, done or blocked; dependency-waiting tickets stay todo.
2. Implement the scoped change with meaningful checks. Tickets give focused checks; the current release policy applies until T24 replaces it. Build before production tests, which reuse that artifact.
3. Add dated completion evidence with changed behavior, actual commands/results and limitations before checking acceptance items and marking the row done. Record actual reduced counts/timings.
4. Preserve committed play, geometric transforms/anchors, full input/timing/Undo, practice separation, terminal completion and resilient records. Keep literal model regressions, independent oracle constants and exhaustive verification.
5. Coordinate shared files directly: T15/T16/T20/T22 touch app input/rendering; T18/T19/T25 touch tests; T23/T24 touch CI. T17 updates all current ticket references if it replaces specification paths. Shared-file overlap alone is not a blocker.
6. Policy/archival revisions belong to their named tickets. Until implemented, existing instructions remain in force. Preserve source/rights and emulation limits concisely and report only performed checks.
