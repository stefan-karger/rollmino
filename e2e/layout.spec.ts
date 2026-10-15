import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { cell, enterExercise, fixtures, mouseDrag, openGame, placePieces, resetRandom, seed, slot, trayPoint, center } from './helpers.ts';

test('responsive reflow preserves the board, clock, draft, focus and Undo; dropdowns remain readable', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-15T10:00:00Z') });
  await page.clock.pauseAt(new Date('2026-10-15T10:00:01Z'));
  await seed(page);
  await page.goto('./');
  await page.locator('#play').click();
  await page.locator('#level').selectOption('WIZARD');
  await resetRandom(page);
  await page.locator('#start').click();
  await placePieces(page, [fixtures[0].solution.find(p => p.id === 'brown')!]);
  await slot(page, 'cyan').click();
  await page.locator('#flip').focus();
  await page.keyboard.press('Enter');
  const preview = await page.locator('#preview').textContent();
  const committed = await page.locator('#committed-art').innerHTML();
  const historyLength = await page.evaluate(() => history.length);
  const boardNode = await page.locator('#grid').elementHandle();
  const originalViewport = page.viewportSize()!;
  for (const viewport of [
    { width: 390, height: 844 }, { width: 1024, height: 768 },
    { width: 1366, height: 768 }, originalViewport,
  ]) {
    await page.setViewportSize(viewport);
    expect(await page.locator('#committed-art').innerHTML()).toBe(committed);
    await expect(page.locator('#preview')).toHaveText(preview!);
    await expect(slot(page, 'cyan')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#flip')).toBeFocused();
    await expect(page.locator('#undo')).toBeEnabled();
    expect(await page.evaluate(() => history.length)).toBe(historyLength);
    await page.clock.fastForward(1000);
  }
  await expect(page.locator('#timer')).toHaveText('00:04.00');
  expect(await boardNode!.evaluate(node => node === document.getElementById('grid'))).toBe(true);
  await page.locator('#undo').click();
  await expect(page.locator('#grid [data-content="brown"]')).toHaveCount(0);
  await expect(page.locator('#undo')).toBeDisabled();
  await expect(page.locator('#timer')).toHaveText('00:04.00');
  await page.locator('#level').selectOption('MASTER');
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page.locator('#level')).toHaveValue('WIZARD');
  await expect(page.locator('#level')).toBeFocused();
  const dropdownContrast = await page.locator('select, select option').evaluateAll(nodes => nodes.map(node => {
    const style = getComputedStyle(node);
    const background = style.backgroundColor.match(/[\d.]+/g)!.map(Number);
    if (background.length === 4 && background[3] !== 1) return 0;
    function luminance(color: number[]): number {
      const channels = color.slice(0, 3).map(value => {
        const channel = value / 255;
        return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
      });
      return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
    }
    const foreground = luminance(style.color.match(/[\d.]+/g)!.map(Number));
    const behind = luminance(background);
    return (Math.max(foreground, behind) + .05) / (Math.min(foreground, behind) + .05);
  }));
  expect(Math.min(...dropdownContrast)).toBeGreaterThanOrEqual(4.5);
  await page.locator('#game-secondary summary').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#rule')).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page.locator('#rule')).toBeHidden();
  await page.reload();
  await expect(page.locator('#play')).toBeEnabled();
  await page.locator('#play').click();
  await expect(page.locator('#tray .piece-label')).toHaveCount(0);
  await expect(page.locator('#grid button[aria-label$="hidden"]')).toHaveCount(36);
});

