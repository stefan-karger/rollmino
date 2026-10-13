import { test, expect } from '@playwright/test';
import { cell, complete, openGame, openRecords, resetRandom, seed, slot } from './helpers.ts';
const key = 'rollmino.records.v1';
const entry = (elapsedMs: number, finishedAt = 1700000000000) => ({ elapsedMs, finishedAt });

async function fixedClock(page: import('@playwright/test').Page) {
  await page.clock.install({ time: new Date('2026-10-13T09:59:50Z') });
  await page.clock.pauseAt(new Date('2026-10-13T10:00:00Z'));
}

test.describe('shared record scenarios', { tag: '@shared' }, () => {
  test('ranked completion saves once, reload keeps records and practice never ranks', async ({ page }) => {
    await fixedClock(page);
    await openGame(page);
    await page.clock.fastForward(10019);
    await complete(page);
    await expect(page.locator('#records-screen')).toBeHidden();
    await expect(page.getByRole('button', { name: 'Clear records' })).toHaveCount(0);
    const stored = await page.evaluate(key => localStorage.getItem(key), key);
    expect(JSON.parse(stored!).WIZARD).toEqual([entry(10019, Date.parse('2026-10-13T10:00:10.019Z'))]);
    await page.clock.fastForward(30000);
    await page.locator('#replay').click();
    await page.locator('#start').click();
    await page.clock.fastForward(5000);
    await complete(page);
    expect(await page.evaluate(key => localStorage.getItem(key), key)).toBe(stored);
    await openRecords(page);
    await expect(page.locator('#records-list li')).toHaveCount(1);
    await expect(page.locator('#records-list')).toContainText('00:10.01');
    await page.locator('#clear-records').click();
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    expect(await page.evaluate(key => localStorage.getItem(key), key)).toBe(stored);
    await page.reload();
    await expect(page.locator('#home-screen')).toBeVisible();
    await openRecords(page, 'STARTER');
    await expect(page.locator('#records-empty')).toBeVisible();
    await page.locator('#records-level').selectOption('WIZARD');
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
    await page.locator('#play').click();
    await page.locator('#level').selectOption('WIZARD');
    await resetRandom(page);
    await page.locator('#start').click();
    await page.clock.fastForward(1001);
    await complete(page);
    expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).WIZARD, key)).toEqual([
      entry(1001, 10), entry(1001, 30), entry(1001, Date.parse('2026-10-13T10:00:01.001Z')), entry(1009, 20), entry(2000, 40),
    ]);
    await page.locator('#new-game').click();
    await page.locator('#start').click();
    await page.clock.fastForward(500);
    await complete(page);
    expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).WIZARD[0].elapsedMs, key)).toBe(500);
    await openRecords(page);
    await expect(page.locator('#records-list li')).toHaveCount(5);
  });

  test('records require leaving active play and clearing preserves other levels and keys', async ({ page }) => {
    await fixedClock(page);
    await page.addInitScript(({ key }) => {
      localStorage.setItem('sentinel', 'keep');
      localStorage.setItem(key, JSON.stringify({ WIZARD: [{ elapsedMs: 10, finishedAt: 20 }], MASTER: [{ elapsedMs: 30, finishedAt: 40 }] }));
    }, { key });
    await openGame(page);
    await slot(page, 'navy').click();
    await cell(page, 4, 5).click();
    await expect(page.getByRole('button', { name: 'Personal bests', exact: true })).toHaveCount(0);
    await page.locator('#game-home').click();
    await page.clock.fastForward(10000);
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    await expect(cell(page, 4, 5)).toHaveAttribute('data-content', 'navy');
    await expect(page.locator('#timer')).toHaveText('00:10.00');
    await expect(page.locator('#undo')).toBeEnabled();
    await openRecords(page, 'MASTER');
    await expect(page.locator('#records-list')).toContainText('00:00.03');
    await page.evaluate(() => { Math.random = () => { throw Error('Records must not roll dice'); }; });
    await page.locator('#clear-records').click();
    await expect(page.getByRole('dialog')).toContainText('Master records');
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    await expect(page.locator('#clear-records')).toBeFocused();
    await expect(page.locator('#records-list li')).toHaveCount(1);
    await page.locator('#clear-records').click();
    await page.getByRole('button', { name: 'Confirm', exact: true }).click();
    await expect(page.locator('#clear-records')).toBeFocused();
    await expect(page.locator('#records-empty')).toBeVisible();
    expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), key)).toMatchObject({ MASTER: [], WIZARD: [entry(10, 20)] });
    expect(await page.evaluate(() => localStorage.getItem('sentinel'))).toBe('keep');
    await page.goBack();
    await expect(page.locator('#home-screen')).toBeVisible();
    await page.locator('#play').click();
    await expect(page.locator('#level')).toHaveValue('WIZARD');
    await expect(page.locator('#timer')).toHaveText('00:00.00');
  });

  test('cleared completed records stay cleared through later navigation and rendering', async ({ page }) => {
    await openGame(page);
    await complete(page);
    await openRecords(page);
    await page.locator('#clear-records').click();
    await page.getByRole('button', { name: 'Confirm', exact: true }).click();
    await expect(page.locator('#records-list li')).toHaveCount(0);
    await page.locator('#records-home').click();
    await page.locator('#personal-bests').click();
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
      if (fault !== 'set') await expect(page.locator('#game-storage-notice')).toContainText(fault === 'corrupt' ? 'discarded' : 'will not survive reload');
      await complete(page);
      if (fault !== 'corrupt') await expect(page.locator('#game-storage-notice')).toContainText('will not survive reload');
      await openRecords(page);
      await expect(page.locator('#records-list li')).toHaveCount(1);
      if (fault !== 'corrupt') await expect(page.locator('#storage-notice')).toContainText('will not survive reload');
    });
  }
});
