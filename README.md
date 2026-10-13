# Rollmino

Rollmino is a free, always-timed solo block puzzle with five difficulty levels and personal records in this browser. It runs entirely on a static website, with no account or backend. [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) is the agreed V1 specification; [docs/DECISIONS.md](docs/DECISIONS.md) records the user's choices.

Play at **[Rollmino](https://stefan-karger.github.io/rollmino/)**. V1 supports tap, keyboard and Pointer Events. The integrated local release gates and the checked-artifact GitHub deployment pass. [Current evidence](docs/TEST-RESULTS.md#integrated-v1-local-release-verification) covers gameplay, records, accessibility, mobile emulation and the built artifact; [Public release evidence](docs/TEST-RESULTS.md#public-pages-release-verification) records the successful hosted run and live smoke check.

Source repository: [stefan-karger/rollmino](https://github.com/stefan-karger/rollmino). The local `main` branch tracks `origin/main`. [T00](https://github.com/stefan-karger/rollmino/blob/61454115b4cf1310ec0f72e50b3fc5e0ec38dd03/docs/tickets/00-repository-setup.md#completion-evidence) records repository creation; [Public release evidence](docs/TEST-RESULTS.md#public-pages-release-verification) records synchronization and publication after implementation.

## Start here

1. Read [AGENTS.md](AGENTS.md), [CODING_GUIDELINES.md](CODING_GUIDELINES.md) and [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md).
2. Follow the active scope, interaction and test summaries in `docs/`. Earlier proposals in [PLAN.md](PLAN.md) and [docs/RESEARCH.md](docs/RESEARCH.md) are historical.
3. Examine [engine/core.ts](engine/core.ts) and [fixtures/rolls.json](fixtures/rolls.json).
4. Run the reference checks. When implementation is requested, pick a ready task from the [ticket tracker](docs/tickets/README.md), which tracks review follow-ups with priorities, blockers and acceptance checks.

[PROMPT_FOR_AGENT.md](PROMPT_FOR_AGENT.md) is the maintenance/publication handoff. Ticket evidence records actual work; historical plans do not override the accepted contract.

## Setup and current commands

Use Node 24 and pnpm 12.10.0 for development. `package.json` pins pnpm through `packageManager`; commit `pnpm-lock.yaml` whenever dependencies change. Install pnpm using its [official setup instructions](https://pnpm.io/installation) if it is unavailable. Node 22.16+ can also run the pure tests through native TypeScript type stripping. Strict checking includes the engine, browser entry, browser tests and configuration files.

```bash
pnpm install --frozen-lockfile
pnpm exec playwright install chromium firefox webkit
pnpm test
pnpm run test:rules
pnpm run test:transforms
pnpm run test:state
pnpm run test:records
pnpm run build
pnpm run test:e2e
pnpm run test:e2e:prod
pnpm run verify:all
pnpm run dev
```

`pnpm run dev` serves the entry at `http://127.0.0.1:5173/`. After building, `pnpm run preview` serves `dist/` at `http://127.0.0.1:4173/`. `pnpm run typecheck` checks TypeScript without building. On Linux, browser installation uses `pnpm exec playwright install --with-deps chromium firefox webkit`. The Windows certificate-store retry used here is recorded in [T03's evidence](https://github.com/stefan-karger/rollmino/blob/61454115b4cf1310ec0f72e50b3fc5e0ec38dd03/docs/tickets/03-web-tooling.md#completion-evidence).

The fast suite has 59 tests covering rules/validation, the independent oracle, all occupied-anchor transforms, run phases/timing/Undo and record ranking/storage faults. The separate `pnpm run verify:all` command validates every returned solution for all 62,208 Wizard boards with a cell-array oracle. The oracle reuses canonical orientation data. [Recorded evidence and limits](docs/TEST-RESULTS.md)

The development suite passes 207 applicable cases in desktop Chromium/Firefox/WebKit and mobile Chromium/WebKit emulation. Eight deliberate skips are the two CDP touch cases outside mobile Chromium. The production suite passes ten checks at `/` and `/rollmino/`, serving the same preceding `dist/` without rebuilding. Always run `pnpm run build` before `test:e2e:prod`.

## Playing

- English-only, phone-first, clean dark UI; the same compact layout centered on desktop.
- Exact physical dice, nine pieces and five contact-rule levels, all immediately selectable.
- Start reveals the hidden puzzle and starts timing. Background/lock time, confirmations and Undo count.
- Touch/mouse dragging, immediate tap placement, keyboard controls and full active-run Undo.
- Fresh rolls can rank; intentional replay is timed practice. Completed runs freeze; reload abandons unfinished play.
- Best five personal runs per level in this browser, with time/date and confirmed selected-level clearing.
- Plain TypeScript, Vite, SVG, CSS and native HTML controls. Node tests and Playwright.
- Published from public `stefan-karger/rollmino` through GitHub Pages. No backend, PWA or Android package.
- Tests executable here are the release gate. Real-phone tests are optional and never claimed without evidence.

Tap a tray piece, then a board cell to place immediately. The marked occupied square is the tap anchor; Rotate turns it clockwise and Flip reflects it left/right. Dragging preserves the square you grabbed. Illegal drops restore committed play, and returning a placed piece to its own tray slot removes it. Placed shapes stay dimmed and selectable.

Tab reaches the grid, tray and controls. Arrows move the grid target without wrapping; Home/End reach row ends, and Ctrl+Home/End reach board ends. Enter/Space activates, R/F transforms, Delete removes, and Escape cancels. Remove and full active-run Undo are also visible buttons. There is no pause, hint or Redo. Completion freezes board/time and cannot be reopened by Undo.

New game, Replay and level changes confirm before abandoning an unfinished run. Replay keeps the layout as hidden practice; its timer starts only on Start. A fresh level change rolls a new puzzle on Start. Reload opens fresh Starter ready and abandons unfinished play. Timing includes hidden tabs, device sleep, confirmations and Undo.

Records contain only elapsed milliseconds and completion dates. A fair fresh roll can rank even if its layout repeats; intentional practice never ranks. Storage failures keep this page's records in memory and show a reload-loss notice. Browser/private-mode/site-data policies can erase records, and system clock changes can affect local times. Records are not uploaded or synchronized.

## Pages workflow

[`.github/workflows/pages.yml`](.github/workflows/pages.yml) checks pull requests without publishing. Pushes to `main` and manual dispatch run the same checks, then deploy the tested `dist/`. It builds once, checks root and `/rollmino/`, and uploads only after browser tests and exhaustive verification pass. Publication runs share a concurrency group and do not cancel an active deployment.

The build job has read-only source and Pages access. The dependent deploy job alone gets `pages: write` and `id-token: write`, and uses the `github-pages` environment. No application API secret or generated publishing branch is needed. pnpm comes from `packageManager` before Node 24 enables the lockfile-based pnpm cache.

The repository uses **Settings > Pages > Build and deployment > Source > GitHub Actions**, with the `github-pages` environment restricted to the `main` branch and no custom domain. Push `main` or manually run the workflow on `main` to publish after its checks succeed. [Verified deployment](https://github.com/stefan-karger/rollmino/actions/runs/38363711259). Action setup follows the [official Pages workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [Node setup](https://github.com/actions/setup-node) and [pnpm setup](https://github.com/pnpm/action-setup) documentation.

## Folder guide

| Path | Purpose |
| --- | --- |
| `IMPLEMENTATION_PLAN.md` | Current agreed specification, exact rules, implementation slices, commands and gates |
| `docs/tickets/README.md` | Current review follow-up status, priorities, blockers and next-task selection |
| `docs/DECISIONS.md` | Confirmed user requirements; interview closed |
| `AGENTS.md` / `PROMPT_FOR_AGENT.md` | Maintenance/publication instructions and handoff |
| `CODING_GUIDELINES.md` | KISS/YAGNI policy adopted from astro-portfolio |
| `docs/V1-SCOPE.md` | Current product summary |
| `docs/UI-AND-INTERACTIONS.md` | Current lifecycle/input summary |
| `docs/TEST-PLAN.md` | Maintained checks and local release acceptance summary |
| `docs/SOURCES-AND-RISKS.md` | Sources, fidelity boundaries and original-art policy |
| `docs/REFERENCE-VERIFICATION.md` / `docs/TEST-RESULTS.md` | Reference evidence, audit results and their limits |
| `engine/core.ts` | Canonical pure engine with validated setup, committed placements and solved coverage |
| `index.html` / `src/app.ts` / `src/styles.css` | Stable SVG/HTML grid/tray, pointer/keyboard/dialog wiring and responsive dark layout |
| `src/session.ts` / `src/records.ts` | Pure authoritative run transactions/timing/Undo and resilient top-five storage |
| `public/favicon.svg` | Original app icon |
| `tsconfig.json` / `vite.config.ts` | Strict browser/configuration checking and relative-asset production build |
| `playwright.config.ts` / `playwright.production.config.ts` / `e2e/` | Five-project gameplay/input/records/accessibility checks and built root/subpath checks |
| `tests/transforms.test.mjs` / `tests/session.test.mjs` / `tests/records.test.mjs` | Occupied anchors, pure lifecycle/timing/history and storage/ranking checks |
| `.github/workflows/pages.yml` | Full checks and dependent tested-artifact Pages deployment |
| `tests/core.test.mjs` / `tests/oracle.mjs` / `tests/oracle.test.mjs` / `scripts/verify-all.mjs` | Literal rules tests, independent answer checks and exhaustive Wizard sweep |
| `fixtures/rolls.json` | Three reproducible rolls and Wizard solutions |
| `PLAN.md` / `docs/RESEARCH.md` | Historical analysis and source research |
| `original-handoff/` / `research-archive/` | Preserved provenance; never runtime imports |
| `SHA256SUMS.txt` | Original 26-file archive snapshot, not a manifest of later edits |

Original rulebooks, product photos, packaging graphics and official logos are not redistributed. The chosen name is Rollmino; this handoff does not claim trademark clearance. Source caveats do not create an additional physical-device or physical-game release gate.
