import { test, expect } from '@playwright/test';
import { activate, cell, complete, fixtures, openGame, seed, slot } from './helpers.ts';

test('full keyboard-only game uses Tab, real transforms and grid navigation', async ({ page }) => {
  await seed(page);
  await page.goto('./');
  // The default Starter accepts this Wizard fixture too.
  await activate(page, '#start', true);
  await complete(page, fixtures[0], true);
});

test('illegal/no-op taps preserve history; movement/removal Undo returns to empty', async ({ page }) => {
  await openGame(page);
  await slot(page, 'navy').click();
  await cell(page, 0, 0).click();
  await expect(page.getByRole('status')).toContainText('Cannot place');
  await expect(page.locator('#undo')).toBeDisabled();
  await expect(slot(page, 'navy')).toHaveAttribute('aria-pressed', 'true');
  await cell(page, 4, 5).click();
  await cell(page, 4, 5).click();
  await cell(page, 4, 5).click();
  await expect(page.getByRole('status')).toHaveText('Piece is already there.');
  await cell(page, 1, 5).click();
  await slot(page, 'navy').click();
  await page.locator('#remove').click();
  await page.locator('#undo').click();
  await expect(cell(page, 1, 5)).toHaveAttribute('data-content', 'navy');
  await page.locator('#undo').click();
  await expect(cell(page, 4, 5)).toHaveAttribute('data-content', 'navy');
  await page.locator('#undo').click();
  await expect(page.locator('[data-content="navy"]')).toHaveCount(0);
  await expect(page.locator('#undo')).toBeDisabled();
});

test('keyboard boundaries, draft transforms, Delete and Escape preserve focus', async ({ page }) => {
  await openGame(page);
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowUp');
  await expect(cell(page, 0, 0)).toBeFocused();
  await page.keyboard.press('Control+End');
  await expect(cell(page, 5, 5)).toBeFocused();
  await page.keyboard.press('Home');
  await expect(cell(page, 0, 5)).toBeFocused();
  await slot(page, 'brown').click();
  await page.keyboard.press('r');
  await expect(page.locator('#preview')).toContainText('Brown domino');
  await page.keyboard.press('Escape');
  await expect(slot(page, 'brown')).toBeFocused();
  await expect(slot(page, 'brown')).toHaveAttribute('aria-pressed', 'false');
  await slot(page, 'navy').click();
  await cell(page, 4, 5).click();
  await slot(page, 'navy').click();
  await page.keyboard.press('Delete');
  await expect(cell(page, 4, 5)).toHaveAttribute('data-content', 'empty');
  await expect(slot(page, 'navy')).toBeFocused();
});

test('multi-cell moves can overlap their own old footprint', async ({ page }) => {
  await openGame(page, { ...fixtures[0], level: 'STARTER' });
  await slot(page, 'brown').click();
  await cell(page, 1, 0).click();
  await slot(page, 'brown').click();
  await cell(page, 2, 0).click();
  await expect(cell(page, 1, 0)).toHaveAttribute('data-content', 'empty');
  await expect(cell(page, 2, 0)).toHaveAttribute('data-content', 'brown');
  await expect(cell(page, 3, 0)).toHaveAttribute('data-content', 'brown');
  await page.locator('#undo').click();
  await expect(cell(page, 1, 0)).toHaveAttribute('data-content', 'brown');
  await expect(cell(page, 3, 0)).toHaveAttribute('data-content', 'empty');
});
