# Verification evidence

The [contract](../IMPLEMENTATION_PLAN.md#verification) defines current checks. This file records performed results and their limits; ticket evidence supplies implementation details. Local checks do not establish a new deployment.

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

T18 reduced repeated browser permutations from 207 cases/about 80 complete games to 93 cases/21 games and production from ten cases/12 games to five cases/four games. T20 adds phone practice completion without new scenarios; T22 adds one DOM-stability scenario. Current development therefore has 94 cases/23 complete games. Native desktop keyboard/mouse/capture, mobile Chromium CDP touch/secondary input/cancel/scroll, cross-platform tap/focus/confirmations/reload, meaningful layout/axe and both artifact mounts remain covered. The [coverage map](../IMPLEMENTATION_PLAN.md#browser-coverage-map) explains selection.

T23's controlled local failure retained a 42,720-byte trace at the configured diagnostic upload path. Hosted diagnostic upload/cancellation has not been observed. T24's conservative selector and exact workflow flags passed 12 regressions; docs-only required jobs remain active, releases retain all gates, and missing PR comparison data fails. T25 retained independent frozen-input/fixed-placement/output-alias checks while merging four overlapping tests. Runtime/oracle behavior is unchanged.

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
