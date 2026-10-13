import { test, expect } from '@playwright/test';
import { cell, complete, openGame, seed, slot } from './helpers.ts';
const key = 'rollmino.records.v1';
const entry = (elapsedMs: number, finishedAt = 1700000000000) => ({ elapsedMs, finishedAt });
test.setTimeout(60000);

async function fixedClock(page: import('@playwright/test').Page) {
  await page.clock.install({ time: new Date('2026-10-13T09:59:50Z') });
  await page.clock.pauseAt(new Date('2026-10-13T10:00:00Z'));
}

test('ranked completion saves once, reload keeps records and practice never ranks', async ({ page }) => {
  await fixedClock(page);
  await openGame(page);
  await page.clock.fastForward(10019);
  await complete(page);
  await expect(page.locator('#records-list li')).toHaveCount(1);
  await expect(page.locator('#records-list')).toContainText('00:10.01');
  const stored = await page.evaluate(key => localStorage.getItem(key), key);
  expect(JSON.parse(stored!).WIZARD).toEqual([entry(10019, Date.parse('2026-10-13T10:00:10.019Z'))]);
  await page.clock.fastForward(30000);
  await page.locator('#clear-records').click();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  expect(await page.evaluate(key => localStorage.getItem(key), key)).toBe(stored);
  await page.locator('#replay').click();
  await page.locator('#start').click();
  await page.clock.fastForward(5000);
  await complete(page);
  expect(await page.evaluate(key => localStorage.getItem(key), key)).toBe(stored);
  await page.reload();
  await expect(page.locator('#level')).toHaveValue('STARTER');
  await expect(page.locator('#records-empty')).toBeVisible();
  await page.locator('#level').selectOption('WIZARD');
  await expect(page.locator('#records-list li')).toHaveCount(1);
  await expect(page.locator('#grid button[aria-label$="hidden"]')).toHaveCount(36);
});

test('ranking caps five, uses milliseconds beneath equal displays and preserves old ties', async ({ page }) => {
  await fixedClock(page);
  await seed(page);
  await page.addInitScript(({ key }) => localStorage.setItem(key, JSON.stringify({ WIZARD: [
    { elapsedMs: 1009, finishedAt: 20 }, { elapsedMs: 1001, finishedAt: 30 },
    { elapsedMs: 1001, finishedAt: 10 }, { elapsedMs: 2000, finishedAt: 40 },
    { elapsedMs: 3000, finishedAt: 50 }, { elapsedMs: 4000, finishedAt: 60 },
  ] })), { key });
  await page.goto('./');
  await page.locator('#level').selectOption('WIZARD');
  await page.locator('#start').click();
  await page.clock.fastForward(1001);
  await complete(page);
  await expect(page.locator('#records-list li')).toHaveCount(5);
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).WIZARD, key)).toEqual([
    entry(1001, 10), entry(1001, 30), entry(1001, Date.parse('2026-10-13T10:00:01.001Z')), entry(1009, 20), entry(2000, 40),
  ]);
  await page.locator('#new-game').click();
  await page.locator('#start').click();
  await page.clock.fastForward(500);
  await complete(page);
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).WIZARD[0].elapsedMs, key)).toBe(500);
});

test('confirmed clearing preserves active board/history/time and other lists/keys', async ({ page }) => {
  await fixedClock(page);
  await openGame(page);
  await page.evaluate(({ key }) => {
    localStorage.setItem('sentinel', 'keep');
    localStorage.setItem(key, JSON.stringify({ WIZARD: [{ elapsedMs: 10, finishedAt: 20 }], MASTER: [{ elapsedMs: 30, finishedAt: 40 }] }));
  }, { key });
  await slot(page, 'navy').click();
  await cell(page, 4, 5).click();
  await page.locator('#clear-records').click();
  await page.clock.fastForward(10000);
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(cell(page, 4, 5)).toHaveAttribute('data-content', 'navy');
  await page.locator('#clear-records').click();
  await page.clock.fastForward(20000);
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await expect(page.locator('#clear-records')).toBeFocused();
  await expect(page.locator('#timer')).toHaveText('00:30.00');
  await expect(cell(page, 4, 5)).toHaveAttribute('data-content', 'navy');
  await page.locator('#undo').click();
  await expect(cell(page, 4, 5)).toHaveAttribute('data-content', 'empty');
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), key)).toMatchObject({ WIZARD: [], MASTER: [entry(30, 40)] });
  expect(await page.evaluate(() => localStorage.getItem('sentinel'))).toBe('keep');
});

test('cleared completed records stay cleared through later rendering', async ({ page }) => {
  await openGame(page);
  await complete(page);
  await page.locator('#clear-records').click();
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await expect(page.locator('#records-list li')).toHaveCount(0);
  await page.locator('#replay').click();
  await expect(page.locator('#records-list li')).toHaveCount(0);
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).WIZARD, key)).toEqual([]);
});

for (const fault of ['getter', 'get', 'set', 'corrupt'] as const) {
  test(`storage ${fault} failure keeps the game playable with an honest notice`, async ({ page }) => {
    await page.addInitScript(({ fault, key }) => {
      if (fault === 'getter') Object.defineProperty(window, 'localStorage', { get() { throw Error('blocked'); } });
      if (fault === 'get') Storage.prototype.getItem = () => { throw Error('blocked'); };
      if (fault === 'set') Storage.prototype.setItem = () => { throw Error('quota'); };
      if (fault === 'corrupt') localStorage.setItem(key, '{bad');
    }, { fault, key });
    await openGame(page);
    if (fault !== 'set') await expect(page.locator('#storage-notice')).toContainText(fault === 'corrupt' ? 'discarded' : 'will not survive reload');
    await complete(page);
    await expect(page.locator('#records-list li')).toHaveCount(1);
    if (fault === 'set') await expect(page.locator('#storage-notice')).toContainText('will not survive reload');
  });
}
