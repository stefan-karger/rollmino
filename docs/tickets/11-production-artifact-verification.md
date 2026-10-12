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
   - `npm run preview` at `http://127.0.0.1:4173/`.
   - `npm run preview -- --port 4174 --base /rollmino/` at `http://127.0.0.1:4174/rollmino/`.
2. Create Chromium root/Pages projects with these base URLs. Navigate relative to the project base rather than hardcoding `/`. Neither configuration/test rebuilds; it must consume the preceding build.
3. Verify title/heading, hidden ready, deterministic Start/blockers, R/F/placement, full fixture completion, frozen time, practice exclusion and saved-record reload through public controls.
4. Fail on page exceptions, unexpected error logs and missing required JS/CSS/favicon assets. Inspect requests and exclude runtime API, external font, analytics and development-HMR dependencies from the artifact.
5. Inspect `dist/` for original application assets only. No rulebook graphics, copied logos, provenance archives, oracle/test code or cheat panel.
6. Run the complete release sequence against the final code, including the strengthened exhaustive check. Record actual browser/runtime versions and pass counts in completion evidence.

## Verification

```bash
npm ci
npm test
npm run build
npm run test:e2e
npm run test:e2e:prod
npm run verify:all
```

Open both mounts with available browser tools and check Start/placement/assets. A development-server pass is not a production-artifact pass. Record a code reference and optional artifact hash/path so later release work can identify what was checked; a commit is not required merely to attach evidence.

## Done when

- [ ] Root and Pages-path projects test the same preceding `dist/` successfully.
- [ ] No test config rebuilds or drops the subpath when navigating.
- [ ] Full fixture completion/reload records work without missing assets, unexpected errors or runtime services.
- [ ] The full release command sequence passes on the code being recorded.
- [ ] Artifact inspection confirms only original application content ships and evidence states the actual automated environment.

## Completion evidence

Not yet recorded. Add the actual changes, command results, checks and code reference here before setting this ticket to `done` in the tracker. Follow the [completion rules](README.md#working-and-completing-tickets).
