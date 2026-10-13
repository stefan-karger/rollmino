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

- [x] Completion feedback and frozen time are visible beside the board on the tested phone viewport.
- [x] Finished play displays no instruction to keep placing pieces.
- [x] Completion stays terminal, saves at most once and announces without a forced modal.
- [x] The viewport assertion passes and transition/focus behavior is preserved.

## Completion evidence

2026-10-13. `src/app.ts` now replaces the existing preview instruction with frozen completion time and ranked/practice text. Mode text also says the run is complete instead of describing future ranking. The existing polite status announces completion once; no new live region, modal, scrolling or focus handler was added. The contract reflects the accepted feedback change.

Extended the existing first-fixture gameplay regression rather than adding another scenario matrix. Before repair, both mobile projects failed because the preview still instructed placement. After repair, native tap completion at 390x844 checks that the entire feedback rectangle remains within the current viewport, without scrolling it into view. It checks ranked and practice frozen times, one unchanged saved record, one polite region, no dialog, Replay/hidden practice and New game/Start focus. Both focused phone cases passed in 24.7 seconds. Phone practice completion adds two full games to the maintained matrix; its case count stays 93.

Frozen installation, all 60 pure tests and strict build passed. All 93 development cases passed in 2.4 minutes, including four-state axe, narrow layout, native inputs and terminal completion. All five root/subpath artifact cases passed in 12.0 seconds. All 62,208 answers passed independent verification in 31.18 seconds. Documentation checks and `git diff --check` passed. Evidence is automated phone emulation, not physical-phone or screen-reader testing.
