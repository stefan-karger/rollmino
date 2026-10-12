# T10. Finish phone layout, accessibility and browser compatibility

[Tracker](README.md) | [Product specification](../../IMPLEMENTATION_PLAN.md) | [Coding guidelines](../../CODING_GUIDELINES.md)

## Blockers

- [T08](08-records-ui-integration.md)
- [T09](09-transactional-pointer-input.md)

Plan coverage: section 7 and browser/accessibility cases in section 12; Slice 4.

## Outcome

The complete control set is reachable, named and predictable across the agreed browser/emulation matrix and responsive sizes.

## Scope and files

Refine `src/styles.css`, semantic/focus wiring in `src/app.ts` and `index.html`. Add a small original `public/favicon.svg`. Add `e2e/accessibility.spec.ts` and fill cross-browser gaps in existing suites. Do not introduce a desktop sidebar, design system or new runtime dependency.

## Implementation steps

1. Finish the clean dark, flat-colored phone layout. Use a system font and one centered column about 440 CSS px maximum on desktop. Keep title/level/time, labeled board, controls and persistent tray adjacent; secondary controls/records follow.
2. Make every required action reachable at 320/390/768/1440 CSS px widths and a short landscape viewport. Allow vertical scrolling, avoid horizontal page overflow and aim for at least 44 CSS px ordinary button targets. No forced orientation/fullscreen mode.
3. Ensure SVG/HTML hit targets stay aligned through resize and zoom. Add or finish non-color identity, restriction numbers/text, valid/invalid marks and readable dimmed/disabled labels.
4. Verify the grid's six rows/36 names/one roving Tab stop, visible focus and full keyboard actions. Reject shortcuts from selects/dialogs/unrelated controls. Timer/render updates must not recreate focused controls or capture nodes.
5. Check native confirmation names, trapped dialog focus and return focus: Cancel to initiator, confirmed run transition to Start, confirmed clear to Clear records. Completion announces once without a modal/focus jump.
6. Keep one polite atomic status for meaningful actions. Do not announce timer ticks or pointer movement. Respect reduced motion and review contrast in the actual rendered states.
7. Run relevant axe scans for ready/running/completed/dialog states, keyboard-only fixture tests, and the complete five-project development suite. Fix browser differences using current code rather than adding abstractions speculatively.
8. Add only original favicon geometry. Keep official artwork, external fonts and image packages out.

## Verification

```bash
pnpm test
pnpm run build
pnpm run test:e2e
```

Inspect the named viewport sizes, landscape, reduced motion and 200% zoom/reflow using available browser tools. Record the actual method if a zoom check uses a reflow simulation. Inspect board corners/center for visual/hit-target alignment. Complete a keyboard-only game and mobile-emulated tap game; verify scrolling outside drag sources.

All five development projects must pass their applicable suites. Chromium CDP-specific tests run only in Chromium by design; their skips elsewhere are not absent cross-engine tap/mouse coverage. Do not silently skip general failures.

## Done when

- [ ] Full controls/records remain reachable at the tested sizes without horizontal page overflow.
- [ ] Keyboard, grid semantics, dialog focus and meaningful action feedback pass.
- [ ] Relevant app-specific axe findings are resolved or a specific justified exclusion is recorded.
- [ ] The full desktop Chromium/Firefox/WebKit and mobile Chromium/WebKit matrix passes applicable checks.
- [ ] Original assets/reduced-motion/contrast checks are recorded without claiming physical-phone or screen-reader results.

## Completion evidence

Not yet recorded. Add the actual changes, command results, checks and code reference here before setting this ticket to `done` in the tracker. Follow the [completion rules](README.md#working-and-completing-tickets).
