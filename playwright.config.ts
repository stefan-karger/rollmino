import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testIgnore: '**/production.spec.ts',
  forbidOnly: Boolean(process.env.CI),
  reporter: 'list',
  timeout: 60000,
  use: {
    baseURL: 'http://127.0.0.1:5173/',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop-chromium', grepInvert: /@touch/, use: { ...devices['Desktop Chrome'] } },
    { name: 'desktop-firefox', grepInvert: /@shared|@touch/, use: { ...devices['Desktop Firefox'] } },
    { name: 'desktop-webkit', grepInvert: /@shared|@touch/, use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chromium', grepInvert: /@shared|@desktop/, use: { ...devices['Pixel 7'] } },
    { name: 'mobile-webkit', grepInvert: /@shared|@desktop|@touch/, use: { ...devices['iPhone 13'] } },
  ],
  webServer: {
    command: 'pnpm run dev',
    url: 'http://127.0.0.1:5173/',
    reuseExistingServer: false,
  },
});
