# T03. Establish the strict web build and browser test setup

[Tracker](README.md) | [Product specification](../../IMPLEMENTATION_PLAN.md) | [Coding guidelines](../../CODING_GUIDELINES.md)

## Blockers

None.

Plan coverage: sections 2, 9 and 10; tooling part of Slice 1.

## Outcome

A minimal Rollmino entry page builds to a static artifact and opens through a configured browser test. This establishes tooling, not playable-game completion.

## Scope and files

Create `index.html`, the minimal `src/app.ts`/`src/styles.css` entry, `tsconfig.json`, `vite.config.ts` and `playwright.config.ts`. Add the initial startup case in `e2e/play.spec.ts`. Update `package.json`, lockfile and `.gitignore`. Do not add production-test configuration until T11.

## Implementation steps

1. Use Node 24 and retain the existing TypeScript compiler. Install and lock compatible Vite 8, Playwright Test, axe and Node 24 types:
   ```bash
   npm install --save-dev --save-exact vite@8 @playwright/test @axe-core/playwright @types/node@24
   npx playwright install chromium firefox webkit
   ```
2. Update package name/description to Rollmino and retain `private: true` for npm publication protection. Ignore Playwright reports/results. Keep archives outside the browser entry and `public/`.
3. Add strict no-emit TypeScript configuration: ES2022, ESNext modules, Bundler resolution, TypeScript import extensions, DOM libraries and configuration-file Node types. Include engine/src/browser tests/configs and exclude provenance directories.
4. Configure Vite with `base: './'` and an explicit ES2022 build target. Add a semantic Rollmino heading/title and minimal dark stylesheet with a real TypeScript entry. No router, framework, placeholder game state or runtime service.
5. Add these scripts, preserving existing pure test/verification commands. Add feature-test scripts when their test files exist; no no-op suites:
   - `typecheck`: `tsc --noEmit`
   - `dev`: `vite --host 127.0.0.1 --port 5173 --strictPort`
   - `build`: `npm run typecheck && vite build`
   - `preview`: `vite preview --host 127.0.0.1 --port 4173 --strictPort`
   - `test:e2e`: `playwright test`
6. Configure desktop Chromium/Firefox/WebKit and mobile Chromium/WebKit projects. Enable touch in mobile projects. Start the dev server through Playwright `webServer`; CI must not reuse an unrelated process.
7. Make the startup test verify the actual loaded entry/title with no page errors or missing app assets. T07 extends this same suite to gameplay.

## Verification

```bash
npm ci
npm test
npm run build
npm run test:e2e -- --project=desktop-chromium
```

Open the entry with `npm run dev` and the built entry with `npm run preview`. Inspect loaded JS/CSS and `dist/`. Do not claim a game or mobile-input pass from a startup smoke test. On Linux browser installation uses `--with-deps`.

## Done when

- [ ] A clean lockfile installation runs the commands above.
- [ ] Strict checking includes new browser/configuration TypeScript, not only the old core.
- [ ] Vite produces a static relative-asset build without archive/official content.
- [ ] All five named projects are configured and the initial Chromium startup case passes.
- [ ] Runtime/build dependencies serve the agreed stack; no speculative application architecture or unavailable test scripts are added.

## Completion evidence

Not yet recorded. Add the actual changes, command results, checks and code reference here before setting this ticket to `done` in the tracker. Follow the [completion rules](README.md#working-and-completing-tickets).
