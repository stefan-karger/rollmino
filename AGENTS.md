# Agent handoff instructions for Rollmino

## Your task

The user confirmed the complete V1 contract on 2026-10-12. [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) is the current agreed specification. The requirements interview is closed; [docs/DECISIONS.md](docs/DECISIONS.md) records the answers. `PLAN.md` is historical analysis, not an alternative active specification.

When asked to implement, pick ready work from [docs/tickets/README.md](docs/tickets/README.md). The tickets divide the agreed plan's slices into scoped tasks with blockers, tests and completion criteria. Keep status only in that central tracker and record evidence in the ticket before marking it done. Do not reopen technology/product decisions without a concrete conflict. Do not implement the app merely because a planning/ticket-writing request or the reference engine exists. This handoff's planning work is complete.

The V1 app, browser/artifact checks and Pages workflow are implemented and [published](https://stefan-karger.github.io/rollmino/). Read [current integrated evidence](docs/TEST-RESULTS.md#integrated-v1-local-release-verification), T14's hosting evidence and the tracker before choosing work; do not repeat completed slices. Further changes require a current user request and must preserve the accepted contract.

## Mandatory context

Read in this order: `README.md`, `docs/V1-SCOPE.md`, `docs/RESEARCH.md`, `engine/core.ts`, `docs/TEST-PLAN.md`, `docs/UI-AND-INTERACTIONS.md`, `docs/SOURCES-AND-RISKS.md`.

Then read `CODING_GUIDELINES.md`, `docs/DECISIONS.md`, `IMPLEMENTATION_PLAN.md` and the ticket tracker/current ticket. Consult the findings/evidence in historical `PLAN.md` as needed. The agreed plan supersedes older optional timer/hint, preview-then-Place, short Undo and physical-phone gate proposals.

Before changing the reference, run the fast tests and inspect the existing engine/fixtures. Known defects and prior exhaustive evidence are documented; do not assume passing old tests establishes robust state validation.

## Non-negotiable correctness rules

1. Use the actual per-die six-face tables. Repeated faces affect probabilities.
2. Physical rolls place seven blockers in seven distinct cells of a 6 by 6 board.
3. Exactly nine piece IDs occupy 29 squares with 28 unique geometric orientations.
4. Respect per-level special-piece contact restrictions. Master is not a superset of Expert; diagonal contact is permitted.
5. Flips and rotations are geometric transformations. Orientation indices are implementation details.
6. Validate solved committed placements, including exact IDs and complete coverage. Visual paint and drop counts cannot establish a win.
7. The reference solver preserves fixed placements and returns null for a legal dead end. No solver assistance ships in V1.

## Engineering guidance

- Follow [CODING_GUIDELINES.md](CODING_GUIDELINES.md), adopted from the user's astro-portfolio KISS/YAGNI policy. Optimize for understandable cohesive code and ongoing maintenance, not a mechanical file/dependency minimum.
- The confirmed stack is TypeScript, Vite, SVG, CSS, native HTML controls, Node tests and Playwright. Do not repeat a greenfield stack-selection exercise.
- Use pnpm, pinned by `packageManager` in `package.json`, for dependencies and scripts. Keep `pnpm-lock.yaml` as the only dependency lockfile and use `pnpm install --frozen-lockfile` for verification/CI.
- Keep pure testable rules, one authoritative committed game, deterministic fixtures and static hosting.
- Preserve the documented validation regressions and repairs. Make every exhaustive answer's independent legality check reproducible.
- Build playable slices with executable checks. Add modules only for meaningful current responsibilities.
- Avoid backend, auth, multiplayer, physics, 3D, generic game engines, generalized state architecture and speculative extensibility.
- Use original artwork. Do not copy official logos/manual graphics or publish provenance directories as app assets.
- Document verified source discrepancies and correct model/tests; never silently follow a mistaken reference.
- Tests executable in the current environment are the release gate. No physical-phone or screen-reader release gate was requested. Do not claim unperformed tests.

## Plan contract

The agreed plan contains stack alternatives/trade-offs, required/nice-to-have/excluded scope, exact rules, minimal file responsibilities, ordered slices, interaction/session state machines, record/timer behavior, test fixtures/failure cases, commands, acceptance/deployment gates and bounded risks.

Keep active docs consistent when an accepted decision changes. Routine implementation details follow the coding guidelines. If a change would alter agreed user-visible behavior, identify that decision and propose a focused revision.

## Existing verification commands

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm run build
pnpm run test:e2e
pnpm run test:e2e:prod
pnpm run verify:all
```

The exhaustive check is separate from the fast suite. Node type stripping runs pure tests, not the browser build. Browser/artifact commands are executable and their current results are recorded in `docs/TEST-RESULTS.md`. Production tests reuse the preceding `dist/`; build before running them. Use the frozen lockfile and documented Playwright browser/system setup for contributor verification.
