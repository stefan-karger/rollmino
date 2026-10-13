# T19. Repair weak and brittle test assertions

[Tracker and priority](README.md) | Blockers: none

The review found checks that prove incidental output or arithmetic, and test names that promise more than their assertions establish.

Files: tests/transforms.test.mjs, e2e/accessibility.spec.ts, e2e/input.spec.ts, e2e/production.spec.ts and existing helpers if needed.

## Work and checks

1. Remove the transform assertion that subtracts an anchor and adds it back. Keep geometric closure, literal direction, reflection, occupied-anchor and symmetry checks.
2. Measure SVG/HTML alignment under CSS zoom using the existing offset approach. Preserve overflow/reachability checks and describe CSS reflow honestly.
3. Remove the body-only reduced-motion assertion while no motion exists, or test a real animated descendant if present. Keep focus and non-color identity checks.
4. Use an in-bounds footprint for any browser overlap claim; green at E6 also leaves the board. A pure collision matrix need not be copied into every browser.
5. Replace exact four-file/one-JS/one-CSS/three-resource counts with required assets/MIME, forbidden provenance/test content and static-service boundaries. Legitimate original assets/chunks must not fail solely by count.

Run pnpm test, pnpm run build, focused input/accessibility cases and pnpm run test:e2e:prod. Where practical, use a temporary controlled fault to prove a repaired assertion detects its claimed failure; restore the fault.

## Acceptance

- [x] Assertions test production behavior and their names match their evidence.
- [x] Artifact checks allow legitimate packaging changes while rejecting missing assets/leaks.
- [x] Geometry, collision, focus and non-color coverage remain meaningful.
- [x] Evidence explains removed assertions and verification of replacements.

## Completion evidence

2026-10-13, same Windows/Node/pnpm/browser setup as T16. Removed the subtract/add anchor tautology while retaining closure, literal direction/reflection, occupied-anchor, symmetry and immutability checks. Removed the body-only animation assertion and renamed the test to describe visible focus/non-color usability with reduced motion requested; there is no animated descendant to verify.

Layout and CSS zoom now measure centers of actual rendered SVG rectangles against HTML cells at all four corners and a center cell. An initial CTM-based version exposed a Firefox measurement discrepancy under CSS zoom: it reported 31.32px offset although the rendered SVG/HTML centers agreed within 0.02px. The shared helper therefore uses rendered bounds for visual alignment. This tests CSS reflow/visual alignment and tap play, not browser-chrome zoom or zoomed native dragging. A temporary 3px grid translation produced a 5.995px zoomed offset and the expected failure; restoring the CSS passed.

The drag-overlap rejection now moves navy to B5 and attempts green at A4. That 2x2 footprint is in bounds and blocker-free, so only piece collision causes rejection. Undo demonstrates that rejection added no history. Artifact checks require the entry/favicon and compiled JS/CSS without exact counts; they retain asset MIME/content/error/static-service checks and reject provenance/test paths or text. Adding an original SVG and second JS chunk passed both mounts. Injecting `resetTestRandom` into a temporary artifact file failed both mounts; all temporary files were removed and the untouched artifact passed.

`pnpm test` passed 60 tests; `pnpm run build` passed strict checking/build. Forty focused input/layout/zoom/focus cases passed across all five projects in 2.5 minutes. The ten production cases passed in 28.1 seconds. `pnpm run check:docs` and `git diff --check` passed. Only test assertions/helpers changed; runtime, oracle, solver and fixtures are unchanged, so the full runtime/exhaustive sequence was not repeated.
