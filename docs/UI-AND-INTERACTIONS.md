# Rollmino V1 interactions

Status: agreed on 2026-10-12. The detailed state machines and geometry policy are in [IMPLEMENTATION_PLAN.md](../IMPLEMENTATION_PLAN.md), sections 5 through 8. This is a summary, not an alternative specification.

These interactions are implemented through the authoritative session and stable HTML/SVG controls. [Integrated verification](TEST-RESULTS.md#integrated-v1-local-release-verification) covers complete tap/keyboard play, native mouse and Chromium-emulated touch dragging, cancellation, records and accessibility/layout checks. No physical-phone or screen-reader audit is claimed.

## Lifecycle

- Ready hides all puzzle coordinates and disables piece editing. Start reveals the board and begins timing.
- Fresh Start samples physical die faces; practice Start uses the replay layout without rolling. Label practice clearly.
- Timing continues during backgrounding, phone lock, confirmations and Undo. There is no pause or assistance.
- New game, Replay and a level change confirm before abandoning active play. Cancel preserves game/time. New game and level changes prepare fresh hidden ready; Replay prepares hidden practice ready.
- Completion freezes committed play and time, discards Undo and considers a ranked record once. Only New game/Replay/level selection begins another run.
- Reload abandons the session and opens fresh Starter ready. Only completed records persist.
- Clearing the selected level's records confirms first and leaves the active game/time alone.

## Input

Keep nine persistent named tray slots. Placed pieces stay dimmed and selectable there. Visible Rotate, Flip, Remove and Undo controls accompany all input methods.

Tap a piece, then a target cell to commit immediately. The marked first occupied cell is the tap anchor. With no selection, tapping a placed board piece selects it. With a selection, a board tap attempts that selected piece's placement. There is no Place button.

Dragging is required for touch/mouse and supported through Pointer Events. Preserve the actual grabbed occupied square. Arm after source hit testing, begin beyond a 6 CSS px movement threshold and capture on a stable container. Keep the old committed placement until a valid release. Returning to the piece's own tray slot removes it; other outside/illegal drops restore committed state. Ignore secondary pointers and suppress the click after a real drag.

Rotate is 90 degrees clockwise; Flip mirrors left/right. Transform cells and anchor together, normalize them and find the canonical orientation. An orientation index increment is not a transform. Map pointer coordinates with the inverse SVG board CTM; never clamp into a valid placement.

Pointer cancellation, lost capture, Escape, blur/hidden tab and layout resize cancel the gesture without modifying committed placements or time. Apply `touch-action: none` only to actual draggable source regions. Scrolling/zoom outside them remain available. Drafts are not committed occupancy.

Successful placements/moves/removals each add one snapshot to full active-run Undo. Invalid/no-op actions and draft changes add none. Undo never rewinds time; completion cannot be reopened. No Redo.

## Keyboard, layout and feedback

Use one compact phone layout centered on desktop. Keep board, controls and tray adjacent; small/landscape screens may scroll vertically. Prevent horizontal overflow and preserve reachable controls at 320 CSS px.

SVG visuals have synchronized native HTML grid controls with named coordinates/content, semantic rows and a roving tab stop. Use piece names/shapes and restriction numbers, not color alone. Keep stable focus and one polite status region; do not announce timer ticks or pointer movement.

Arrows navigate cells/selected targets; Home/End navigate the row; Ctrl+Home/End navigate board ends. Enter/Space activates or commits once; R/F transforms; Delete removes; Escape cancels. Do not intercept unrelated controls/dialogs/selects. Start focuses the grid; completion announces without a forced modal. Native confirmations restore focus on Cancel. Confirmed run transitions focus Start; confirmed record clearing returns focus to Clear records.

Records show time/date only, best five for the selected difficulty. There is no layout inspection or replay from a record. Follow the plan's exact formatting, ranking and storage-failure policy.
