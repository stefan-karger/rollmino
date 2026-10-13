# T14. Deploy GitHub Pages and verify the live site

[Tracker](README.md) | [Product specification](../../IMPLEMENTATION_PLAN.md) | [Coding guidelines](../../CODING_GUIDELINES.md)

## Blockers

- [T00](00-repository-setup.md)
- [T13](13-release-handoff.md)

Plan coverage: section 13 and final deployment checks of Slice 5.

## Outcome

Rollmino is publicly available from `stefan-karger/rollmino` at `https://stefan-karger.github.io/rollmino/`, with a successful checked-artifact deployment and recorded live smoke check.

## Scope and files

Use the repository/Pages settings and established workflow. Update README/live test evidence and the tracker. This ticket includes external publication only when it is executed; creating these tickets does not create a repository, push or deploy.

## Implementation steps

1. Reuse T00's public `stefan-karger/rollmino` and local tracked main branch. Verify the actual target, description, visibility and current remote history; do not create a second repository or replace unrelated work.
2. Review the release changes before pushing and preserve the source/provenance policy. Public source is distinct from app assets in `dist/`. Integrate remote changes without forced history replacement; do not invent a code license or claim naming/rights clearance.
3. Select GitHub Actions as the Pages publishing source and configure the `github-pages` environment/main deployment settings. No custom domain.
4. Publish the release code and run the established main/manual workflow. Confirm its checks, artifact upload and dependent deployment succeed. The deployed artifact must be the one tested in that workflow, not an unverified local rebuild.
5. Open the actual project-path URL with available browser tools. Verify Rollmino title, no missing assets/errors, hidden ready, all levels, Start, a representative legal placement/transform and visible records controls. Check that reload abandons unfinished play. Localhost records belong to another origin, so do not expect them on Pages.
6. Set the repository homepage to the verified `https://stefan-karger.github.io/rollmino/` URL. Record repo/deployed code, Actions/deployment link, live URL, check date/browser and observed outcome. Update README/status and close the tracker row only after actual hosting evidence exists.
7. If account access, repository configuration, Actions or hosting prevents completion, set this row to `blocked` and record the concrete cause/next action. Local readiness remains proven by T13, but publication is not done.

## Verification

Use the actual GitHub workflow run as evidence for the full release sequence and checked artifact. Perform the live smoke checks above. If hosting reveals a code/path bug, repair it, rerun affected/full artifact gates as appropriate, redeploy through the same workflow and recheck.

No physical-phone check is required. Do not claim a live pass from the local `/rollmino/` mount or a queued/failed Actions run.

## Done when

- [x] T00's public repository is correctly connected and Pages uses the agreed Actions deployment.
- [x] The release workflow's checks and deployment succeed for the recorded code.
- [x] The actual live URL loads working app assets and passes the listed smoke checks.
- [x] URLs, code/run references and live verification evidence are recorded without unperformed device claims.
- [x] The handoff reflects the actual public release and the central row is marked done only with this evidence.

## Completion evidence

2026-10-13, about 07:48 UTC: Reused public stefan-karger/rollmino with main upstream and the intended description. Verified admin/push access through the existing T00 Git credential helper, reviewed all tracked release files/diffs and confirmed remote main was an ancestor of local HEAD. No credentials, unofficial artwork, dependency directories or test artifacts entered the release; provenance stayed source-only. Enabled Pages build_type workflow, HTTPS/no custom domain, and the github-pages environment with a main branch policy. Pushed the ten implementation commits without forced history replacement. [Workflow 38363711259](https://github.com/stefan-karger/rollmino/actions/runs/38363711259) succeeded for [8105f41fd93139cae446945b959fb3c7267c9f18](https://github.com/stefan-karger/rollmino/commit/8105f41fd93139cae446945b959fb3c7267c9f18), including all setup, 59 pure tests, strict build, 207 applicable development cases with 8 expected CDP-only skips, all 10 artifact cases, 62,208 independently checked Wizard answers, tested-dist upload and dependent deployment. Hosted runtime was Ubuntu/Node 24.21.0 with pinned pnpm 12.10.0 and Playwright 1.64.0. The verified [live URL](https://stefan-karger.github.io/rollmino/) is now the repository homepage. Shared T3 preview Chromium 152.0.7977.130/Electron 44.4.2 verified title, hidden ready, all five levels, seven blockers on Start, Starter and Wizard play, real Rotate/Flip followed by a legal vertical brown placement, action feedback, visible records controls and full-page reload abandonment to Starter/00:00.00/no placements. Wizard selection used the native Level control change event; placement/transforms used the public controls. A live diagnostic error/rejection listener captured no errors for those interactions. HTML, favicon, CSS and JS returned HTTP 200 with correct MIME types and subpath URLs; all three live asset hashes exactly match the previously tested artifact, including JS SHA-256 787FC845B2C80897D12E26C544424C8F479773F38AC57149402828B3DE70B236. Screenshot/resize calls in the live shared preview failed, so no new live visual audit is claimed; DOM geometry/control/resource checks and T10 local visual evidence remain explicit. Localhost records were not expected on the new Pages origin. Updated README, active handoff summaries and test results to actual publication; no physical-device or screen-reader check is claimed.

Downloaded the `github-pages` artifact from the successful run and inspected its tar paths before extraction. Its four file SHA-256 hashes exactly match the previously tested local build; the three served asset hashes match that archive too. Final documentation checks passed for 102 relative links/anchors and 86 pnpm command references. All remaining ticket rows now have completion evidence. The release-evidence commit changes documentation only; runtime/artifact bytes remain the checked ones above.