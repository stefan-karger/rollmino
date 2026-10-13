# Genius Square source research (historical)

Status: historical source research, not the current contract. [IMPLEMENTATION_PLAN.md](../IMPLEMENTATION_PLAN.md) preserves the accepted decisions and supersedes the proposals below. Timing, records, full active Undo, immediate tap placement and touch dragging are required; hints and physical-device sign-off are not. The original verbatim research remains in `original-handoff/genius-square-greenfield-research.md` until T26's archival cleanup.

**Research date:** 2026-10-12  
**Target:** the SmartGames 2022–2023 five-level Genius Square edition, including the physical seven-die setup.  
**Principle:** greenfield engineering; no stack selected due to prior user preferences. Optimize for fidelity, approachable interaction, code simplicity, maintenance, and performance.

## 1. Decision in one paragraph

Build a **static, client-only web application using Vite + vanilla TypeScript + SVG + CSS**, with no application framework, renderer, game engine, backend, database or server-side state. Keep game rules, piece orientation generation, collision/adjacency validation, and a one-solution backtracking solver in a DOM-independent TypeScript module. A small controller translates pointer and keyboard interactions into placement operations and updates the SVG. If later UI requirements truly justify a framework, Svelte is a reasonable next step; do not build an abstraction layer to prepare for that hypothetical migration.

The reference engine included separately has been type-checked with strict TypeScript, exercised with example puzzles, and used to confirm solvability across all 62,208 unique dice configurations at Wizard level. This is a **puzzle core**, not a completed graphical game.

## 2. Rules and product variants

### Component inventory

- 2 physical boards, **6×6** (36 squares each).
- Per player: **9 colored puzzle pieces** covering **29 cells** in total; **7 round blockers**.
- 7 six-sided dice shared by both players; each face indicates one board coordinate.
- SmartGames edition has **5 difficulty levels**: Starter, Junior, Expert, Master, Wizard.
- Board axes in the inspected SmartGames 2023 manual: **A–F across the top (columns); 1–6 down the left (rows)**. Some older Happy Puzzle edition imagery displays the axes transposed. Our software uses the 2023 SmartGames convention and stores zero-based `(x, y)` internally.

### Basic round

1. Roll the seven dice *once*.
2. Place a blocker on the displayed coordinate from each die. Both players use the **same** roll.
3. Place, rotate and optionally flip the nine pieces to cover every non-blocked cell.
4. Win only when all nine pieces are placed legally, there are no overlaps, and the 36 board cells are completely accounted for.
5. Solo: solve against a clock. Competitive match: start both players on Starter; a round winner advances to the next level while the opponent remains at their current level; re-roll all dice; first to complete Wizard wins the overall match.

### Difficulty-level restrictions

The marked special pieces are **1: navy monomino**, **2: brown domino**, **3: orange three-cell line**, and **4: purple L tromino**. "Cannot touch" means **no orthogonally adjacent squares between any *two different* members of the restricted subset**. Touching corners diagonally is allowed. The restriction does NOT prohibit touching the board edge, blockers, or unrestricted pieces.

| Level | Restricted piece IDs | Forbidden adjacency pairs |
|---|---|---|
| Starter | none | none |
| Junior | 1, 2 | 1–2 |
| Expert | 1, 2, 3 | 1–2, 1–3, 2–3 |
| Master | 2, 3, 4 | 2–3, 2–4, 3–4 |
| Wizard | 1, 2, 3, 4 | every pair among 1–4 |

**Critical:** Master is not merely “Expert plus the fourth piece.” It removes piece 1 and adds piece 4. However, every level restricts a subset of the four Wizard pieces; thus a Wizard solution works at every easier level (under the same dice roll).

## 3. All 42 physical die faces

**Repeated entries are intentional. Do not deduplicate before rolling.** The order of individual faces is immaterial to a fair six-sided random choice, but each coordinate must appear with its physical multiplicity.

