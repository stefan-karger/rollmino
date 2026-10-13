# T26. Remove obsolete research and provenance duplicates

[Tracker and priority](README.md) | Blockers: [T17](17-maintenance-documentation.md)

Old proposals, copied engines/verifiers, source-only experiments, unrequested ideas and incremental setup/package-manager narratives add navigation noise. The two archived engines match each other, as do the archived verifiers; canonical maintained code supersedes them.

Files: PLAN.md, historical parts of docs/RESEARCH.md and docs/TEST-RESULTS.md, original-handoff, research-archive, SHA256SUMS.txt, remaining historical guidance and archival-retention instructions.

## Work and checks

1. Verify exact historical files are committed and retrievable before removal. Keep one stable archive commit reference instead of another copied archive directory. Check resolved deletion paths stay within the intended workspace.
2. Preserve source/model data/links, known validation regressions, verification method/limits and the dated V1 deployment reference retained by T17. Do not relabel experiments as maintained checks.
3. Remove superseded plans, duplicate old engines/verifiers/experiments and unrequested ideas from active maintenance. Trim incremental setup/package-manager narratives once current setup remains complete.
4. Update the explicit retention policy, checksum description and remaining links. Preserve canonical engine/fixtures/oracle/exhaustive verification. Do not create feature tickets for unrequested ideas.

Verify archived file retrieval, local files/anchors, documented commands and git diff --check. Inspect the deletion diff for canonical/runtime/test files. Documentation/provenance cleanup needs no new browser or hardware gate.

## Acceptance

- [ ] Obsolete material leaves everyday navigation and remains retrievable by commit.
- [ ] Source evidence, regression history and independent verification limits remain concise and accessible.
- [ ] Canonical code/fixtures/tests and accepted behavior are preserved.
- [ ] Evidence records removed paths, archive reference and actual size reduction.

## Completion evidence

Add dated implementation and verification results before marking the tracker done.
