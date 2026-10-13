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

- [x] Browser failures have a reachable diagnostic upload with useful paths and bounded retention.
- [x] PR cancellation is conditional and publication remains protected.
- [x] Failed checks cannot upload/deploy the app artifact and PRs cannot publish.
- [x] Evidence distinguishes local validation from hosted observations.

## Completion evidence

2026-10-13. Added a `failure()` diagnostic upload of existing `test-results/` using [official upload-artifact v7](https://github.com/actions/upload-artifact), with a run/attempt-specific name, seven-day retention and no-files ignore for earlier failures that have no browser trace. Diagnostics remain separate from dist and are never uploaded on success. Current official documentation supports the selected action/inputs; no runtime dependency was added.

`cancel-in-progress` now evaluates true only for pull requests, whose groups remain per PR. Push/manual publication retains the shared deployment group and false cancellation. Read-only build permissions, dependent deployment and build-once/tested-dist flow are unchanged. Failed tests leave the job failed, so normal success-gated Pages configuration/upload and the dependent deploy cannot run. PR conditions still prohibit publication.

The existing checksum-verified official actionlint 1.7.12 Windows binary passed. A temporary single Chromium test deliberately failed after loading the app, producing a 42,720-byte `test-results/.../trace.zip` and error context at the configured upload path. The temporary test was removed in `finally`; no app fault remains. Documentation checks and `git diff --check` passed. Current application evidence is T22's passing full gate; unchanged app suites were not repeated. No hosted diagnostic upload or remote cancellation has been observed yet.
