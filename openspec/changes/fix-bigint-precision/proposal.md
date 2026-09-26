## Why

`filesize()` coerces its argument with `Number(arg)`, which silently loses precision for `bigint` inputs above `Number.MAX_SAFE_INTEGER` (2^53 - 1). It also misdetects unit boundaries because `Number(10 ** 24 - 1)` rounds up across the YB boundary. Users passing `bigint` values get inaccurate results.

## What Changes

- Add a dedicated `bigint` branch in `filesize()` that runs before the `Number(arg)` coercion.
- Compute the exponent and value using `bigint` arithmetic, converting to `number` only at the final division.
- Correct unit boundary detection for `bigint` values just below a unit boundary (SI and IEC).
- Rejoin the existing output path (rounding, precision, decoration, formatting) after computing `value` and `e`.
- Add regression tests for the precision and boundary cases.

## Capabilities

### New Capabilities
- `bigint-precision`: Correct handling of `bigint` inputs, preserving precision above `Number.MAX_SAFE_INTEGER` and detecting unit boundaries accurately.

### Modified Capabilities
- `number-formatting`: The `filesize()` function's handling of `bigint` inputs changes — values above 2^53 must not lose precision, and unit boundaries must be detected correctly.

## Impact

- `src/filesize.js` — add the `bigint` branch and detect `typeof arg === "bigint"`.
- `src/helpers.js` — add bigint-aware exponent and value helpers.
- `tests/unit/filesize.test.js` — add regression tests.
- No public API changes; existing number and string inputs are unaffected.
