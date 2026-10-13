# T13. Close local release gates and update the implementation handoff

[Tracker](README.md) | [Product specification](../../IMPLEMENTATION_PLAN.md) | [Coding guidelines](../../CODING_GUIDELINES.md)

## Blockers

- [T12](12-pages-workflow.md)

Plan coverage: acceptance gates and documentation tasks in sections 11 through 14; local readiness part of Slice 5.

## Outcome

A new contributor can install, play, test and build V1 from current documentation, and every local release gate has traceable evidence.

## Scope and files

Update `README.md`, `docs/TEST-RESULTS.md`, active scope/UI/test summaries and agent/prompt wording where implementation changes their status. Review the current plan, ticket evidence and app diff. Keep user decisions and historical/provenance documents accurate.

## Implementation steps

1. Map every plan acceptance gate to actual feature/test evidence from T01 through T12. Check the final integrated code rather than treating completion of isolated tickets as proof of V1.
2. Document supported Node/setup/browser installation, runnable scripts, controls/anchors, timer/background behavior, practice/eligibility, selected-level clearing and storage limitations.
3. Replace obsolete statements that the browser app/tooling do not exist with the actual local implementation status. Until T14 passes, describe hosting as pending, not live.
4. Record actual command results, versions and artifact/code reference. Distinguish reference evidence, current app checks, automated mobile emulation and any optional real-device checks. Do not invent a physical-phone, physical-game or screen-reader release gate.
5. Check all agreed constraints: exact model, one authoritative Game, complete tap/keyboard and required drag, frozen completion, full active Undo, no layouts in records, no hints/pause/Redo/backend/PWA/Android or copied official assets.
6. Review KISS/YAGNI adherence and remove introduced unused options, forwarding layers, test-only production APIs or speculative capabilities. A cleanup that changes runtime behavior requires the affected tests/artifact checks again.
7. Record any accepted deviations and their decision updates. Undocumented behavior changes are unresolved work, not a reason to mark this ticket done.

## Verification

Review current T11/T12 evidence and perform a clean contributor setup if it has not been demonstrated on the final application/configuration. Use the full release sequence for changed runtime/build code:

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm run build
pnpm run test:e2e
pnpm run test:e2e:prod
pnpm run verify:all
```

Documentation-only edits need link/command consistency checks rather than invented new app-test results. Inspect the README steps and compare every listed script with `package.json`. Verify that all local plan gates have evidence and that live verification remains explicitly pending T14.

## Done when

- [x] All local acceptance gates have passing evidence for the integrated code.
- [x] Setup/controls/storage/test instructions match actual implementation and runnable commands.
- [x] No unapproved features, unused architecture, copied content or production cheat API remains.
- [x] Test limitations and any accepted deviations are explicit; unavailable hardware is not a hidden gate.
- [x] The handoff states local release readiness and identifies T14 as the remaining publication task.

## Completion evidence

2026-10-13: Reviewed the integrated canonical engine, session/records boundaries, app input/rendering, original-only artifact, current T01-T12 evidence and plan gates. Updated README, AGENTS, maintenance prompt, active scope/UI/test summaries, package description and `docs/TEST-RESULTS.md#integrated-v1-local-release-verification` with current commands, controls/anchors, wall time, practice eligibility, storage limits, browser evidence and a mapping for every local acceptance gate. Historical research/decision/provenance files remain unchanged. No product deviation, runtime behavior change, unused forwarding layer, assistance UI, service worker/backend or production test/session API was introduced. Verified final tracked app/build configuration in a detached clean checkout of 1a9c8c6: frozen install added all 23 packages from the local store, 59 pure tests passed, strict build passed, and all 10 production root/subpath checks passed in 17.1 seconds with existing installed browsers. All four contributor artifact hashes exactly match the T11 integrated artifact; tracked files stayed clean. Verified the resolved absolute temporary worktree path before removing only that checkout. Main frozen installation also passed after the description-only package edit. One-off Node consistency inspection checked 51 relative links/anchors and 85 pnpm command references; `git diff --check` passed. T11 supplies the unchanged runtime full release evidence, including 207 applicable browser cases and 62,208 independent answers; T12 supplies passing actionlint/workflow review. Windows, Node 24.15.0, pnpm 12.10.0 and Playwright 1.64.0. Emulation/synthetic/CSS zoom and unperformed hardware/screen-reader limits are explicit. Public activation and live verification remain T14; local readiness is not a publication claim.
