## ADDED Requirements

### Requirement: Padding with separator must truncate excess decimals
When both `separator` and `pad` options are provided to filesize, the output MUST truncate excess decimal digits to match the `round` parameter before applying zero-padding.

#### Scenario: Truncate excess decimals with separator and pad
- **WHEN** filesize is called with `1234.567`, `{separator: ",", pad: true, round: 2}`
- **THEN** the result is `"1,234.57"` (not `"1,234.567"`)

#### Scenario: Pad with separator when decimals are sufficient
- **WHEN** filesize is called with `1234.5`, `{separator: ",", pad: true, round: 2}`
- **THEN** the result is `"1,234.50"` (truncated to 2 decimals, then padded)

#### Scenario: Truncate without pad but with separator
- **WHEN** filesize is called with `1234.567`, `{separator: ",", pad: false, round: 2}`
- **THEN** the result is `"1,234.57"` (truncated to round digits, no padding)

#### Scenario: Round of zero truncates all decimals with separator
- **WHEN** filesize is called with `1234.567`, `{separator: ",", pad: true, round: 0}`
- **THEN** the result is `"1,235"` (rounded and no decimal places)

#### Scenario: Locale formatting is unaffected
- **WHEN** filesize is called with locale option set (locale: true or locale string)
- **THEN** the padding and separator logic does not apply; locale formatting handles precision independently
