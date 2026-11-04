# Spec Delta

## ADDED Requirements

### Requirement: Rounding method is restricted to supported values

The `roundingMethod` option MUST be one of `round`, `floor`, or `ceil`. Any other value MUST throw `TypeError` with the message `"Invalid rounding method"`.

#### Scenario: Unsupported Math function throws

- **WHEN** `filesize(1536, {roundingMethod: "sqrt"})` is called
- **THEN** a `TypeError` is thrown with message `"Invalid rounding method"`

#### Scenario: Another unsupported Math function throws

- **WHEN** `filesize(1536, {roundingMethod: "abs"})` is called
- **THEN** a `TypeError` is thrown with message `"Invalid rounding method"`

#### Scenario: Unknown method throws

- **WHEN** `filesize(1536, {roundingMethod: "bogus"})` is called
- **THEN** a `TypeError` is thrown with message `"Invalid rounding method"`

#### Scenario: Supported round method still works

- **WHEN** `filesize(1536, {roundingMethod: "round"})` is called
- **THEN** the result is `"1.54 kB"`

#### Scenario: Supported floor method still works

- **WHEN** `filesize(1536, {roundingMethod: "floor"})` is called
- **THEN** the result is `"1.53 kB"`

#### Scenario: Supported ceil method still works

- **WHEN** `filesize(1536, {roundingMethod: "ceil"})` is called
- **THEN** the result is `"1.54 kB"`
