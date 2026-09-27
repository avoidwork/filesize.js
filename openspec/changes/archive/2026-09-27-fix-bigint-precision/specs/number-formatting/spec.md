## ADDED Requirements

### Requirement: BigInt inputs preserve precision above Number.MAX_SAFE_INTEGER

When a `bigint` is passed to `filesize()`, the system SHALL preserve precision for values above `Number.MAX_SAFE_INTEGER` (2^53 - 1). The `+1` in `BigInt(2 ** 53 + 1)` MUST NOT be silently dropped by `Number()` coercion.

#### Scenario: BigInt above 2^53 preserves the increment
- **WHEN** `filesize(BigInt(2 ** 53 + 1), {round: 15})` is called
- **THEN** the result differs from `filesize(BigInt(2 ** 53), {round: 15})`

#### Scenario: BigInt just below 2^53 is unchanged
- **WHEN** `filesize(BigInt(2 ** 53 - 1))` is called
- **THEN** the result is accurate and matches the expected value

### Requirement: BigInt unit boundary detection is accurate

The system SHALL detect unit boundaries for `bigint` inputs using `bigint` arithmetic, not `Number()` rounding. A `bigint` value clearly below a unit boundary MUST NOT round up across it.

#### Scenario: BigInt clearly below 1 YB reports ZB
- **WHEN** `filesize(BigInt(10 ** 24 - 10 ** 21))` is called
- **THEN** the result reports the value in ZB (exponent 7), not YB (exponent 8)

#### Scenario: BigInt clearly below 1 YiB reports ZiB
- **WHEN** `filesize(BigInt(1024 ** 8 - 1024 ** 7), {standard: "iec"})` is called
- **THEN** the result reports the value in ZiB (exponent 7), not YiB (exponent 8)
