import type { Placement } from '../engine/core.ts';

// Intentional teaching artwork, independent of any ordinary roll or test fixture import.
export const tutorialExample: { dice: readonly string[]; placements: readonly Placement[] } = {
  dice: ['A1', 'B2', 'C3', 'F2', 'D6', 'E5', 'A6'],
  placements: [
    { id: 'navy', orientation: 0, x: 4, y: 5 },
    { id: 'grey', orientation: 1, x: 5, y: 2 },
    { id: 'brown', orientation: 0, x: 1, y: 0 },
    { id: 'cyan', orientation: 6, x: 4, y: 0 },
    { id: 'yellow', orientation: 3, x: 2, y: 0 },
    { id: 'purple', orientation: 0, x: 0, y: 1 },
    { id: 'orange', orientation: 0, x: 2, y: 3 },
    { id: 'red', orientation: 0, x: 1, y: 4 },
    { id: 'green', orientation: 0, x: 0, y: 3 },
  ],
};
