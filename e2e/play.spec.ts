import { test, expect } from '@playwright/test';
import { cell, complete, fixtures, openGame, resetRandom, seed, slot } from './helpers.ts';

test('loads the Rollmino entry and its styles without page or asset errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('requestfailed', request => errors.push(`Failed request: ${request.url()}`));
  page.on('response', response => {
    if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
  });

  await page.goto('./');
  await expect(page).toHaveTitle('Rollmino');
  await expect(page.getByRole('heading', { name: 'Rollmino', level: 1 })).toBeVisible();
  await expect(page.getByText('Puzzle hidden until Start.', { exact: true })).toBeVisible();
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(18, 22, 29)');
  expect(errors).toEqual([]);
});

for (const fixture of fixtures) {
  test(`completes ${fixture.id} through public tap controls, shows completion and retains records`, { tag: fixture === fixtures[0] ? [] : '@shared' }, async ({ page }, testInfo) => {
    const phone = Boolean(testInfo.project.use.isMobile);
    if (phone) await page.setViewportSize({ width: 390, height: 844 });
    await page.clock.install({ time: new Date('2026-10-13T09:59:50Z') });
    await page.clock.pauseAt(new Date('2026-10-13T10:00:00Z'));
    await openGame(page, fixture);
    await page.clock.fastForward(65432);
    await complete(page, fixture);
    await expect(page.locator('#timer')).toHaveText('01:05.43');
    await expect(page.locator('#preview')).toHaveText('Completed in 01:05.43. Ranked run.');
    await expect(page.locator('#mode')).toHaveText('Ranked run complete.');
    if (phone) {
      const bounds = await page.locator('#preview').boundingBox();
      expect(bounds!.y).toBeGreaterThanOrEqual(0);
      expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(844);
    }
    const frozen = await page.locator('#timer').textContent();
    await page.clock.fastForward(20000);
    await expect(page.locator('#timer')).toHaveText(frozen!);
    await expect(slot(page, 'navy')).toBeDisabled();
    await page.getByRole('button', { name: 'Replay', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Start practice' })).toBeFocused();
    await expect(page.locator('[data-content="blocker"]')).toHaveCount(0);
    await expect(page.locator('#board-art circle')).toHaveCount(0);
    await page.getByRole('button', { name: 'Start practice' }).click();
    for (const face of fixture.dice) await expect(page.getByRole('button', { name: `${face}, blocker`, exact: true })).toBeVisible();
    await expect(page.locator('#timer')).toHaveText('00:00.00');
    if (phone) {
      await page.clock.fastForward(5000);
      await complete(page, fixture);
      await expect(page.locator('#preview')).toHaveText('Completed in 00:05.00. Practice run.');
      await expect(page.locator('#mode')).toHaveText('Practice run complete. This run cannot rank.');
      const bounds = await page.locator('#preview').boundingBox();
      expect(bounds!.y).toBeGreaterThanOrEqual(0);
      expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(844);
      await expect(page.locator('#records-list li')).toHaveCount(1);
      await expect(page.locator('[aria-live="polite"]')).toHaveCount(1);
      await expect(page.getByRole('dialog')).not.toBeVisible();
      await page.locator('#new-game').click();
      await expect(page.locator('#start')).toBeFocused();
      await expect(page.locator('#mode')).toHaveText('Fresh roll. Your time can rank.');
      await expect(page.locator('#preview')).not.toContainText('Completed');
    }
    await page.reload();
    await expect(page.locator('#grid button[aria-label$="hidden"]')).toHaveCount(36);
    await page.locator('#level').selectOption(fixture.level);
    await expect(page.locator('#records-list li')).toHaveCount(1);
    await expect(page.locator('#records-list')).toContainText('01:05.43');
  });
}

test('active confirmations preserve time on cancel, replay is hidden, and level changes are fresh', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-13T09:59:50Z') });
  await page.clock.pauseAt(new Date('2026-10-13T10:00:00Z'));
  await seed(page, [fixtures[0].dice, fixtures[1].dice]);
  await page.goto('./');
  await expect(page.locator('#grid button[aria-label$="hidden"]')).toHaveCount(36);
  await resetRandom(page);
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await expect(cell(page, 0, 0)).toBeFocused();
  await slot(page, 'navy').click();
  await cell(page, 4, 5).click();
  await page.getByRole('button', { name: 'New game', exact: true }).click();
  await page.clock.fastForward(30000);
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(cell(page, 4, 5)).toHaveAttribute('data-content', 'navy');
  await expect(page.locator('#timer')).toHaveText('00:30.00');
  await expect(page.getByRole('button', { name: 'New game', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Replay', exact: true }).click();
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Start practice' })).toBeVisible();
  await expect(page.locator('#grid button[aria-label$="hidden"]')).toHaveCount(36);
  await page.getByRole('button', { name: 'Start practice' }).click();
  await expect(cell(page, 0, 0)).toHaveAttribute('data-content', 'blocker');
  await page.getByLabel('Level', { exact: true }).selectOption('MASTER');
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page.getByLabel('Level', { exact: true })).toHaveValue('STARTER');
  await page.getByLabel('Level', { exact: true }).selectOption('MASTER');
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Start', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await expect(page.getByRole('button', { name: 'D2, blocker', exact: true })).toBeVisible();
  await expect(page.locator('#mode')).toContainText('Fresh roll');
  await page.reload();
  await expect(page.getByLabel('Level', { exact: true })).toHaveValue('STARTER');
  await expect(page.locator('#grid button[aria-label$="hidden"]')).toHaveCount(36);
});

test('a queued close cannot consume a reopened confirmation', { tag: '@shared' }, async ({ page }) => {
  await openGame(page);
  await page.getByLabel('Level', { exact: true }).selectOption('MASTER');
  // Force reopening before the native close event runs, rather than relying on machine timing.
  await page.evaluate(async () => {
    const dialog = document.querySelector<HTMLDialogElement>('#confirm-dialog')!;
    const level = document.querySelector<HTMLSelectElement>('#level')!;
    const closed = new Promise<void>(resolve => dialog.addEventListener('close', () => resolve(), { once: true }));
    dialog.querySelector<HTMLButtonElement>('button[value="cancel"]')!.click();
    level.value = 'EXPERT';
    level.dispatchEvent(new Event('change', { bubbles: true }));
    await closed;
  });
  await expect(page.getByRole('dialog')).toContainText('Change to Expert');
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await expect(page.getByLabel('Level', { exact: true })).toHaveValue('EXPERT');
  await expect(page.getByRole('button', { name: 'Start', exact: true })).toBeFocused();
  await expect(page.locator('#grid button[aria-label$="hidden"]')).toHaveCount(36);
});

test('a coincidental repeated fresh roll remains ranked and a legal dead end is accepted', { tag: '@shared' }, async ({ page }) => {
  await openGame(page);
  await slot(page, 'navy').click();
  await cell(page, 1, 5).click();
  await expect(cell(page, 1, 5)).toHaveAttribute('data-content', 'navy');
  await page.getByRole('button', { name: 'New game', exact: true }).click();
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await expect(page.locator('#mode')).toContainText('Fresh roll');
  await expect(page.getByRole('button', { name: 'A1, blocker', exact: true })).toBeVisible();
});
