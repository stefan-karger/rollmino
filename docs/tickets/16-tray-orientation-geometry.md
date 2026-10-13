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

- [x] All four grey cells are visible after vertical placement.
- [x] Occupied hit regions align with artwork and stay clear of labels/gutters.
- [x] Grabbed anchors, own-slot removal, tap selection and scrolling remain correct.
- [x] Compact layout is preserved and the failing regression passes.

## Completion evidence

2026-10-13, Windows workspace, Node 24.15.0 and pnpm 12.10.0. The native regression failed before repair at 320 CSS pixels because the fourth vertical grey cell lay outside the SVG viewport. `src/tray-geometry.ts` now computes padded bounds at the existing 4.3/3.3 slot aspect ratio; `src/app.ts` uses those same bounds for the SVG viewBox and occupied HTML hit regions. Tall orientations scale inside the existing compact slot without moving labels or changing the stylesheet.

`pnpm test` passed all 60 tests, including a bounded check of every one of the 28 orientations, padding, aspect ratio and the literal horizontal/vertical grey cases. `pnpm run build` passed strict checking. The focused `vertical grey` browser regression passed all five projects in 34.5 seconds. Each project checks 320/390/800 CSS pixels, all four grey rectangles, hit-region alignment below 1px, clearance above the label, dragging from the formerly clipped last square to the own-slot label, and exact removal/Undo behavior. The frozen installation passed without dependency changes. The sequential release run passed all 217 applicable development cases in 7.9 minutes with eight expected CDP skips, all ten root/subpath production cases in 28.0 seconds, and all 62,208 independently checked Wizard answers in 31.66 seconds. Native touch/capture, own-slot return, labels/holes and scrolling coverage remained green. `git diff --check` passed. This is browser emulation, not physical-device or screen-reader evidence.
