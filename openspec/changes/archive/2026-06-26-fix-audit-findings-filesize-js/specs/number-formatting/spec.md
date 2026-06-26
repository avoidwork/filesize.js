## ADDED Requirements

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
