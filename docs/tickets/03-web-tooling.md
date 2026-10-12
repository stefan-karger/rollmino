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

- [x] A clean lockfile installation runs the commands above.
- [x] Strict checking includes new browser/configuration TypeScript, not only the old core.
- [x] Vite produces a static relative-asset build without archive/official content.
- [x] All five named projects are configured and the initial Chromium startup case passes.
- [x] Runtime/build dependencies serve the agreed stack; no speculative application architecture or unavailable test scripts are added.

## Completion evidence

Completed checks on 2026-10-12 in Windows, Node 24.15.0 and npm 11.12.1. [Detailed results](../TEST-RESULTS.md#t03-implementation-verification).

- [package.json](../../package.json) and its lockfile use the Rollmino name and retain `private: true`. They lock Vite 8.3.4, Playwright Test 1.64.0, axe Playwright 4.13.0 and Node types 24.19.2 while retaining TypeScript 5.8.3. The added development/build/preview/browser-test scripts execute real tooling; pure tests remain separate.
- [tsconfig.json](../../tsconfig.json) strictly checks the engine, browser entry, browser tests and both configuration files with ES2022/ESNext, Bundler resolution, DOM/Node types and no emit. [vite.config.ts](../../vite.config.ts) produces relative assets with the ES2022 target. [index.html](../../index.html) and [src/app.ts](../../src/app.ts) provide a semantic heading/title, actual loaded TypeScript behavior and a minimal dark stylesheet.
- [playwright.config.ts](../../playwright.config.ts) configures all five named projects with touch-enabled mobile emulation. It starts its own server with reuse disabled. [e2e/play.spec.ts](../../e2e/play.spec.ts) checks loaded entry text/title/styles and fails on page/console errors, request failures or HTTP error responses. Reports/results are ignored.
- `npm ci`, `npm test` and `npm run build` passed. All 44 pure tests passed. The required Chromium startup command passed, followed by all five projects passing `npm run test:e2e` with no skips. Installed browsers are Chromium 156.0.8078.4, Firefox 157.0 and WebKit 27.2.
- Opened both dev and built entries in the collaborative browser and confirmed the heading, runtime text, dark background and JS/CSS resource loads. `dist/` contains only the original entry HTML/JS/CSS with relative references. No oracle, provenance or official assets ship. `git diff --check` passed.

The first browser download failed with `UNABLE_TO_VERIFY_LEAF_SIGNATURE`. This retry used the installed system certificate store and restored the previous environment setting afterwards:

```powershell
$rollminoNodeOptions = $env:NODE_OPTIONS
try {
  $env:NODE_OPTIONS = "$rollminoNodeOptions --use-system-ca"
  npx playwright install chromium firefox webkit
} finally {
  $env:NODE_OPTIONS = $rollminoNodeOptions
}
```

Configuration follows the official [Vite build documentation](https://vite.dev/guide/build.html) and [Playwright web-server/project documentation](https://playwright.dev/docs/test-webserver). The collaborative preview contained earlier Electron preload errors from blank-tab initialization; separate Playwright page/console checks passed. This is startup tooling, not a game, mobile-input or accessibility pass. Production configuration/testing remains T11; no deployment or physical-device checks were performed.