| Die | Side 1 | Side 2 | Side 3 | Side 4 | Side 5 | Side 6 | Unique options |
|---:|---|---|---|---|---|---|---:|
| 1 | A1 | C1 | D1 | D2 | E2 | F3 | 6 |
| 2 | A2 | B2 | C2 | A3 | B1 | B3 | 6 |
| 3 | C3 | D3 | E3 | B4 | C4 | D4 | 6 |
| 4 | E1 | F2 | F2 | B6 | A5 | A5 | 4 |
| 5 | A4 | B5 | C6 | C5 | D6 | F6 | 6 |
| 6 | E4 | F4 | E5 | F5 | D5 | E6 | 6 |
| 7 | F1 | F1 | F1 | A6 | A6 | A6 | 2 |

Cross-checked between the ManGo's Gaming write-up (2019), a r/boardgames thread (2021) and the aCampello solver, which lists the distinct options but omits repeats.

### Dice mathematics

- Physical equally likely face combinations: `6^7 = 279,936`.
- Distinct blocker boards: `6 × 6 × 6 × 4 × 6 × 6 × 2 = 62,208`.
- The 36 unique coordinate labels are distributed **exactly once** across the seven dice's unique coordinate sets. Consequently, every physical roll yields **seven different blocker cells**; there is no overlap or replacement logic to implement.
- Die 4: `P(E1)=1/6`, `P(B6)=1/6`, `P(F2)=2/6`, `P(A5)=2/6`.
- Die 7: `P(F1)=P(A6)=3/6=1/2`.
- The other five dice have six equally likely unique coordinates.
- Consequently, the 62,208 distinct boards are **not equiprobable** under physical rolls: outcomes with die 4 at F2 or A5 occur twice as often as those with E1 or B6, all else equal. Choosing uniformly among unique outcomes would change game probabilities.
- There are `C(36,7)=8,347,680` arbitrary sets of 7 board coordinates. The 62,208 physical outcomes are only around **0.745%** of those sets. Arbitrarily sampling seven unique cells is *not* a faithful alternative.

### Exact dice data

```ts
const DICE = [
  ['A1', 'C1', 'D1', 'D2', 'E2', 'F3'],
  ['A2', 'B2', 'C2', 'A3', 'B1', 'B3'],
  ['C3', 'D3', 'E3', 'B4', 'C4', 'D4'],
  ['E1', 'F2', 'F2', 'B6', 'A5', 'A5'],
  ['A4', 'B5', 'C6', 'C5', 'D6', 'F6'],
  ['E4', 'F4', 'E5', 'F5', 'D5', 'E6'],
  ['F1', 'F1', 'F1', 'A6', 'A6', 'A6'],
] as const;

function roll(): string[] {
  return DICE.map(faces => faces[Math.floor(Math.random() * 6)]);
}
```

No dice-physics simulation is needed. An optional 200–400 ms visual rolling animation can show the already-sampled results.

## 4. The nine pieces and all 28 orientations

A `■` is an occupied cell, `·` an empty cell. A `/` represents a *new row*, always read left-to-right and top-to-bottom. Shapes are normalized to upper-left `(0,0)`.

| Piece | Physical color | Units | Unique orientations | All distinct orientations |
|---|---|---:|---:|---|
| 1 | navy, monomino | 1 | 1 | `■` |
| 2 | brown, domino | 2 | 2 | `■■`; `■/■` |
| 3 | orange, I tromino | 3 | 2 | `■■■`; `■/■/■` |
| 4 | purple, L tromino | 3 | 4 | `■·/■■`; `■■/■·`; `■■/·■`; `·■/■■` |
| — | grey, I tetromino | 4 | 2 | `■■■■`; `■/■/■/■` |
| — | green, O tetromino | 4 | 1 | `■■/■■` |
| — | cyan, L tetromino | 4 | 8 | `■·/■·/■■`; `■■■/■··`; `■■/·■/·■`; `··■/■■■`; `·■/·■/■■`; `■··/■■■`; `■■/■·/■·`; `■■■/··■` |
| — | yellow, T tetromino | 4 | 4 | `·■·/■■■`; `■·/■■/■·`; `■■■/·■·`; `·■/■■/·■` |
| — | red, S/Z tetromino | 4 | 4 | `·■■/■■·`; `■·/■■/·■`; `■■·/·■■`; `·■/■■/■·` |
| **Total** | | **29** | **28** | |

