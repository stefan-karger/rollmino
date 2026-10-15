# Verification evidence

The [contract](../IMPLEMENTATION_PLAN.md#verification) defines current checks. This file records performed results and their limits; [archived ticket evidence](#historical-archive) supplies implementation details. Local checks do not establish a new deployment.

## Shared action styles, headers and placed-piece states

On 2026-10-15, [T40](tickets/T40-unframed-tutorial.md) applied the user's follow-up refinements: unframed tutorial navigation/examples, secondary Back and primary Next around plain progress, and one Tutorial heading. All labeled action buttons now share the exercise Play primary style or Review tutorial secondary style. Highscores replaces Personal bests and shares identical heading typography and text-only Home links with Tutorial. Explicit tab indices retain the links in WebKit's native keyboard order. The ordinary footer follows Level, New game, Replay, Home, with two columns on narrow phones. The exercise has one compact Redo action; Reset step and its checkpoint code are removed, while individual Undo recovery remains.

Available tray pieces keep solid colors; placed pieces now show muted cell outlines and a check mark. They remain selectable/repositionable, with restriction marks and occupied drag regions preserved. Shared-preview inspection covered both headers, primary/secondary computed styles, 320px footer targets and native placement/selection/Remove/Undo state changes. The native geometry check now compares the actual SVG rectangle corners through `getScreenCTM`, accounting for Firefox's larger client paint bounds on outlined shapes without widening the alignment threshold.

All 75 pure tests and the final strict build passed. The complete five-project browser run passed all 145 cases without skips in 5.0 minutes using one worker; all five existing-artifact cases passed at root and `/rollmino/` in 8.8 seconds against that build. Independent verification checked 62,208 Wizard answers in 67.14 seconds earlier in this ticket, with its model/fixtures/verifier/oracle unchanged through the later UI refinements. Documentation consistency and `git diff --check` passed. The ticket records exact commands, deliberately interrupted provisional runs, the Firefox teardown diagnostic and the Firefox/WebKit corrections before the final clean pass. Playwright invocations ran sequentially, the temporary reuse config was removed and the user's process 15372 remains on port 5173.

Coverage retains native keyboard/mouse and Chromium touch, fixed exercise protection, clean restart/terminal behavior, wall time/Undo/history, record retention/storage faults, reduced-motion axe, narrow reflow, dropdown contrast and both production mounts. Mobile projects/previews remain emulation; CSS zoom is reflow coverage, and held-drag Redo uses a synthetic cleanup click. No physical-device, pen, screen-reader or publication pass is claimed. Earlier sections below record the preceding UI stages.

## Simplified tutorial navigation

On 2026-10-15, [T39](tickets/T39-tutorial-navigation.md) replaced the tutorial's scattered actions with one Back/progress/Next bar. Try exercise replaces Next on the final panel. The compact header, shared static-example section and grouped exercise Reset/Redo actions match the new board's section style. Replay example and its highlighting/timer/cleanup code are removed; the six explanations, literal transforms/levels, native heading focus and untimed exercise behavior remain.

All 75 pure tests, strict build and 13 focused tutorial/accessibility cases passed. The full five-project run passed all 145 cases without skips in 1.9 minutes; all five existing-artifact cases passed at root and `/rollmino/` in 8.5 seconds against that build. Independent verification checked 62,208 Wizard answers in 62.28 seconds. Documentation consistency and `git diff --check` passed. Playwright invocations ran sequentially, the temporary server-reuse wrapper was removed and the user's process 15372 remained on port 5173.

Coverage includes last-panel-only exercise access and backtracking, static artwork through elapsed time, progress/heading focus, keyboard/tap exercise and review flows, reduced-motion axe, 320px grouped navigation and 200% CSS zoom. The ticket records exact commands and limits. Shared-preview snapshot/evaluation returned client automation errors after reopening the tab, so no new manual visual/screenshot pass is claimed. Mobile checks remain emulation; physical devices, pen, screen readers and publication were not verified.

## Permanent responsive game and exercise layout

On 2026-10-15, [T38](tickets/T38-main-responsive-layout.md) promoted the selected responsive comparison at number 2 to the default and applied its shared styling to the exercise. Both now use one compact three-by-three tray with controls above it on phones and the tray to the right of board/controls from 900 CSS pixels. Static ordinary-game HTML keeps the clock above play and secondary actions/collapsed help below it. The numbered switch, layout query handling, alternative styles and temporary control movement are removed. Accessible piece names, hover titles, teaching instructions and fixed-piece protection remain.

All 75 pure tests and the strict 15-module build passed. The final clean development run passed all 145 cases without skips in 2.0 minutes, reusing the user's existing Vite server through a temporary config importing all five projects. All five production cases passed at both artifact mounts in 8.5 seconds against that build; the artifact also excludes comparison controls/code. Independent verification validated 62,208 Wizard answers in 56.05 seconds. Documentation consistency and `git diff --check` passed. Playwright invocations ran sequentially, the temporary wrapper was removed and the user's process 15372 remained on port 5173.

Coverage includes shared game/exercise layout and axe at representative phone/tablet/desktop sizes, native occupied-region dragging, clock/draft/focus/Undo through reflow, keyboard/tap exercise completion and computed dropdown contrast of at least 4.5:1. The ticket records exact commands, preliminary assertion corrections and a run interrupted by development reloads before the final clean pass. Preview DOM inspection confirmed the exercise styling and wider tray placement; later client snapshot failures prevent a new exercise/phone screenshot claim. Exercise teaching content may scroll; mobile projects/resizing remain emulation. No physical-device, native-popup, pen, screen-reader or publication pass is claimed. The comparison sections below record earlier stages before this default was selected.

## Merged tray and responsive comparison

On 2026-10-15, [T37](tickets/T37-merged-tray.md) combined prototype 1's mobile placement with prototype 2's shared tray/control backgrounds. Candidates 1 and 2 place controls above a single three-by-three tray without individual piece cards. Candidate 2 moves the tray beside the board/controls from 900 CSS pixels. Native selects/options now use opaque dark backgrounds with readable light text.

All 75 pure tests, strict build, the three focused prototype cases and all 145 development cases passed. The full browser run reused the developer-owned server through a temporary config importing the repository's five projects; it completed without skips in 2.1 minutes. All five artifact cases passed in 8.3 seconds against that build, and independent verification checked 62,208 Wizard answers in 27.65 seconds. Documentation consistency and local `git diff --check` passed. Playwright invocations ran sequentially; the temporary config was removed and the user's port-5173 process remained running.

Expanded checks cover the shared 3×3 arrangement, controls above the mobile tray, tray placement beside the board/controls on tablet/desktop, 1024×600 merged-layout fit, occupied hit-region/native drag alignment at tablet width, continuing state through resizing and at least 4.5:1 computed select/option contrast. The ticket records setup diagnostics, exact commands and limits. Native popup appearance is not captured by the shared browser screenshots; phone projects/resizing remain emulation. At this stage the comparisons had not been published or selected as the default layout.

## Game layout prototype verification

On 2026-10-15, [T36](tickets/T36-game-prototypes.md) implemented the requested fixed 1–4 switch and four optional `?prototype=X` game layouts. Time, board, controls and all nine pieces remain visible without horizontal overflow or switch obstruction at 320×568, 390×844 and 1366×768. Names are retained for accessibility/hover; secondary actions/help sit below play. Switching preserves the current board, clock, draft and Undo. Reload preserves the requested prototype URL while returning to fresh Home. Missing/invalid values retain the established layout.

Frozen installation, all 75 pure tests and strict build passed. The final `pnpm run test:e2e --max-failures=1` passed all 145 cases without skips in 1.9 minutes; `pnpm run test:e2e:prod` passed all five root/subpath cases in 8.4 seconds against that build. `pnpm run verify:all` independently validated 62,208 Wizard answers in 27.71 seconds. Documentation consistency and `git diff --check` passed. The conservative selector required the complete sequence for new paths; Playwright invocations ran sequentially.

The ticket records the reproduced reload issue, repair, actual commands and acceptance evidence. Prototype coverage adds keyboard/state/query regressions in all five projects, native centered-art/hit-region dragging in the three desktop engines and layout/axe checks in desktop Chromium. Mobile projects and shared-preview resizing remain emulation. Short/landscape scrolling is allowed; no physical-device/pen/screen-reader checks or deployment are claimed. No final layout had been selected at this stage.

## Board coordinate text selection

On 2026-10-15, the board's decorative SVG text received `user-select: none` and its WebKit prefix so row/column labels cannot acquire a text-selection highlight. The rule is scoped to `#board-art text`.

Shared Chromium preview inspection initially reported `user-select: auto` and returned `3` from a Selection API attempt on row 3. After the change, all twelve coordinate labels reported `none` and returned empty selection text from the same synthetic check. A native click on row 3 followed by Start left selection empty, revealed seven blockers and focused the first cell. Ordinary help text retained `user-select: auto`. This is browser inspection and a synthetic selection check, not a physical-device or native double-click/long-press test.

| Command | Result |
| --- | --- |
| `pnpm install --frozen-lockfile` | Passed without dependency/lock changes |
| `pnpm exec playwright install chromium firefox webkit` | Passed |
| `pnpm test` | All 75 pure tests passed |
| `pnpm run build` | Strict TypeScript/Vite build passed |
| `pnpm run test:e2e e2e/play.spec.ts e2e/input.spec.ts e2e/accessibility.spec.ts --max-failures=1` | All 88 selected cases passed in 1.3 minutes |
| `pnpm run test:e2e:prod` | All five root/subpath artifact cases passed in 8.1 seconds against the preceding build |

The changed-path selector chose pure/build/UI/artifact checks without exhaustive solving. Playwright invocations ran sequentially; phone projects remain emulation. Documentation consistency and local `git diff --check` passed. These results establish local verification only.

## Home and tutorial local readiness

Executed on 2026-10-13 in the Windows workspace with Node 24.15.0, pnpm 12.10.0 and the existing pinned browser/tool versions. Runtime revision `0c80425` contains the complete Home/history, separate records, six-panel tutorial, Starter exercise and handled-offer flow. T35 changes verification and documentation only. [Archived T30 through T34 evidence](#historical-archive) retains the implementation checks, repairs/retries and rendered observations. The new revision is locally ready; the dated public releases below do not establish its publication.

| Check | Final local evidence |
| --- | --- |
| Frozen installation | `pnpm install --frozen-lockfile` passed without dependency/lock changes |
| Pure and strict build | T35 `pnpm test` passed all 75; `pnpm run build` passed strict TypeScript/Vite |
| Complete development matrix | T34 `pnpm run test:e2e --max-failures=1` passed all 136 selected cases without skips in 4.2 minutes for the unchanged final runtime |
| Expanded magnified layouts | T35 `pnpm run test:e2e --grep "200 percent CSS zoom" --workers=1 --max-failures=1` passed the three updated desktop cases in 25.4 seconds, adding Home, all panels, exercise alignment/tap/Undo and reachable Home to existing game/records reflow |
| Both artifact mounts | T35 `pnpm run test:e2e:prod` passed all five expanded cases in 18.6 seconds against the preceding build at `/` and `/rollmino/` |
| Independent reference | T34 `pnpm run verify:all` independently validated 62,208 Wizard answers in 50.07 seconds for the unchanged model/oracle/runtime |
| Selection | Final development listing remains 136 cases in eight files, with 23 ordinary and nine exercise completions; production remains five cases, with four ordinary and two exercise completions |

The two-mount persistence scenario now continues from ordinary ranked/practice completion through records/reload, every panel, the intended exercise Undo/Rotate/Flip completion, time passage without a record write, review, direct repeat exercise, Redo, Home and clean hidden ordinary Play/Start. Requests remain local static GETs with no runtime services/errors. Artifact inspection rejects test instrumentation, oracle/fixture collection markers and provenance; teaching ships only intentional data. Browser/history cancellation, timed replay, fixed baseline/independent teaching answer, off-step/terminal solving, record faults and flag/clear isolation retain their earlier meaningful regressions.

T35's changed-path selector chose pure/build/UI/artifact, without a new exhaustive requirement. Its explicit unchanged-code rule reuses the complete T34 matrix and exhaustive result, while running the newly expanded cases. Every rebuilt file's SHA-256 matched the T34 build:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `58c141c492fdb77c0626404ccaa49521655ca7aaf273252c8c4f1e1ca28bb066` |
| `favicon.svg` | `896ba7e0ad6aa5df68614160a44f16de23a9a1762be6490f63d98c884e1002cc` |
| `assets/index-aQ_UVemO.js` | `3c709ad818b5961f5f8bd50610f5bc6773fe0350bf221a0ead84b6ff3c11d940` |
| `assets/index-CvODy6fN.css` | `526327e9f3c27cc259e1b066fe23b4650f9ccc14e52762d1a6a5a523651b73f3` |

Collaborative-browser reviews in T30–T34 inspected Home, records, tutorial coverage/contact/transform art and actual exercise placement/Undo/completion at 320px and short landscape sizes. The user's shape/name centering correction is implemented and tested. Axe covers Home first/returning offers, panels, exercise/completion, records/dialog and ordinary states; native keyboard, mouse/capture and Chromium CDP touch/cancel/scroll remain in the reduced matrix. Phone projects are emulation. Reset during a held exercise drag uses explicitly synthetic cleanup; CSS zoom checks reflow/rendered alignment and tap play, not browser-chrome zoom or zoomed native dragging. No physical phone, pen, physical set, screen-reader or learner-observation pass is claimed.

The contract is consolidated around the implemented behavior, with untimed teaching and the sole handled-offer persistence exception explicit. `pnpm run check:docs`, local/staged `git diff --check` and acceptance review precede the final commit. CI/deployment files, permissions, main/manual full gates, dependent tested-artifact deployment and non-cancelling serialized publication are unchanged. Nothing was pushed or deployed; publication remains a separate authorized release action.

## Exercise drag test reflow repair

On 2026-10-13, the reported GitHub Actions failure was traced to cached viewport coordinates in the native exercise mouse test. Undo changes the lesson text above the board and tray. When the initial instruction wraps onto an extra line, the later task moves both targets; the cached source point lands outside the occupied HTML grab square, so no drag starts and the expected two preview squares never appear.

In the Windows workspace with Node 24.13.0 and pnpm 12.10.0, the original 800px scenario passed all three desktop engines. Setting its viewport to 320px reproduced the reported `#draft-art rect` count failure in Chromium, Firefox and WebKit. Shared-preview DOM-driven placement/Undo measurements at that width showed the instruction shrinking from 96px to 72px and the source moving up 24px; the stale point hit the SVG rather than a grab square. These measurements are separate from native mouse verification.

The test now measures the source and destination before each drag, after any preceding transition, and retains the narrow viewport to exercise instruction reflow. Fixed-piece protection, successful native placement, held preview, synthetic Reset step during capture, late release rejection and subsequent native dragging remain asserted. Runtime, rules, workflow and timeouts are unchanged. All four rebuilt artifact hashes match the [Home/tutorial readiness artifact](#home-and-tutorial-local-readiness).

| Check | Actual local evidence |
| --- | --- |
| Setup | `pnpm install --frozen-lockfile` passed without lock changes; the first browser attempt found missing executables, then `pnpm exec playwright install chromium firefox webkit` installed the pinned browsers |
| Focused regression | `pnpm run test:e2e e2e/exercise.spec.ts --grep "native mouse" --workers=1` failed all three cases with stale coordinates at 320px, then passed all three after repair in 11.3 seconds |
| Conservative scope | `node scripts/verification-scope.mjs pull_request e2e/exercise.spec.ts docs/TEST-RESULTS.md` selected pure/build/all browsers/artifact/exhaustive for the currently unclassified exercise test path |
| Pure and build | `pnpm test` passed all 75 tests; `pnpm run build` passed strict TypeScript/Vite |
| Complete development matrix | `pnpm run test:e2e` passed all 136 cases without skips in 1.8 minutes |
| Both artifact mounts | `pnpm run test:e2e:prod` passed all five cases in 8.4 seconds against the preceding build at `/` and `/rollmino/` |
| Independent reference | `pnpm run verify:all` independently validated all 62,208 Wizard answers in 51.94 seconds |
| Documentation and whitespace | `pnpm run check:docs` and `git diff --check` passed |

Playwright invocations ran sequentially. Desktop mouse input is browser automation; phone projects remain emulation and held-drag Reset remains synthetic cleanup. These are local results, with no new hosted run or deployment claimed.

## Follow-up local verification

Executed on 2026-10-13 in the Windows workspace with Node 24.15.0, pnpm 12.10.0, TypeScript 5.8.3, Vite 8.3.4 and Playwright 1.64.0. Browser projects use the previously verified bundled Chromium 156, Firefox 157 and WebKit 27.2, including phone emulation.

| Check | Actual evidence |
| --- | --- |
| Frozen installation | Passed without dependency/lock changes before runtime checks |
| Pure suite | All 68 tests passed after T25, including the 12 T24 scope checks; literal regressions, independent oracle, transforms/anchors, session/time/Undo and records remain |
| Strict build | Passed for the final runtime change in T22; later policy/test/documentation edits do not change app output |
| Development browser matrix | T22 passed all 94 selected cases in 2.5 minutes, with no skips |
| Existing artifact | T22 passed all five root/Pages-path cases in 12.3 seconds against its preceding build |
| Exhaustive reference | T22 independently checked every returned answer for all 62,208 Wizard boards in 30.51 seconds |
| Documentation and CI | Local link/anchor/script checks pass; official actionlint 1.7.12 passed; scope/required-check/failure behavior was tested/inspected locally |

T15's native regression failed in Chromium/Firefox before repair and then passed. An interrupted broad run reported Windows socket error 10055; its standalone one-worker retry passed all 212 applicable cases in 11.9 minutes with eight then-expected CDP skips. The earlier concurrent Playwright trace-file errors came from shared output paths. Subsequent invocations ran sequentially and the resource failure did not recur.

T16's clipping regression failed before repair and passed in all five projects at 320/390/800 CSS pixels. T19's repaired alignment assertion detected a controlled grid offset, accepted legitimate extra original assets and rejected injected test content; all temporary faults were restored. Rendered bounds supply visual CSS-zoom alignment because Firefox's CTM measurement differed under CSS zoom.

T18 reduced repeated browser permutations from 207 cases/about 80 complete games to 93 cases/21 games and production from ten cases/12 games to five cases/four games. T20 adds phone practice completion without new scenarios; T22 adds one DOM-stability scenario. T22 therefore had 94 cases/23 complete games. Native desktop keyboard/mouse/capture, mobile Chromium CDP touch/secondary input/cancel/scroll, cross-platform tap/focus/confirmations/reload, meaningful layout/axe and both artifact mounts remain covered. The [coverage map](../IMPLEMENTATION_PLAN.md#browser-coverage-map) explains selection.

T23's controlled local failure retained a 42,720-byte trace at the configured diagnostic upload path. [Hosted run 38398713542](https://github.com/stefan-karger/rollmino/actions/runs/38398713542) later failed one Chromium confirmation case and uploaded a 245,686-byte diagnostic artifact. Its trace was downloaded and inspected; deployment was skipped. Hosted cancellation has not been observed. T24's conservative selector and exact workflow flags passed 12 regressions; docs-only required jobs remain active, releases retain all gates, and missing PR comparison data fails. T25 retained independent frozen-input/fixed-placement/output-alias checks while merging four overlapping tests. Runtime/oracle behavior is unchanged.

## Confirmation race repair

On 2026-10-13, T27 reproduced the hosted failure deterministically. Cancelling a level change and opening a different confirmation in the same JavaScript task lets the first dialog's queued native `close` event consume the new pending action. The new desktop-Chromium regression failed before repair, leaving Wizard active instead of the confirmed Expert level. Shared-preview DOM submission reproduced the same lost transition.

The controller now handles form submission and Escape cancellation directly, clears the pending action, closes the native dialog, then accepts or restores focus. It no longer reads a later dialog's action from a queued `close` event. Native buttons, keyboard submission and the modal remain; no delay or retry masks the race. The controlled regression uses DOM events, while the existing confirmation scenario still exercises public controls in all five projects.

`pnpm install --frozen-lockfile`, `pnpm test`, `pnpm run build`, `pnpm run check:docs` and `git diff --check` passed. The new regression and existing five-platform confirmation scenario passed all six focused cases. `pnpm run test:e2e` passed all 95 cases without skips in 2.7 minutes, including Escape/modal focus, active time/play preservation and record clearing. `pnpm run test:e2e:prod` passed all five root/subpath cases in 10.8 seconds against the preceding build. No rules/oracle code changed, so the local scope did not repeat exhaustive solving. The main push runs all hosted release gates, including the exhaustive verifier; these local results do not claim publication.

[Hosted run 38403323980](https://github.com/stefan-karger/rollmino/actions/runs/38403323980) for `b336573` subsequently passed every release gate and deployed. Shared-preview live checks reproduced rapid cancellation/reopening, confirmed the new level through Tab/Enter, and observed hidden ready with Start focused. The live JavaScript asset matched the local build's SHA-256 hash. This is the dated T27 release, before the marking revision below.

## Level-specific square markings

On 2026-10-13, T28 implements the user's revision: inset white square outlines, with the piece color visible inside, replace all restriction numbers. Only the current level's restricted pieces are marked; Starter shows none and Master excludes navy. There is no display option. One drawing helper supplies marks to tray, transformed previews and committed squares. Accessible names identify restrictions, rule text explains the marks, and anchor/legality symbols sit inside their square without crossing its outline. Rules, sessions and records remain unchanged.

`pnpm install --frozen-lockfile`, `pnpm test` and `pnpm run build` passed, including all 68 pure tests and strict browser-test checking. The final `pnpm run test:e2e` selected 96 cases: 95 passed in 3.1 minutes; one records reload hit Windows `net::ERR_NO_BUFFER_SPACE`. `pnpm run test:e2e --last-failed --workers=1` then passed that unchanged case in 6.1 seconds. The new regression independently checks all five literal restriction groups, transformed previews, tray/committed square outlines, white stroke/transparent centers, accessible labels, mark ownership and cancelled level changes. Native input, focus, narrow layouts and existing accessibility checks passed in the broader matrix.

Shared-preview inspection at 390 CSS pixels verified the square-outline appearance against the user's reference, distinct anchors and no horizontal overflow. It observed zero Starter marks and nine Wizard marks on the four placed special pieces, with matching tray artwork. These were DOM-driven visual checks, not physical-phone tests. `pnpm run test:e2e:prod` passed all five root/subpath cases in 10.3 seconds against the preceding build. Documentation checks and `git diff --check` passed. No rules/oracle changes require a new local exhaustive sweep; the main push retains the full hosted release gate. These local results do not claim the new markings are published.

## Integrated V1 local release verification

On 2026-10-13 the original integrated V1 passed frozen installation, all 59 pure tests, strict build, 207 applicable development cases with eight deliberate CDP skips, ten root/subpath artifact checks and 62,208 independent Wizard answers. A clean detached contributor checkout also passed install/pure/build/artifact checks. These are dated V1 results, not the current suite counts.

## Public Pages release verification

Published and checked on 2026-10-13 at about 07:48 UTC at [Rollmino](https://stefan-karger.github.io/rollmino/). [Workflow 38363711259](https://github.com/stefan-karger/rollmino/actions/runs/38363711259) for [8105f41](https://github.com/stefan-karger/rollmino/commit/8105f41fd93139cae446945b959fb3c7267c9f18) passed frozen setup, 59 pure tests, build, 207 applicable development cases, ten artifact checks and all 62,208 independent answers, then deployed the checked dist. Pages uses Actions, HTTPS and a main-only environment, without a custom domain.

Live shared-preview checks verified title, hidden ready, all five levels, Start/seven blockers, Starter/Wizard controls, a transformed brown placement and fresh Starter on reload. HTML/JS/CSS/favicon returned 200 with correct MIME/project paths; live asset hashes matched the downloaded CI artifact. No errors were observed during the inspected Wizard controls. Preview screenshot/resize calls failed during that live check; DOM geometry and HTTP inspection supplied its evidence. Follow-up local changes do not claim another hosted release.

## Verification limits

The maintained cell-array oracle uses separate literal IDs/contact groups and no engine legality calls/masks. It reuses canonical orientations, so its independence is bounded by literal geometry tests. Exhaustive verification establishes one legal answer per encoded physical board, not solution counts, human difficulty, all partial-state completability or manufacturer certification. Wizard answers satisfy the other levels' restriction subsets; five separate exhaustive sweeps were not performed.

Native mouse/CDP touch tests are browser automation; phone projects are emulation. Synthetic blur/visibility/cancellation branches remain labeled as such. CSS zoom tests check reflow, rendered alignment and tap play, not browser-chrome zoom or zoomed native dragging. Physical phones, pen, a current physical set and screen-reader tests were not performed and are not hidden release gates. Source/rights and record-storage limits remain in the contract.

## Historical archive

The completed T29 through T35 tracker, analysis, acceptance and implementation evidence remain in local Git commit `ba45457fe49dc746af5cbcf1de975802771e5e19`. On 2026-10-13, all seven tracker rows were marked done. Before removing the tracker and seven ticket files at the user's request, each working file matched that commit and all eight archived blobs were retrieved. For example, use `git show ba45457fe49dc746af5cbcf1de975802771e5e19:docs/tickets/README.md` or `git show ba45457fe49dc746af5cbcf1de975802771e5e19:docs/tickets/T35-integrated-verification.md`. The current contract and readiness evidence stay in the working tree. The cleanup selected documentation-only verification. `pnpm run check:docs` passed for five Markdown files and 35 local links, and local/staged `git diff --check` passed before commit. No app, model or verification-script changes required another runtime suite.

Earlier completed tickets remain in the [V1 archive](https://github.com/stefan-karger/rollmino/tree/61454115b4cf1310ec0f72e50b3fc5e0ec38dd03/docs/tickets) and the [T15 through T26 archive](https://github.com/stefan-karger/rollmino/tree/757746a0b7652cf311b43b0392bfbeadfec7c452/docs/tickets). T27 and T28's maintained verification evidence appears above.

Superseded plans/research, copied engines/verifiers, exploratory scripts, incremental setup/package-manager narratives and the original checksum manifest remain retrievable at [archive commit 46880c4e32f5cdb9a243133b580893cbb6bb29d9](https://github.com/stefan-karger/rollmino/tree/46880c4e32f5cdb9a243133b580893cbb6bb29d9). Every T26 removal target and the old results document matched that commit and its blob was retrieved before removal. Earlier deleted decision/scope/handoff files remain in its ancestry. No new archive directory replaces them.

For example, use `git show 46880c4e32f5cdb9a243133b580893cbb6bb29d9:PLAN.md` or inspect `git log 46880c4e32f5cdb9a243133b580893cbb6bb29d9 -- docs/DECISIONS.md` to find prior revisions. The removed `SHA256SUMS.txt` described the original 26-file snapshot, not later edits or the current artifact. Old existence-only sweeps/transient audits are historical experiments, not substitutes for the maintained independent verifier. Canonical rules, fixtures, oracle, tests and exhaustive script remain active.
