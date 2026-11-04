# Design

## Context

See proposal.md - Why. The `roundingMethod` option in `src/filesize.js` currently
resolves `roundingFunc = Math[roundingMethod]` and only checks
`typeof roundingFunc !== FUNCTION`. This accepts any `Math` function, including
`Math.sqrt` and `Math.abs`, which produce nonsensical size output. The documented and
typed contract (`types/filesize.d.ts`) restricts the value to `round`, `floor`, `ceil`.

## Goals / Non-Goals

**Goals:**
- Restrict `roundingMethod` to the supported set `round`, `floor`, `ceil`.
- Throw `TypeError: Invalid rounding method` for any other value.
- Preserve existing behavior for the three supported methods.

**Non-Goals:**
- No change to the rounding math itself.
- No change to `types/filesize.d.ts` or `README.md` (they already document the correct contract).
- No change to `partial()` behavior.

## Decisions

**Whitelist validation before resolving from `Math`.**

The current code at `src/filesize.js:108` does:
```javascript
const roundingFunc = Math[roundingMethod];
if (typeof roundingFunc !== FUNCTION) {
    throw new TypeError(INVALID_ROUND);
}
```

The fix adds an explicit whitelist check on the `roundingMethod` string before it is
resolved from `Math`. This is the most robust approach because it does not rely on
enumerating every invalid `Math` function.

**Alternative considered:** Blacklisting known-bad functions (e.g. `sqrt`, `abs`).
Rejected because it is fragile — new `Math` functions could be added and slip through.
A whitelist is self-documenting and future-proof.

**Reuse existing error constant.** Throw `INVALID_ROUND` (`"Invalid rounding method"`)
so the error message stays consistent with the existing unknown-method path.

## Risks / Trade-offs

- [Whitelist must not break the default `"round"` path] → The default value is `ROUND`
  (`"round"`), which is in the whitelist, so the default path is unaffected.
- [Whitelist must not break `partial()`] → `partial()` passes `roundingMethod` through
  unchanged; the whitelist applies uniformly in `filesize()`, so `partial()` is unaffected.
- [Future `Math` functions] → A whitelist naturally rejects any value outside the
  supported set, so future `Math` functions cannot slip through.
