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

- [ ] T00's public repository is correctly connected and Pages uses the agreed Actions deployment.
- [ ] The release workflow's checks and deployment succeed for the recorded code.
- [ ] The actual live URL loads working app assets and passes the listed smoke checks.
- [ ] URLs, code/run references and live verification evidence are recorded without unperformed device claims.
- [ ] The handoff reflects the actual public release and the central row is marked done only with this evidence.

## Completion evidence

Not yet recorded. Add the actual changes, command results, checks and code reference here before setting this ticket to `done` in the tracker. Follow the [completion rules](README.md#working-and-completing-tickets).
