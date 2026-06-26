## Why

An audit of the filesize.js source code identified three issues that affect correctness and code quality:

1. A medium-severity bug in `helpers.js` where the padding logic fails to truncate excess decimal places when both `separator` and `pad` options are set, producing output with more decimal digits than the `round` parameter specifies.
2. A low-severity clarity issue in `filesize.js` where `isNaN(arg)` is used after `num = Number(arg)` was already computed — `isNaN(num)` would be more intentional.
3. A low-severity fragility issue in the `partial` function where `JSON.parse(JSON.stringify())` is used for deep cloning, which silently drops functions, undefined, Dates, and RegExps.

These fixes improve correctness (the padding bug), code clarity (isNaN), and future-proofing (structuredClone).

## What Changes

- Fix `applyNumberFormatting` in `helpers.js` to round the value to `round` decimal places BEFORE applying separator replacement and padding, ensuring excess decimal places are truncated.
- Replace `isNaN(arg)` with `isNaN(num)` in the `filesize` function for clarity.
- Replace `JSON.parse(JSON.stringify())` with `structuredClone()` in the `partial` function for robust deep cloning, with a fallback for older Node versions.

## Capabilities

### New Capabilities
- `number-formatting`: Correct truncation of decimal places when separator and pad options are combined

### Modified Capabilities
- `partial-application`: Use structuredClone instead of JSON serialization for deep cloning options

## Impact

- `src/helpers.js` — `applyNumberFormatting` function (rounding applied before separator/padding)
- `src/filesize.js` — `filesize` function (isNaN clarity), `partial` function (structuredClone)
- `tests/unit/filesize-helpers.test.js` — New tests for padding + separator edge case
- `tests/unit/filesize.test.js` — New tests for partial function with structuredClone