### Canonical shapes as local cell coordinates

```ts
const SHAPES = {
  navy: [[0,0]],
  brown: [[0,0],[1,0]],
  orange: [[0,0],[1,0],[2,0]],
  purple: [[0,0],[0,1],[1,1]],
  grey: [[0,0],[1,0],[2,0],[3,0]],
  green: [[0,0],[1,0],[0,1],[1,1]],
  cyan: [[0,0],[0,1],[0,2],[1,2]],
  yellow: [[1,0],[0,1],[1,1],[2,1]],
  red: [[0,1],[1,1],[1,0],[2,0]],
};
```

The L-tetromino is the important **chiral** piece: its flipped shapes cannot be obtained through rotation alone (8 variants). The red S/Z piece also needs flipping (4 variants total, two of each handedness). Other pieces have fewer transformations due to symmetry.

To generate rather than hardcode orientations: for each piece, consider unflipped and reflected coordinates, apply 0/90/180/270 degree rotations, shift all coordinates by negative minimum x/y, sort cells deterministically, and deduplicate by serialized cell list. Deduplication produces all 28 distinct shapes from just 9 source arrays. Expose a list of valid variants; don't have to force a duplicate orientation on every keypress.

**UI nuance:** A "Rotate" button means geometrical rotation, not just "next entry in the deduplicated list" if users need predictability. Implement rotation by transforming the currently displayed shape and normalizing, then finding the matching canonical variant. Flip likewise. A physical mirror operation on a 2-cell line or square will return the same variant, which is correct. Support `R` to rotate, `F` to flip, and visible mobile controls. Beware that orientation *index* is merely an internal stable identifier, not an intuitive angular state.

## 5. Geometry and legality model

Represent the board in ordinary integer coordinates (`x=0..5` means A..F; `y=0..5` means rows 1..6). A placed shape's world coordinates are `(placement.x + localX, placement.y + localY)`.

```ts
type PieceId = keyof typeof SHAPES;
type Level = 'STARTER'|'JUNIOR'|'EXPERT'|'MASTER'|'WIZARD';
type Placement = { id: PieceId; orientation: number; x: number; y: number };
type Game = {
  dice: readonly string[]; // physical-die order
  level: Level;
  placed: Partial<Record<PieceId, Placement>>;
};
```

**Rules for a proposed placement:**

1. Shape and orientation are valid for that piece.
2. Every cell lies inside `0..5 × 0..5`.
3. No cell overlaps a blocker.
4. No cell overlaps any **other** placed piece. When moving an existing piece, ignore its old footprint.
5. For a special piece in the current level, none of its cells can be orthogonally adjacent to any cell of another special piece in that level. Diagonal touching remains legal.
6. The final board has all nine named pieces placed legally, covering 29 cells; blockers account for the remaining 7 cells.

An `isSolved` function can validate all placed pieces anew rather than relying on incremental UI state.

### Solver

Use **backtracking with the most-constrained-empty-cell heuristic**:

1. Generate all 625 in-bounds placements across the 28 unique orientation variants.
2. Represent each placement's 36-cell footprint as one `bigint` bit mask (`1n << BigInt(y * 6 + x)`). A JavaScript bitwise `number` mask is not enough: bitwise operators coerce to 32 bits.
3. Precompute each candidate's orthogonal neighbor mask.
4. Start with the blockers marked occupied. Add the player's existing placed pieces if finding a hint or checking feasibility.
5. Choose the empty cell with the fewest currently legal candidate placements (MRV heuristic).
6. Try a candidate if its piece has not yet been used, it does not overlap occupied cells, and no forbidden special adjacency occurs.
7. Recurse; backtrack on failure. Return the first full solution, or `null` if the player's current partial layout is a dead end.

