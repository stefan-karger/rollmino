import test from 'node:test';
import assert from 'node:assert/strict';
import { ORIENTATIONS } from '../engine/core.ts';
import { trayBounds } from '../src/tray-geometry.ts';

test('all 28 tray orientations fit with padding and the compact CSS aspect ratio', () => {
  for (const [id, orientations] of Object.entries(ORIENTATIONS)) {
    for (const [orientation, cells] of orientations.entries()) {
      const bounds = trayBounds(cells);
      assert.ok(Math.abs(bounds.width / bounds.height - 4.3 / 3.3) < 1e-12);
      for (const [x, y] of cells) {
        assert.ok(x + 1.15 <= bounds.width, `${id}/${orientation} horizontal extent`);
        assert.ok(y + 1.15 <= bounds.height, `${id}/${orientation} vertical extent`);
      }
    }
  }
  assert.deepEqual(trayBounds([[0, 0], [0, 1], [0, 2], [0, 3]]), { width: 4.3 * (4.3 / 3.3), height: 4.3 });
  assert.deepEqual(trayBounds([[0, 0], [1, 0], [2, 0], [3, 0]]), { width: 4.3, height: 3.3 });
});
