# T23. Retain CI failure diagnostics and cancel stale PR checks

[Tracker and priority](README.md) | Blockers: none

Playwright retains failure traces, but the workflow uploads only a successful Pages artifact. Its non-cancelling concurrency rule also keeps superseded PR checks running.

Files: .github/workflows/pages.yml, Playwright configuration only if needed and concise CI guidance.

## Work and checks

1. Upload existing test-results and any useful existing report on failure with short retention. Keep diagnostics separate from deployable dist; avoid runtime dependencies and permanent success artifacts.
2. Cancel superseded runs in the same PR group. Preserve serialized, non-cancelling active publication and PR isolation from deployment.
3. Preserve read-only build permissions, dependent deployment, build-once/tested-artifact flow and failed-check protection. Coordinate shared workflow edits with T24.

Validate YAML with available actionlint and inspect event/failure conditions. Verify artifact paths against an existing trace or controlled local test failure, then restore the fault. State any unavailable hosted-run check instead of claiming remote upload was verified.

## Acceptance

- [ ] Browser failures have a reachable diagnostic upload with useful paths and bounded retention.
- [ ] PR cancellation is conditional and publication remains protected.
- [ ] Failed checks cannot upload/deploy the app artifact and PRs cannot publish.
- [ ] Evidence distinguishes local validation from hosted observations.

## Completion evidence

Add dated implementation and verification results before marking the tracker done.
