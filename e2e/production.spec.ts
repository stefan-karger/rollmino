import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
import { cell, complete, enterExercise, finishExercise, fixtures, openGame, openRecords, seed, slot } from './helpers.ts';

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

test('dist includes required app assets and excludes provenance and test content', { tag: '@artifact-files' }, () => {
  const files = readdirSync('dist', { recursive: true, withFileTypes: true }).filter(entry => entry.isFile())
    .map(entry => `${entry.parentPath}/${entry.name}`.replace(/^dist[/\\]/, ''));
  expect(files).toContain('index.html');
  expect(files).toContain('favicon.svg');
  expect(files.some(path => /^assets[/\\].+\.js$/.test(path))).toBe(true);
  expect(files.some(path => /^assets[/\\].+\.css$/.test(path))).toBe(true);
  for (const file of files) {
    expect(file).not.toMatch(/(?:original-handoff|research-archive|fixtures|tests|e2e)(?:[/\\]|$)|SHA256SUMS|\.test\./);
    const text = readFileSync(`dist/${file}`, 'utf8');
    for (const forbidden of ['original-handoff', 'research-archive', 'resetTestRandom', 'pointerEvidence', 'tests/oracle', 'Invalid answer for roll', 'opening-seed', 'exerciseRandomCalls', 'tutorialRandomCalls']) {
      expect(text).not.toContain(forbidden);
    }
  }
});

test('production starts hidden and loads required assets without runtime services', async ({ page, baseURL, request }) => {
  const errors = productionErrors(page, baseURL!);
  await seed(page);
  await page.goto('./');
  await expect(page.locator('#home-screen')).toBeVisible();
  await expect(page.getByRole('grid')).toHaveCount(0);
  await page.getByRole('button', { name: 'Play', exact: true }).click();
  await expect(page).toHaveTitle('Rollmino');
  await expect(page.getByRole('heading', { name: 'Rollmino', exact: true })).toBeVisible();
  await expect(page.locator('#grid button[aria-label$="hidden"]')).toHaveCount(36);
  await expect(page.locator('#board-art circle')).toHaveCount(0);
  await expect(page.getByRole('button', { name: /hint|solution/i })).toHaveCount(0);
  const assets = await page.evaluate(() => [
    ...Array.from(document.querySelectorAll<HTMLScriptElement>('script[src]'), el => el.src),
    ...Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"], link[rel="icon"]'), el => el.href),
  ]);
  expect(assets.some(asset => new URL(asset).pathname.endsWith('.js'))).toBe(true);
  expect(assets.some(asset => new URL(asset).pathname.endsWith('.css'))).toBe(true);
  expect(assets.some(asset => new URL(asset).pathname.endsWith('/favicon.svg'))).toBe(true);
  for (const asset of assets) {
    expect(asset.startsWith(baseURL!)).toBe(true);
    const response = await request.get(asset);
    expect(response.status()).toBe(200);
    const extension = new URL(asset).pathname.split('.').pop();
    const mime = extension === 'svg' ? /image\/svg\+xml/ : extension === 'css' ? /text\/css/ : extension === 'js' ? /javascript/ : /image\//;
    expect(response.headers()['content-type']).toMatch(mime);
    expect((await response.body()).length).toBeGreaterThan(0);
  }
  await page.locator('#start').click();
  await expect(page.locator('[data-content="blocker"]')).toHaveCount(7);
  await slot(page, 'navy').click();
  await cell(page, 4, 5).click();
  await expect(cell(page, 4, 5)).toHaveAttribute('data-content', 'navy');
  expect(errors).toEqual([]);
});

const fixture = fixtures[0];
test(`production completes ${fixture.id}, freezes, replays as practice and retains records`, async ({ page, baseURL }) => {
  const errors = productionErrors(page, baseURL!);
  await page.clock.install({ time: new Date('2026-10-13T09:59:50Z') });
  await page.clock.pauseAt(new Date('2026-10-13T10:00:00Z'));
  await openGame(page, fixture);
  for (const face of fixture.dice) await expect(page.getByRole('button', { name: `${face}, blocker`, exact: true })).toBeVisible();
  await page.clock.fastForward(54321);
  await complete(page, fixture);
  await expect(page.locator('#timer')).toHaveText('00:54.32');
  const saved = await page.evaluate(() => localStorage.getItem('rollmino.records.v1'));
  expect(JSON.parse(saved!).WIZARD).toHaveLength(1);
  await page.clock.fastForward(20000);
  await expect(page.locator('#timer')).toHaveText('00:54.32');
  await page.locator('#replay').click();
  await expect(page.locator('#grid button[aria-label$="hidden"]')).toHaveCount(36);
  await page.locator('#start').click();
  await page.clock.fastForward(5000);
  await complete(page, fixture);
  expect(await page.evaluate(() => localStorage.getItem('rollmino.records.v1'))).toBe(saved);
  await page.reload();
  await expect(page.locator('#home-screen')).toBeVisible();
  await expect(page.locator('#level')).toHaveValue('STARTER');
  await expect(page.locator('#grid button[aria-label$="hidden"]')).toHaveCount(36);
  await openRecords(page, fixture.level);
  await expect(page.locator('#records-list li')).toHaveCount(1);
  await expect(page.locator('#records-list')).toContainText('00:54.32');
  await page.locator('#records-home').click();
  await expect(page.locator('#tutorial')).not.toHaveClass('offered');
  await enterExercise(page);
  await finishExercise(page);
  await page.clock.fastForward(600000);
  expect(await page.evaluate(() => localStorage.getItem('rollmino.records.v1'))).toBe(saved);
  await page.locator('#review-tutorial').click();
  await expect(page.locator('#tutorial-heading')).toHaveText('Fill the board');
  await page.locator('#try-exercise').click();
  await page.locator('[data-piece="brown"]').click();
  await cell(page, 1, 0).click();
  await page.locator('#redo-exercise').click();
  await expect(page.locator('#grid [data-content="empty"]')).toHaveCount(10);
  await expect(page.locator('#undo')).toBeDisabled();
  await page.locator('#tutorial-home').click();
  await page.locator('#play').click();
  await expect(page.locator('#start')).toBeFocused();
  await expect(page.locator('#level')).toHaveValue('STARTER');
  await expect(page.locator('#grid button[aria-label$="hidden"]')).toHaveCount(36);
  await expect(page.locator('#grid .lesson-target')).toHaveCount(0);
  await expect(page.locator('#board-art circle')).toHaveCount(0);
  await expect(page.locator('#timer')).toHaveText('00:00.00');
  await page.locator('#start').click();
  await expect(page.locator('#grid [data-content="empty"]')).toHaveCount(29);
  expect(await page.evaluate(() => localStorage.getItem('rollmino.records.v1'))).toBe(saved);
  expect(errors).toEqual([]);
});
