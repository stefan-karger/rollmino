# Coding guidelines

These guidelines apply to planning and implementation in Rollmino. They adopt the general KISS, YAGNI and decision rules from the user's astro-portfolio repository. Optimize for code that is easy to find, understand, edit and verify, with low ongoing maintenance cost.

## KISS

Choose the simplest implementation that clearly meets the current requirements.

- Keep code direct and locally understandable. Wrappers, helper chains, layers and delegation need a concrete readability or maintenance benefit.
- Keep cohesive logic together. Short functions and small files are useful when they clarify the operation. Splitting one simple operation across several places solely to shorten them adds work for the reader.
- Extract a function or module when its boundary represents a meaningful concept, contains real complexity or makes current code easier to change. A single consumer can justify extraction. Inline abstractions that add more confusion than they remove.
- Put substantial SVG geometry and opaque asset data in dedicated files when that improves editing, previewing or review. Keep selection and loading near their consumers. Short readable literals and geometry generated from the game's shape data can stay inline. Use the simplest loader that works with the build and tests.
- Use concise names that are clear in their scope. Avoid repeating information supplied by a module, type or surrounding code. Use more descriptive names for wider APIs and familiar abbreviations such as `id` and `url` where clear.
- Prefer obvious control flow. Avoid clever compression that obscures branches, state changes or failure handling.
- Keep APIs small. Export, parameterize and configure only behavior with a current consumer. Leave implementation details private and local.
- Check the language, browser APIs, standard library and existing project code before adding a utility or dependency. Follow established patterns when the alternatives are otherwise comparable.
- Account for each dependency's maintenance, build and runtime cost. Add it when it makes the required implementation easier to understand, change or verify. A useful framework is compatible with KISS; fewer packages alone do not establish the simpler result.

## YAGNI

Implement current requirements and keep the result easy to modify.

- Avoid guessed features, unused options, future-only state fields and dormant code paths. Add them when a real feature needs them; remove obsolete capabilities.
- Introduce interfaces, factories, plugins, strategies, hooks or configuration mechanisms only for an actual need. Do not prepare a framework migration or alternate game system in advance.
- Similar code can represent different concepts. Small, clear duplication is acceptable until a stable shared concept warrants extraction.
- Optimize after a concrete performance requirement or measurement identifies a problem. Cache invalidation, workers and alternate solver implementations add maintenance work.
- Refactor when it improves the clarity, safety or maintainability of current code. YAGNI does not excuse confusing structure or known correctness defects.

## Decision rule

Compare implementations by how easily someone can locate the relevant behavior, understand it, make a change and verify the result. Include recurring costs such as dependency updates, build time and development reload behavior. Accept a little initial work when it reduces those ongoing costs.

When the alternatives are otherwise comparable, choose fewer concepts, layers, public APIs and dependencies, with clearer control flow and less speculative flexibility. Apply judgment. Current requirements may justify additional complexity.

For this game, pure rules, transactional placement validation, accessible non-drag input and tests of complete board coverage serve real requirements. Generic game engines, configurable board sizes and unused hint infrastructure do not. Follow the agreed stack in [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md). Its file tree names meaningful responsibilities; adjust module boundaries when actual code becomes easier to maintain under these rules.

## Source and project-specific scope

Adapted from [astro-portfolio's guidelines on redesign](https://github.com/stefan-karger/astro-portfolio/blob/redesign/CODING_GUIDELINES.md), as inspected on 2026-10-12. The general policy is based on [the version at commit 9648357](https://github.com/stefan-karger/astro-portfolio/blob/9648357fcc097b58d437eca396864dfa9e81b6dd/CODING_GUIDELINES.md).

The portfolio's Tailwind, Astro components, shared link styles and outbound icon conventions concern that repository's existing UI. They do not choose this game's styling or framework. Rollmino's agreed stack uses plain CSS and SVG; assess changes using the same decision rule. This local document is the project's working policy, with source updates adopted deliberately rather than fetched automatically during builds or agent work.
