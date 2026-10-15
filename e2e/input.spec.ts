import { test, expect } from '@playwright/test';
import { activate, cell, center, complete, fixtures, mouseDrag, openGame, openRecords, placePieces, resetRandom, seed, slot, trayPoint } from './helpers.ts';
import { transformPiece } from '../engine/core.ts';
test.setTimeout(60000);
test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: page.viewportSize()!.width, height: 1400 });
});

test('full keyboard-only game uses Tab, real transforms and grid navigation', { tag: '@desktop' }, async ({ page }) => {
  await seed(page);
  await page.goto('./');
  await activate(page, '#play', true);
  await resetRandom(page);
  // The default Starter accepts this Wizard fixture too.
  await activate(page, '#start', true);
  await complete(page, fixtures[0], true);
});

test('illegal/no-op taps preserve history; movement/removal Undo returns to empty', { tag: '@shared' }, async ({ page }) => {
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

test('keyboard boundaries, draft transforms, Delete and Escape preserve focus', { tag: '@desktop' }, async ({ page }) => {
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

test('multi-cell moves can overlap their own old footprint', { tag: '@shared' }, async ({ page }) => {
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

test('native mouse preserves cyan/red occupied anchors at two board scales', { tag: '@desktop' }, async ({ page }) => {
  await openGame(page, { ...fixtures[0], level: 'STARTER' });
  for (const width of [320, 800]) {
    await page.setViewportSize({ width, height: 1000 });
    await mouseDrag(page, await trayPoint(page, 'cyan', [1, 2]), await center(cell(page, 1, 3)));
    for (const [x, y] of [[0, 1], [0, 2], [0, 3], [1, 3]]) await expect(cell(page, x, y)).toHaveAttribute('data-content', 'cyan');
    await expect(slot(page, 'cyan')).toHaveAttribute('aria-pressed', 'false');
    await page.locator('#undo').click();
    await expect(page.locator('[data-content="cyan"]')).toHaveCount(0);
    await expect(page.locator('#undo')).toBeDisabled();
    await mouseDrag(page, await trayPoint(page, 'red', [0, 1]), await center(cell(page, 1, 5)));
    for (const [x, y] of [[2, 4], [3, 4], [1, 5], [2, 5]]) await expect(cell(page, x, y)).toHaveAttribute('data-content', 'red');
    await page.locator('#undo').click();
  }
});

test('Start works on its first click after Escape and release outside the widget', async ({ page }) => {
  await openGame(page);
  const from = await trayPoint(page, 'navy', [0, 0]);
  const to = await center(cell(page, 4, 5));
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(to.x, to.y, { steps: 5 });
  await page.keyboard.press('Escape');
  await page.mouse.move(5, 5);
  await page.mouse.up();
  await expect(page.locator('#undo')).toBeDisabled();
  await page.locator('#new-game').click();
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await expect(page.locator('#ready')).toBeVisible();
  await page.locator('#start').click();
  await expect(page.locator('[data-content="blocker"]')).toHaveCount(7);
  await expect(slot(page, 'navy')).toBeEnabled();
  await slot(page, 'navy').click();
  await cell(page, 4, 5).click();
  await expect(cell(page, 4, 5)).toHaveAttribute('data-content', 'navy');
});

test('vertical grey tray artwork and occupied drag regions fit inside its slot', async ({ page }) => {
  await openGame(page);
  for (const width of [320, 390, 800]) {
    await page.setViewportSize({ width, height: 1000 });
    await slot(page, 'grey').click();
    await page.locator('#rotate').click();
    await cell(page, 0, 1).click();
    const errors = await slot(page, 'grey').evaluate(button => {
      const svg = button.querySelector('svg')!;
      const art = svg.getBoundingClientRect();
      const slot = button.getBoundingClientRect();
      const regions = [...button.querySelectorAll('.grab-square')];
      return [...svg.querySelectorAll('rect')].map((rect, i) => {
        const visual = rect.getBoundingClientRect();
        const hit = regions[i].getBoundingClientRect();
        return {
          visible: visual.top >= art.top && visual.bottom <= art.bottom && visual.top >= slot.top && visual.bottom <= slot.bottom,
          hitFits: hit.top >= art.top && hit.bottom <= art.bottom && hit.top >= slot.top && hit.bottom <= slot.bottom,
          offset: Math.max(Math.abs(hit.x - visual.x), Math.abs(hit.y - visual.y), Math.abs(hit.width - visual.width), Math.abs(hit.height - visual.height)),
        };
      });
    });
    expect(errors).toHaveLength(4);
    for (const error of errors) {
      expect(error.visible).toBe(true);
      expect(error.hitFits).toBe(true);
      expect(error.offset).toBeLessThan(1);
    }
    // The formerly clipped final cell remains a real occupied drag source.
    await mouseDrag(page, await trayPoint(page, 'grey', [0, 3]), await center(slot(page, 'grey')));
    await expect(page.locator('[data-content="grey"]')).toHaveCount(0);
    await page.locator('#undo').click();
    await expect(page.locator('[data-content="grey"]')).toHaveCount(4);
    await page.locator('#undo').click();
  }
});

test('native mouse can transform a held anchor and commit only on release', { tag: '@desktop' }, async ({ page }) => {
  await openGame(page, { ...fixtures[0], level: 'STARTER' });
  const from = await trayPoint(page, 'cyan', [0, 0]);
  const to = await center(cell(page, 4, 0));
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(to.x, to.y, { steps: 6 });
  await expect(page.locator('#rotate')).toBeDisabled();
  await expect(page.locator('[data-content="cyan"]')).toHaveCount(0);
  await page.keyboard.press('r');
  await page.keyboard.press('f');
  const rotated = transformPiece('cyan', 0, [0, 0], 'rotate');
  const flipped = transformPiece('cyan', rotated.orientation, rotated.anchor, 'flip');
  expect(flipped.anchor).toEqual([0, 0]);
  const release = await center(cell(page, 3, 3));
  await page.mouse.move(release.x, release.y);
  await page.mouse.up();
  for (const [x, y] of [[4, 3], [5, 3], [3, 3], [5, 4]]) await expect(cell(page, x, y)).toHaveAttribute('data-content', 'cyan');
  await page.locator('#undo').click();
  await expect(page.locator('[data-content="cyan"]')).toHaveCount(0);
});

test('native mouse moves with self-overlap, rejects other slots, and removes through its own slot', { tag: '@desktop' }, async ({ page }) => {
  await openGame(page, { ...fixtures[0], level: 'STARTER' });
  await mouseDrag(page, await trayPoint(page, 'brown', [1, 0]), await center(cell(page, 2, 0)));
  await mouseDrag(page, await center(cell(page, 2, 0)), await center(cell(page, 3, 0)));
  await expect(cell(page, 1, 0)).toHaveAttribute('data-content', 'empty');
  await expect(cell(page, 2, 0)).toHaveAttribute('data-content', 'brown');
  await mouseDrag(page, await center(cell(page, 3, 0)), await center(slot(page, 'navy')));
  await expect(cell(page, 3, 0)).toHaveAttribute('data-content', 'brown');
  await mouseDrag(page, await center(cell(page, 3, 0)), await center(slot(page, 'brown')));
  await expect(page.locator('[data-content="brown"]')).toHaveCount(0);
  await page.locator('#undo').click();
  await expect(cell(page, 3, 0)).toHaveAttribute('data-content', 'brown');
  await page.locator('#undo').click();
  await expect(cell(page, 1, 0)).toHaveAttribute('data-content', 'brown');
  await page.locator('#undo').click();
  await expect(page.locator('#undo')).toBeDisabled();
});

test('native mouse rejects blockers, overlaps, edges and outside without adding history', { tag: '@desktop' }, async ({ page }) => {
  await openGame(page);
  await mouseDrag(page, await trayPoint(page, 'navy', [0, 0]), await center(cell(page, 4, 5)));
  for (const target of [await center(cell(page, 0, 0)), { x: 5, y: 5 }, await center(slot(page, 'red'))]) {
    await mouseDrag(page, await center(cell(page, 4, 5)), target);
    await expect(cell(page, 4, 5)).toHaveAttribute('data-content', 'navy');
  }
  await mouseDrag(page, await trayPoint(page, 'brown', [0, 0]), await center(cell(page, 5, 0)));
  await expect(slot(page, 'brown')).not.toHaveClass(/placed/);
  // A4's 2x2 footprint is in bounds and blocker-free; only the navy at B5 collides.
  await mouseDrag(page, await center(cell(page, 4, 5)), await center(cell(page, 1, 4)));
  await mouseDrag(page, await trayPoint(page, 'green', [0, 0]), await center(cell(page, 0, 3)));
  await expect(slot(page, 'green')).not.toHaveClass(/placed/);
  await page.locator('#undo').click();
  await expect(cell(page, 4, 5)).toHaveAttribute('data-content', 'navy');
  await page.locator('#undo').click();
  await expect(cell(page, 4, 5)).toHaveAttribute('data-content', 'empty');
  await expect(page.locator('#undo')).toBeDisabled();
});

test('source taps and bounding-box holes do not accidentally drag or commit', { tag: '@desktop' }, async ({ page }) => {
  await openGame(page);
  const source = await trayPoint(page, 'navy', [0, 0]);
  await page.mouse.move(source.x, source.y);
  await page.mouse.down();
  await page.mouse.move(source.x + 3, source.y + 2);
  await page.mouse.up();
  await expect(slot(page, 'navy')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#undo')).toBeDisabled();
  await cell(page, 4, 5).click();
  const padding = await slot(page, 'yellow').evaluate(button => {
    const box = button.getBoundingClientRect();
    return { x: box.left + 2, y: box.top + 2 };
  });
  await mouseDrag(page, padding, await center(cell(page, 2, 0)));
  await expect(slot(page, 'yellow')).not.toHaveClass(/placed/);
  // Yellow's upper-left bounding-box square is a hole.
  const svg = slot(page, 'yellow').locator('svg');
  const hole = await svg.evaluate(el => {
    const matrix = (el as SVGSVGElement).getScreenCTM()!;
    const point = new DOMPoint(.5, .5).matrixTransform(matrix);
    return { x: point.x, y: point.y };
  });
  await mouseDrag(page, hole, await center(cell(page, 2, 0)));
  await expect(slot(page, 'yellow')).not.toHaveClass(/placed/);
  await page.locator('#undo').click();
  await expect(page.locator('#undo')).toBeDisabled();
});

for (const cleanup of ['Escape', 'blur', 'resize', 'lost capture', 'pointercancel', 'hidden', 'Undo', 'New game'] as const) {
  const tag = cleanup === 'Escape' || cleanup === 'lost capture' ? '@desktop' : '@shared';
  test(`drag cancellation via ${cleanup} preserves committed state and permits subsequent play`, { tag }, async ({ page }) => {
    await openGame(page);
    await slot(page, 'navy').click();
    await cell(page, 4, 5).click();
    const from = await center(cell(page, 4, 5));
    const to = await center(cell(page, 1, 5));
    await page.mouse.move(from.x, from.y);
    await page.mouse.down();
    await page.mouse.move(to.x, to.y, { steps: 5 });
    if (cleanup === 'Escape') await page.keyboard.press('Escape');
    if (cleanup === 'blur') await page.evaluate(() => window.dispatchEvent(new Event('blur')));
    if (cleanup === 'resize') await page.setViewportSize({ width: 360, height: 980 });
    if (cleanup === 'lost capture') await page.evaluate(() => {
      const game = document.getElementById('game')!;
      // Mouse is the native Chromium/Firefox/WebKit pointer; inspect its captured ID.
      for (let id = 0; id < 10; id++) if (game.hasPointerCapture(id)) game.releasePointerCapture(id);
    });
    if (cleanup === 'pointercancel') await page.evaluate(() => {
      const game = document.getElementById('game')!;
      for (let id = 0; id < 10; id++) if (game.hasPointerCapture(id)) game.dispatchEvent(new PointerEvent('pointercancel', { pointerId: id, bubbles: true }));
    });
    if (cleanup === 'hidden') await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, value: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    if (cleanup === 'Undo' || cleanup === 'New game') {
      // Synthetic activation isolates the cleanup path while native mouse capture is held.
      await page.locator(cleanup === 'Undo' ? '#undo' : '#new-game').dispatchEvent('click');
      if (cleanup === 'New game') await page.getByRole('button', { name: 'Confirm', exact: true }).dispatchEvent('click');
    }
    await page.mouse.up();
    if (cleanup === 'New game') {
      await expect(page.locator('#ready')).toBeVisible();
      await expect(page.locator('#grid button[aria-label$="hidden"]')).toHaveCount(36);
      await page.locator('#start').click();
    } else if (cleanup === 'Undo') {
      await expect(page.locator('[data-content="navy"]')).toHaveCount(0);
    } else {
      await expect(cell(page, 4, 5)).toHaveAttribute('data-content', 'navy');
      await expect(cell(page, 1, 5)).toHaveAttribute('data-content', 'empty');
      await page.locator('#undo').click();
      await expect(page.locator('#undo')).toBeDisabled();
    }
    await slot(page, 'navy').click();
    await cell(page, 4, 5).click();
    await expect(cell(page, 4, 5)).toHaveAttribute('data-content', 'navy');
  });
}

test('Chromium native touch drag/move/return, secondary input and touchCancel are transactional', { tag: '@touch' }, async ({ page, browserName }, testInfo) => {
  expect(browserName).toBe('chromium');
  expect(testInfo.project.name).toBe('mobile-chromium');
  await page.setViewportSize({ width: 430, height: 1400 });
  await openGame(page, { ...fixtures[0], level: 'STARTER' });
  const cdp = await page.context().newCDPSession(page);
  await page.evaluate(() => {
    const evidence: unknown[] = [];
    (window as unknown as { pointerEvidence: unknown[] }).pointerEvidence = evidence;
    for (const type of ['pointerdown', 'pointermove', 'pointerup', 'pointercancel', 'gotpointercapture', 'lostpointercapture']) {
      window.addEventListener(type, event => {
        const e = event as PointerEvent;
        evidence.push({ type, id: e.pointerId, primary: e.isPrimary, x: e.clientX, y: e.clientY, target: (e.target as Element).tagName });
      });
    }
  });
  const send = (type: 'touchStart' | 'touchMove' | 'touchEnd' | 'touchCancel', points: { x: number; y: number; id: number }[] = []) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: points });
  const from = await trayPoint(page, 'cyan', [1, 2]);
  const to = await center(cell(page, 1, 3));
  await send('touchStart', [{ ...from, id: 1 }]);
  await send('touchMove', [{ ...to, id: 1 }]);
  await expect(page.locator('[data-content="cyan"]')).toHaveCount(0);
  await send('touchStart', [{ ...to, id: 1 }, { x: 410, y: 80, id: 2 }]);
  await send('touchMove', [{ ...to, id: 1 }, { x: 400, y: 90, id: 2 }]);
  await send('touchEnd');
  const evidence = await page.evaluate(() => (window as unknown as { pointerEvidence: unknown[] }).pointerEvidence);
  expect(evidence).toEqual(expect.arrayContaining([
    expect.objectContaining({ type: 'pointerdown', primary: false }),
    expect.objectContaining({ type: 'gotpointercapture', primary: true, target: 'SECTION' }),
  ]));
  await expect(cell(page, 1, 3)).toHaveAttribute('data-content', 'cyan');
  await expect(page.locator('[data-content="cyan"]')).toHaveCount(4);
  const moveFrom = await center(cell(page, 1, 3));
  const moveTo = await center(cell(page, 1, 4));
  await send('touchStart', [{ ...moveFrom, id: 3 }]);
  await send('touchMove', [{ ...moveTo, id: 3 }]);
  await send('touchEnd');
  await expect(cell(page, 0, 1)).toHaveAttribute('data-content', 'empty');
  await expect(cell(page, 0, 4)).toHaveAttribute('data-content', 'cyan');
  await send('touchStart', [{ ...await center(cell(page, 1, 4)), id: 4 }]);
  await send('touchMove', [{ ...await center(cell(page, 2, 4)), id: 4 }]);
  await send('touchCancel');
  await expect(cell(page, 1, 4)).toHaveAttribute('data-content', 'cyan');
  await send('touchStart', [{ ...await center(cell(page, 1, 4)), id: 5 }]);
  await send('touchMove', [{ ...await center(slot(page, 'cyan')), id: 5 }]);
  await send('touchEnd');
  await expect(page.locator('[data-content="cyan"]')).toHaveCount(0);
  await page.locator('#undo').click();
  await expect(cell(page, 1, 4)).toHaveAttribute('data-content', 'cyan');
  await page.locator('#undo').click();
  await expect(cell(page, 1, 3)).toHaveAttribute('data-content', 'cyan');
  await page.locator('#undo').click();
  await expect(page.locator('#undo')).toBeDisabled();
});

test('records and committed artwork stay mounted during dragging and timer ticks', { tag: '@shared' }, async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-13T10:00:00Z') });
  await page.addInitScript(() => localStorage.setItem('rollmino.records.v1', JSON.stringify({
    WIZARD: [{ elapsedMs: 1000, finishedAt: 1700000000000 }],
    MASTER: [{ elapsedMs: 2000, finishedAt: 1700000000000 }],
  })));
  await seed(page);
  await page.goto('./');
  await openRecords(page);
  await page.locator('#records-home').click();
  await page.locator('#play').click();
  await page.locator('#level').selectOption('WIZARD');
  await resetRandom(page);
  await page.locator('#start').click();
  await slot(page, 'navy').click();
  await cell(page, 4, 5).click();
  const record = await page.locator('#records-list li').elementHandle();
  const piece = await page.locator('#committed-art .restriction-mark').elementHandle();
  const source = await slot(page, 'cyan').locator('[data-anchor="0,0"]').elementHandle();
  const from = await trayPoint(page, 'cyan', [0, 0]);
  const to = await center(cell(page, 0, 0));
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(to.x, to.y, { steps: 20 });
  await page.clock.fastForward(5000);
  expect(await record!.evaluate(node => node.isConnected)).toBe(true);
  expect(await piece!.evaluate(node => node.isConnected)).toBe(true);
  expect(await source!.evaluate(node => node.isConnected)).toBe(true);
  await page.mouse.up(); // Blocker drop rejects without replacing committed content.
  await expect(cell(page, 4, 5)).toHaveAttribute('data-content', 'navy');
  expect(await record!.evaluate(node => node.isConnected)).toBe(true);
  expect(await piece!.evaluate(node => node.isConnected)).toBe(true);
  await page.locator('#level').selectOption('MASTER');
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await expect(page.locator('#records-list')).toContainText('00:01.00');
  expect(await record!.evaluate(node => node.isConnected)).toBe(true);
});

test('native drag completion freezes once and saves one ranked record', { tag: '@shared' }, async ({ page }) => {
  await openGame(page);
  await placePieces(page, fixtures[0].solution.slice(0, -1));
  await mouseDrag(page, await trayPoint(page, 'green', [1, 1]), await center(cell(page, 1, 4)));
  await expect(page.locator('#status')).toContainText('Completed in');
  await expect(page.locator('#undo')).toBeDisabled();
  await expect(slot(page, 'green')).toBeDisabled();
  await openRecords(page);
  await expect(page.locator('#records-list li')).toHaveCount(1);
  await page.locator('#clear-records').click();
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await expect(page.locator('#records-list li')).toHaveCount(0);
});

test('native Chromium touch scrolls outside occupied source regions', { tag: '@touch' }, async ({ page, browserName }, testInfo) => {
  expect(browserName).toBe('chromium');
  expect(testInfo.project.name).toBe('mobile-chromium');
  await page.setViewportSize({ width: 430, height: 800 });
  await openGame(page);
  await expect(page.locator('.grab-square').first()).toHaveCSS('touch-action', 'none');
  await expect(cell(page, 1, 0)).toHaveCSS('touch-action', 'auto');
  await expect(slot(page, 'navy')).toHaveCSS('touch-action', 'auto');
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 5, y: 700, id: 1 }] });
  for (const y of [660, 610, 550, 490, 430]) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 5, y, id: 1 }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
});
