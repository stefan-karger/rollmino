# T24. Scope verification to changes and releases

[Tracker and priority](README.md) | Blockers: [T17](17-maintenance-documentation.md), [T18](18-browser-test-coverage.md)

CI runs full browser, production and exhaustive checks for documentation-only edits. The handoff also requires the whole release sequence after any runtime/build change. The review recommends one clear policy using the actual reduced browser suite.

Files: .github/workflows/pages.yml, package scripts only if needed, agent instructions and the maintenance contract retained by T17.

## Work and checks

1. Document and implement scopes: documentation consistency checks; pure/build and affected browser checks for app edits; independent exhaustive verification for model/rules/solver changes; broad native-browser and artifact checks for releases.
2. Keep main/manual publication behind complete release checks, including exhaustive verification, and deploy their exact tested build. Reduced PR checks must never enable publishing.
3. Make path selection explicit and conservative. Handle mixed edits, dependencies, configuration, unknown files and manual dispatch. Prefer existing conditions/scripts to a routing framework.
4. Keep required-check behavior valid for docs-only PRs. Preserve T23 diagnostics/cancellation if implemented and replace contradictory handoff rules in one place.

Validate selection for docs-only, CSS/app, rules/solver, dependency/configuration and mixed PRs, main pushes and manual releases. Run selected commands locally where applicable; build before production tests. Do not rerun unchanged full app suites solely for this policy edit.

## Acceptance

- [x] Maintained guidance and CI implement the same understandable scope policy.
- [x] Model/rules/solver changes and releases retain independent exhaustive checks.
- [x] Publication passes broad required checks and deploys their exact artifact.
- [x] Selection/failure/required-check evidence covers the event and change cases without silent skips.

## Completion evidence

2026-10-13. Added the small dependency-free `scripts/verification-scope.mjs` selector and replaced the old blanket local policy with the [same scope table used by CI](../../IMPLEMENTATION_PLAN.md#verification). Markdown/provenance-only PRs run documentation consistency. Pure-test edits run pure tests. App/records/UI/browser edits select build and affected browser/artifact checks. Rules/solver/fixtures, dependency/configuration/unknown paths and all push/manual release events retain complete checks; oracle/verifier-only edits retain pure plus independent exhaustive checks. Mixed groups combine conservatively.

CI checks out complete comparison history, validates base/head SHAs and reads a NUL-delimited Git diff with rename detection disabled so both deleted and added paths count. Missing comparison information fails instead of silently selecting no tests. The selector emits only fixed workflow flags. The always-running `Test and build` job performs documentation checking even for empty/docs-only PR diffs, with no workflow path filter or skipped required job. Main/manual publication still requires successful broad tests and the exact preceding dist. PRs never publish, and non-main manual checks cannot configure/upload/deploy Pages. T23 diagnostics, PR cancellation, read-only build permissions and dependent non-cancelling deployment remain intact.

All 72 pure tests passed, including 12 policy regressions for docs/empty, CSS/assets, app/session, records, rules/fixtures, oracle/verifier, test-only, dependency/configuration/unknown, mixed/renamed paths, push/manual/unknown events, missing comparison data and literal emitted workflow flags. Actual CLI examples and a real committed Git comparison selected expected flags. The affected UI and records manifests contain 86 and 26 cases; broad selection retains 94 cases and five artifact checks. Documentation checking now includes all current Git-listed Markdown, including new docs, while excluding frozen provenance copies. It passed 21 files/101 local links. Official actionlint 1.7.12 and `git diff --check` passed.

No runtime, model or browser-test behavior changed, so unchanged full app suites were not rerun solely for this policy edit. T22 supplies their latest passing release evidence. Hosted path selection/deployment has not yet been observed for this new workflow; local lint, selection tests and inspection are not reported as a hosted pass.
