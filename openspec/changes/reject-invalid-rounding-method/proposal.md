# Proposal

## Why

The `roundingMethod` option accepts arbitrary `Math` functions even though the
documented and typed values are `round`, `floor`, and `ceil`. Functions such as
`Math.sqrt` and `Math.abs` pass the current runtime validation and produce
nonsensical size output (e.g. `filesize(1536, { roundingMethod: "sqrt" })` returns
`0.12393546707863734 kB` instead of throwing). The runtime contract does not match
the documented and typed contract.

## What Changes

- Restrict the `roundingMethod` option to the supported set: `round`, `floor`, and `ceil`.
- Reject any other value (e.g. `"sqrt"`, `"abs"`, `"bogus"`) with
  `TypeError: Invalid rounding method`, matching the existing unknown-method behavior.
- No change to the rounding math for the three supported methods.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `number-formatting`: Add a requirement that the `roundingMethod` option MUST be one
  of `round`, `floor`, or `ceil`, and that any other value MUST throw
  `TypeError: Invalid rounding method`.

## Impact

- `src/filesize.js`: Add whitelist validation for `roundingMethod` before resolving
  `Math[roundingMethod]`.
- `tests/unit/filesize.test.js`: Add assertions that `"sqrt"` and `"abs"` throw
  `TypeError`, matching the existing unknown-method test.
- No changes to `types/filesize.d.ts` or `README.md` — they already document the
  correct contract; the bug is purely a runtime validation gap.
