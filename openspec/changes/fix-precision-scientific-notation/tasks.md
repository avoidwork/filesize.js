# Tasks

## 1. Fix scientific notation handling

- [x] 1.1 Update `applyPrecisionHandling` in `src/helpers.js` so the scientific-notation correction runs whenever the result contains `e`/`E` and the exponent is auto (remove the `e < 8` restriction), and verify the reproduction cases produce no `e`/`E`
- [x] 1.2 Update `applyNumberFormatting` in `src/helpers.js` so string precision results containing `e`/`E` are expanded to a plain decimal, and verify the affected cases produce clean output

## 2. Add regression tests

- [x] 2.1 Add regression tests to `tests/unit/filesize.test.js` asserting `filesize(10n ** 30n, {precision: 3})`, `filesize(1024n ** 8n * 1000n, {precision: 2, standard: "iec"})`, and `filesize(10n ** 27n, {precision: 3})` produce no `e`/`E`, and verify they pass

## 3. Verify

- [x] 3.1 Run `npm test` and confirm the full suite passes with 100% coverage
