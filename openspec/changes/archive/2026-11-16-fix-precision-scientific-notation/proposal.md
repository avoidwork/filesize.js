# Proposal

## Why

The `precision` option leaks scientific notation (`e+`/`e-`) into output for values at or above the unit ceiling (exponent 8, e.g. YB/YiB). The library promises no scientific notation in precision results, but the normalization in `applyPrecisionHandling` only runs when `e < 8`, so it is skipped at the clamped ceiling. This produces inconsistent, non-human-readable output such as `1.00e+6 YB`.

## What Changes

- Fix `applyPrecisionHandling` in `src/helpers.js` so the scientific-notation correction runs even when the exponent is at or above the ceiling (`e >= 8`).
- Fix `applyNumberFormatting` in `src/helpers.js` so string precision results (from `toPrecision`) are also expanded from scientific notation, not just numeric values.
- Add regression tests asserting precision output never contains `e`/`E` for the affected cases.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `number-formatting`: Add a requirement that the `precision` option MUST NOT produce scientific notation in the formatted output, including at the exponent ceiling.

## Impact

- `src/helpers.js` — `applyPrecisionHandling`, `applyNumberFormatting`
- `tests/unit/filesize.test.js` — regression tests
- No API changes; no breaking changes.
