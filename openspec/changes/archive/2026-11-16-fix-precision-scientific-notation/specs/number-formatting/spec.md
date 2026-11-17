# Spec Delta

## ADDED Requirements

### Requirement: Precision output never uses scientific notation

When the `precision` option is set, the formatted value MUST NOT contain scientific notation (`e` or `E`), including when the exponent is at or above the unit ceiling (exponent 8, e.g. YB/YiB).

#### Scenario: Precision at the exponent ceiling does not leak scientific notation

- **WHEN** `filesize(10n ** 30n, {precision: 3})` is called
- **THEN** the result does not contain `e` or `E`

#### Scenario: Precision with IEC standard at the ceiling does not leak scientific notation

- **WHEN** `filesize(1024n ** 8n * 1000n, {precision: 2, standard: "iec"})` is called
- **THEN** the result does not contain `e` or `E`

#### Scenario: Precision near the ceiling normalizes to a plain decimal

- **WHEN** `filesize(10n ** 27n, {precision: 3})` is called
- **THEN** the result does not contain `e` or `E`
