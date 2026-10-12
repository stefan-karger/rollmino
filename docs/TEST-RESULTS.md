# Reference validation results

These results concern the reference engine. Browser tooling, controls, records and deployment are not yet implemented; no app/mobile release pass is claimed.

## Original packaging evidence

Reported by the handoff preparation environment on 2026-10-12:

| Check | Reported result |
| --- | --- |
| `npm test` | 13 of 13 fast reference tests passed |
| Strict type check | Passed with TypeScript 5.8.3 |
| `npm run verify:all` | 62,208 Wizard boards returned non-null answers; the script additionally replay-validated one example |
| Runtime/environment | 23.87 seconds, Node 22.16.0 on the preparation machine |

The original wording described every answer as validated. The maintained loop actually checks answer existence; this document now distinguishes that from the stronger review audit.

## Independent handoff review

Executed on 2026-10-12 in this workspace, Windows, Node 24.15.0, npm 11.12.1 and local TypeScript 5.8.3:

| Check | Result and limit |
| --- | --- |
| Initial archive integrity | All 26 supplied SHA-256 entries matched before review edits. Canonical and archived engines were byte-identical. |
| `npm test` | All 13 reference tests passed; the fast baseline was rechecked during final planning. |
| `npm install` and `npm run typecheck` | Passed. Installation generated `package-lock.json`. |
| `npm run verify:all` | All 62,208 Wizard boards yielded non-null answers in 30.94 seconds. |
| Additional exhaustive audit | A separate cell-array checker validated all 62,208 answers in 28.77 seconds for IDs, bounds, blockers, overlaps, coverage and Wizard contacts. It reused canonical orientation data. |
| Observed empty solve latency | Maximum observed during that audit: 14.20 ms. This is not a worst-case or phone guarantee. |
| Deterministic partial-position sample | Xorshift seed `0x6a09e667`, 200 legal partial states per level. Many were dead ends; maximum observed solve 9.02 ms. This is not human difficulty evidence. |

The extra audit/sample were review experiments, not new maintained test files. Slice 0 of [IMPLEMENTATION_PLAN.md](../IMPLEMENTATION_PLAN.md) makes the stronger solution legality check reproducible.

## Known failures beyond the old suite

The review reproduced false wins for truncated dice and mismatched placement map keys/IDs, acceptance of sparse seven-element dice arrays and acceptance of unknown runtime levels. Passing the 13 old tests does not resolve these defects. The engine remains unchanged in this documentation pass; regression tests and repairs are the first implementation slice.

Future implementation results must name the actual commands/browser versions and distinguish automated emulation from physical-device checks. Physical-phone testing is not a release gate. Performance numbers above are observations, not UI or mobile requirements.
