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

- [ ] Assertions test production behavior and their names match their evidence.
- [ ] Artifact checks allow legitimate packaging changes while rejecting missing assets/leaks.
- [ ] Geometry, collision, focus and non-color coverage remain meaningful.
- [ ] Evidence explains removed assertions and verification of replacements.

## Completion evidence

Add dated implementation and verification results before marking the tracker done.
