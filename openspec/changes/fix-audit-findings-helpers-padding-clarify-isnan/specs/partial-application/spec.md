## ADDED Requirements

### Requirement: Partial function must use safe deep cloning
The `partial` function MUST use a safe deep cloning mechanism that correctly handles plain objects and arrays without silently dropping values.

#### Scenario: Deep clone localeOptions
- **WHEN** partial is called with `{localeOptions: {currency: "USD"}}`
- **THEN** modifying the returned function's internal state does not affect the original localeOptions object

#### Scenario: Deep clone symbols
- **WHEN** partial is called with `{symbols: {"B": "bytes"}}`
- **THEN** modifying the returned function's internal state does not affect the original symbols object

#### Scenario: Deep clone fullforms
- **WHEN** partial is called with `{fullforms: ["bytes", "kilobytes"]}`
- **THEN** modifying the returned function's internal state does not affect the original fullforms array

### Requirement: Partial function must support Node.js < 17
The `partial` function MUST work on Node.js versions below 17 where `structuredClone` is not available.

#### Scenario: Fallback clone on older Node.js
- **WHEN** partial is called on Node.js < 17 with plain object options
- **THEN** the options are correctly deep cloned using the fallback mechanism
