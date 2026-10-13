# T29: onboarding and Home planning

The user requested an in-depth analysis, plan and questioning session on 2026-10-13. The request covers an optional first-launch tutorial, repeat access and the value of a home screen. This ticket records the audit, the user's answers and the resulting implementation tickets. It documents planning; it does not report a shipped feature or authorize deployment. Status lives in the [tracker](README.md).

[IMPLEMENTATION_PLAN.md](../../IMPLEMENTATION_PLAN.md#accepted-home-and-tutorial-revision) now records the accepted next revision as the single contract. The decisions below preserve the audit and user answers within these two requested areas. They do not reopen the rules, ordinary timing, ranking or input decisions.

## Acceptance for this planning work

- Inspect the current contract, relevant implementation, tests and completed blocker evidence.
- Identify concrete newcomer problems and assess the value and cost of a home screen.
- Resolve the main product choices with the user, including tutorial timing, navigation, first-visit behavior and exercise recovery.
- Specify a short visual walkthrough and a legal, finishable Starter exercise.
- Define compatibility boundaries, implementation slices and affected verification, without changing app behavior during planning.
- Record dated commands, inspection results and limits; run documentation consistency checks and `git diff --check`.

## Current behavior and concrete gaps

Inspection used [index.html](../../index.html), [app.ts](../../src/app.ts), [styles.css](../../src/styles.css), [session.ts](../../src/session.ts), [records.ts](../../src/records.ts), [the fixtures](../../fixtures/rolls.json), [the oracle](../../tests/oracle.mjs) and the relevant pure/browser tests. T27's [confirmation repair](../TEST-RESULTS.md#confirmation-race-repair) and T28's [marking evidence](../TEST-RESULTS.md#level-specific-square-markings) are completed prerequisites, not work to repeat.

| Observation | Newcomer implication |
| --- | --- |
| Starter says "Cover every empty cell with the nine pieces." Other levels replace that sentence with the contact rule. | The objective exists, but a newcomer choosing another level does not receive it in the same place. |
| The initial board is hidden; Start reveals blockers and begins a ranked timer together. | The player cannot try the controls before the clock starts. |
| The tray has nine named pieces and + marks. Selecting a piece adds "Anchor marked +" to preview feedback. | The UI does not demonstrate that the marked square lands on the tapped cell, or that the mark moves with transformations. |
| The full control hint follows Personal bests near the bottom of the page. | Useful instructions may be found only after scrolling past the game and records. |
| White outlines identify the current level's restricted pieces. The level selector lists five names without a comparison. | Players can see which pieces are marked, but do not get an overview of the level differences. |
| Replay repeats the layout as timed, unranked practice. | Replay does not provide the requested learning without time pressure. |
| There is a text heading and an original SVG favicon, with no visible logo on the page. | A home screen can introduce the identity, but branding alone would not explain play. |

Local collaborative-browser inspection at 390 by 844 CSS pixels measured the tray starting at y=650.45, the records section at y=1094.20 and the final control hint at y=1279.84. At 320 by 568, the tray started at y=592.45 and that hint at y=1208.81. No horizontal overflow was observed at these sizes. These are desktop-browser CSS layouts, not physical-phone results or evidence of how people learn.

The audit identifies missing teaching and instruction placement. It does not establish a completion-rate problem through user testing or analytics.

## Decisions made with the user

The user answered five rounds of concrete choices on 2026-10-13.

| Topic | Agreed behavior |
| --- | --- |
| Tutorial sequence | A short visual walkthrough to watch/read, followed by a short guided exercise. Afterward, learn through ordinary play. |
| Tutorial presentation | Self-paced illustrated panels with short text and optional Replay example buttons. |
| Tutorial timing | Learning is always free of time pressure. The walkthrough and exercise have no timer and cannot affect records. |
| Exercise level and ending | Starter only. Finish a mostly completed board with a few guided placements, including Rotate, Flip and Undo. |
| Prepared pieces | Six pieces are fixed for the exercise, with an explanation that they have been prepared for this lesson. The learner works with the remaining three. |
| Legal deviations | Accept a legal move, explain what the current step asks for and offer Reset step. Do not reject a move merely because it differs from the guide. |
| Launch | Show a separate Home screen on every visit, with Play, Tutorial and Personal bests. |
| Play | Open the hidden game board with level selection. Start reveals the puzzle and begins timing. |
| Tutorial access | Available only from Home. There is no Tutorial action anywhere in the game, including ready and completed states. |
| Records | Move the full lists and clearing controls to their own Personal bests screen. Keep the current run's result in the game. |
| First-visit offer | Highlight Tutorial once per browser. Stop highlighting after the user chooses Play or Tutorial. Keep Tutorial available on every visit. |
| Level explanation | Include a small note about the differences, without a harder-level exercise. |
| Browser Back | Navigate within the app. Returning Home from a running game confirms abandonment; Back from Home can leave the site. |

## Home value and screen flow

The initial alternatives were an offer inside the existing hidden-board area, a separate Home screen on every visit, or a welcome screen on the first visit only. The user chose Home on every visit.

Home now has a concrete purpose: it separates playing, learning and reviewing records. Moving records also shortens the game page. Its cost is an extra Play action before the existing Start action. The user explicitly chose that sequence so level selection and the timed reveal remain separate.

Proposed layout, using the existing original favicon mark as a starting point for the visible logo:

```text
Home                          Game ready

      [original mark]         Home
         Rollmino             Rollmino
                              Level [Starter]     00:00.00
  Fill the board around
  seven blockers.             [hidden board]
                                  Start
         Play
         Tutorial             [controls and piece tray]
         Personal bests

  New here? Tutorial shows
  the rules, then lets you
  try a short exercise.
```

The first-visit sentence or emphasis disappears after Play or Tutorial is chosen. The three menu actions keep their positions. Personal bests alone does not dismiss the offer.

| Transition | Required behavior |
| --- | --- |
| Load/reload | Display Home. Prepare fresh hidden Starter internally; restore no game, timer, lesson progress or level preference. |
| Home to Play | Display hidden fresh ready at the ordinary level selected in this page, initially Starter. Draw no RNG and start no clock. Focus Start. |
| Ready/completed game to Home | Clear the game/draft/history and return Home without abandonment confirmation. A subsequent Play prepares a fresh roll. |
| Running game to Home | Cancel any gesture and confirm abandonment. Cancel preserves committed play, eligibility and wall time. Restore initiating-button focus, or the prior game focus for browser Back. Confirm discards the run before Home is available. |
| Home to Tutorial | Start the walkthrough. No ordinary running game exists behind it. |
| Walkthrough to exercise | Load the fixed Starter lesson. No RNG, time or records. |
| Tutorial exit | Return Home at any point. Exiting the lesson does not alter records or the ordinary selected level. |
| Tutorial finish to Play | Prepare a fresh hidden ordinary game; Start remains necessary. Clear all lesson targets and placements. |
| Home to Personal bests | Show level-filtered top-five lists, dates, the browser-storage explanation and selected-level clearing. |
| Personal bests to Home | Return without preparing or starting a run. Record clearing never dismisses the tutorial offer. |

Use direct native buttons and hidden sections with browser History API navigation. No framework router, new route format or deep links are required. Browser Back moves within the app; returning to the root Home entry lets the next Back leave the site. Do not push duplicate Home entries that trap Back in a menu loop. Panel Back buttons move through the explanation.

Confirm an internal return Home before exposing Home or Tutorial while a run is active. Cancelling browser Back must reconcile the history position and restore the current game without another Start or a timer reset. Forward must never restore an abandoned run, placements or eligibility; a game entry can prepare fresh hidden ready. Reload still resets to Home/fresh Starter regardless of the current history entry. Actual navigation away from the site retains V1's no-unload-prompt behavior. These paths need executable navigation regressions.

The current app initializes its DOM, records and game synchronously after the module loads. It has no backend request or asynchronous puzzle generator to await. A home menu does not require a staged loading animation. Present actions when initialization is complete; add no artificial minimum logo duration. A failed initialization should leave a readable reload instruction, not an indefinite logo or enabled buttons without handlers.

A future native splash screen can be decided with that port. Android's documented splash screen dismisses when the app is ready, then shows the app; it is separate from the Home navigation planned here. [Android splash-screen documentation](https://developer.android.com/develop/ui/views/launch/splash-screen).

## Walkthrough content

Use original SVG diagrams made from the canonical shapes, blockers and marks. Keep each panel to one short explanation with an illustration. Next and Back are explicit; examples replay only when requested. Home is always reachable. Returning players can go straight to the exercise or review the explanation again.

| Panel | Teaching point and proposed copy |
| --- | --- |
| Goal | "Use all nine pieces to cover the empty cells around the seven blockers. Pieces cannot overlap or extend beyond the board." Show a before/after example, clearly labelled as an example. |
| Place and move | "Select a piece, then select a cell. The square marked + lands on that cell. You can also drag a piece by one of its squares." Demonstrate the tap method first and show selecting a placed piece to move it. |
| Rotate and Flip | "Rotate turns the piece clockwise. Flip mirrors it left to right. The + moves with the piece." Use the cyan L so the reflection is visible. Replay example demonstrates the actual geometric transforms. |
| Recover | "An invalid move leaves your board unchanged. Undo reverses your last successful move. Remove returns a selected piece to the tray." Show a rejected blocker overlap and the restored board. |
| Levels | Show the small comparison below and one edge/corner diagram. The exercise still uses Starter. |
| Ordinary play | "Start reveals a fresh puzzle and starts the clock. Undo and leaving the app do not stop it. Replay repeats a layout as timed practice and does not enter Personal bests." End with Try the exercise. |

The examples should explain that normal play permits moving every placed piece. In the exercise, six prepared pieces are fixed only to keep the short task focused. Do not present that restriction as a game rule.

The level panel should use actual shape artwork with text names, rather than rely on color or restore the removed piece numbers:

| Level | Pieces that cannot share an edge with one another |
| --- | --- |
| Starter | None |
| Junior | Navy square, Brown domino |
| Expert | Navy square, Brown domino, Orange line |
| Master | Brown domino, Orange line, Purple corner |
| Wizard | Navy square, Brown domino, Orange line, Purple corner |

"White outlines mark these pieces. Corners may touch. Marked pieces may touch blockers and unmarked pieces." Note that Master swaps the Navy square for the Purple corner compared with Expert. All levels are available; do not claim that each level is objectively harder than the previous one.

Budget the walkthrough for roughly a minute and the exercise for roughly one to two minutes as design targets. These are not measured completion times and should not become a countdown or a speed expectation in the UI.

## Concrete Starter exercise

The existing `opening-seed` regression layout supplies a checked example. Use its seven physical-die faces, interpreted at Starter: A1, B2, C3, F2, D6, E5, A6. Six canonical placements cover 19 squares. Leave Brown domino, Grey line and Cyan L in the tray, with ten empty cells remaining.

Ship only the intentional lesson data and guidance. Do not import the test fixture collection into the app, expose a test API or call the reference solver. Test the lesson with the independent oracle. The deliberate answer shown in a teaching exercise is a scoped exception to V1's deferred tutorials/no-assistance rule; ordinary games receive no assistance.

| Guided task | Concrete result |
| --- | --- |
| Place | Select Brown domino and tap B1. It covers B1 and C1. |
| Undo | Undo that successful placement. The prepared board remains; Brown domino returns to the tray. |
| Place again | Place Brown domino at B1 again. |
| Rotate | Select Grey line, Rotate once, then tap F3. It fills F3 through F6. |
| Flip and rotate | Select Cyan L, Flip once, Rotate twice, then tap E3. The transformed + is the bottom square; the piece fills E1, F1, E2 and E3. |
| Finish | Validate exact IDs, legality and full coverage, then show exercise completion with Play, Review tutorial and Redo exercise. |

The prepared six placements are the fixture's navy, yellow, purple, orange, red and green placements. Tutorial history begins after this prepared baseline. Undo cannot remove prepared pieces.

Accept equivalent transformation sequences and all existing non-drag inputs. Mandatory dragging would undermine both the current input contract and the purpose of teaching it. W3C distinguishes a single-pointer alternative from keyboard access, so the exercise must remain achievable through taps/clicks as well as a keyboard. [W3C dragging guidance](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html).

A legal off-step placement commits once but does not falsely advance the current instruction. Explain the task and provide Reset step. Reset restores that step's board/history checkpoint, clears draft/gesture and keeps the prepared pieces fixed. Invalid moves retain committed play/history. Redo exercise restores the initial six-piece baseline. A legal full-board solve ends successfully even if the learner completed steps out of order; offer review or redo rather than reject an actual solve to enforce button order.

Explain fixed pieces in the introduction and their accessible names. Use a distinct target highlight with a text coordinate; do not use the inset white restriction marks for lesson targets. Starter has no restricted-piece marks. Keep prepared-piece labels readable and the grid navigable even when a prepared piece cannot be selected for movement.

## Engineering and compatibility boundaries

The real state distinction is between screen navigation and a puzzle run. Keep simple page-local screen state for Home, game, tutorial and Personal bests. One visible controller owns committed placements at a time. No running game survives entry to Home or Tutorial.

Keep the lesson's steps, prepared placements, checkpoints and history in a cohesive tutorial module if that responsibility warrants a file. Reuse canonical legality/transforms and the existing board/tray/input behavior. Do not build a second rule engine or a generic lesson framework. Keep ordinary ranked/practice timing and record consideration separate from teaching state. The exact renderer extraction should follow the existing code's responsibilities, not a file-count target.

Preserve these behaviors while adding navigation:

- Fresh Start still samples six-face physical dice, reveals and starts timing together, and consumes no RNG on menu/tutorial navigation.
- Replay remains hidden, timed and unranked. A coincidental fresh roll matching the lesson remains an ordinary fair ranked roll.
- Successful ordinary actions retain full Undo; rejection/cancellation remains transactional. Completion remains terminal and considers ranked records once.
- Lesson targets, prepared placements and action history cannot leak into fresh ready, practice ready, normal play or records.
- Hidden screens cannot retain keyboard focus or expose active controls in the accessibility tree. Start and dialogs retain their current focus behavior; Home, Tutorial and Personal bests get deliberate entry/return focus.
- Timer ticks remain outside live announcements. Instruction changes and outcomes use the current single polite status approach without announcing every pointer movement.
- Personal bests keep the current key/schema, top-five ordering, dates, selected-level confirmation and page-memory recovery. The screen's level filter identifies exactly which list Clear records affects.
- Completion still shows frozen time and ranked/practice feedback beside the board. A save failure must remain visible there even though full record lists move elsewhere. Notices also appear on Personal bests.
- Retain English copy, the dark palette, native controls, original art, phone-first single-column layout, scrolling and no horizontal overflow at 320 CSS pixels.

First-visit highlighting needs one explicit persistence exception. Use a separate versioned key such as `rollmino.onboarding.v1` containing only whether the offer was handled. Set it after Play or Tutorial is chosen. Do not infer a first visit from empty records; clearing records must not reset the offer. No lesson progress, active game or level preference is persisted. This identifies a visit within one browser at the site's origin, not a person across devices. Cleared site data, private browsing or missing/invalid storage may make the offer reappear. Storage failure must not block play.

Visual direction follows the existing game: background `#12161d`, board/welcome background `#182230`, button background `#253346`, text `#e8edf3` and the existing cyan `#65c8df` as the brand mark's color. Retain system-ui type and the centered maximum width around 440 CSS pixels. Put the logo/name at the center of Home; left-align instructions beside or above their examples. Use the actual puzzle shapes as explanatory art. No new decorative font, motion sequence, official graphics or external media is needed.

## Implementation tickets

On 2026-10-13, the user requested that the plan become tickets. The [tracker](README.md) owns their blockers and status. The earlier three proposed slices are now six scoped tickets, each with its own acceptance and verification.

| Ticket | Scope |
| --- | --- |
| [T30](T30-home-and-navigation.md) | Home, original visible mark, hidden-ready Play and safe button/browser-history navigation. |
| [T31](T31-personal-bests-screen.md) | Dedicated records screen and completion/storage feedback. |
| [T32](T32-visual-tutorial.md) | Self-paced explanation, geometric examples and level comparison. |
| [T33](T33-starter-exercise.md) | Untimed Starter exercise, prepared baseline, real inputs, Undo and Reset step. |
| [T34](T34-first-visit-and-repeat.md) | Separate handled-offer flag and complete repeat review/exercise flow. |
| [T35](T35-integrated-verification.md) | Integrated coverage, contract consistency and dated local readiness evidence. |

Add menu actions only when their destinations work. No dead button, fake lesson or claim of completed onboarding should ship. The complete accepted flow is reviewed through T35; publication remains a separate release action through the existing gates.

## Verification for implementation

Follow the [existing policy](../../IMPLEMENTATION_PLAN.md#verification), using actual paths. App wiring selects pure tests, strict build, the full reduced development browser matrix and both artifact mounts. New tutorial modules/specs are currently unknown to [the conservative selector](../../scripts/verification-scope.mjs), so they select the full release sequence, including 62,208 independently checked answers. A later scoped selector revision would be its own explicit policy change; do not silently bypass this behavior.

Meaningful added coverage should establish:

- First launch, returning launch and blocked/corrupt flag storage; Play/Tutorial handling; records clearing does not reset the offer.
- Home has no running clock or disclosed normal puzzle; Play keeps the puzzle hidden and RNG untouched until Start; reload returns Home with fresh Starter internally and completed records intact.
- Running Home confirmation preserves committed game/time/focus on cancellation and discards it on confirmation, including browser Back. Back/Forward do not create menu loops, reopen abandoned runs or bypass confirmation. Back from root Home can leave the app. There is no route/control to Tutorial while any game screen is displayed.
- Self-paced panels, example replay, optional exit and repeated review/exercise entry work with native buttons and a keyboard.
- The fixed six-piece Starter baseline and three-piece finish pass legality and the independent oracle. Prepared pieces survive Undo and Reset; off-step legal moves commit; invalid actions do not.
- The intended tap and keyboard lesson demonstrate geometric Rotate/Flip anchors, Undo and terminal completion; representative native mouse and emulated touch still use existing input behavior.
- Tutorial completion/time passage never inserts records; starting ordinary play afterward has no lesson placement/history/target leakage and still draws exactly seven physical faces.
- Dedicated records filtering/clearing and completion-time storage notices preserve the existing schema, ranking, recovery and date behavior.
- Home, panels, exercise, records and relevant dialogs fit narrow/landscape layouts, expose appropriate focus/names and pass affected axe checks. Current native input regressions remain in the full matrix.
- Built production at `/` and `/rollmino/` can enter from Home, finish ordinary play and the lesson, preserve records through reload and load the original assets without test APIs or provenance content.

Build before production checks, reuse dist and run Playwright invocations sequentially. New startup navigation should update the existing representative game completions rather than duplicate every full fixture/platform combination. Releases retain all current gates and deploy their tested artifact.

For learning quality, a later observation with people unfamiliar with Rollmino should check whether they can explain the objective, place using +, distinguish Rotate from Flip, recover with Undo and understand the edge/corner rule before ordinary play. That observation is useful product evidence; it is not a new physical-device release gate or an assertion that such testing already happened.

## Planning evidence and limits

Executed in the Windows workspace on 2026-10-13 at commit `eab0101`, with an initially clean `git status --short`.

- Read README, the current contract, coding guidelines, tracker and completed T27/T28 evidence with `Get-Content`; used `rg` to locate initialization, instruction, timing, storage and relevant test paths.
- Ran `pnpm run dev` for read-only current-UI inspection. Vite reported ready and served port 5173. This was a development server, not a production build or deployment verification.
- Used the T3 collaborative browser's status/open/navigation/resize/snapshot/evaluate and input tools to inspect ready and running Starter, selected-piece anchor feedback, the existing New game abandonment confirmation and Wizard rule/marks. Inspected 390 by 844 and 320 by 568 CSS layouts. Some input calls reported an automation error; subsequent DOM inspection established the observed state. No browser suite pass is claimed from this inspection.
- Ran an inline `node --experimental-strip-types --input-type=module -` script using `newGame`, `canPlace`, `transformPiece`, `firstAnchor`, `isSolved` and `assertSolution`. It constructed the six-piece Starter baseline from `opening-seed`, checked the fixed placements with the oracle, applied Brown at B1, rotated Grey at F3 and flipped/rotated Cyan at E3, then checked the final answer. It reported `preparedPieces: 6`, `emptyCells: 10`, `finalEngineSolved: true` and `independentOraclePassed: true`. The proposed untimed controller, lesson Undo/reset and browser flow do not yet exist and were not tested by that script.
- Inspected the existing placement/Undo/time tests and the verification selector. No engine, fixture, app, dependency or CI files changed in this planning work. No runtime suites, production checks or exhaustive sweep were required for the documentation-only change.
- Consulted the primary W3C dragging guidance and Android splash-screen documentation linked above. Android behavior informs the distinction for a future port, not a current native feature requirement.

- `pnpm run check:docs` passed, checking seven Markdown files, 48 local links and documented scripts. `git diff --check` passed. `node scripts/verification-scope.mjs pull_request docs/tickets/README.md docs/tickets/T29-onboarding-and-home.md` selected documentation-only work: no pure/build/browser/artifact/exhaustive requirements.

## Ticket breakdown evidence

On 2026-10-13, the user requested converting the plan into tickets. Created T30 through T35 with scoped acceptance, prerequisites, affected verification and instructions to record actual implementation evidence. Added their blockers/status to the tracker and the accepted revision to the single contract. T29's earlier UI/geometry evidence remains planning evidence, not a pass for an unimplemented lesson. App, model, fixtures, dependencies and CI were not changed.

- `pnpm run check:docs` passed for the breakdown: 13 Markdown files, 128 local links and documented scripts.
- `git diff --check` passed. An inline `node --input-type=module -` document audit also checked all new/untracked tickets for trailing whitespace and duplicate status fields.
- The same inline audit validated seven tracker entries, six implementation todos, existing blocker targets, an acyclic dependency graph and T30 as the sole initial ready ticket. Shared-file overlap adds no blockers.
- `node scripts/verification-scope.mjs pull_request IMPLEMENTATION_PLAN.md docs/tickets/README.md docs/tickets/T29-onboarding-and-home.md docs/tickets/T30-home-and-navigation.md docs/tickets/T31-personal-bests-screen.md docs/tickets/T32-visual-tutorial.md docs/tickets/T33-starter-exercise.md docs/tickets/T34-first-visit-and-repeat.md docs/tickets/T35-integrated-verification.md` selected documentation-only work, without pure/build/browser/artifact/exhaustive requirements. No runtime suites or publication were performed for ticket creation.
