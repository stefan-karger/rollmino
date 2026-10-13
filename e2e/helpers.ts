import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { DICE, firstAnchor, transformPiece } from '../engine/core.ts';
import type { Cell, Level, PieceId, Placement } from '../engine/core.ts';
import { readFileSync } from 'node:fs';

export const fixtures = JSON.parse(readFileSync(new URL('../fixtures/rolls.json', import.meta.url), 'utf8')) as { id: string; level: Level; dice: string[]; solution: Placement[] }[];
export const cell = (page: Page, x: number, y: number) => page.locator(`[data-cell="${y * 6 + x}"]`);
export const slot = (page: Page, id: PieceId) => page.locator(`[data-piece="${id}"]`);

export async function seed(page: Page, rolls = [fixtures[0].dice]): Promise<void> {
  const values = rolls.flatMap(dice => dice.map((face, i) => (DICE[i].indexOf(face) + .5) / 6));
  await page.addInitScript(values => {
    let index = 0;
    Math.random = () => values[index++ % values.length];
  }, values);
}
export async function openGame(page: Page, fixture = fixtures[0]): Promise<void> {
  await seed(page, [fixture.dice]);
  await page.goto('./');
  await page.getByLabel('Level', { exact: true }).selectOption(fixture.level);
  await page.getByRole('button', { name: 'Start', exact: true }).click();
}
export function transformPath(id: PieceId, wanted: number): { actions: ('rotate' | 'flip')[]; anchor: Cell } {
  const queue = [{ orientation: 0, anchor: firstAnchor(id, 0), actions: [] as ('rotate' | 'flip')[] }];
  const seen = new Set<number>();
  while (queue.length) {
    const next = queue.shift()!;
    if (next.orientation === wanted) return next;
    if (seen.has(next.orientation)) continue;
    seen.add(next.orientation);
    for (const action of ['rotate', 'flip'] as const) {
      queue.push({ ...transformPiece(id, next.orientation, next.anchor, action), actions: [...next.actions, action] });
    }
  }
  throw Error('Unreachable fixture orientation');
}
export async function activate(page: Page, selector: string, keyboard: boolean): Promise<void> {
  const locator = page.locator(selector);
  if (!keyboard) {
    if (await page.evaluate(() => navigator.maxTouchPoints > 0)) await locator.tap();
    else await locator.click();
    return;
  }
  // Tab through the real focus order, without programmatically moving focus.
  for (let i = 0; i < 60; i++) {
    if (await locator.evaluate(el => el === document.activeElement)) {
      await page.keyboard.press('Enter');
      return;
    }
    await page.keyboard.press('Tab');
  }
  throw Error(`Cannot reach ${selector} through Tab`);
}
export async function complete(page: Page, fixture = fixtures[0], keyboard = false): Promise<void> {
  for (const p of fixture.solution) {
    await activate(page, `[data-piece="${p.id}"]`, keyboard);
    const path = transformPath(p.id, p.orientation);
    for (const action of path.actions) {
      if (keyboard) await page.keyboard.press(action === 'rotate' ? 'r' : 'f');
      else await page.getByRole('button', { name: action === 'rotate' ? 'Rotate' : 'Flip', exact: true }).click();
    }
    const x = p.x + path.anchor[0], y = p.y + path.anchor[1];
    if (keyboard) {
      for (let i = 0; i < 30; i++) {
        if (await page.locator('#grid button:focus').count()) break;
        await page.keyboard.press('Tab');
      }
      await page.keyboard.press('Control+Home');
      for (let i = 0; i < x; i++) await page.keyboard.press('ArrowRight');
      for (let i = 0; i < y; i++) await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
    } else if (await page.evaluate(() => navigator.maxTouchPoints > 0)) await cell(page, x, y).tap();
    else await cell(page, x, y).click();
    await expect(slot(page, p.id)).toHaveClass(/placed/);
  }
  await expect(page.getByRole('status')).toContainText('Completed in');
  await expect(page.getByRole('button', { name: 'Undo', exact: true })).toBeDisabled();
}
