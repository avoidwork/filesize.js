# number-formatting Specification

## Purpose
TBD - created by archiving change fix-audit-findings-filesize-js. Update Purpose after archive.
## Requirements
### Requirement: Padding truncates excess decimal places with separator
When both `separator` and `pad` options are set, the formatted value MUST be truncated to the specified `round` decimal places before the separator is applied, ensuring the output never exceeds the requested precision.

#### Scenario: Truncate excess decimals with separator and pad
- **WHEN** `filesize(1234.567, {separator: ",", pad: true, round: 2})` is called
- **THEN** the result is `"1,234.57"` (not `"1,234.567"`)

#### Scenario: Truncate multiple excess decimals with separator and pad
- **WHEN** `filesize(1234.5678, {separator: ",", pad: true, round: 2})` is called
- **THEN** the result is `"1,234.57"` (not `"1,234.5678"`)

#### Scenario: Pad with fewer decimals than round
- **WHEN** `filesize(1234.5, {separator: ",", pad: true, round: 2})` is called
- **THEN** the result is `"1,234.50"` (padded with trailing zero)

#### Scenario: Separator and pad without excess decimals
- **WHEN** `filesize(1234.56, {separator: ",", pad: true, round: 2})` is called
- **THEN** the result is `"1,234.56"` (no change needed)

#### Scenario: Pad without separator still works
- **WHEN** `filesize(1234.5, {pad: true, round: 2})` is called
- **THEN** the result is `"1234.50"` (existing behavior preserved)

#### Scenario: Separator without pad still works
- **WHEN** `filesize(1234.567, {separator: ",", round: 2})` is called
- **THEN** the result is `"1,234.57"` (existing behavior preserved)

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

