# Rollmino

Play [Rollmino](https://stefan-karger.github.io/rollmino/), a free, always-timed solo block puzzle with five levels and personal records in this browser. It runs on a static website without an account or backend.

[IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) is the single current contract. [AGENTS.md](AGENTS.md) explains maintenance and [CODING_GUIDELINES.md](CODING_GUIDELINES.md) supplies KISS/YAGNI policy. Choose ready work from the [tracker](docs/tickets/README.md). Status lives only there; tickets record actual results.

## Playing

Choose a level, then Start to reveal seven blockers and begin timing. Select a piece and tap a cell to place immediately, or drag from an occupied square. Rotate turns clockwise; Flip mirrors left/right. The marked square is the tap anchor; dragging preserves the square grabbed.

Illegal attempts preserve committed play. Placed shapes stay dimmed and selectable. Use Remove, Delete or drag back to the own slot to remove. Undo covers all successful active-run actions without rewinding time.

Tab reaches grid/tray/controls. Arrows move without wrapping. Home/End reaches row ends; Ctrl+Home/End reaches board ends. Enter/Space activates, R/F transforms, Delete removes and Escape cancels.

Timing includes background/lock, confirmations and Undo. Completion freezes board/time. New game, Replay and level changes confirm active abandonment. Replay retains a hidden layout as timed practice and never ranks. Fair fresh rolls can rank even when repeated. Reload abandons unfinished play and returns to hidden Starter ready.

Records show five best times/dates per level. Selected clearing confirms and preserves active play. Records stay in this browser; private mode/site-data/storage policies can erase them. Storage failures retain page-memory records with a reload-loss notice. No hints, pause, Redo, sync, PWA or Android app.

## Development

Use Node 24 and pnpm 12.10.0, pinned by `packageManager`. Keep `pnpm-lock.yaml` as the sole lockfile. Node 22.16+ can run pure tests through native type stripping.

```bash
pnpm install --frozen-lockfile
pnpm exec playwright install chromium firefox webkit
pnpm test
pnpm run build
pnpm run test:e2e
pnpm run test:e2e:prod
pnpm run verify:all
pnpm run dev
```

Linux browser setup uses `pnpm exec playwright install --with-deps chromium firefox webkit`. Development serves `http://127.0.0.1:5173/`. After building, `pnpm run preview` serves dist at `http://127.0.0.1:4173/`. Production tests reuse that build at root and `/rollmino/`; build first. Never run concurrent Playwright invocations sharing `test-results/`. Use `--workers=1` for a resource-pressure rerun.

Focused scripts are `test:rules`, `test:transforms`, `test:state`, `test:records` and `typecheck`. `pnpm run check:docs` checks local documentation links/anchors and script names. [Verification policy](IMPLEMENTATION_PLAN.md#verification) defines required checks; exhaustive verification is separate from fast tests.

## Code guide

| Path | Responsibility |
| --- | --- |
| `engine/core.ts` | Canonical dice/shapes/contacts, validation, transforms and reference solver |
| `src/session.ts` | Committed run, transactions, time and Undo |
| `src/records.ts` | Top-five ranking and resilient storage |
| `src/app.ts`, `src/styles.css`, `index.html` | Stable HTML/SVG, input, dialogs and compact layout |
| `src/tray-geometry.ts` | Matching tray artwork/hit-region bounds |
| `fixtures/rolls.json`, `tests/`, `scripts/verify-all.mjs` | Literal regressions, fixtures and independent verification |
| `e2e/`, Playwright configs | Five projects and existing-artifact root/subpath checks |
| `.github/workflows/pages.yml` | Checked-artifact Pages workflow |

Use original assets. [Source/verification limits](IMPLEMENTATION_PLAN.md#sources-and-limits) explain provenance and emulation; current results do not claim real-phone or screen-reader passes.

## Deployment and evidence

Public [stefan-karger/rollmino](https://github.com/stefan-karger/rollmino) uses Actions as Pages source and a main-only `github-pages` environment, without custom domain. PRs check without publishing. Main/manual releases build once, check that dist and deploy it through a dependent job. Publication is serialized without cancelling active deployment.

[Dated V1 release](IMPLEMENTATION_PLAN.md#static-hosting-and-release-reference) and [local/live evidence](docs/TEST-RESULTS.md) distinguish local checks from publication. New deployment claims require successful hosting and live checks. Completed V1 tickets remain in [Git history](https://github.com/stefan-karger/rollmino/tree/61454115b4cf1310ec0f72e50b3fc5e0ec38dd03/docs/tickets).

`PLAN.md`, `docs/RESEARCH.md`, `docs/REFERENCE-VERIFICATION.md`, older results and provenance directories are historical. They do not choose features/stack/gates. T26 owns their cleanup.
