# Sources, fidelity and rights

[IMPLEMENTATION_PLAN.md](../IMPLEMENTATION_PLAN.md) defines the accepted model and bounded risk handling. Earlier feature proposals in research are historical.

## Puzzle sources

- [Official SmartGames product](https://www.smartgames.com/uk/one-player-games/genius-square)
- [Five-level multilingual rulebook](https://d32bxxnq6qs937.cloudfront.net/sites/default/files/GRL%20SGHP001%20Genius%20Square%2020230714.pdf)
- [Older edition comparison](https://manuals.plus/m/7bae49678d06d9344664adc4f299df047fb3d263d87fd8489a044bebef42675c.pdf)
- [First-hand dice report with corrected repeated sides](https://mangosgaming.uk/portfolio/review-genius-square/)
- [Independent solver/model](https://github.com/aCampello/genius-square)
- [Additional independent solver](https://github.com/mitchblank/gsqsolve)

Use the newer five-level model, not mixed historical coordinate/rule variants. The official diagram supports axes, shapes and restriction groups. It does not list all 42 physical die faces. The corrected first-hand face table matches the handoff; the independent model corroborates distinct coordinate sets. Source URLs may change. Preserve the explicit literal data and correct any verified discrepancy with tests/documentation.

The exhaustive checks establish a completion for every distinct physical blocker board under this encoded model. They do not independently certify a currently sold physical set. Comparing a physical set may improve evidence, but the user did not require it as a V1 release gate. Do not claim manufacturer certification.

## Implementation sources

- [Vite build](https://vite.dev/guide/build.html) and [CLI](https://vite.dev/guide/cli)
- [SVG coordinates](https://www.w3.org/TR/SVG2/coords.html)
- [Pointer Events](https://www.w3.org/TR/pointerevents3/)
- [Accessible grid pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)
- [WCAG dragging alternatives](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html)
- [Playwright touchscreen](https://playwright.dev/docs/api/class-touchscreen), [CDP sessions](https://playwright.dev/docs/api/class-cdpsession) and [clock](https://playwright.dev/docs/clock)
- [Chromium touch protocol](https://github.com/ChromeDevTools/devtools-protocol/blob/master/json/browser_protocol.json)
- [Elapsed timing and sleep](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now#ticking_during_sleep)
- [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [GitHub Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

## Release boundaries

Rollmino uses original flat SVG/CSS visuals. Do not copy product photos, packaging, manual graphics or official logos. These linked materials are source evidence, not app assets. Public naming is Rollmino without a trademark-clearance claim; the earlier naming shortlist was creative research, not legal clearance.

The app stores personal records locally and does not upload them. Browser policies, private sessions or cleared site data can remove them; no synchronization/backup is promised. System clock or storage editing can affect local results; no anti-cheat service is planned.

The user accepted tests executable here as the release gate. Automated mobile emulation does not establish real Android/iPhone or screen-reader results. Such checks may be performed later, but must not silently become mandatory or be reported as passed without evidence.
