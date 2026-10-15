import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { activate, seed } from './helpers.ts';

test('self-paced panels only draw an ordinary roll after Home, Play and Start', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-13T10:00:00Z') });
  await page.clock.pauseAt(new Date('2026-10-13T10:00:01Z'));
  await seed(page);
  await page.goto('./');
  await page.evaluate(() => {
    const random = Math.random;
    const counts = window as unknown as { tutorialRandomCalls: number };
    counts.tutorialRandomCalls = 0;
    Math.random = () => { counts.tutorialRandomCalls++; return random(); };
  });
  await page.locator('#play').click();
  await page.locator('#level').selectOption('MASTER');
  await expect(page.getByRole('button', { name: 'Tutorial', exact: true })).toHaveCount(0);
  await page.locator('#game-home').click();
  await page.locator('#tutorial').click();
  await expect(page.locator('#tutorial-heading')).toBeFocused();
  await expect(page.getByRole('timer')).toHaveCount(0);
  await expect(page.locator('#tutorial-panel [data-example-piece]')).toHaveCount(29);
  await expect(page.locator('#tutorial-progress')).toHaveText('1 of 6');
  await expect(page.locator('#tutorial-back')).toBeDisabled();
  await expect(page.locator('#try-exercise')).toBeHidden();
  await expect(page.getByRole('button', { name: 'Replay example' })).toHaveCount(0);
  const art = await page.locator('#tutorial-panel').innerHTML();
  await page.clock.fastForward(600000);
  expect(await page.locator('#tutorial-panel').innerHTML()).toBe(art);
  for (let i = 2; i <= 6; i++) {
    await page.locator('#tutorial-next').click();
    await expect(page.locator('#tutorial-progress')).toHaveText(`${i} of 6`);
    await expect(page.locator('#tutorial-heading')).toBeFocused();
    await expect(page.locator('#try-exercise')).toBeVisible({ visible: i === 6 });
  }
  await expect(page.locator('#tutorial-next')).toBeHidden();
  await page.locator('#tutorial-back').click();
  await expect(page.locator('#tutorial-heading')).toHaveText('Choose a level');
  await expect(page.locator('#try-exercise')).toBeHidden();
  await expect(page.locator('#tutorial-next')).toBeVisible();
  await page.locator('#tutorial-home').click();
  await expect(page.locator('#play')).toBeFocused();
  await page.clock.fastForward(5000);
  await expect(page.locator('#status')).toHaveText('');
  expect(await page.evaluate(() => (window as unknown as { tutorialRandomCalls: number }).tutorialRandomCalls)).toBe(0);
  expect(await page.evaluate(() => localStorage.getItem('rollmino.records.v1'))).toBeNull();
  await page.locator('#play').click();
  await expect(page.locator('#level')).toHaveValue('MASTER');
  await expect(page.locator('#grid button[aria-label$="hidden"]')).toHaveCount(36);
  await page.locator('#start').click();
  expect(await page.evaluate(() => (window as unknown as { tutorialRandomCalls: number }).tutorialRandomCalls)).toBe(7);
  await expect(page.locator('[data-content="blocker"]')).toHaveCount(7);
  await expect(page.getByRole('button', { name: 'Tutorial', exact: true })).toHaveCount(0);
});

test('keyboard panels show literal clockwise and mirror geometry with occupied anchors', { tag: '@desktop' }, async ({ page }) => {
  await page.goto('./');
  await activate(page, '#tutorial', true);
  await activate(page, '#tutorial-next', true);
  await activate(page, '#tutorial-next', true);
  await expect(page.locator('#tutorial-heading')).toHaveText('Rotate and Flip');
  const expected = {
    original: { cells: ['0,0', '0,1', '0,2', '1,2'], anchor: '0,0' },
    rotate: { cells: ['0,0', '0,1', '1,0', '2,0'], anchor: '2,0' },
    flip: { cells: ['0,2', '1,0', '1,1', '1,2'], anchor: '1,0' },
  };
  for (const [action, value] of Object.entries(expected)) {
    const diagram = page.locator(`[data-transform="${action}"]`);
    const cells = await diagram.locator('[data-example-piece="cyan"]').evaluateAll(nodes => nodes.map(node => {
      const rect = node as SVGRectElement;
      return `${Math.floor(rect.x.baseVal.value)},${Math.floor(rect.y.baseVal.value)}`;
    }).sort());
    expect(cells).toEqual(value.cells);
    await expect(diagram.locator('[data-example-anchor]')).toHaveAttribute('data-example-anchor', value.anchor);
  }
  await activate(page, '#tutorial-back', true);
  await expect(page.locator('#tutorial-heading')).toHaveText('Place and move');
  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('#tutorial-home')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#play')).toBeFocused();
});

test('exact level groups and static reduced-motion panels pass axe and narrow reflow', { tag: '@shared' }, async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('./');
  await page.locator('#tutorial').click();
  for (let index = 0; index < 6; index++) {
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([]);
    await page.locator('.tutorial-navigation').scrollIntoViewIfNeeded();
    await expect(page.locator('.tutorial-navigation')).toBeInViewport();
    const navigation = await page.locator('.tutorial-navigation button:visible').evaluateAll(buttons => buttons.map(button => {
      const box = button.getBoundingClientRect();
      return { top: box.top, bottom: box.bottom, height: box.height, left: box.left, right: box.right };
    }));
    expect(navigation).toHaveLength(2);
    expect(Math.abs(navigation[0].top - navigation[1].top)).toBeLessThan(1);
    for (const button of navigation) {
      expect(button.height).toBeGreaterThanOrEqual(44);
      expect(button.left).toBeGreaterThanOrEqual(0);
      expect(button.right).toBeLessThanOrEqual(320);
      // Native scrolling rounds fractional positions at the viewport edge.
      expect(button.top).toBeGreaterThanOrEqual(-1);
      expect(button.bottom).toBeLessThanOrEqual(569);
    }
    if (index === 4) {
      const groups: Record<string, string[]> = { STARTER: [], JUNIOR: ['navy', 'brown'], EXPERT: ['navy', 'brown', 'orange'], MASTER: ['brown', 'orange', 'purple'], WIZARD: ['navy', 'brown', 'orange', 'purple'] };
      for (const [level, group] of Object.entries(groups)) {
        const row = page.locator(`[data-example-level="${level}"]`);
        expect(await row.locator('[data-example-restricted]').evaluateAll(nodes => nodes.map(node => (node as HTMLElement).dataset.exampleRestricted))).toEqual(group);
        await expect(row.locator('[data-mark-piece="navy"]')).toHaveCount(group.includes('navy') ? 1 : 0);
        expect(await row.locator('[data-example-restricted]').evaluateAll(nodes => nodes.every(node => {
          const art = node.querySelector('g')!.getBoundingClientRect();
          const name = node.querySelector('span')!.getBoundingClientRect();
          const icon = node.querySelector('svg')!.getBoundingClientRect();
          return Math.abs(art.top + art.height / 2 - name.top - name.height / 2) < 1
            && Math.abs(art.left + art.width / 2 - icon.left - icon.width / 2) < 1;
        }))).toBe(true);
      }
    }
    if (index < 5) await page.locator('#tutorial-next').click();
  }
  await page.setViewportSize({ width: 667, height: 375 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator('#tutorial-home').scrollIntoViewIfNeeded();
  await expect(page.locator('#tutorial-home')).toBeInViewport();
});
