# Rollmino ticket tracker

T15 through T26 are complete, with one verified commit per ticket. Their acceptance/evidence and final status table remain in [the completed batch](https://github.com/stefan-karger/rollmino/tree/757746a0b7652cf311b43b0392bfbeadfec7c452/docs/tickets). T27's [confirmation-race repair](../TEST-RESULTS.md#confirmation-race-repair) and T28's [level-specific square markings](../TEST-RESULTS.md#level-specific-square-markings) are complete with recorded regression and verification evidence. The user requested removal of those completed ticket files after the batch.

| Ticket | Work | Blockers | Status |
| --- | --- | --- | --- |
| [T29](T29-onboarding-and-home.md) | Analyse and plan onboarding, the Starter exercise and Home navigation with the user | None | done |
| [T30](T30-home-and-navigation.md) | Home, original branding and browser Back/Forward with safe game abandonment | T29 | done |
| [T31](T31-personal-bests-screen.md) | Separate Personal bests screen and preserve completion/storage feedback | T30 | done |
| [T32](T32-visual-tutorial.md) | Self-paced illustrated tutorial and exact level comparison | T30 | done |
| [T33](T33-starter-exercise.md) | Untimed three-piece Starter exercise with Undo and Reset step | T32 | todo |
| [T34](T34-first-visit-and-repeat.md) | First-visit tutorial offer, repeat review and redo exercise | T33 | todo |
| [T35](T35-integrated-verification.md) | Final navigation/tutorial/records checks, contract consolidation and readiness evidence | T31, T34 | todo |

[IMPLEMENTATION_PLAN.md](../../IMPLEMENTATION_PLAN.md) is the single current contract. Follow [CODING_GUIDELINES.md](../../CODING_GUIDELINES.md) and the contract's [verification scopes](../../IMPLEMENTATION_PLAN.md#verification). [Performed checks and limits](../TEST-RESULTS.md) distinguish local readiness from hosting.

The user requested this ticket breakdown on 2026-10-13. [The accepted revision](../../IMPLEMENTATION_PLAN.md#accepted-home-and-tutorial-revision) owns the requirements; T29 preserves the analysis and decisions. Choose the next ready implementation ticket from the table. T31 and T32 share the Home prerequisite; shared-file overlap alone adds no dependency. Each ticket includes its own meaningful regressions and verification, with T35 checking the complete result. Ticket creation did not begin implementation or authorize publication. The user subsequently authorized sequential implementation and one commit per completed ticket; publication remains outside this batch.

When new work is authorized, add scoped tickets here and keep their status only in this tracker. Choose the first todo ticket whose blockers are done. Record actual dated checks before marking done; preserve committed play, exact rules, input/time/Undo, practice separation, terminal completion and resilient records. Do not create work from historical optional ideas or repeat completed slices.
