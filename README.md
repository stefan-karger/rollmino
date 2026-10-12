# Rollmino V1 handoff

Rollmino is a planned free, always-timed solo puzzle website. The requirements interview is complete. [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) is the agreed, executable specification; [docs/DECISIONS.md](docs/DECISIONS.md) records the user's choices.

This folder contains research, a TypeScript rules engine, deterministic tests and a minimal Rollmino web entry. Vite and browser startup tests are configured. It is not yet playable; game controls, sessions, records and deployment still need implementation.

Source repository: [stefan-karger/rollmino](https://github.com/stefan-karger/rollmino). The existing local workspace is initialized on `main` and connected to `origin/main`. [T00's setup evidence](docs/tickets/00-repository-setup.md#completion-evidence) records the baseline and synchronization checks. Website deployment remains T14.

## Start here

1. Read [AGENTS.md](AGENTS.md), [CODING_GUIDELINES.md](CODING_GUIDELINES.md) and [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md).
2. Follow the active scope, interaction and test summaries in `docs/`. Earlier proposals in [PLAN.md](PLAN.md) and [docs/RESEARCH.md](docs/RESEARCH.md) are historical.
3. Examine [engine/core.ts](engine/core.ts) and [fixtures/rolls.json](fixtures/rolls.json).
4. Run the reference checks. When implementation is requested, pick a ready task from the [ticket tracker](docs/tickets/README.md), which breaks the agreed slices into independently checkable work.

[PROMPT_FOR_AGENT.md](PROMPT_FOR_AGENT.md) is a future implementation handoff prompt. Creating this plan does not implement or publish the website.

## Setup and current commands

Use Node 24 and pnpm 12.10.0 for development. `package.json` pins pnpm through `packageManager`; commit `pnpm-lock.yaml` whenever dependencies change. Install pnpm using its [official setup instructions](https://pnpm.io/installation) if it is unavailable. Node 22.16+ can also run the pure tests through native TypeScript type stripping. Strict checking includes the engine, browser entry, browser tests and configuration files.

```bash
pnpm install --frozen-lockfile
pnpm exec playwright install chromium firefox webkit
pnpm test
pnpm run test:rules
pnpm run build
pnpm run test:e2e
pnpm run dev
```

`pnpm run dev` serves the entry at `http://127.0.0.1:5173/`. After building, `pnpm run preview` serves `dist/` at `http://127.0.0.1:4173/`. `pnpm run typecheck` checks TypeScript without building. On Linux, browser installation uses `pnpm exec playwright install --with-deps chromium firefox webkit`. The Windows certificate-store retry used here is recorded in [T03's evidence](docs/tickets/03-web-tooling.md#completion-evidence).

The current fast suite has 44 tests, including the repaired malformed-state regressions, exact model/contact checks and independent oracle tests. The separate `pnpm run verify:all` command validates every returned solution for all 62,208 Wizard boards with a cell-array oracle. The oracle reuses canonical orientation data. [Recorded evidence and limits](docs/TEST-RESULTS.md)

The browser startup case passes in desktop Chromium/Firefox/WebKit and mobile Chromium/WebKit emulation. It checks the entry/title, loaded TypeScript behavior and CSS, page errors and failed asset requests. This establishes startup tooling; gameplay, mobile input and accessibility acceptance remain future tickets. Production root/subpath tests are added in T11.

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
| `engine/core.ts` | Canonical pure engine with validated setup, committed placements and solved coverage |
| `index.html` / `src/` | Minimal semantic web entry and dark stylesheet; gameplay comes in T07 |
| `tsconfig.json` / `vite.config.ts` / `playwright.config.ts` / `e2e/play.spec.ts` | Strict browser build and five-project startup checks |
| `tests/core.test.mjs` / `tests/oracle.mjs` / `tests/oracle.test.mjs` / `scripts/verify-all.mjs` | Literal rules tests, independent answer checks and exhaustive Wizard sweep |
| `fixtures/rolls.json` | Three reproducible rolls and Wizard solutions |
| `PLAN.md` / `docs/RESEARCH.md` | Historical analysis and source research |
| `original-handoff/` / `research-archive/` | Preserved provenance; never runtime imports |
| `SHA256SUMS.txt` | Original 26-file archive snapshot, not a manifest of later edits |

Original rulebooks, product photos, packaging graphics and official logos are not redistributed. The chosen name is Rollmino; this handoff does not claim trademark clearance. Source caveats do not create an additional physical-device or physical-game release gate.
