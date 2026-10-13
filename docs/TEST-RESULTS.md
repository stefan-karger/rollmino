# Verification evidence

The [contract](../IMPLEMENTATION_PLAN.md#verification) defines current checks. This file records performed results and their limits; ticket evidence supplies implementation details. Local checks do not establish a new deployment.

## Home and tutorial local readiness

Executed on 2026-10-13 in the Windows workspace with Node 24.15.0, pnpm 12.10.0 and the existing pinned browser/tool versions. Runtime revision `0c80425` contains the complete Home/history, separate records, six-panel tutorial, Starter exercise and handled-offer flow. T35 changes verification and documentation only. [T30–T34 evidence](tickets/README.md) retains the implementation checks, repairs/retries and rendered observations. The new revision is locally ready; the dated public releases below do not establish its publication.

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

Superseded plans/research, copied engines/verifiers, exploratory scripts, incremental setup/package-manager narratives and the original checksum manifest remain retrievable at [archive commit 46880c4e32f5cdb9a243133b580893cbb6bb29d9](https://github.com/stefan-karger/rollmino/tree/46880c4e32f5cdb9a243133b580893cbb6bb29d9). Every T26 removal target and the old results document matched that commit and its blob was retrieved before removal. Earlier deleted decision/scope/handoff files remain in its ancestry. No new archive directory replaces them.

For example, use `git show 46880c4e32f5cdb9a243133b580893cbb6bb29d9:PLAN.md` or inspect `git log 46880c4e32f5cdb9a243133b580893cbb6bb29d9 -- docs/DECISIONS.md` to find prior revisions. The removed `SHA256SUMS.txt` described the original 26-file snapshot, not later edits or the current artifact. Old existence-only sweeps/transient audits are historical experiments, not substitutes for the maintained independent verifier. Canonical rules, fixtures, oracle, tests and exhaustive script remain active.
