# Tasks: fix-bigint-precision

## 1. BigInt exponent and value helpers

- [x] 1.1 Add a `bigint` exponent helper that computes the unit exponent using `bigint` comparisons (SI base 1000, IEC base 1024), clamped to exponent 8
- [x] 1.2 Add a `bigint` value helper that divides the `bigint` by the appropriate `bigint` power using a scaled division that preserves precision

## 2. Integrate BigInt branch into filesize()

- [x] 2.1 Detect `typeof arg === "bigint"` before the `Number(arg)` coercion in `filesize()`
- [x] 2.2 Route bigint inputs to the BigInt branch, computing `value` and `e` with bigint arithmetic
- [x] 2.3 Rejoin the common output path (applyRounding, applyPrecisionHandling, decorateResult, formatOutput) after computing `value` and `e`

## 3. Regression tests

- [x] 3.1 Add test: `filesize(BigInt(2 ** 53 + 1), {round: 15})` differs from `filesize(BigInt(2 ** 53), {round: 15})`
- [x] 3.2 Add test: `filesize(BigInt(10 ** 24 - 1))` reports ZB (exponent 7), not YB
- [x] 3.3 Add test: `filesize(BigInt(1024 ** 8 - 1), {standard: "iec"})` reports ZiB (exponent 7), not YiB
- [x] 3.4 Add test: `filesize(BigInt(10 ** 30))` clamps to exponent 8 (YB)

## 4. Verification

- [x] 4.1 Run `npm test` and confirm all tests pass
- [x] 4.2 Run `npm run coverage` and confirm 100% coverage maintained
