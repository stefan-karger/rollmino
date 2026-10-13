# T32: self-paced visual tutorial

Created on 2026-10-13 from the user's accepted onboarding plan. The [tracker](README.md) owns blockers and status. Read [the accepted revision](../../IMPLEMENTATION_PLAN.md#accepted-home-and-tutorial-revision), [T29's walkthrough content](T29-onboarding-and-home.md#walkthrough-content), T30's navigation evidence and the completed [T28 marking evidence](../TEST-RESULTS.md#level-specific-square-markings) before implementation.

## Problem and scope

New players have no demonstration of the objective, tap anchor or controls. Add short illustrated panels with self-paced Next/Back and optional Replay example actions, reached by Tutorial on Home. This ticket implements the explanation; T33 supplies the guided exercise and T34 supplies first-visit highlighting and complete repeat access.

Use original SVG diagrams from canonical shapes, blockers and marks. Keep text brief and English. No prerecorded video, required audio, autoplay, external media, generic tour dependency or solver is required.

Relevant code is [the canonical core](../../engine/core.ts), [app.ts](../../src/app.ts), [styles.css](../../src/styles.css), [index.html](../../index.html) and [accessibility coverage](../../e2e/accessibility.spec.ts). Preserve the current contact and transform regressions.

## Acceptance

- Home has a working Tutorial action. No Tutorial action or history bypass exists on any ready, running or completed game screen. There is no running game behind the lesson.
- Panels are self-paced, with native Next/Back, clear progress and exit to Home at every point. Optional Replay example starts only on request and never invokes normal-game Replay.
- Explain filling all empty cells with all nine pieces around seven blockers, with no overlap or out-of-bounds placement. Label demonstration layouts as examples.
- Demonstrate selection and immediate tap placement, showing that + lands on the selected cell. Explain moving placed pieces and dragging by an occupied square, while teaching the tap method first.
- Demonstrate Rotate clockwise and Flip left/right using geometric transforms of cells and occupied anchor. Use a visibly asymmetric shape such as Cyan L, and show + moving with it. Do not step orientation indices or invent a different tutorial transform.
- Explain transactional invalid attempts, Undo of successful actions and Remove. Show a rejected blocker overlap retaining committed play. Clarify that normal placed pieces remain movable; the later exercise's prepared pieces are fixed only for teaching.
- Include a compact comparison with the exact five contact groups. Starter marks none; Master marks brown/orange/purple and leaves navy unmarked. Explain legal corners and contact with blockers/unrestricted pieces. Use shape artwork and text names, not color alone or the removed numbers.
- Explain ordinary Start/reveal/timing, continuing time through Undo/background, and timed unranked Replay. The explanation itself has no timer, RNG draw or record consideration.
- Panel/example state cannot alter normal placements, selected level, history or records. Exit and subsequent Play prepare ordinary hidden ready according to T30.
- Preserve visible focus and native keyboard operation; use readable text for visual information. Respect reduced motion with an equivalent static explanation. Hidden panels have no focusable controls; instruction/example feedback is deliberate and timer ticks remain outside live announcements.
- Panels and examples fit 320 CSS pixels and short/landscape screens without horizontal overflow. Scope teaching content to the short introduction; do not add strategy hints to normal games.
- Add Try the exercise when T33 provides its working destination; no dead exercise button is acceptable in an intermediate review.

## Verification

Use the [single verification policy](../../IMPLEMENTATION_PLAN.md#verification) with actual paths. App wiring requires frozen install, `pnpm test`, `pnpm run build`, full `pnpm run test:e2e` and `pnpm run test:e2e:prod`, documentation checks and `git diff --check`. New tutorial modules/specs are unknown paths and require `pnpm run verify:all` under the current selector. Keep canonical model/fixtures unchanged unless a separate verified discrepancy requires correction.

Verify panel navigation, Home-only access, requested example replay, exact literal level groups, geometric anchors, keyboard/focus, reduced motion and affected axe/layout states. Inspect the actual rendered diagrams through the collaborative browser. Retain production requests/assets restrictions and both artifact mounts. Build first; run Playwright invocations sequentially.

Update documentation for the implemented walkthrough without claiming that T33's exercise already exists. Record dated commands/results, rendered observations and limits before checking acceptance and changing tracker status. Learner observation and physical-device/screen-reader testing cannot be claimed without execution.
