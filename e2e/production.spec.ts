import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
import { cell, complete, fixtures, openGame, seed, slot } from './helpers.ts';

function productionErrors(page: Page, baseURL: string): string[] {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('requestfailed', event => errors.push(`Failed request: ${event.url()}`));
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  page.on('websocket', socket => errors.push(`Unexpected socket: ${socket.url()}`));
  page.on('request', event => {
    if (!event.url().startsWith(baseURL) || event.method() !== 'GET' || ['xhr', 'fetch', 'eventsource', 'font'].includes(event.resourceType())) {
      errors.push(`Unexpected runtime request: ${event.url()}`);
    }
  });
  return errors;
}

test('dist contains only the app entry, original favicon and compiled assets', () => {
  const files = readdirSync('dist', { recursive: true }).map(String).filter(path => !['assets'].includes(path));
  expect(files).toHaveLength(4);
  expect(files).toContain('index.html');
  expect(files).toContain('favicon.svg');
  expect(files.filter(path => /^assets[/\\].+\.js$/.test(path))).toHaveLength(1);
  expect(files.filter(path => /^assets[/\\].+\.css$/.test(path))).toHaveLength(1);
  for (const file of files) {
    const text = readFileSync(`dist/${file}`, 'utf8');
    for (const forbidden of ['original-handoff', 'research-archive', 'resetTestRandom', 'pointerEvidence', 'tests/oracle']) {
      expect(text).not.toContain(forbidden);
    }
  }
});

test('production starts hidden and loads required assets without runtime services', async ({ page, baseURL, request }) => {
  const errors = productionErrors(page, baseURL!);
  await seed(page);
  await page.goto('./');
  await expect(page).toHaveTitle('Rollmino');
  await expect(page.getByRole('heading', { name: 'Rollmino', exact: true })).toBeVisible();
  await expect(page.locator('#grid button[aria-label$="hidden"]')).toHaveCount(36);
  await expect(page.locator('#board-art circle')).toHaveCount(0);
  await expect(page.getByRole('button', { name: /hint|solution/i })).toHaveCount(0);
  const assets = await page.evaluate(() => [
    ...Array.from(document.querySelectorAll<HTMLScriptElement>('script[src]'), el => el.src),
    ...Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"], link[rel="icon"]'), el => el.href),
  ]);
  expect(assets).toHaveLength(3);
  for (const asset of assets) {
    expect(asset.startsWith(baseURL!)).toBe(true);
    const response = await request.get(asset);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toMatch(asset.endsWith('.svg') ? /image\/svg\+xml/ : asset.endsWith('.css') ? /text\/css/ : /javascript/);
    expect((await response.body()).length).toBeGreaterThan(0);
  }
  await page.locator('#start').click();
  await expect(page.locator('[data-content="blocker"]')).toHaveCount(7);
  await slot(page, 'navy').click();
  await cell(page, 4, 5).click();
  await expect(cell(page, 4, 5)).toHaveAttribute('data-content', 'navy');
  expect(errors).toEqual([]);
});

for (const fixture of fixtures) {
  test(`production completes ${fixture.id}, freezes, replays as practice and retains records`, async ({ page, baseURL }) => {
    const errors = productionErrors(page, baseURL!);
    await page.clock.install({ time: new Date('2026-10-13T09:59:50Z') });
    await page.clock.pauseAt(new Date('2026-10-13T10:00:00Z'));
    await openGame(page, fixture);
    for (const face of fixture.dice) await expect(page.getByRole('button', { name: `${face}, blocker`, exact: true })).toBeVisible();
    await page.clock.fastForward(54321);
    await complete(page, fixture);
    await expect(page.locator('#timer')).toHaveText('00:54.32');
    await expect(page.locator('#records-list li')).toHaveCount(1);
    await page.clock.fastForward(20000);
    await expect(page.locator('#timer')).toHaveText('00:54.32');
    await page.locator('#replay').click();
    await expect(page.locator('#grid button[aria-label$="hidden"]')).toHaveCount(36);
    await page.locator('#start').click();
    await page.clock.fastForward(5000);
    await complete(page, fixture);
    await expect(page.locator('#records-list li')).toHaveCount(1);
    await page.reload();
    await expect(page.locator('#level')).toHaveValue('STARTER');
    await expect(page.locator('#grid button[aria-label$="hidden"]')).toHaveCount(36);
    await page.locator('#level').selectOption(fixture.level);
    await expect(page.locator('#records-list li')).toHaveCount(1);
    await expect(page.locator('#records-list')).toContainText('00:54.32');
    expect(errors).toEqual([]);
  });
}
