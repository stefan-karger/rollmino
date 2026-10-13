# T35: integrated verification and contract consolidation

Created on 2026-10-13 from the user's accepted onboarding plan. The [tracker](README.md) owns blockers and status. Read [the accepted revision](../../IMPLEMENTATION_PLAN.md#accepted-home-and-tutorial-revision), T30 through T34's actual implementation evidence and the [verification policy](../../IMPLEMENTATION_PLAN.md#verification) before checking the combined result.

## Problem and scope

Home, browser history, separate records and the tutorial cross the existing run/input/storage boundaries. Verify the complete accepted flow, consolidate the contract around what actually runs and record local readiness. Earlier tickets own their focused regressions and checks; this ticket is not a place to defer all testing or invent additional features.

Publication is outside this batch. Local readiness must remain distinct from the [dated live release evidence](../TEST-RESULTS.md#public-pages-release-verification). Preserve CI/deployment behavior and the tested-artifact policy.

## Acceptance

- Every Home action is functional: Play, Tutorial and Personal bests. Original identity, first/returning-visit emphasis and actual initialization readiness match the accepted revision; no incomplete menu destination or fake loading delay remains.
- The full public flow works: Home, hidden level selection, Start, ordinary completion, dedicated records, reload, self-paced explanation, short untimed Starter exercise, repeat review/redo and subsequent ordinary Play.
- Native and browser-history Home abandonment preserve board/time/focus on Cancel and discard the run on Confirm. Back from root Home can leave; Forward/reload cannot resurrect abandoned state or bypass Home-only tutorial access. No run remains active behind learning or records.
- Ordinary physical dice, exact pieces/contact groups, geometric transforms/anchors, full Undo, transactional rejection/cancellation, timing and terminal single-ranked consideration retain their regressions. Replay remains hidden, timed and unranked.
- Tutorial legality/fixed baseline and completion have independent oracle evidence. Off-step moves, Reset step, equivalent transforms, keyboard/tap/native pointer inputs and legal early finishes meet their ticket acceptance. Tutorial state and RNG/history cannot leak into ordinary play.
- Records keep their schema, ordering, dates, selected clearing, recovery and save-failure visibility. Clearing records leaves the handled-offer flag intact; flag faults cannot break records or gameplay.
- Existing representative complete-game coverage is adapted for Home and separate records rather than multiplied across unrelated permutations. Add only meaningful missing integrated scenarios. Preserve native mouse/capture, emulated touch/cancel/scroll, keyboard, focus, confirmations and malformed-state checks.
- Final Home, walkthrough, exercise, records and applicable dialog states have affected axe, visible-focus, reduced-motion and narrow/landscape/desktop layout evidence. Report CSS layout/reflow and phone emulation accurately.
- The exact built dist works at `/` and `/rollmino/`, with original assets, representative ordinary and tutorial completion, replay exclusion and reload retention. No fixture collection, oracle, provenance, alternate engine or mutable test API ships.
- The single contract and README describe the final implemented behavior, including the explicit untimed teaching/handled-offer exceptions. Remove transitional baseline contradictions or consolidate the accepted-revision section once its behavior is implemented. T29 remains analysis/evidence; ticket status remains only in the tracker.
- Update documentation/coverage counts to actual final selections and results. Separate performed checks from intended checks, and retain dated evidence and limits from earlier tickets.

## Verification and evidence

Inspect the actual final changed paths with the conservative selector. Check the complete reduced browser matrix, both artifact mounts and the independent 62,208-board reference sweep for this integrated readiness result. Use `pnpm install --frozen-lockfile`, install selected browsers if needed, `pnpm run check:docs`, `pnpm test`, `pnpm run build`, `pnpm run test:e2e`, `pnpm run test:e2e:prod`, `pnpm run verify:all` and local `git diff --check`.

Build before production tests, reuse that dist and run Playwright invocations sequentially. If earlier ticket evidence already covers the exact unchanged final code/artifact, cite it and run only missing or newly affected checks; do not repeat successful suites merely for a new document or ticket number. New code, failures or unresolved concerns justify reruns. Do not narrow unknown paths or alter CI gates to avoid required checks.

Record the tested revision, actual commands, selected/passed counts, failures/retries, artifact mounts, independent result count and inspection limits in this ticket and the maintained verification evidence. No physical phone, pen, physical set, screen-reader or learner-observation pass may be inferred from automation. These optional observations are not newly invented release gates.

Only after evidence satisfies every acceptance criterion may tracker status change. This ticket establishes local readiness, not deployment. Any later main/manual publication must run existing full release gates and deploy their tested artifact; PRs cannot publish.
