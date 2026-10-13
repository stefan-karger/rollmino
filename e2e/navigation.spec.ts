import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { cell, openGame, seed, slot } from './helpers.ts';

test('Home cancellation keeps the run and confirmation makes Forward fresh', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-13T10:00:00Z') });
  await page.clock.pauseAt(new Date('2026-10-13T10:00:01Z'));
  await openGame(page);
  await slot(page, 'navy').click();
  await cell(page, 4, 5).click();
  await page.locator('#game-home').click();
  await expect(page.getByRole('dialog')).toContainText('Return Home');
  await expect(page.locator('#home-screen')).toBeHidden();
  await page.clock.fastForward(10000);
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page.locator('#game-home')).toBeFocused();
  await expect(cell(page, 4, 5)).toHaveAttribute('data-content', 'navy');
  await expect(page.locator('#timer')).toHaveText('00:10.00');
  await expect(page.locator('#undo')).toBeEnabled();
  await page.goBack();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#game-home')).toBeFocused();
  await page.goBack();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await expect(page.locator('#home-screen')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Play', exact: true })).toBeFocused();
  await expect(page.getByRole('grid')).toHaveCount(0);
  await page.goForward();
  await expect(page.locator('#start')).toBeFocused();
  await expect(page.locator('#level')).toHaveValue('WIZARD');
  await expect(page.locator('#mode')).toContainText('Fresh roll');
  await expect(page.locator('#grid button[aria-label$="hidden"]')).toHaveCount(36);
  await expect(page.locator('#board-art circle')).toHaveCount(0);
  await expect(page.locator('#undo')).toBeDisabled();
  await page.reload();
  await expect(page.locator('#home-screen')).toBeVisible();
  await expect(page.locator('#play')).toBeEnabled();
  await expect(page.locator('#level')).toHaveValue('STARTER');
});

test('Home has no RNG or focus leak and repeated returns leave one root entry', { tag: '@shared' }, async ({ page }) => {
  await page.goto('/favicon.svg');
  await seed(page);
  await page.goto('./');
  await expect(page.locator('#home-screen')).toBeVisible();
  await expect(page.getByRole('button')).toHaveCount(1);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.evaluate(() => { Math.random = () => { throw Error('Unexpected random draw before Start'); }; });
  for (let i = 0; i < 3; i++) {
    await page.locator('#play').click();
    await expect(page.locator('#start')).toBeFocused();
    await page.locator('#level').selectOption('MASTER');
    await page.locator('#game-home').click();
    await expect(page.locator('#play')).toBeFocused();
  }
  await page.locator('#play').click();
  await page.reload();
  await expect(page.locator('#play')).toBeEnabled();
  await page.goBack();
  await expect(page).toHaveURL(/favicon\.svg$/);
});

test('rapid history and dialog cancellation cannot bypass abandonment', { tag: '@shared' }, async ({ page }) => {
  await openGame(page);
  await slot(page, 'navy').click();
  await cell(page, 4, 5).click();
  await page.locator('#new-game').click();
  await page.goBack();
  await expect(page.getByRole('dialog')).toContainText('Return Home');
  await page.evaluate(() => { history.back(); history.forward(); });
  await expect(page.locator('#home-screen')).toBeHidden();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page.locator('#new-game')).toBeFocused();
  await expect(cell(page, 4, 5)).toHaveAttribute('data-content', 'navy');
  await page.locator('#game-home').click();
  await expect(page.getByRole('dialog')).toContainText('Return Home');
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await expect(page.locator('#play')).toBeFocused();
});

test('leaving practice ready discards its retained layout without confirmation', { tag: '@shared' }, async ({ page }) => {
  await openGame(page);
  await page.locator('#replay').click();
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await expect(page.locator('#mode')).toContainText('Practice replay');
  await page.locator('#game-home').click();
  await expect(page.locator('#play')).toBeFocused();
  await expect(page.getByRole('dialog')).toBeHidden();
  await page.locator('#play').click();
  await expect(page.locator('#mode')).toContainText('Fresh roll');
  await expect(page.locator('#board-art circle')).toHaveCount(0);
});
