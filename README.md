# Rollmino

Play [Rollmino](https://stefan-karger.github.io/rollmino/), a free timed solo block puzzle with five levels and personal records in this browser. It runs on a static website without an account or backend. The locally implemented Home/tutorial and responsive layout revisions are described below; their publication remains separate from the dated V1 release.

[IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) is the single current contract. [AGENTS.md](AGENTS.md) explains maintenance and [CODING_GUIDELINES.md](CODING_GUIDELINES.md) supplies KISS/YAGNI policy. The [tracker](docs/tickets/README.md) records current work; earlier completed tickets and their evidence remain in the [Git archive](docs/TEST-RESULTS.md#historical-archive).

## Playing

Tutorial on Home offers six self-paced illustrated panels with a level comparison. An unframed row places progress between secondary Back and primary Next; Try exercise replaces Next on the final panel. The examples also sit directly on the page. Teaching is untimed and never records a result. The exercise uses the real controls without a clock: six prepared pieces stay fixed while you place Brown domino, Grey line and Cyan L. Undo reverses individual moves; the compact Redo exercise button starts the lesson over. Any legal full-board finish succeeds. Exercise completion offers Play, Review tutorial and Redo exercise.

On a new visit, Home highlights the optional tutorial invitation. Choosing Play or Tutorial remembers only that the offer was handled; Highscores does not dismiss it. Cleared or unavailable browser storage can repeat the invitation. Tutorial always opens at the first panel without saved progress. Home remains available throughout teaching.

Choose Play on Home, choose a level, then Start to reveal seven blockers and begin timing. Select a piece and tap a cell to place immediately, or drag from an occupied square. Rotate turns clockwise; Flip mirrors left/right. The marked square is the tap anchor; dragging preserves the square grabbed.

Time sits above the board. Controls sit above one compact three-by-three piece tray; from 900 CSS pixels the tray moves to the right of the board and controls. The exercise uses the same presentation. Piece names remain available to assistive technology and on hover. Level, New game, Replay and Home sit below ordinary play in that order, followed by collapsed rules/keyboard help.

Action buttons share two styles throughout: mint primary actions and dark filled, bordered secondary actions. Tutorial and Highscores share the same heading and text-only Home link. Narrow phones use two rows for the game footer to keep full-size controls.

Inset white square outlines identify the pieces that cannot share an edge at the selected level. Starter has no outlines. The small + marks the tap anchor inside its square.

Illegal attempts preserve committed play. Placed shapes become muted outlines with a check mark in the tray and stay selectable; available shapes keep their solid colors. Use Remove, Delete or drag back to the own slot to remove. Undo covers all successful active-run actions without rewinding time.

Tab reaches grid/tray/controls. Arrows move without wrapping. Home/End reaches row ends; Ctrl+Home/End reaches board ends. Enter/Space activates, R/F transforms, Delete removes and Escape cancels.

Timing includes background/lock, confirmations and Undo. Completion freezes board/time. New game, Replay and level changes confirm active abandonment. Replay retains a hidden layout as timed practice and never ranks. Fair fresh rolls can rank even when repeated. Home confirms running abandonment and discards the layout. Browser Back follows the same confirmation; Forward opens fresh hidden play. Reload returns Home with fresh hidden Starter internally.

Highscores on Home shows five best times/dates for the selected records level. Clearing confirms that level and preserves other lists. The records filter does not change the play level. Records stay in this browser; private mode/site-data/storage policies can erase them. Storage failures retain page-memory records with a reload-loss notice. Ordinary games have no hints, pause or Redo. No sync, PWA or Android app.

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
| `src/navigation.ts` | Screen-only history, root returns and reconciled abandonment |
| `src/records.ts`, `src/onboarding.ts` | Top-five ranking and the independent handled-offer flag |
| `src/app.ts`, `src/styles.css`, `index.html` | Stable HTML/SVG, input, dialogs and shared responsive game/exercise layout |
| `src/tutorial.ts`, `src/exercise.ts`, `src/teaching-data.ts`, `src/piece-art.ts` | Self-paced teaching examples and shared original piece artwork |
| `src/tray-geometry.ts` | Matching tray artwork/hit-region bounds |
| `fixtures/rolls.json`, `tests/`, `scripts/verify-all.mjs` | Literal regressions, fixtures and independent verification |
| `e2e/`, Playwright configs | Five projects and existing-artifact root/subpath checks |
| `.github/workflows/pages.yml` | Checked-artifact Pages workflow |

Use original assets. [Source/verification limits](IMPLEMENTATION_PLAN.md#sources-and-limits) explain provenance and emulation; current results do not claim real-phone or screen-reader passes.

## Deployment and evidence

Public [stefan-karger/rollmino](https://github.com/stefan-karger/rollmino) uses Actions as Pages source and a main-only `github-pages` environment, without custom domain. PRs check without publishing. Main/manual releases build once, check that dist and deploy it through a dependent job. Publication is serialized without cancelling active deployment.

[Dated V1 release](IMPLEMENTATION_PLAN.md#static-hosting-and-release-reference) and [local/live evidence](docs/TEST-RESULTS.md) distinguish local checks from publication. New deployment claims require successful hosting and live checks. Completed V1 tickets remain in [Git history](https://github.com/stefan-karger/rollmino/tree/61454115b4cf1310ec0f72e50b3fc5e0ec38dd03/docs/tickets).

Superseded research/provenance and setup narratives remain in the [historical Git archive](docs/TEST-RESULTS.md#historical-archive). They do not choose features, stack or release gates. Only the canonical engine/fixtures/tests remain active; copied archives and the initial checksum manifest no longer occupy the working tree.
