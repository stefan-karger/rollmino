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

- [x] Obsolete material leaves everyday navigation and remains retrievable by commit.
- [x] Source evidence, regression history and independent verification limits remain concise and accessible.
- [x] Canonical code/fixtures/tests and accepted behavior are preserved.
- [x] Evidence records removed paths, archive reference and actual size reduction.

## Completion evidence

2026-10-13. Removed PLAN.md, docs/RESEARCH.md, docs/REFERENCE-VERIFICATION.md, SHA256SUMS.txt, the three original-handoff files and seven research-archive/experiments files. Before deleting, each physical file's Git blob hash matched archive commit `46880c4e32f5cdb9a243133b580893cbb6bb29d9`, and every archived blob was actually retrieved. The old TEST-RESULTS.md was also verified/retrieved before trimming. The two copied engines have identical SHA-256 hashes, as do the two verifier copies.

Resolved every target under the intended workspace before deletion. Removed only named committed files, then removed the verified empty directories without recursive deletion. No unarchived file was removed. The deletion diff contains only the 14 scoped historical/provenance paths; canonical engine/src/fixtures/tests/scripts/configuration are preserved.

Retained the contract's exact source/model tables/links, known validation regressions, independent verification method/limits and original-assets policy. The results document now separates recent performed checks, dated V1 integration/publication and honest emulation/measurement limits. Replaced retention instructions and checksum wording with [one historical archive reference](../TEST-RESULTS.md#historical-archive). Original interview documents removed in T17 remain in that commit's ancestry. No experimental result was relabeled as maintained, no new archive copy or feature ticket was created, and current setup remains complete.

Across removed files and the trimmed results document, 2,338 lines/173,949 bytes became 47 lines/7,034 bytes, a reduction of 2,291 lines and 166,915 bytes in that material. Documentation checks passed all 18 remaining maintained Markdown files and their local files/anchors/script names; `git diff --check` passed. Runtime/browser/hardware gates were not repeated for this documentation/provenance-only change under T24. The last runtime release evidence remains T22, with T25's 68 passing pure tests.
