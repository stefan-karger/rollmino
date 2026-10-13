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

- [ ] Maintained guidance and CI implement the same understandable scope policy.
- [ ] Model/rules/solver changes and releases retain independent exhaustive checks.
- [ ] Publication passes broad required checks and deploys their exact artifact.
- [ ] Selection/failure/required-check evidence covers the event and change cases without silent skips.

## Completion evidence

Add dated implementation and verification results before marking the tracker done.
