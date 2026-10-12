# Rollmino V1 handoff

Rollmino is a planned free, always-timed solo puzzle website. The requirements interview is complete. [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) is the agreed, executable specification; [docs/DECISIONS.md](docs/DECISIONS.md) records the user's choices.

This folder contains research, a TypeScript reference engine and deterministic tests. It is not yet a playable web application. The browser app, records, controls and deployment workflow still need implementation.

## Start here

1. Read [AGENTS.md](AGENTS.md), [CODING_GUIDELINES.md](CODING_GUIDELINES.md) and [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md).
2. Follow the active scope, interaction and test summaries in `docs/`. Earlier proposals in [PLAN.md](PLAN.md) and [docs/RESEARCH.md](docs/RESEARCH.md) are historical.
3. Examine [engine/core.ts](engine/core.ts) and [fixtures/rolls.json](fixtures/rolls.json).
4. Run the reference checks. When implementation is requested, pick a ready task from the [ticket tracker](docs/tickets/README.md), which breaks the agreed slices into independently checkable work.

[PROMPT_FOR_AGENT.md](PROMPT_FOR_AGENT.md) is a future implementation handoff prompt. Creating this plan does not implement or publish the website.

## Current reference commands

Node 22.16+ runs the reference tests through native TypeScript type stripping. The review used Node 24.15.0. Install the local compiler for strict checking.

```bash
npm test
npm run verify:all
npm install
npm run typecheck
```

The current fast suite has 13 tests. The current exhaustive script checks solution existence for 62,208 Wizard boards and validates one example through the engine. The plan first repairs known validation gaps and makes independent validation of every answer a maintained check. [Recorded evidence and limits](docs/TEST-RESULTS.md)

Vite, Playwright and the browser commands in the plan have not been added yet. Do not mistake planned commands or reference results for a tested web app.

## Agreed V1

- English-only, phone-first, clean dark UI; the same compact layout centered on desktop.
- Exact physical dice, nine pieces and five contact-rule levels, all immediately selectable.
- Start reveals the hidden puzzle and starts timing. Background/lock time, confirmations and Undo count.
- Touch/mouse dragging, immediate tap placement, keyboard controls and full active-run Undo.
- Fresh rolls can rank; intentional replay is timed practice. Completed runs freeze; reload abandons unfinished play.
- Best five personal runs per level in this browser, with time/date and confirmed selected-level clearing.
- Plain TypeScript, Vite, SVG, CSS and native HTML controls. Node tests and Playwright.
- Public `stefan-karger/rollmino` on GitHub Pages. No backend, PWA or Android package.
- Tests executable here are the release gate. Real-phone tests are optional and never claimed without evidence.

## Folder guide

| Path | Purpose |
| --- | --- |
| `IMPLEMENTATION_PLAN.md` | Current agreed specification, exact rules, implementation slices, commands and gates |
| `docs/tickets/README.md` | Central ticket status/blockers and next-task selection; links detailed implementation tickets |
| `docs/DECISIONS.md` | Confirmed user requirements; interview closed |
| `AGENTS.md` / `PROMPT_FOR_AGENT.md` | Agent instructions and future implementation prompt |
| `CODING_GUIDELINES.md` | KISS/YAGNI policy adopted from astro-portfolio |
| `docs/V1-SCOPE.md` | Current product summary |
| `docs/UI-AND-INTERACTIONS.md` | Current lifecycle/input summary |
| `docs/TEST-PLAN.md` | Current versus planned checks and acceptance summary |
| `docs/SOURCES-AND-RISKS.md` | Sources, fidelity boundaries and original-art policy |
| `docs/REFERENCE-VERIFICATION.md` / `docs/TEST-RESULTS.md` | Reference evidence, audit results and their limits |
| `engine/core.ts` | Canonical pure engine; known repairs are planned |
| `tests/core.test.mjs` / `scripts/verify-all.mjs` | Existing maintained reference checks |
| `fixtures/rolls.json` | Three reproducible rolls and Wizard solutions |
| `PLAN.md` / `docs/RESEARCH.md` | Historical analysis and source research |
| `original-handoff/` / `research-archive/` | Preserved provenance; never runtime imports |
| `SHA256SUMS.txt` | Original 26-file archive snapshot, not a manifest of later edits |

Original rulebooks, product photos, packaging graphics and official logos are not redistributed. The chosen name is Rollmino; this handoff does not claim trademark clearance. Source caveats do not create an additional physical-device or physical-game release gate.
