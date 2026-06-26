## Why

An audit of the filesize.js source code (issue #296) identified three findings: a medium-severity bug where padding with a custom separator fails to truncate excess decimal places, a low-severity clarity issue where `isNaN(arg)` should reference the already-coerced `num` variable, and a low-severity fragility issue where `JSON.parse(JSON.stringify())` is used for deep cloning in the `partial` function. These fixes improve correctness, code clarity, and long-term maintainability.

## What Changes

- **Fix padding truncation in helpers.js**: When both `separator` and `pad` options are set, truncate excess decimal digits to match `round` before applying zero-padding. This fixes the bug where `filesize(1234.567, {separator: ",", pad: true, round: 2})` returned `"1,234.567"` instead of `"1,234.57"`.
- **Clarify isNaN check in filesize.js**: Replace `isNaN(arg)` with `isNaN(num)` after `num = Number(arg)` for clarity. No behavioral change.
- **Replace JSON deep clone in partial function**: Replace `JSON.parse(JSON.stringify())` with `structuredClone` (with fallback for Node.js < 17) for safer deep cloning of `localeOptions`, `symbols`, and `fullforms`.

## Capabilities

### New Capabilities
- `number-formatting`: Correct truncation of decimal places when using custom separators with padding

### Modified Capabilities
- `partial-application`: Safer deep cloning of options objects in the `partial` function

## Impact

- **Affected code**: `src/helpers.js` (applyNumberFormatting), `src/filesize.js` (filesize, partial)
- **API**: No breaking changes. The padding fix corrects incorrect behavior — existing code relying on the buggy behavior is unlikely.
- **Dependencies**: No new dependencies. Uses `structuredClone` with fallback for older Node.js versions.
- **Tests**: Existing tests for padding and separator behavior must continue to pass. New tests needed for the padding truncation fix.