No ILP package, SAT solver, DLX library, database, worker, server or WebAssembly is warranted for finding **one** solution. A web worker would only be justified by measurement on target devices or a future heavy statistics feature.

### Independent verification

The included dependency-free TypeScript reference implementation and `verify.mjs` script establish:

- Exactly 9 shapes, covering exactly 29 cells.
- Exactly 28 distinct orientations.
- Exactly 36 unique coordinates across the physical dice's distinct faces, and 6 physical sides per die.
- Exactly 62,208 distinct dice combinations.
- A complete, legal Wizard solution for **each of the 62,208** combinations.
- Because every other difficulty restricts a subset of Wizard's four marked pieces, Wizard solvability implies Starter/Junior/Expert/Master solvability for the same blockers.

The exhaustive check completed in **22.49 seconds** with Node 22 on the analysis machine (~0.36 ms per board average). These are *reference-environment measurements*, not promises for low-end phones. Separate research from aCampello reports that the **Starter** solution count per board ranges from 11 to 22,317, with median 1,340. Solution count is not an exact human difficulty score, especially because strategy and structure matter.

## 6. Renderer and framework decision (greenfield)

### Rendering alternatives

| Rendering | Strength | Cost / weakness | Verdict |
|---|---|---|---|
| **SVG** | Native scalable 2D geometry; event targets per piece; crisp cells and labels; DOM/CSS styling; simple coordinate mapping | Requires a little SVG DOM event glue | **Best** |
| HTML/CSS grid | Very simple static grid/cell rendering | Multi-cell connected piece dragging and preview can be cumbersome | Usable but inferior to SVG for this interaction |
| Canvas 2D | Good graphics control, small native API | Must implement drawing, hit testing, DPI, accessibility and redraw handling | Unnecessary extra work |
| PixiJS | Mature GPU 2D interaction/rendering | Renderer, scene graph and event abstraction for 36 cells; DOM UI still needed | Overkill |
| Phaser | Engine-level input, scenes and game object support | Game-loop and framework concepts not needed in a discrete puzzle | Overkill |
| Three.js orthographic | Flexible effects and rendering | Largest conceptual mismatch; 3D scene used to fake a simple 2D grid | Reject |

### UI/application alternatives

| Framework | Strength | Tradeoff | When to use |
|---|---|---|---|
| **Vanilla TS** | Zero UI runtime dependencies; transparent event flow; few moving parts | Manually update DOM nodes affected by state changes | **Best for the proposed one-screen app** |
| Svelte 5 | Terse reactive templates, very little runtime ceremony | Framework/build dependency not essential for limited UI | If settings/screens/modals multiply |
| Preact | Small JSX component model | Hooks/reconciliation are optional complexity | If team strongly prefers JSX |
| React | Large ecosystem | More dependency/tooling overhead for this task | When embedding into an existing React app, not greenfield |
| SolidJS/Vue | Good fine-grained or declarative UIs | No task-specific advantage decisive enough to add a framework | No reason to privilege |

**Recommendation:** Vite + vanilla TypeScript + SVG + CSS. No React/Preact/Svelte/Solid/Vue. Use Vite for TypeScript dev server, production build and pleasant local development; Vitest is optional for the rule tests if native Node tests are sufficient. Avoid premature component systems or state libraries.

**Single UI state:** a `Game` plus a tiny transient interaction object (`selectedPiece`, `draggedPiece`, `grabbedLocalCell`, `ghostX/Y`, `startedAt`, etc.). Do not store all 36 occupied squares independently; derive them from blockers and placed shapes. Don't introduce a reducer, event bus, store, or class hierarchy without a demonstrated need.

## 7. User interface and accessibility

### Desktop layout

