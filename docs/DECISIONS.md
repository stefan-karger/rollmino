# V1 decision record

Status: interview closed. The user confirmed the complete contract on 2026-10-12 and requested [IMPLEMENTATION_PLAN.md](../IMPLEMENTATION_PLAN.md). That file is the current executable specification. The answers below supersede older proposals in `PLAN.md` and the original research. Decisions remain revisable through an explicit update.

## Confirmed by the user

| Topic | Decision |
| --- | --- |
| Engineering principles | Follow the adopted astro-portfolio KISS/YAGNI guidelines in `CODING_GUIDELINES.md`. Optimize for understandable, cohesive code and ongoing maintenance. |
| Game mode | Solo. Every run is timed. |
| Records | Separate top-runs lists for each difficulty. |
| Record storage/audience | Personal records on the current browser/device. No synchronization, accounts or worldwide leaderboard. |
| Primary devices | Phones first. Desktop reuses the phone layout, centered on the screen. |
| Release | A free public site that can be shared. |
| Starting a run | Press Start to reveal the puzzle and start timing. The blocker layout is hidden before Start. |
| Background time | Time continues when the tab is hidden, apps are switched or the phone is locked. |
| Solver assistance | No hints or solution button in V1. The reference solver remains useful for correctness tests. |
| Ranking eligibility | Freshly rolled completed games can rank. Deliberately replaying a known layout is always timed but is practice only. A coincidentally repeated fair roll is still a fresh roll. |
| Undo | Available during an active run. Time continues and the run remains eligible for records. |
| Phone input | Touch dragging plus a complete tap-to-place alternative. Drag support is required, not optional. |
| Tap commit | Select a piece, then tap a target cell to place immediately. No separate Place confirmation step. |
| Tray after placement | Keep the piece dimmed and selectable in its original tray slot. |
| Transform controls | Visible Rotate/Flip controls and desktop keyboard support. |
| Abandonment | New game and difficulty changes ask before discarding an unfinished run. The next puzzle remains hidden until Start. |
| Reload/close | Abandon the unfinished game. Retain completed local records. No in-progress persistence. |
| Completion | Freeze the completed run and save once. Offer a fresh game or a timed practice replay. No editing/undo after completion. |
| Retention | Keep the best five ranked runs per difficulty. |
| Record fields/UI | Time and completion date only. Entries do not inspect or replay layouts; do not persist unused layout data. |
| Language | English only. |
| Level access | Starter, Junior, Expert, Master and Wizard are all available immediately. No unlock progression. |
| Visual direction | Clean dark interface and flat, identifiable colored pieces. Original artwork; no official logos. |
| Public name | Rollmino. The naming discussion's Android reference does not itself authorize an Android app. |
| Platform | Responsive website only. No PWA, service worker, app installation or Android package in V1. |
| Hosting | GitHub Pages under the user's GitHub account. No custom domain initially. |
| Stack | Pure TypeScript rules, Vite, SVG, plain CSS and native HTML controls; Node tests and Playwright. |
| Package manager | pnpm is the user's default for web projects, confirmed on 2026-10-12. Pin it in `package.json`, maintain `pnpm-lock.yaml`, and use frozen-lockfile installation for verification and CI. |
| Return to tray | Visible Remove button, desktop Delete shortcut, and dragging back to that piece's own tray slot. Other out-of-board releases reject/restore. |
| Clear records | Clear only the selected difficulty's saved records, after confirmation. |
| Available phone | Android with Chrome. Model not required for the plan. |
| Release testing | Tests executable in this environment are sufficient. There is no manual real-phone release gate; do not claim unperformed device tests passed. |
| Repository | Public `stefan-karger/rollmino`, deployed through GitHub Pages. |
| Replay access/lifecycle | Available during active runs and after completion. Confirm active-run abandonment, clear pieces, enter hidden practice-ready state, and start its new timer only when Start is pressed. |
| Undo capacity | All successful actions within the current active run. No Redo. History ends when the run is abandoned or completed. |
| Input anchors | Tap uses a marked occupied cell; drag preserves the actual grabbed occupied cell. Illegal attempts restore committed state. |
| Transform direction | Rotate is 90 degrees clockwise; Flip mirrors left/right. |
| Level changes | Prepare a fresh hidden game; do not reuse the known layout as ranked play at another level. |
| Confirmation time | Abandonment and clear-record confirmations do not pause the timer. Clearing records does not reset active play. |
| Time/date display | Show `mm:ss.ss` and a local completion date; store whole milliseconds. |
| Ranking ties | Sort fastest first; keep the older completion first on an exact millisecond tie. |
| Final consistency review | The user accepted the combined contract and asked to derive `IMPLEMENTATION_PLAN.md`. |

## Scope changes from the initial proposal

- Timing and local records are required, not optional or excluded.
- Mobile controls drive the layout. The earlier desktop sidebar layout is not the target.
- The puzzle must stay hidden until Start. Automatically showing a roll on initial load would contradict that requirement.
- Replays have a distinct practice status. Removing solver help does not make every completion eligible for ranking.
- Local persistence now serves a confirmed requirement. A backend does not.
- Touch dragging is part of V1. The prior desktop-only drag proposal is superseded.
- Tap commits immediately. The prior preview-then-Place proposal is superseded.
- Undo covers the whole active run. The previous short history and post-win editing proposals are superseded.
- Automated checks executable here are sufficient. The earlier required physical-phone gate is superseded.

## Closure and implementation details

There are no remaining open product decisions. The final plan aligns the active scope, interaction and test documents. `PLAN.md` and the research remain historical evidence.

The plan fixes ordinary implementation details such as Starter on page load, row-major tap anchors, local wall-clock timing, a namespaced storage key, stable HTML grid controls and browser test configurations. These implement the agreed behavior; they are not additional interview answers or future feature commitments. Routine code/CSS choices should follow the plan and coding guidelines. Identify a concrete conflict before proposing a user-visible revision.
