# T11. Test the production artifact at root and Pages subpath

[Tracker](README.md) | [Product specification](../../IMPLEMENTATION_PLAN.md) | [Coding guidelines](../../CODING_GUIDELINES.md)

## Blockers

- [T10](10-responsive-accessibility.md)

Plan coverage: sections 10, 12 and 13; artifact verification part of Slice 5.

## Outcome

The already-built static app completes fixture gameplay and retains records at both `/` and `/rollmino/` without missing assets or runtime services.

## Scope and files

Add `playwright.production.config.ts`, `e2e/production.spec.ts` and `test:e2e:prod` as `playwright test --config playwright.production.config.ts`. Reuse public-action fixture helpers. Update the development config's test matching so it excludes production-only cases. Change runtime asset paths only if checks expose a defect.

## Implementation steps

1. Configure two preview servers for the same existing `dist/`:
   - `pnpm run preview` at `http://127.0.0.1:4173/`.
   - `pnpm run preview --port 4174 --base /rollmino/` at `http://127.0.0.1:4174/rollmino/`.
2. Create Chromium root/Pages projects with these base URLs. Navigate relative to the project base rather than hardcoding `/`. Neither configuration/test rebuilds; it must consume the preceding build.
3. Verify title/heading, hidden ready, deterministic Start/blockers, R/F/placement, full fixture completion, frozen time, practice exclusion and saved-record reload through public controls.
4. Fail on page exceptions, unexpected error logs and missing required JS/CSS/favicon assets. Inspect requests and exclude runtime API, external font, analytics and development-HMR dependencies from the artifact.
5. Inspect `dist/` for original application assets only. No rulebook graphics, copied logos, provenance archives, oracle/test code or cheat panel.
6. Run the complete release sequence against the final code, including the strengthened exhaustive check. Record actual browser/runtime versions and pass counts in completion evidence.

## Verification

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm run build
pnpm run test:e2e
pnpm run test:e2e:prod
pnpm run verify:all
```

Open both mounts with available browser tools and check Start/placement/assets. A development-server pass is not a production-artifact pass. Record a code reference and optional artifact hash/path so later release work can identify what was checked; a commit is not required merely to attach evidence.

## Done when

- [x] Root and Pages-path projects test the same preceding `dist/` successfully.
- [x] No test config rebuilds or drops the subpath when navigating.
- [x] Full fixture completion/reload records work without missing assets, unexpected errors or runtime services.
- [x] The full release command sequence passes on the code being recorded.
- [x] Artifact inspection confirms only original application content ships and evidence states the actual automated environment.

## Completion evidence

2026-10-13: Added `playwright.production.config.ts`, `e2e/production.spec.ts` and `test:e2e:prod`. Root and /rollmino/ Chromium projects serve the same preceding dist through Vite preview, with no build inside either configuration. Each mount checks hidden ready, deterministic blockers, required JS/CSS/favicon status and MIME types, public-control completion of all three fixtures, frozen timing, practice exclusion and record retention after reload. Page exceptions, unexpected error logs, failed/missing assets, external/service/font requests and WebSockets fail these tests. Artifact audit confirms exactly four files and no provenance/oracle/test-hook content. The full ordered release sequence passed: frozen-lockfile installation; 59 pure tests; strict production build; 207 applicable development cases with 8 intentional CDP-only skips in 6.3 minutes; all 10 production cases in 15.5 seconds; all 62,208 Wizard answers independently validated in 27.36 seconds. A final strict typecheck also passed after the MIME assertions. Opened both production mounts in the T3 shared preview and checked Start, seven blockers, actual navy placement and correctly prefixed subpath asset URLs. The first visual-navigation attempt happened after the test-owned servers stopped; restarting the preview servers resolved it, then they were stopped before the release sequence. Tested JS artifact `dist/assets/index-DrVNgP7r.js` has SHA-256 `787FC845B2C80897D12E26C544424C8F479773F38AC57149402828B3DE70B236`; HTML, favicon and CSS are the only other artifact files. Windows, Node 24.15.0, pnpm 12.10.0 and Playwright 1.64.0; five development projects and two production Chromium projects. No live hosting, physical-device or screen-reader pass is claimed here.
