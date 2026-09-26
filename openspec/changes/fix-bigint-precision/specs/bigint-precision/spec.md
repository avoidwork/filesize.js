# bigint-precision Specification

## Purpose
Correct handling of `bigint` inputs to `filesize()`, preserving precision above `Number.MAX_SAFE_INTEGER` and detecting unit boundaries accurately.

## Requirements

### Requirement: BigInt exponent detection uses bigint arithmetic

The system SHALL compute the unit exponent for `bigint` inputs using `bigint` comparisons, not `Math.log()`. This ensures values just below a unit boundary are not rounded up across it.

#### Scenario: SI exponent detection for value just below 1 YB
- **WHEN** `filesize(BigInt(10 ** 24 - 1), {output: "object"})` is called
- **THEN** the exponent is 7 (ZB), not 8 (YB)

#### Scenario: IEC exponent detection for value just below 1 YiB
- **WHEN** `filesize(BigInt(1024 ** 8 - 1), {standard: "iec", output: "object"})` is called
- **THEN** the exponent is 7 (ZiB), not 8 (YiB)

### Requirement: BigInt value calculation preserves precision

The system SHALL compute the value for `bigint` inputs using `bigint` arithmetic, converting to `number` only at the final division. This preserves precision above 2^53.

#### Scenario: BigInt value above 2^53 is distinct
- **WHEN** `filesize(BigInt(2 ** 53 + 1), {round: 15, output: "object"})` is called
- **THEN** the value differs from `filesize(BigInt(2 ** 53), {round: 15, output: "object"})`

### Requirement: BigInt values above the unit ceiling clamp to exponent 8

The system SHALL clamp the exponent to 8 (YB for SI, YiB for IEC) for `bigint` values above the unit ceiling, preserving existing behavior for huge values.

#### Scenario: BigInt above 1 YB clamps to YB
- **WHEN** `filesize(BigInt(10 ** 30), {output: "object"})` is called
- **THEN** the exponent is 8 (YB) and the value reflects the clamped unit
