import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/production.spec.ts',
  forbidOnly: Boolean(process.env.CI),
  timeout: 60000,
  reporter: 'list',
  use: { ...devices['Desktop Chrome'], trace: 'retain-on-failure' },
  projects: [
    { name: 'production-root', use: { baseURL: 'http://127.0.0.1:4173/' } },
    { name: 'production-pages', use: { baseURL: 'http://127.0.0.1:4174/rollmino/' } },
  ],
  webServer: [
    { command: 'pnpm run preview', url: 'http://127.0.0.1:4173/', reuseExistingServer: false },
    { command: 'pnpm run preview --port 4174 --base /rollmino/', url: 'http://127.0.0.1:4174/rollmino/', reuseExistingServer: false },
  ],
});