- Left/main: responsive square **6×6 board**, coordinate labels, blocker circles, placed color shapes.
- Right: tray with nine draggable shapes; current level, timer, roll/new game, rotate, flip, undo, hint, reset. A shape in the tray disappears or is marked used after placement.
- Use restrained shadows, visible grid lines, highly contrasted blocker marks and the same colors/identifiers as the physical edition, but avoid importing trademarked packaging images.

### Mobile layout

- Board first and sufficiently large; piece tray in **two compact rows beneath the board**.
- Selected-piece toolbar with prominent Rotate / Flip / Remove actions near the board, not hidden behind right-click or keyboard shortcuts.
- Board scales via SVG `viewBox`; pointer coordinates are converted using `getScreenCTM().inverse()` rather than CSS pixel assumptions.
- Avoid preventing page scroll globally. Limit `touch-action: none` to the actual draggable board/tray elements as necessary; allow normal scrolling elsewhere.

### Input interactions

**Pointer:** on `pointerdown` over a piece, remember which *unit cell* was grabbed, capture the pointer, and draw a translucent ghost. On `pointermove`, translate pointer coordinates to the logical board and snap the ghost to integer grid units while retaining the grabbed-cell anchor. Highlight green if valid, amber/red if invalid. On `pointerup`, commit the piece only when legal. Otherwise restore the original placement or return it to the tray. Also handle `pointercancel` and `lostpointercapture`.

**Single-pointer non-drag alternative:** tap to select a piece, rotate/flip by buttons, tap an available board cell to place it. The selected cell or initial anchor must be understandable. Dragging-only controls would be an avoidable accessibility failure (WCAG 2.2 2.5.7).

**Keyboard:** Tab between tray pieces/buttons, Enter/Space select, arrow keys move ghost, R rotate, F flip, Enter/Space confirm, Escape cancel, Delete return piece to tray. Maintain visible focus and an announced status message for invalid placement and solved state. Avoid relying exclusively on color to communicate errors or special-piece groups.

**Animations:** optional CSS transitions (valid snap, solved highlight, dice settle). Do not animate every frame via a game loop; during active dragging, update only the SVG ghost transform. Respect `prefers-reduced-motion`.

### Subtle usability decisions

- Moving an already placed piece is a transaction; it does not collide with itself.
- Only a valid final drop modifies the committed board state.
- Position and orientation must remain stable after browser resize.
- Undo is cheap via a small history stack of placements; no generalized command-pattern framework.
- A hint should find a solution consistent with the current layout; if current moves create a dead end, tell the user and optionally offer to remove a conflicting piece rather than silently replacing the entire board.
- Show the four marked pieces with subtle IDs/symbols in difficult modes: the physical game uses white square markers.
- Timer can use `performance.now()` with a low-frequency display refresh; don't persist timer ticks as game state.

## 8. Scope, roadmap, and acceptance criteria

### Phase A — Mathematical core (first)

- Exact dice arrays with duplicates, exact piece shapes, 28 unique variants, difficulty restrictions.
- `rollDice`, `canPlace`, `isSolved`, `solve` functions with no UI imports.
- Tests: all geometry/dice invariants, adjacency and diagonal edge cases, 62,208-Wizard exhaustive command.

### Phase B — First playable web version

- Vite + vanilla TypeScript + HTML/CSS + SVG.
- Dice roll, board and tray, pointer drag/drop, click/tap placement, rotate/flip, snap, validation, win detection.
- Desktop/mobile sizing, keyboard support, reset/new game and timer.

### Phase C — Polishing with real-device testing

- Undo, hint, current-level help, simple accessibility audit.
- Touch behavior on iOS Safari/Android Chrome, responsive portrait sizes, phone rotation, `pointercancel` handling.
- URL challenge sharing (encode one choice per die; validate against that die on decode). Optional localStorage for preferences/best times only.

### Explicit non-goals for V1

