# Rollmino V1 test and acceptance plan

[IMPLEMENTATION_PLAN.md](../IMPLEMENTATION_PLAN.md), sections 10 through 13, defines the commands, fixtures, slice checks and release gates. Tests executable here are sufficient. Real-phone testing is optional; never claim unperformed checks.

## Executable now

```bash
npm ci
npm test
npm run test:rules
npm run verify:all
npm run typecheck
npm run build
npm run test:e2e
```

The fast pure suite has 44 tests covering T01's validation repairs, the literal model and T02's independent oracle. The separate exhaustive loop requires a non-null answer for each of 62,208 Wizard boards and checks every answer with the cell-array oracle. It reuses canonical orientation data but does not call the engine's legality checks or use their masks. [Current evidence](TEST-RESULTS.md)

T03 adds a strict Vite build and one browser startup case in all five configured projects. Browser binaries must be installed with `npx playwright install chromium firefox webkit`; Linux uses `--with-deps`. The startup case checks the title/heading, loaded TypeScript entry and CSS, page errors and failed requests. It does not test gameplay, dragging, records or accessibility. `npm run dev` and `npm run preview` serve the source entry and built artifact for inspection.

## Required coverage during implementation

| Area | Required evidence |
| --- | --- |
| Literal model | All 42 faces with duplicates, disjoint coordinate partition, exact shapes/IDs/groups, 29 cells, 28 orientations and 625 candidates |
| Rules | All special-piece pairs at all levels in both orders; diagonal/boundary/blocker/unrestricted contact; no edge wrapping |
| Failure contracts | Sparse/wrong dice, unknown level/IDs, mismatched keys, fractional coordinates/orientation, malformed maps, incomplete/overlapping false wins |
| Solver reference | Fixed pieces preserved, known legal dead end returns null, no input mutation, every exhaustive answer passes independent occupancy/contact checks |
| Geometry | Four rotations/two flips, cyan/red reflections, every occupied anchor, canonical normalization without index stepping |
| Session | Hidden Start, fresh/practice eligibility, confirmations, level changes, complete active Undo, no-op/rejection preservation, frozen completion |
| Timing | Controlled timestamps/Playwright clock, background/delayed callbacks/confirmations count, completion freezes once, clearing does not reset time |
| Records | Best five per level, raw milliseconds/ties, practice exclusion, single consideration, retention after reload, selected clear, corruption/storage exceptions |
| Browser input | Full fixtures through public tap/keyboard controls, native mouse drag/capture and Chromium CDP touch drag/cancel, own-slot return, secondary pointers |
| Accessibility/layout | Relevant axe checks, visible focus, named controls/grid, restrictions beyond color, modal focus, narrow/landscape/desktop, 200% zoom, reduced motion |
| Artifact | Built app at root and `/rollmino/`, no missing assets/page errors/runtime API, complete fixture and record retention |

Reuse `fixtures/rolls.json`. Seed physical random face indices before app startup; do not add a production cheat panel or inject placements into a mutable global. Wizard `opening-seed` with navy at B6 is a legal dead end. A fair second roll may repeat the first; changed-board tests use predetermined different rolls.

Development projects are desktop Chromium/Firefox/WebKit and mobile Chromium/WebKit emulation. All five currently pass startup checks. Future native Chromium touch sequences use CDP because Playwright's touchscreen API only provides taps. Cross-engine tap/keyboard/mouse checks and touch-specific cases require explicit coverage; synthetic events alone do not establish touch dragging.

## Remaining release checks

The full release sequence below includes `test:e2e:prod`, which becomes executable in T11. Other commands are available now with the current limited feature coverage:

```bash
npm ci
npm test
npm run build
npm run test:e2e
npm run test:e2e:prod
npm run verify:all
```

Build includes strict type checking. Production tests reuse that exact `dist/`; they do not rebuild. Keep exhaustive verification outside the fast default test and run it for release/rule changes. The Pages workflow publishes the checked artifact after successful checks.

Pass requires the agreed model, transaction/lifecycle/record behavior, complete non-drag play, native mouse and emulated touch checks, responsive/accessibility cases, and static artifact readiness. No physical-phone, physical-game or screen-reader sign-off is a hidden gate. Emulation does not claim those results, or prove low-end phone performance/human difficulty.
