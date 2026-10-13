# T06. Implement top-five ranking and resilient local storage

[Tracker](README.md) | [Product specification](../../IMPLEMENTATION_PLAN.md) | [Coding guidelines](../../CODING_GUIDELINES.md)

## Blockers

- [T03](03-web-tooling.md)

Plan coverage: section 8 and record cases in section 12; pure/storage part of Slice 2.

## Outcome

A small records module retains the fastest five results per level, validates its payload and survives storage failures. It does not require gameplay UI to be developed.

## Scope and files

Add `src/records.ts`, `tests/records.test.mjs` and `test:records`. The only stored fields are `elapsedMs` and `finishedAt`, both integer milliseconds, under `rollmino.records.v1`. T08 owns UI and completion wiring.

## Implementation steps

1. Represent the five known level lists and `{elapsedMs, finishedAt}` entries. No board data, sessions, names, unused IDs, settings or migration framework.
2. Implement insertion sorted by raw elapsed milliseconds ascending, then completion timestamp ascending. Keep five; preserve insertion order if both fields tie. Do not rank by formatted centiseconds.
3. Validate JSON for this exact payload. Accept finite nonnegative integer durations and valid integer date timestamps; discard malformed entries, normalize missing lists, sort and cap. Do not retain unknown payload fields/levels. Malformed JSON/invalid payload produces empty recovered records and a short notice.
4. Accept the small storage object needed for real get/set and failure tests. The UI will catch a throwing `window.localStorage` getter before supplying it. Catch get/set errors here; retain this page's records in memory and indicate unavailable persistence. Avoid generic adapters/factories.
5. Read the latest valid payload before inserting/clearing when storage works. Preserve every other level and unrelated origin storage key. Clear the selected list within the app key only; never call `localStorage.clear()`.
6. Export only consumed ranking/load/save/clear behavior. Leave run eligibility, confirmation and formatting presentation to consumers. Add `test:records` as `node --experimental-strip-types --test tests/records.test.mjs`.

## Verification

```bash
pnpm run test:records
pnpm test
pnpm run typecheck
```

Test empty data, more than five entries, all five independent levels, exact-duration ties, equal timestamps and two durations that render identically but differ in milliseconds. Include corrupt JSON, non-object payloads, wrong arrays, bad dates, fractional/negative/infinite values, unknown fields, and throwing read/write operations. Use a small storage fake with an unrelated sentinel key and verify it survives clearing.

## Done when

- [x] Top-five limits/order/tie behavior use raw milliseconds and preserve independent levels.
- [x] Serialization contains only the agreed level lists and two entry fields.
- [x] Invalid data recovers without crashing; unavailable storage preserves usable in-memory records with a notice.
- [x] Clearing and insertion preserve unrelated keys/levels and use the latest valid stored data.
- [x] Tests/strict checks pass without a database, synchronization service or generalized persistence layer.

## Completion evidence

2026-10-13: Added `src/records.ts` and six record tests. All five lists rank/cap by raw milliseconds and completion date with stable exact ties. Validation discards malformed entries, strips unused fields and recovers invalid payloads. Insert/clear refresh current storage; failures retain page records and expose a notice. Sentinel-key and other-level preservation pass. `pnpm run test:records` passed 6 tests; `pnpm test` passed 59 tests; `pnpm run typecheck` passed. Windows, Node 24.15.0, pnpm 12.10.0. Browser getter handling and ranked/practice wiring remain T08.