test('game and exercise share the compact responsive layout and pass axe', { tag: '@shared' }, async ({ page }) => {
  for (const surface of ['game', 'exercise']) {
    if (surface === 'game') await openGame(page);
    else {
      await page.goto('./');
      await enterExercise(page);
      await expect(slot(page, 'navy')).toBeDisabled();
      await expect(slot(page, 'brown')).toBeEnabled();
    }
    for (const viewport of [
      { width: 320, height: 568 }, { width: 390, height: 844 },
      { width: 1024, height: 600 }, { width: 1024, height: 768 }, { width: 1366, height: 768 },
    ]) {
      await page.setViewportSize(viewport);
      await page.evaluate(exercise => {
        if (exercise) document.querySelector('.board-frame')!.scrollIntoView({ block: 'start' });
        else scrollTo(0, 0);
      }, surface === 'exercise');
      const geometry = await page.evaluate(exercise => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        board: document.querySelector('.board-frame')!.getBoundingClientRect().toJSON(),
        tools: document.querySelector('.tools')!.getBoundingClientRect().toJSON(),
        tray: document.getElementById('tray')!.getBoundingClientRect().toJSON(),
        pieces: [...document.querySelectorAll('#tray button')].map(node => node.getBoundingClientRect().toJSON()),
        trayBackground: getComputedStyle(document.getElementById('tray')!).backgroundColor,
        pieceBackgrounds: [...document.querySelectorAll('#tray button')].map(node => getComputedStyle(node).backgroundColor),
        targets: [...document.querySelectorAll(exercise ? '.board-frame, .tools button, #tray button' : '#timer, .board-frame, .tools button, #tray button')].map(node => {
          const box = node.getBoundingClientRect();
          return { name: node.getAttribute('aria-label') ?? node.id, top: box.top, bottom: box.bottom };
        }),
      }), surface === 'exercise');
      expect(geometry.overflow).toBe(false);
      for (const target of geometry.targets) {
        // Native scrollIntoView rounds fractional exercise geometry to CSS pixels.
        expect(target.top, viewport.width + '/' + target.name).toBeGreaterThanOrEqual(-1);
        expect(target.bottom, viewport.width + '/' + target.name).toBeLessThanOrEqual(viewport.height + 1);
      }
      await expect(page.locator('#tray .piece-label')).toHaveCount(0);
      await expect(page.locator('#tray button')).toHaveCount(9);
      for (let row = 0; row < 3; row++) {
        const pieces = geometry.pieces.slice(row * 3, row * 3 + 3);
        expect(pieces.every(piece => Math.abs(piece.top - pieces[0].top) < 1)).toBe(true);
        if (row) expect(pieces[0].top).toBeGreaterThan(geometry.pieces[(row - 1) * 3].bottom);
      }
      expect(geometry.trayBackground).not.toBe('rgba(0, 0, 0, 0)');
      expect(geometry.pieceBackgrounds.every(color => color === 'rgba(0, 0, 0, 0)')).toBe(true);
      expect(geometry.tools.top).toBeGreaterThanOrEqual(geometry.board.bottom);
      if (viewport.width >= 900) {
        expect(geometry.tray.left).toBeGreaterThan(geometry.board.right);
        expect(geometry.tray.left).toBeGreaterThan(geometry.tools.right);
      } else {
        expect(geometry.tray.top).toBeGreaterThanOrEqual(geometry.tools.bottom);
      }
      if (viewport.width === 390) {
        expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([]);
      }
    }
  }
});

test('centered piece art matches occupied hit regions and native dragging', { tag: '@desktop' }, async ({ page }) => {
  await openGame(page);
  for (const viewport of [
    { width: 390, height: 844 }, { width: 1024, height: 768 }, { width: 1366, height: 768 },
  ]) {
    await page.setViewportSize(viewport);
    await mouseDrag(page, await trayPoint(page, 'brown', [1, 0]), await center(cell(page, 2, 0)));
    await expect(cell(page, 1, 0)).toHaveAttribute('data-content', 'brown');
    await expect(cell(page, 2, 0)).toHaveAttribute('data-content', 'brown');
    await page.locator('#undo').click();
    await placePieces(page, [{ id: 'grey', orientation: 1, x: 5, y: 2 }]);
    const errors = await page.locator('#tray button').evaluateAll(buttons => buttons.flatMap(button => {
      const svgRects = [...button.querySelectorAll<SVGRectElement>('svg rect[fill]')];
      const art = button.querySelector('.piece-art')!.getBoundingClientRect();
      return [...button.querySelectorAll<HTMLElement>('[data-anchor]')].map(region => {
        const [x, y] = region.dataset.anchor!.split(',').map(Number);
        const rect = svgRects.find(rect => Math.abs(rect.x.baseVal.value - x - .04) < .001 && Math.abs(rect.y.baseVal.value - y - .04) < .001)!;
        // Compare occupied cell geometry; Firefox includes stroke paint in SVG client bounds.
        const matrix = rect.getScreenCTM()!;
        const start = new DOMPoint(rect.x.baseVal.value, rect.y.baseVal.value).matrixTransform(matrix);
        const end = new DOMPoint(rect.x.baseVal.value + rect.width.baseVal.value, rect.y.baseVal.value + rect.height.baseVal.value).matrixTransform(matrix);
        const visual = { x: start.x, y: start.y, width: end.x - start.x, height: end.y - start.y };
        const hit = region.getBoundingClientRect();
        return { piece: button.getAttribute('data-piece'), anchor: [x, y], visual, hit: hit.toJSON(),
          error: Math.max(Math.abs(visual.x - hit.x), Math.abs(visual.y - hit.y), Math.abs(visual.width - hit.width), Math.abs(visual.height - hit.height),
            art.left - hit.left, art.top - hit.top, hit.right - art.right, hit.bottom - art.bottom) };
      });
    }));
    expect(Math.max(...errors.map(value => value.error)), JSON.stringify({ viewport, errors: errors.filter(value => value.error >= 1) })).toBeLessThan(1);
    await page.locator('#undo').click();
  }
});
