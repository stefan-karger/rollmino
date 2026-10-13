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
2. Use one test/build job on a suitable GitHub runner with Node 24, the pinned pnpm version, frozen-lockfile installation and Playwright browser/system dependency installation. Install pnpm with `pnpm/action-setup`, reading its version from `package.json`, before `actions/setup-node` enables `cache: pnpm` with `cache-dependency-path: pnpm-lock.yaml`. Use compatible official action versions from the sources linked in the plan and [pnpm setup documentation](https://github.com/pnpm/action-setup).
3. Run `pnpm install --frozen-lockfile`, `pnpm test`, `pnpm run build`, `pnpm run test:e2e`, `pnpm run test:e2e:prod` and `pnpm run verify:all` in the required order. Build once; artifact tests reuse that build.
4. Configure Pages for deployment runs, then upload the exact tested `dist/` with the official Pages artifact action. No branch-generated Jekyll site or build inside the deploy job.
5. Make deployment depend on successful build/checks, use the `github-pages` environment and output URL, and scope `pages: write`/`id-token: write` to deployment. Keep build repository permissions read-only. Serialize Pages deployments so they cannot publish out of order.
6. Guard deployment/upload/configuration steps appropriately for pull requests. Document selecting GitHub Actions as the Pages source; T14 applies it on the public target repository.
7. Review YAML structure, event conditions, action compatibility, artifact path and failure propagation. Do not claim a GitHub-run pass from a local review; T14 records actual Actions/deployment evidence.

## Verification

If application/configuration changes require a fresh build, run the release sequence:

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm run build
pnpm run test:e2e
pnpm run test:e2e:prod
pnpm run verify:all
```

For workflow-only edits, reuse current local application evidence and inspect that each workflow command matches an existing runnable script. Validate YAML through available tooling without adding a runtime dependency just for this ticket. Check that failed tests prevent upload/deployment and PR conditions cannot enter the deploy job.

## Done when

- [x] The workflow has explicit test/build and dependent deploy jobs with correct triggers.
- [x] PRs cannot publish; main/manual publication requires successful full checks.
- [x] The uploaded/deployed artifact is the tested `dist/` and no deploy rebuild occurs.
- [x] Permissions, Pages environment, concurrency and repository setup instructions are explicit.
- [x] Local/configuration validation is recorded honestly; the remaining actual-host verification is assigned to T14.

## Completion evidence

2026-10-13: Added `.github/workflows/pages.yml` and README Pages setup/trigger/permission instructions. PR, main-push and manual runs use Node 24, packageManager-pinned pnpm, frozen installation and Playwright system/browser setup. pnpm setup precedes the Node pnpm cache. All existing release commands run in order; build runs once, production checks reuse dist, and only successful non-PR runs configure Pages/upload dist. Deploy needs build, uses github-pages and receives Pages/OIDC write permissions; build has only contents/pages read. Publication runs share a non-cancelling concurrency group. Checked current primary documentation for [Pages actions](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [checkout](https://github.com/actions/checkout), [Node setup](https://github.com/actions/setup-node) and [pnpm setup](https://github.com/pnpm/action-setup); selected checkout/setup-node v7, pnpm action-setup v6, configure-pages v5, upload-pages-artifact v4 and deploy-pages v4. Reviewed conditions, needs, default failure propagation, artifact path and command/script correspondence. The official actionlint 1.7.12 Windows binary passed workflow validation with no findings; its downloaded archive matched the published SHA-256 `6E7241B51E6817EA6A047693D8E6FED13B31819C9A0DD6C5A726E1592D22F6E9`. No runtime dependency was added. `git diff --check` passed. T11 full-release evidence applies because no app/build configuration changed. The standalone gh login was absent, but the existing T00 Git credential helper authenticated API reads as stefan-karger without exposing or recording credentials. Pages activation and actual Actions/deployment evidence remain T14; no hosted-run pass is claimed here.
