import { test, expect } from '@playwright/test';

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
  await expect(page.getByText('A timed solo puzzle. Game controls are coming next.', { exact: true })).toBeVisible();
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(18, 22, 29)');
  expect(errors).toEqual([]);
});
