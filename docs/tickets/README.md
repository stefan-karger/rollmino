# Rollmino ticket tracker

No open tickets as of 2026-10-13. T15 through T26 are complete, with one verified commit per ticket. Their acceptance/evidence and final status table remain in [the completed batch](https://github.com/stefan-karger/rollmino/tree/757746a0b7652cf311b43b0392bfbeadfec7c452/docs/tickets). T27's confirmation-race repair is complete; its failing-before/passing-after regression and full local checks are recorded in [verification evidence](../TEST-RESULTS.md#confirmation-race-repair). The user requested removal of completed ticket files after the batch; this tracker remains the only file here.

[IMPLEMENTATION_PLAN.md](../../IMPLEMENTATION_PLAN.md) is the single current contract. Follow [CODING_GUIDELINES.md](../../CODING_GUIDELINES.md) and the contract's [verification scopes](../../IMPLEMENTATION_PLAN.md#verification). [Performed checks and limits](../TEST-RESULTS.md) distinguish local readiness from hosting.

When new work is authorized, add scoped tickets here and keep their status only in this tracker. Choose the first todo ticket whose blockers are done. Record actual dated checks before marking done; preserve committed play, exact rules, input/time/Undo, practice separation, terminal completion and resilient records. Do not create work from historical optional ideas or repeat completed slices.
