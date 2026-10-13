import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { boardOffset, cell, complete, fixtures, openGame, placePieces, resetRandom, seed, slot } from './helpers.ts';

async function noAxeViolations(page: import('@playwright/test').Page) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(results.violations).toEqual([]);
}

test('ready, running, confirmation and completed states pass relevant axe checks', { tag: '@shared' }, async ({ page }) => {
  await seed(page);
  await page.goto('./');
  await noAxeViolations(page);
  await page.locator('#level').selectOption('WIZARD');
  await resetRandom(page);
  await page.locator('#start').click();
  await noAxeViolations(page);
  await page.locator('#new-game').click();
  await expect(page.getByRole('dialog', { name: 'Abandon this run?' })).toBeVisible();
  await noAxeViolations(page);
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await complete(page);
  await noAxeViolations(page);
});

for (const viewport of [
  { width: 320, height: 568 }, { width: 390, height: 844 },
  { width: 768, height: 1024 }, { width: 1440, height: 900 }, { width: 667, height: 375 },
]) {
  test(`all actions remain reachable and aligned at ${viewport.width}x${viewport.height}`, { tag: viewport.width === 320 ? [] : '@shared' }, async ({ page }) => {
    await page.setViewportSize(viewport);
    await openGame(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const mainWidth = await page.locator('main').evaluate(el => el.getBoundingClientRect().width);
    expect(mainWidth).toBeLessThanOrEqual(Math.min(viewport.width, 440));
    for (const [x, y] of [[0, 0], [5, 0], [0, 5], [5, 5], [3, 3]]) {
      expect(await boardOffset(page, x, y)).toBeLessThan(1);
    }
    await slot(page, 'navy').click();
    await cell(page, 4, 5).click();
    for (const selector of ['#rotate', '#flip', '#remove', '#undo', '#new-game', '#replay', '#clear-records']) {
      const control = page.locator(selector);
      await control.scrollIntoViewIfNeeded();
      await expect(control).toBeInViewport();
      const bounds = await control.boundingBox();
      // Firefox may report a 44px CSS box a few millionths below 44.
      expect(bounds!.height).toBeGreaterThanOrEqual(43.99);
    }
    await page.locator('#clear-records').click();
    await expect(page.getByRole('dialog', { name: 'Clear records?' })).toBeInViewport();
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    await expect(page.locator('#clear-records')).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('grid semantics, stable focus, scoped shortcuts and modal focus match the game contract', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-13T09:59:50Z') });
  await page.clock.pauseAt(new Date('2026-10-13T10:00:00Z'));
  await openGame(page);
  await expect(page.getByRole('grid', { name: 'Puzzle board' })).toBeVisible();
  await expect(page.getByRole('row')).toHaveCount(6);
  await expect(page.getByRole('gridcell')).toHaveCount(36);
  await expect(page.locator('#grid button[tabindex="0"]')).toHaveCount(1);
  await expect(cell(page, 0, 0)).toHaveAccessibleName('A1, blocker');
  await page.keyboard.press('ArrowRight');
  await expect(cell(page, 1, 0)).toBeFocused();
  const node = await cell(page, 1, 0).elementHandle();
  await page.clock.fastForward(15000);
  expect(await node!.evaluate(el => el === document.activeElement)).toBe(true);
  await expect(page.locator('#timer')).toHaveAttribute('aria-live', 'off');
  await expect(page.locator('[aria-live="polite"]')).toHaveCount(1);
  await expect(page.locator('#status')).toHaveAttribute('aria-atomic', 'true');
  await slot(page, 'cyan').click();
  const preview = await page.locator('#preview').textContent();
  await page.locator('#level').focus();
  await page.keyboard.press('r');
  await expect(page.locator('#preview')).toHaveText(preview!);
  await page.locator('#new-game').click();
  await expect(page.getByRole('button', { name: 'Cancel', exact: true })).toBeFocused();
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => Boolean(document.activeElement?.closest('dialog')))).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(page.locator('#new-game')).toBeFocused();
  await page.locator('#replay').click();
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await expect(page.locator('#start')).toBeFocused();
});

test('200 percent CSS zoom reflows and keeps board geometry aligned', { tag: '@desktop' }, async ({ page }) => {
  // CSS zoom provides a reproducible magnification/reflow check, not a browser-chrome zoom audit.
  await page.setViewportSize({ width: 640, height: 960 });
  await openGame(page);
  await page.evaluate(() => { document.documentElement.style.zoom = '2'; });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  for (const [x, y] of [[0, 0], [5, 0], [0, 5], [5, 5], [3, 3]]) {
    expect(await boardOffset(page, x, y)).toBeLessThan(1);
  }
  await slot(page, 'navy').click();
  await cell(page, 4, 5).click();
  await expect(cell(page, 4, 5)).toHaveAttribute('data-content', 'navy');
  await page.locator('#clear-records').scrollIntoViewIfNeeded();
  await expect(page.locator('#clear-records')).toBeInViewport();
});

test('visible focus and non-color identity remain usable with reduced motion requested', { tag: '@shared' }, async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openGame(page);
  await expect(page.locator('#rule')).toHaveText('Pieces 1, 2, 3, 4 cannot share an edge. Corners may touch.');
  for (const [id, name] of [['navy', /square.*1/i], ['brown', /domino.*2/i], ['orange', /line.*3/i], ['purple', /corner.*4/i], ['cyan', /L/i], ['red', /zigzag/i]] as const) {
    await expect(slot(page, id)).toHaveAccessibleName(name);
  }
  await page.keyboard.press('ArrowRight');
  await expect(cell(page, 1, 0)).toBeFocused();
  await expect(cell(page, 1, 0)).toHaveCSS('outline-style', 'solid');
  await expect(cell(page, 1, 0)).toHaveCSS('outline-width', '3px');
  await page.keyboard.press('Control+Home');
  await slot(page, 'navy').click();
  await expect(page.locator('#preview')).toContainText('cannot place here');
  await cell(page, 0, 0).click();
  await expect(page.locator('#status')).toContainText('Cannot place here');
  await page.keyboard.press('Escape');
  // These four pieces provide all nine restriction-number glyphs without another full game.
  await placePieces(page, fixtures[0].solution.filter(p => ['navy', 'brown', 'orange', 'purple'].includes(p.id)));
  await expect(page.locator('#board-art .piece-number')).toHaveCount(9);
});
