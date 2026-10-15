import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { cell, enterExercise } from './helpers.ts';

const key = 'rollmino.onboarding.v1';

test('first offer survives records, Tutorial handles it, and reload/repeat keep stable Home actions', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('#tutorial-offer')).toBeVisible();
  const positions = await page.locator('.home-actions button').evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().y));
  await page.locator('#highscores').click();
  await page.locator('#clear-records').click();
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await page.locator('#records-home').click();
  await expect(page.locator('#tutorial-offer')).toBeVisible();
  expect(await page.evaluate(key => localStorage.getItem(key), key)).toBeNull();
  await page.locator('#tutorial').click();
  await page.locator('#tutorial-next').click();
  await page.locator('#tutorial-home').click();
  await expect(page.locator('#tutorial-offer')).toBeHidden();
  expect(await page.locator('.home-actions button').evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().y))).toEqual(positions);
  expect(await page.evaluate(key => localStorage.getItem(key), key)).toBe('handled');
  await page.reload();
  await expect(page.locator('#home-screen')).toBeVisible();
  await expect(page.locator('#tutorial-offer')).toBeHidden();
  await page.locator('#highscores').click();
  await page.locator('#clear-records').click();
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await page.locator('#records-home').click();
  expect(await page.evaluate(key => localStorage.getItem(key), key)).toBe('handled');
  await page.locator('#tutorial').click();
  await expect(page.locator('#tutorial-heading')).toHaveText('Fill the board');
  for (let i = 0; i < 5; i++) await page.locator('#tutorial-next').click();
  await page.locator('#try-exercise').click();
  await expect(page.locator('#exercise-title')).toBeFocused();
  await page.locator('[data-piece="brown"]').click();
  await cell(page, 1, 0).click();
  await page.locator('#redo-exercise').click();
  await expect(page.locator('#grid [data-content="empty"]')).toHaveCount(10);
  await expect(page.locator('#undo')).toBeDisabled();
  await page.locator('#tutorial-home').click();
  await page.locator('#tutorial').click();
  await expect(page.locator('#tutorial-heading')).toHaveText('Fill the board');
  await page.reload();
  await page.locator('#play').click();
  await expect(page.locator('#level')).toHaveValue('STARTER');
  await expect(page.locator('#grid button[aria-label$="hidden"]')).toHaveCount(36);
});

test('Play immediately handles the offer with no roll and remembers only that flag', { tag: '@shared' }, async ({ page }) => {
  await page.goto('./');
  await page.evaluate(() => { Math.random = () => { throw Error('unexpected roll'); }; });
  await page.locator('#play').click();
  await expect(page.locator('#ready')).toBeVisible();
  await page.locator('#level').selectOption('WIZARD');
  await page.locator('#game-home').click();
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([key]);
  await page.reload();
  await expect(page.locator('#tutorial-offer')).toBeHidden();
  await page.locator('#play').click();
  await expect(page.locator('#level')).toHaveValue('STARTER');
});

for (const fault of ['getter', 'get', 'set', 'corrupt'] as const) {
  test(`offer ${fault} faults keep choice in page memory and permit Play and the tutorial exercise`, { tag: '@shared' }, async ({ page }) => {
    await page.addInitScript(({ key, fault }) => {
      if (fault === 'getter') Object.defineProperty(window, 'localStorage', { get() { throw Error('blocked'); } });
      if (fault === 'get') Storage.prototype.getItem = () => { throw Error('blocked'); };
      if (fault === 'set') Storage.prototype.setItem = () => { throw Error('quota'); };
      if (fault === 'corrupt') localStorage.setItem(key, 'not-a-flag');
    }, { key, fault });
    await page.goto('./');
    await expect(page.locator('#tutorial-offer')).toBeVisible();
    await page.locator('#play').click();
    await expect(page.locator('#start')).toBeFocused();
    if (fault === 'getter' || fault === 'get') await expect(page.locator('#game-storage-notice')).toContainText('will not survive reload');
    await page.locator('#game-home').click();
    await expect(page.locator('#tutorial-offer')).toBeHidden();
    await enterExercise(page);
    await expect(page.locator('#grid [data-content="empty"]')).toHaveCount(10);
    await page.reload();
    await expect(page.locator('#tutorial-offer')).toBeVisible();
  });
}

test('optional offer and tutorial exercise remain usable in reduced-motion narrow Home', { tag: '@shared' }, async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('./');
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await enterExercise(page);
  await page.locator('#tutorial-home').click();
  await expect(page.locator('#play')).toBeFocused();
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([]);
});
