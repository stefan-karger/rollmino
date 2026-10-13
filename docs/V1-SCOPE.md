# Rollmino V1 scope

Status: agreed on 2026-10-12. [IMPLEMENTATION_PLAN.md](../IMPLEMENTATION_PLAN.md) is the full current specification. [DECISIONS.md](DECISIONS.md) records the user's answers.

The V1 journey below is implemented and published at [Rollmino](https://stefan-karger.github.io/rollmino/). [Current checks and limits](TEST-RESULTS.md#integrated-v1-local-release-verification) distinguish automated emulation from hardware testing. [T14](tickets/14-public-pages-deployment.md#completion-evidence) records the successful checked-artifact deployment and live verification.

## Required journey

1. Open a free English-only Rollmino site. Choose any of five levels. The puzzle is hidden behind Start.
2. Start reveals seven blockers from the physical dice and begins the timer. Background/lock time, confirmations and Undo count.
3. Place all nine pieces through immediate tap/click input, touch/mouse dragging or keyboard controls. Rotate clockwise, flip left/right, move and remove pieces with occupied anchors.
4. Reject illegal attempts without changing committed placements/history. Keep placed pieces dimmed and selectable in their own tray slots. Returning to that slot removes them.
5. Undo any successful action within the current active run, without rewinding time. There is no Redo or solver help.
6. Validate complete committed coverage, freeze the solved run and consider its record once. Fresh completions can rank; intentional replay is timed practice.
7. New game, Replay and level changes confirm before abandoning active play. The next puzzle is hidden until Start. Replay preserves that layout/level; a level change prepares a fresh roll.
8. Inspect the best five personal runs for the selected level, with `mm:ss.ss` and local completion date. Clear that level with confirmation. Reload retains records and abandons unfinished play.

## Model

The exact dice/shapes/contact tables are in the agreed plan and canonical `engine/core.ts`. Preserve repeated die faces, seven distinct blockers, nine IDs, 29 piece squares and 28 orientations on the 6 by 6 board. A1 is the upper-left cell.

| Level | Pieces that cannot share an edge with one another |
| --- | --- |
| Starter | none |
| Junior | navy, brown |
| Expert | navy, brown, orange |
| Master | brown, orange, purple |
| Wizard | navy, brown, orange, purple |

Diagonal contact is allowed. Board boundaries, blockers and unrestricted pieces may touch these pieces. Master is not a superset of Expert. Every physical blocker board has a Wizard completion under the encoded model; legal partial play can still reach a dead end.

## Delivery and exclusions

Use a clean dark phone-first layout, original flat piece visuals and the same centered layout on desktop. Deliver a responsive website using TypeScript/Vite/SVG/CSS/native HTML, Node tests and Playwright. Host the public `stefan-karger/rollmino` repository on GitHub Pages.

No hints, solution button, pause, Redo, in-progress persistence, saved-record layouts/replay, account, synchronization, global leaderboard, multiplayer, analytics, PWA/service worker or Android app. Elaborate animations, sound and guided tutorials are deferred beyond V1.

Automated tests executable here are the release gate; a physical phone is not required. Physical-source caveats and unperformed device checks must remain honest. See [SOURCES-AND-RISKS.md](SOURCES-AND-RISKS.md).