- No authentication, account system, backend, live multiplayer, matchmaking, cloud leaderboards or persistent DB.
- No Three.js, Phaser, Canvas engine, physics, fake 3D dice or elaborate animation system.
- No AI/LLM necessary to solve a finite exact-cover problem.
- No puzzle generation from arbitrary blocker placements; only actual dice results.
- No speculative extensibility layer for alternate boards, future game variations or arbitrary polyomino sets.

### Acceptance checklist

- [ ] Every die shows its actual 6 faces, including repeated coordinates.
- [ ] Board orientation matches inspected SmartGames edition.
- [ ] All 36 cells are partitioned among unique dice coordinates.
- [ ] Shapes cover 29 squares, generate 28 unique orientations, and all support legal flips.
- [ ] Every level uses its *correct* special-piece restriction subset.
- [ ] Orthogonal contact is rejected when appropriate; diagonal contact allowed.
- [ ] Invalid/out-of-bounds drops are not committed.
- [ ] Already placed pieces can be moved without self-collision.
- [ ] The entire state can be solved from a valid starting board; dead-end partial layouts are reported honestly.
- [ ] All 62,208 dice boards are Wizard-solvable in exhaustive test.
- [ ] Mouse, touch and keyboard interactions work, with a non-drag placement path.
- [ ] A completed board is validated from state, not just a UI cell count.
- [ ] The app can be deployed as static files without a server.

## 9. Worthwhile later ideas (not architecture drivers)

- **Daily challenge** from deterministic date-based seed — be explicit that it is an app-defined challenge, not a physical dice roll, unless its face sampling is modeled faithfully.
- **Shareable challenge** (dice faces + level in URL). Users can compare times outside the application, no backend.
- **Hints with tiered assistance:** highlight a piece that fits; suggest a location; show one complete solution.
- **Guided tutorial** teaching one rotation, one flip and the difference between corner and edge adjacency.
- **Statistics:** completion time per level and best times in localStorage; avoid global ranks without a service.
- **Same-screen two-player race** on sufficiently large screens, with identical blockers and independent boards. Much harder to make ergonomic on a phone. Real-time online multiplayer is a separate project and needs synchronization, a service, and anti-cheat expectations.
- **Difficulty analysis** by precomputed solution count and structural features if a real user need emerges. Different physical rolls have different baseline difficulty even at the same rule level.

## 10. References and licensing caution

1. SmartGames official product: https://www.smartgames.com/uk/one-player-games/genius-square
2. SmartGames multilingual 2023 rules PDF (English and German): https://d32bxxnq6qs937.cloudfront.net/sites/default/files/GRL%20SGHP001%20Genius%20Square%2020230714.pdf
3. Earlier Happy Puzzle Company rules PDF, useful to compare editions: https://manuals.plus/m/7bae49678d06d9344664adc4f299df047fb3d263d87fd8489a044bebef42675c.pdf
4. Complete die faces with duplicate sides: https://mangosgaming.uk/portfolio/review-genius-square/
5. Independent solver/shape data and published Starter solution distribution: https://github.com/aCampello/genius-square
6. Separate puzzle solver approach: https://github.com/mitchblank/gsqsolve
7. SVG pointer coordinate conversion: https://developer.mozilla.org/en-US/docs/Web/SVG/Guides/Scripting
8. Pointer capture: https://developer.mozilla.org/en-US/docs/Web/API/Element/setPointerCapture
9. Accessible alternative to dragging, WCAG 2.2: https://www.w3.org/WAI/WCAG22/Techniques/general/G219

**Publishing caveat:** reproducing game mechanics and writing original SVG/CSS assets is different from redistributing official rulebook artwork, package imagery, logos or distinctive branding. The official download page explicitly restricts reuse of its rulebook content. For a publicly released product, assess title/trademark, artwork rights, and presentation with the rights holder or qualified counsel. This document provides technical research, not legal clearance.

---

**Companion files:** `genius-square-core.ts` (tested, dependency-free puzzle reference engine) and `genius-square-verify.mjs` (full-space verification script). They are *not* a complete web UI.
