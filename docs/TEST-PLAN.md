# Rollmino V1 test and acceptance plan

[IMPLEMENTATION_PLAN.md](../IMPLEMENTATION_PLAN.md), sections 10 through 13, defines the commands, fixtures, slice checks and release gates. Tests executable here are sufficient. Real-phone testing is optional; never claim unperformed checks.

## Executable now

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm run test:rules
pnpm run test:transforms
pnpm run test:state
pnpm run test:records
pnpm run verify:all
pnpm run typecheck
pnpm run build
pnpm run test:e2e
pnpm run test:e2e:prod
```

The fast pure suite has 59 tests covering T01's validation repairs, the literal model, T02's independent oracle, occupied-anchor transforms, run phases/timing/Undo and record ranking/storage faults. The separate exhaustive loop requires a non-null answer for each of 62,208 Wizard boards and checks every answer with the cell-array oracle. It reuses canonical orientation data but does not call the engine's legality checks or use their masks. [Current evidence](TEST-RESULTS.md#integrated-v1-local-release-verification)

The strict Vite build and all browser suites are executable. Browser binaries must be installed with `pnpm exec playwright install chromium firefox webkit`; Linux uses `--with-deps`. The five-project development suite passes 207 applicable cases covering startup, public fixture play, lifecycle/timing, tap/keyboard/mouse input, records and accessibility. Eight expected skips exclude two CDP touch cases from the four other projects. Ten production cases serve the same preceding dist at root and /rollmino/, inspect original-only assets, reject missing/error/service requests, and complete all three fixtures with replay/record retention. `pnpm run dev` and `pnpm run preview` serve source and artifact for inspection.

## Maintained coverage

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

Development projects are desktop Chromium/Firefox/WebKit and mobile Chromium/WebKit emulation. All five pass their applicable gameplay/input/records/accessibility suites. Native Chromium touch sequences use CDP because Playwright's touchscreen API only provides taps. Synthetic blur/visibility/pointercancel cleanup branches are labeled separately; native CDP touchCancel, second-finger input, capture and touch scrolling establish the emulated touch evidence. The test-only seeded RNG can reset before Start after tools such as axe consume randomness; no mutable production game API exists.

## Local release checks

The full release sequence passes on the integrated V1 application:

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm run build
pnpm run test:e2e
pnpm run test:e2e:prod
pnpm run verify:all
```

Build includes strict type checking. Production tests reuse that exact `dist/`; they do not rebuild. Keep exhaustive verification outside the fast default test and run it for release/rule changes. The Pages workflow publishes the checked artifact after successful checks.

Pass requires the agreed model, transaction/lifecycle/record behavior, complete non-drag play, native mouse and emulated touch checks, responsive/accessibility cases, and static artifact readiness. No physical-phone, physical-game or screen-reader sign-off is a hidden gate. Emulation does not claim those results, or prove low-end phone performance/human difficulty.

T12 validates the Pages workflow locally. T14 must record actual successful Actions/public hosting and a live smoke check; local release readiness does not establish that publication result.
