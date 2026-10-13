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

## Implementation evidence

Executed on 2026-10-13 at runtime revision `0c80425`, with only the verification/documentation diff in this ticket. Read the actual T30–T34 evidence, contract, input/accessibility/production assertions, conservative selector and unchanged Pages workflow. Reviewed every acceptance criterion against the combined regressions; [the maintained readiness evidence](../TEST-RESULTS.md#home-and-tutorial-local-readiness) records the commands, artifact hashes, counts, flow and limits.

- Frozen install passed; `pnpm test` passed all 75 tests and `pnpm run build` passed strict TypeScript/Vite. SHA-256 before/after rebuilding matched all four T34 artifact files, proving the runtime/artifact is unchanged.
- The actual changed paths selected pure/build/UI/artifact and no new exhaustive check. Following this ticket's explicit reuse rule, T34's complete 136-case pass (4.2 minutes, no skips) and 62,208 independently validated answers (50.07 seconds) remain the full runtime/model evidence. They were not repeated solely for a new ticket/document number.
- Extended the existing CSS zoom scenario with Home, six panels, direct exercise, actual SVG/grid alignment, tap placement/Undo and reachable Home. `pnpm run test:e2e --grep "200 percent CSS zoom" --workers=1 --max-failures=1` passed all three updated desktop cases in 25.4 seconds. This is CSS reflow/tap verification, not physical-device or browser-chrome zoom evidence.
- Extended the existing artifact persistence scenario instead of adding repeated full games. `pnpm run test:e2e:prod` passed all five expanded cases in 18.6 seconds at root and Pages subpath against the preceding build. Each mount covers ordinary completion/frozen time, timed unranked practice, records/reload, explanation, real exercise completion, unchanged records through learning/time, review/direct redo and subsequent hidden clean Play/Start. Asset/service/request exclusions remain; oracle/fixture/test-instrumentation markers were added to artifact inspection.
- Final selection remains 136 development cases in eight files, with 23 ordinary and nine exercise completions; production has five cases, four ordinary and two exercise completions. No final full-matrix single invocation after these test-only expansions is claimed: unchanged cases retain T34's pass and affected cases have the focused/production passes above.
- Consolidated the contract's transitional accepted-revision text into current behavior, a dedicated Tutorial section and explicit local/public distinction. README describes the same learning, records and persistence behavior. Earlier dated evidence remains, and status remains only in the tracker. Existing CI/deployment gates and tested-artifact publication are unchanged.

Acceptance is satisfied by the implementation and these executable checks, including the earlier independent fixed-placement/geometry, history/cancellation/time/focus, storage/clearing and Home-only learning regressions. No unresolved implementation blocker remains. Documentation/local/staged diff checks precede commit. This establishes local readiness only: no push, deployment, physical-phone, pen, physical-set, screen-reader or learner-observation pass is claimed. A later publication must run the existing main/manual full gates and deploy that tested artifact.
