# T20. Show completion feedback near the board

[Tracker and priority](README.md) | Blockers: none

Completing opening-seed through touch controls at 390 by 844 left the status below the viewport at y=945.45. The visible preview still said "Select a piece, then a board cell" and the mode still described a fresh roll that could rank.

Files: src/app.ts, index.html, src/styles.css and focused gameplay/layout tests.

## Work and checks

1. Show concise completion feedback and frozen time near the board or existing preview area. Make ranked versus practice completion clear.
2. Keep the polite single announcement, terminal board/time and reachable New game/Replay actions. Preserve the current focus policy without a forced modal or scroll jump.
3. Add one representative phone completion regression that checks viewport position, not only text. Check narrow layout/scrolling without another full fixture matrix.

Run pnpm test, pnpm run build and focused gameplay/accessibility checks in mobile Chromium/WebKit. Check completed, practice, New game and Replay states and relevant axe coverage.

## Acceptance

- [ ] Completion feedback and frozen time are visible beside the board on the tested phone viewport.
- [ ] Finished play displays no instruction to keep placing pieces.
- [ ] Completion stays terminal, saves at most once and announces without a forced modal.
- [ ] The viewport assertion passes and transition/focus behavior is preserved.

## Completion evidence

Add dated implementation and verification results before marking the tracker done.
