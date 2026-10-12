# T12. Add the checked-artifact GitHub Pages workflow

[Tracker](README.md) | [Product specification](../../IMPLEMENTATION_PLAN.md) | [Coding guidelines](../../CODING_GUIDELINES.md)

## Blockers

- [T11](11-production-artifact-verification.md)

Plan coverage: section 13; deployment configuration part of Slice 5.

## Outcome

The repository has a workflow that checks pull requests and publishes a successfully tested artifact on main/manual deployment. T00 owns repository creation/local synchronization; T14 owns Pages activation and actual live publication.

## Scope and files

Create `.github/workflows/pages.yml` and document its triggers/permissions/setup. Reuse all established scripts; do not invent a second build/deploy toolchain or application API secret.

## Implementation steps

1. Add pull-request, main-push and manual triggers. Pull requests run checks without deployment. Main/manual deployment runs only after the required checks succeed.
2. Use one test/build job on a suitable GitHub runner with Node 24, lockfile installation and Playwright browser/system dependency installation. Use compatible official checkout/setup-node action versions from the sources linked in the plan.
3. Run `npm ci`, `npm test`, `npm run build`, `npm run test:e2e`, `npm run test:e2e:prod` and `npm run verify:all` in the required order. Build once; artifact tests reuse that build.
4. Configure Pages for deployment runs, then upload the exact tested `dist/` with the official Pages artifact action. No branch-generated Jekyll site or build inside the deploy job.
5. Make deployment depend on successful build/checks, use the `github-pages` environment and output URL, and scope `pages: write`/`id-token: write` to deployment. Keep build repository permissions read-only. Serialize Pages deployments so they cannot publish out of order.
6. Guard deployment/upload/configuration steps appropriately for pull requests. Document selecting GitHub Actions as the Pages source; T14 applies it on the public target repository.
7. Review YAML structure, event conditions, action compatibility, artifact path and failure propagation. Do not claim a GitHub-run pass from a local review; T14 records actual Actions/deployment evidence.

## Verification

If application/configuration changes require a fresh build, run the release sequence:

```bash
npm ci
npm test
npm run build
npm run test:e2e
npm run test:e2e:prod
npm run verify:all
```

For workflow-only edits, reuse current local application evidence and inspect that each workflow command matches an existing runnable script. Validate YAML through available tooling without adding a runtime dependency just for this ticket. Check that failed tests prevent upload/deployment and PR conditions cannot enter the deploy job.

## Done when

- [ ] The workflow has explicit test/build and dependent deploy jobs with correct triggers.
- [ ] PRs cannot publish; main/manual publication requires successful full checks.
- [ ] The uploaded/deployed artifact is the tested `dist/` and no deploy rebuild occurs.
- [ ] Permissions, Pages environment, concurrency and repository setup instructions are explicit.
- [ ] Local/configuration validation is recorded honestly; the remaining actual-host verification is assigned to T14.

## Completion evidence

Not yet recorded. Add the actual changes, command results, checks and code reference here before setting this ticket to `done` in the tracker. Follow the [completion rules](README.md#working-and-completing-tickets).
