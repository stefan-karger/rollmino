# Rollmino ticket tracker

This is the single source of ticket status. [IMPLEMENTATION_PLAN.md](../../IMPLEMENTATION_PLAN.md) remains the product specification; tickets divide its execution without changing the agreed scope. Each linked ticket contains its implementation steps, files, blockers, tests and definition of done.

## Pick the next task

Read the table top to bottom. Pick the first `todo` ticket whose listed blockers are all `done`. Start with T00 for repository/local baseline setup. T01, T03 and T04 remain independent code branches; they can continue on the local baseline if T00's GitHub part is blocked. Check `doing` rows before claiming work. Actual readiness follows the table, not a separately maintained list.

| State | Ticket | Blockers | Quick completion check / work note |
| --- | --- | --- | --- |
| `done` | [T00. Create the GitHub repository and synchronize the local workspace](00-repository-setup.md) | None | Public repo/description and main upstream verified on 2026-10-12; baseline 9188f0b |
| `done` | [T01. Harden rules and committed-state validation](01-rule-validation.md) | None | 30 fast tests, strict check and 62,208-board existence sweep passed; [evidence](01-rule-validation.md#completion-evidence) |
| `done` | [T02. Validate every exhaustive solver answer independently](02-independent-solution-verification.md) | [T01](01-rule-validation.md) | 44 fast tests and 62,208 independently checked Wizard answers passed; [evidence](02-independent-solution-verification.md#completion-evidence) |
| `done` | [T03. Establish the strict web build and browser test setup](03-web-tooling.md) | None | Clean install, 44 pure tests, strict build and all five browser startup cases passed; [evidence](03-web-tooling.md#completion-evidence) |
| `todo` | [T04. Implement geometric transforms with occupied-cell anchors](04-geometric-transforms.md) | None | Real R/F geometry and every occupied anchor |
| `todo` | [T05. Implement pure run lifecycle, wall-clock timing and Undo](05-session-timing-undo.md) | [T01](01-rule-validation.md), [T03](03-web-tooling.md) | Pure phases, wall time, terminal completion and full Undo |
| `todo` | [T06. Implement top-five ranking and resilient local storage](06-record-ranking-storage.md) | [T03](03-web-tooling.md) | Top-five ranking, payload validation and storage failures |
| `todo` | [T07. Deliver the complete timed game through tap and keyboard](07-playable-tap-keyboard-game.md) | [T02](02-independent-solution-verification.md), [T04](04-geometric-transforms.md), [T05](05-session-timing-undo.md) | Complete hidden-Start game through tap and keyboard |
| `todo` | [T08. Connect ranked completion to personal records](08-records-ui-integration.md) | [T06](06-record-ranking-storage.md), [T07](07-playable-tap-keyboard-game.md) | Single ranked save, practice exclusion and confirmed clearing |
| `todo` | [T09. Add transactional touch, mouse and pen dragging](09-transactional-pointer-input.md) | [T07](07-playable-tap-keyboard-game.md) | Native mouse/emulated touch transactions and cancellation |
| `todo` | [T10. Finish phone layout, accessibility and browser compatibility](10-responsive-accessibility.md) | [T08](08-records-ui-integration.md), [T09](09-transactional-pointer-input.md) | Reachable phone layout, focus/axe and five browser projects |
| `todo` | [T11. Test the production artifact at root and Pages subpath](11-production-artifact-verification.md) | [T10](10-responsive-accessibility.md) | Same built artifact works at root and /rollmino/ |
| `todo` | [T12. Add the checked-artifact GitHub Pages workflow](12-pages-workflow.md) | [T11](11-production-artifact-verification.md) | PR checks and dependent checked-artifact Pages deployment |
| `todo` | [T13. Close local release gates and update the implementation handoff](13-release-handoff.md) | [T12](12-pages-workflow.md) | Local release gates/evidence and current contributor docs |
| `todo` | [T14. Deploy GitHub Pages and verify the live site](14-public-pages-deployment.md) | [T00](00-repository-setup.md), [T13](13-release-handoff.md) | Existing public repo, successful deployment and live smoke check |

## Working and completing tickets

1. Use `todo`, `doing`, `done` or `blocked` in the State cell. All tickets start as `todo`; existing reference tests do not complete the planned repairs/features. Dependency-waiting rows stay `todo`; use `blocked` for a concrete obstacle and record its cause/next action in the work-note cell.
2. Before work, read the ticket, finished blocker outputs and [coding guidelines](../../CODING_GUIDELINES.md). Set its row to `doing`; add an owner only when coordinating concurrent work. Current pure checks need Node 22.16+; Node 24 is the planned development runtime. Use `pnpm install --frozen-lockfile` for existing dependencies. T03 adds web tooling; other new commands become runnable in the ticket that creates their files.
3. Implement only that ticket's scope, keeping a playable result where its outcome requires one. Add meaningful tests with the feature. Blockers describe functional prerequisites; coordinate shared-file edits as described below.
4. Check every acceptance item and add completion evidence at the bottom of the ticket: date, changed behavior/files, actual commands/results, relevant runtime/browser versions, manual/emulated checks and any limitation. Link existing result/artifact/code references when available. Planned checks, skipped general failures and unavailable live hosting are not passes.
5. Mark the acceptance checklist, then replace the central State with `done`. The ticket's evidence/checklist supports review; it does not create a second status field. Keep a short result/reference in the work-note cell if useful.
6. Rescan `todo` rows using their blockers to find the next work. If a completed prerequisite is reopened, reassess dependent completion evidence and reopen affected rows. Record product changes in the plan/decision record rather than silently changing a ticket.

## Shared files and milestone coverage

T00 owns Git/repository setup; establish its local baseline before code changes and coordinate Git operations with active work. T01/T04 edit the core; tooling and feature tickets edit package scripts; T07 through T10 edit app/CSS. Sequence or coordinate those edits, preserve completed work and avoid artificial architecture just to separate tickets.

| Original plan slice | Tickets |
| --- | --- |
| 0. Repository baseline and trustworthy reference | T00, T01, T02 |
| 1. First complete timed non-drag game | T03, T04, T05, T07 |
| 2. Personal records | T06, T08 |
| 3. Transactional dragging | T09 |
| 4. Responsive/accessibility finish | T10 |
| 5. Artifact and public release | T11, T12, T13, T14 |

Tests executable here are the release gate. Physical phones/game sets and screen-reader sign-off are not prerequisites. Report emulation and unperformed checks honestly. Publication is separate from local readiness: T13 closes local gates; T14 needs actual successful hosting evidence.

Edit this table and the relevant ticket evidence directly.
