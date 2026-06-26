# partial-application Specification

## Purpose
TBD - created by archiving change fix-audit-findings-filesize-js. Update Purpose after archive.
## Requirements
### Requirement: Partial function uses structuredClone for deep cloning
The `partial` function MUST use `structuredClone` for deep cloning `localeOptions`, `symbols`, and `fullforms` options, with a fallback to `JSON.parse(JSON.stringify())` for environments where `structuredClone` is not available.

#### Scenario: Partial clones plain objects correctly
- **WHEN** `partial({ localeOptions: { minimumFractionDigits: 2 }, symbols: {}, fullforms: [] })` is called
- **THEN** the returned function has independently cloned copies of each option

#### Scenario: Partial clones with structuredClone when available
- **WHEN** `structuredClone` is available in the runtime
- **THEN** `partial` uses `structuredClone` for deep cloning

#### Scenario: Partial falls back to JSON clone when structuredClone unavailable
- **WHEN** `structuredClone` is not available in the runtime
- **THEN** `partial` falls back to `JSON.parse(JSON.stringify())` for deep cloning

### Requirement: Partial function preserves non-cloneable values with fallback
When `structuredClone` is not available, the `partial` function MUST maintain backward compatibility by using `JSON.parse(JSON.stringify())` which preserves plain objects, arrays, strings, numbers, booleans, and null.

#### Scenario: Partial works with plain object options
- **WHEN** `partial({ localeOptions: { localeMatcher: "best fit" } })` is called
- **THEN** the returned function correctly uses the cloned localeOptions

