# T16. Fit every tray orientation and its drag regions

[Tracker and priority](README.md) | Blockers: none

The tray assumes a 4.3 by 3.3 drawing area. A committed vertical grey line is four cells tall, so its last square is clipped and its HTML drag region overlaps the label. At 390 CSS px, artwork ended at y=847.45 while the last hit region extended to y=863.64.

Files: src/app.ts, src/styles.css, focused input/layout tests and a small geometry helper only if useful.

## Work and checks

1. Add a failing regression using opening-seed: select grey, Rotate, place vertically at A2, then inspect its persistent tray slot.
2. Use one geometry calculation to fit SVG artwork and occupied HTML hit regions. Keep slots compact, committed orientation visible, placed shapes dimmed and labels readable.
3. Check all piece/orientation extents and representative occupied anchors. Empty bounding-box areas and labels must retain their existing non-drag behavior.

Run pnpm test, pnpm run build and focused input/layout checks in desktop engines and mobile Chromium/WebKit at narrow and wider sizes. Prefer a bounded geometry loop and one browser regression to additional complete-game matrices.

## Acceptance

- [ ] All four grey cells are visible after vertical placement.
- [ ] Occupied hit regions align with artwork and stay clear of labels/gutters.
- [ ] Grabbed anchors, own-slot removal, tap selection and scrolling remain correct.
- [ ] Compact layout is preserved and the failing regression passes.

## Completion evidence

Add dated implementation and verification results before marking the tracker done.
