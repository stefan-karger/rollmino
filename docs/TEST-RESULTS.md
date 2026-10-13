# Verification results

Package-manager migration on 2026-10-12: commands in historical results below are current pnpm equivalents. Those earlier runs used the previous package manager; their original commands are preserved in commit `df3e241`. [Actual pnpm verification](#pnpm-migration-verification).

The current integrated V1 evidence appears first. Later sections preserve the reference, tooling and package-manager results from 2026-10-12; statements about then-unimplemented gameplay describe those historical checks.

## Integrated V1 local release verification

Executed on 2026-10-13 in this Windows workspace with Node 24.15.0, pnpm 12.10.0, TypeScript 5.8.3, Vite 8.3.4, Playwright 1.64.0 and axe Playwright 4.13.0. The bundled/tested browsers are Chromium 156.0.8078.4, Firefox 157.0 and WebKit 27.2. [T11's ordered release run](tickets/11-production-artifact-verification.md#completion-evidence) and [T12's workflow review](tickets/12-pages-workflow.md#completion-evidence) provide the detailed evidence.

| Command/check | Actual result |
| --- | --- |
| `pnpm install --frozen-lockfile` | Passed without dependency/lock changes |
| `pnpm test` | 59 pure tests passed, no skips |
| `pnpm run build` | Strict checking and production build passed |
| `pnpm run test:e2e` | 207 applicable cases passed across all five projects; 8 expected skips for two mobile-Chromium-only CDP cases; 6.3 minutes in T11 |
| `pnpm run test:e2e:prod` | All 10 root/Pages-path cases passed against the same preceding dist in 15.5 seconds |
| `pnpm run verify:all` | Every returned answer on all 62,208 Wizard boards passed the independent oracle in 27.36 seconds |
| Workflow validation | Official actionlint 1.7.12 passed; actual GitHub execution remains T14 |
| Clean contributor checkout | Detached `1a9c8c6` checkout with no node_modules installed all 23 locked packages from the local store, passed 59 pure tests, strict build and all 10 production cases in 17.1 seconds; existing browser binaries reused |

The built artifact contains only `index.html`, `favicon.svg`, `assets/index-CIHiYrAQ.css` and `assets/index-DrVNgP7r.js`. The JS SHA-256 is `787FC845B2C80897D12E26C544424C8F479773F38AC57149402828B3DE70B236`. Both production configurations serve this artifact without rebuilding. Requests/asset MIME checks reject missing assets, page/console errors, unexpected runtime APIs, external fonts and development WebSockets.

### Acceptance gate evidence

| Agreed local gate | Integrated evidence |
| --- | --- |
| Model | [core tests](../tests/core.test.mjs) and T01 preserve literal faces/shapes/groups and reject malformed committed wins |
| Solver reference | [oracle](../tests/oracle.mjs), [oracle tests](../tests/oracle.test.mjs), exhaustive verifier and T02/T11 check independent occupancy/contact/fixed-placement legality |
| Start and time | [session tests](../tests/session.test.mjs) and [play tests](../e2e/play.spec.ts) prove hidden ready, wall time through delayed/background/confirmation periods, Undo time and one frozen completion |
| Play and transactions | Session tests and public-control fixtures complete all three boards; illegal/no-op/cancelled actions preserve committed state/history |
| Inputs | [input tests](../e2e/input.spec.ts) complete keyboard play, native mouse anchors/transforms/moves/return/capture and native Chromium CDP touch placement/movement/return/cancellation/secondary input |
| Lifecycle | Session/play tests cover active cancellation/acceptance, hidden practice replay, fresh level changes, reload abandonment and terminal completion |
| Records | [pure record tests](../tests/records.test.mjs) and [browser record tests](../e2e/records.spec.ts) cover top five, millisecond/tie order, practice exclusion, single consideration, selected clearing and storage faults |
| Layout/accessibility | [accessibility tests](../e2e/accessibility.spec.ts) cover named grid, visible/stable focus, native dialog focus, non-color cues, required widths/landscape, reduced motion and zero relevant axe findings in four states; no exclusions |
| Static artifact | [production tests](../e2e/production.spec.ts) complete all fixtures, freeze/replay/reload records and verify assets/services at root and /rollmino/ |
| Reproduction | Frozen installation/build/pure/production checks also pass in a fresh detached contributor checkout with unchanged tracked files |
| Assets/scope | Original SVG/CSS only, one committed Game inside the session, separate drafts/gestures and records containing only time/date; no assistance, backend, PWA or test game API |

Inspected 320/390/768/1440 CSS px widths and 667x375 landscape with the shared T3 preview. Automated corner/center SVG/HTML alignment stays below 1px. The 200% check uses CSS zoom/reflow, with about 0.02px offset at the manually checked zoomed cell, not browser-chrome zoom. Dark glyph contrast against undimmed piece fills ranges from 5.07:1 to 12.20:1; tray labels remain undimmed. HTML tray hit regions match occupied SVG squares and keep touch-action off holes/labels/gutters.

Native mouse and CDP touch evidence is browser automation; mobile projects emulate phones. Blur/hidden-document/pointercancel and held-action cleanup branches are explicitly synthetic. Physical phone, pen, current physical game set and screen-reader checks were not performed. These are not additional release gates. The oracle reuses canonical orientations and establishes one returned answer per encoded board, not human difficulty, all partial-state completability or physical-source certification.

No accepted product deviations were needed. The detached-checkout tests use the same committed runtime/build code as the integrated release; subsequent handoff edits change documentation/package description only. Public activation, successful hosted Actions and live URL verification remain T14.

## Original packaging evidence

Reported by the handoff preparation environment on 2026-10-12:

| Check | Reported result |
| --- | --- |
| `pnpm test` | 13 of 13 fast reference tests passed |
| Strict type check | Passed with TypeScript 5.8.3 |
| `pnpm run verify:all` | 62,208 Wizard boards returned non-null answers; the script additionally replay-validated one example |
| Runtime/environment | 23.87 seconds, Node 22.16.0 on the preparation machine |

The original wording described every answer as validated. That loop checked answer existence; this document distinguishes it from the stronger review audit and T02's later maintained independent checks.

## Independent handoff review

Executed on 2026-10-12 in this workspace, Windows, Node 24.15.0, the pre-migration package manager 11.12.1 and local TypeScript 5.8.3:

| Check | Result and limit |
| --- | --- |
| Initial archive integrity | All 26 supplied SHA-256 entries matched before review edits. Canonical and archived engines were byte-identical. |
| `pnpm test` | All 13 reference tests passed; the fast baseline was rechecked during final planning. |
| `pnpm install --frozen-lockfile` and `pnpm run typecheck` | Passed. Installation generated the pre-migration lockfile; the current dependency lockfile is `pnpm-lock.yaml`. |
| `pnpm run verify:all` | All 62,208 Wizard boards yielded non-null answers in 30.94 seconds. |
| Additional exhaustive audit | A separate cell-array checker validated all 62,208 answers in 28.77 seconds for IDs, bounds, blockers, overlaps, coverage and Wizard contacts. It reused canonical orientation data. |
| Observed empty solve latency | Maximum observed during that audit: 14.20 ms. This is not a worst-case or phone guarantee. |
| Deterministic partial-position sample | Xorshift seed `0x6a09e667`, 200 legal partial states per level. Many were dead ends; maximum observed solve 9.02 ms. This is not human difficulty evidence. |

The extra audit/sample were review experiments, not maintained test files. T02 implements the reproducible solution legality check required by Slice 0 of [IMPLEMENTATION_PLAN.md](../IMPLEMENTATION_PLAN.md).

## Failures reproduced before T01

The review reproduced false wins for truncated dice and mismatched placement map keys/IDs, acceptance of sparse seven-element dice arrays and acceptance of unknown runtime levels. Passing the 13 old tests did not resolve these defects. T01 added four regressions, observed all four fail against the original engine, then repaired validation.

## T01 implementation verification

Executed on 2026-10-12 in this Windows workspace with Node 24.15.0, the pre-migration package manager 11.12.1 and TypeScript 5.8.3:

| Check | Result and limit |
| --- | --- |
| Baseline `pnpm test` | All 13 original tests passed before changes. |
| Four new defect regressions before repair | All four failed, reproducing both false wins and both missing validation errors. |
| `pnpm install --frozen-lockfile` | Passed; dependencies and lockfile were unchanged; audit reported zero vulnerabilities. |
| Final `pnpm test` | All 30 tests passed, with no skips. |
| `pnpm run typecheck` | Passed with strict checking. |
| Final `pnpm run verify:all` | All 62,208 Wizard boards returned non-null answers in 27.11 seconds; the existing script also replay-validated one example through the engine. |
| `git diff --check` | Passed. |

[The engine](../engine/core.ts) now validates dense physical dice, own level/piece keys, integer geometry and committed map key/ID agreement. Placement and solved checks return false for malformed state. Solved validation requires nine used IDs, 29 distinct piece cells, legal contacts and complete board coverage. The solver throws for malformed setup and returns null for invalid fixed placements or legal dead ends. Injected random values must be finite numbers in `[0,1)`.

[The fast suite](../tests/core.test.mjs) asserts the literal dice, base shapes and restriction groups, 36-cell dice partition, 29 cells, 28 orientations and 625 candidates. It checks all six numbered-piece pairs at all five levels in both orders for edge and diagonal contact. It also covers blocker/boundary/unrestricted contact, row-edge wrapping, malformed and inherited values, legal self-overlap moves, all stored solutions, frozen fixed inputs and the B6 Wizard dead end. Dice order, orientation generation, fixtures and archive copies are unchanged.

This sweep establishes answer existence, not maintained independent legality validation of every answer. T02 owns that stronger oracle. No browser, physical-device or screen-reader checks were performed for T01.

## T02 implementation verification

Executed on 2026-10-12 in this Windows workspace with Node 24.15.0, the pre-migration package manager 11.12.1 and TypeScript 5.8.3:

| Check | Result and limit |
| --- | --- |
| Baseline `pnpm test` | All 30 T01 tests passed before T02 changes. |
| `pnpm run test:rules` | All 44 tests passed, including 14 oracle tests; no skips. |
| `pnpm test` | All 44 tests passed; the default suite does not run the exhaustive sweep. |
| `pnpm run typecheck` | Passed with strict checking. |
| `pnpm run verify:all` | All 62,208 returned Wizard answers passed the independent oracle in 29.17 seconds. |
| Import inspection | The oracle's sole engine import is `ORIENTATIONS`; neither it nor the exhaustive verifier calls `canPlace` or `isSolved`. Only test/verification files import the oracle. |
| `git diff --check` | Passed. |

[The maintained oracle](../tests/oracle.mjs) checks nine unique known IDs, valid integer geometry, bounds, seven distinct blockers, overlap, 29 piece cells, complete coverage, restricted edge contacts and unchanged fixed placements. It uses direct coordinates and a cell array. Error messages identify the roll and failed condition.

[The oracle tests](../tests/oracle.test.mjs) accept all three stored Wizard fixtures at every level and independently check solver results with 0, 1, 4 and 9 fixed placements. They reject duplicate/missing/unknown IDs, malformed arrays, invalid orientations/coordinates, bounds errors, blocker/piece overlap, forbidden contacts and changed fixed placements. One synchronous fault-injection test temporarily removes the navy orientation's cell, verifies the coverage-gap check fails and restores the data in `finally`. This isolates coverage after the other answer checks. Allowed diagonal and unrestricted edge contacts also pass.

[The exhaustive verifier](../scripts/verify-all.mjs) checks every non-null answer before incrementing its count and asserts exactly 62,208 boards. Enumeration alone deduplicates per-die coordinates. Physical roll sampling, model tables, fixture indices and archive copies are unchanged.

The oracle reuses canonical orientations, which the literal T01 tests guard. It checks one returned solution per board, not solution counts, all partial states, human difficulty or source-independent physical accuracy. Wizard solutions imply solvability at the other levels; no separate exhaustive lower-level sweeps were run. No browser/device/screen-reader checks were performed for T02.

## T03 implementation verification

Executed on 2026-10-12 in this Windows workspace with Node 24.15.0 and the pre-migration package manager 11.12.1. Locked development dependencies are TypeScript 5.8.3, Vite 8.3.4, Playwright Test 1.64.0, axe Playwright 4.13.0 and Node types 24.19.2. Playwright installed Chromium 156.0.8078.4, Firefox 157.0 and WebKit 27.2.

| Check | Result and limit |
| --- | --- |
| Dependency installation and `pnpm install --frozen-lockfile` | Passed with the updated lockfile; audit reported zero vulnerabilities. |
| Browser installation | Initial download failed on a certificate chain; retry with Node's system CA store installed all three engines successfully. |
| `pnpm test` after `pnpm install --frozen-lockfile` | All 44 pure tests passed, with no skips. |
| `pnpm run build` after `pnpm install --frozen-lockfile` | Strict TypeScript checking and Vite build passed. |
| TypeScript file inspection | `tsc --noEmit --listFilesOnly` includes `engine/core.ts`, `src/app.ts`, `e2e/play.spec.ts`, `playwright.config.ts` and `vite.config.ts`; provenance directories are excluded. |
| `pnpm run test:e2e --project=desktop-chromium` | One startup case passed. |
| `pnpm run test:e2e` | All five startup cases passed in desktop Chromium/Firefox/WebKit and mobile Chromium/WebKit emulation. No skips, page/console errors or failed asset requests. |
| Development/preview inspection | Opened the entry through `pnpm run dev` and `pnpm run preview` in the collaborative browser. Confirmed title/heading, entry text, dark stylesheet and loaded JS/CSS resources. |
| Artifact inspection | `dist/` contains only `index.html` and generated original-entry JS/CSS. Asset references are relative. No engine, oracle, archive or official artwork ships. |
| `git diff --check` and ignore check | Passed; Playwright reports/results are ignored. |

The static artifact has three files: 512-byte HTML, 839-byte JS and 325-byte CSS. [The startup test](../e2e/play.spec.ts) requires text written by the actual TypeScript entry and the stylesheet's computed background. It fails on page errors, console errors, failed requests and HTTP error responses. [The browser configuration](../playwright.config.ts) starts its own Vite server and disables server reuse, including in CI.

The collaborative preview retained two Electron preload errors from its earlier blank-tab initialization. Those entries predated navigation to Rollmino. The separate Playwright runs passed their page/console error checks. The visual inspection establishes only the minimal entry and loaded assets.

No gameplay, native touch dragging, accessibility audit, physical-device check, production root/subpath suite or deployment is claimed. Axe is installed for later accessibility tests. T11 adds the production test configuration. The exhaustive rules sweep was not repeated because T03 does not change rules or the solver; T02 records its latest run.

## pnpm migration verification

Executed on 2026-10-12 in this Windows workspace with Node 24.15.0 and pnpm 12.10.0. The user chose pnpm as the default package manager for this web project. `package.json` now pins that version. The existing dependency lock was imported into `pnpm-lock.yaml`, and the previous lockfile was removed. Direct dependency versions remain TypeScript 5.8.3, Vite 8.3.4, Playwright Test 1.64.0, axe Playwright 4.13.0 and Node types 24.19.2.

| Actual pnpm command | Result and limit |
| --- | --- |
| `pnpm install --frozen-lockfile` | Passed with the imported lockfile. |
| `pnpm install --force --frozen-lockfile` | Reinstalled all 23 applicable packages through pnpm without changing the lockfile. The installed Vite entry is a junction into pnpm's virtual store. |
| `pnpm exec playwright install chromium firefox webkit` | Passed using the already installed browser builds. |
| `pnpm test` | All 44 pure tests passed, with no skips. |
| `pnpm run build` | Strict checking and Vite build passed. The generated HTML/JS/CSS filenames and sizes match the pre-migration artifact. |
| `pnpm run test:e2e --project=desktop-chromium` | One startup case passed; direct script argument forwarding works. |
| `pnpm run test:e2e` | All five desktop/mobile-emulation startup cases passed, with no skips. The test server starts through `pnpm run dev`. |
| `pnpm run verify:all` | Independently validated all 62,208 Wizard answers in 33.01 seconds. |
| Documentation and diff inspection | All project command examples now use pnpm, including tickets, historical analysis, agent instructions and future CI setup. `git diff --check` passed. |

Historical verification sections and completed tickets label their commands as current equivalents and point to commit `df3e241` for original invocations. This section records the actual pnpm checks. Package-manager migration changes no puzzle rules or user-visible game behavior. Production root/subpath testing and deployment remain future tickets.

Future implementation results must name the actual commands/browser versions and distinguish automated emulation from physical-device checks. Physical-phone testing is not a release gate. Performance numbers above are observations, not UI or mobile requirements.
