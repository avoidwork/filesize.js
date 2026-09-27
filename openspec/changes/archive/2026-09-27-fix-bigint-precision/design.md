# Design: BigInt precision fix

## Context

`filesize()` converts bytes to human-readable strings. It accepts `number`, `string`, and `bigint` inputs. The current implementation coerces every input with `Number(arg)` at the top of `src/filesize.js`. For `bigint` values above `Number.MAX_SAFE_INTEGER` (2^53 - 1), this loses precision because `Number()` cannot represent integers above 2^53 exactly. It also misdetects unit boundaries because `Number(10 ** 24 - 1)` rounds up to `10 ** 24`, crossing the YB boundary.

The unit ceiling is exponent 8 (YB for SI, YiB for IEC), matching the existing `BINARY_POWERS` / `DECIMAL_POWERS` arrays in `src/constants.js`.

## Goals / Non-Goals

**Goals:**
- Preserve `bigint` precision above 2^53.
- Correct unit boundary detection for `bigint` values just below a boundary.
- Rejoin the existing output path so all options (bits, round, precision, locale, symbols, fullform, output) continue to work.

**Non-Goals:**
- Changing behavior for `number` or `string` inputs.
- Adding new unit standards or extending the exponent ceiling beyond 8.
- Changing the public API.

## Decisions

### Decision 1: Dedicated `bigint` branch before `Number(arg)` coercion

When `typeof arg === "bigint"`, route to a dedicated branch that computes the exponent and value with `bigint` arithmetic. This avoids the precision loss of `Number(num)`.

**Alternatives considered:**
- Coerce to `number` and accept the precision loss — rejected, this is the bug.
- Use `BigInt` throughout including the output path — rejected, the output path expects `number` values for rounding and formatting.

### Decision 2: Exponent detection with `bigint` comparisons

Replace `Math.log()`-based exponent calculation with `bigint` comparisons. For SI (decimal, base 1000), find the largest `e` in `0..8` such that `num >= 10n ** BigInt(3 * (e + 1))`. For IEC (binary, base 1024), find the largest `e` in `0..8` such that `num >= 1024n ** BigInt(e + 1)`. Clamp `e` to 8.

**Alternatives considered:**
- `Math.log(num) / LOG_10_1000` — rejected, loses precision and misdetects boundaries.

### Decision 3: Scaled `bigint` division for value calculation

Divide the `bigint` by the appropriate `bigint` power using a scaled division: `Number((num * 10n ** 16n) / power) / Number(10n ** 16n)`. This preserves precision because the division happens in `bigint` space before converting to `number`.

**Alternatives considered:**
- `Number(num) / Number(power)` — rejected, loses precision.
- `Number(num / power) + Number(num % power) / Number(power)` — rejected, `Number(num % power)` loses precision when the remainder is large.

### Decision 4: Rejoin the common output path

After computing `value` and `e`, feed them into the existing `applyRounding`, `applyPrecisionHandling`, `decorateResult`, and `formatOutput` flow. No overlap in the BigInt branch until the returns.

## Risks / Trade-offs

- **[Precision loss at the final division]** → The scaled `bigint` division preserves ~16 significant digits, which is sufficient for the rounding and precision options (max 100 significant digits, but the value is already bounded by the unit ceiling).
- **[Huge BigInt values above the ceiling]** → Clamp `e` to 8, preserving existing behavior for values above YB / YiB.
- **[Bits auto-increment]** → The existing `result *= 8` and `e++` logic must still apply in the BigInt branch.

## Migration Plan

No migration needed — this is a bug fix. The change is backward-compatible for `number` and `string` inputs.

## Open Questions

None. The contract is defined by the issue and the existing test suite.
