# Design

## Context

See proposal.md - Why. The `precision` option produces scientific notation at the exponent ceiling (e=8) because `applyPrecisionHandling` guards its correction with `e < 8`, and `applyNumberFormatting` only expands scientific notation for numeric values, not the string produced by `toPrecision`.

## Goals / Non-Goals

**Goals:**
- Ensure precision output never contains `e`/`E`, including at the exponent ceiling.
- Preserve all existing behavior and 100% coverage.

**Non-Goals:**
- No API changes, no new options, no refactoring of unrelated paths.

## Decisions

**Decision 1: Run the scientific-notation correction regardless of `e` value.**
The guard `if (result.includes(E) && e < 8 && autoExponent)` in `applyPrecisionHandling` skips normalization at the ceiling. Change the guard so the correction runs whenever the result contains `e`/`E` and the exponent is auto. The `e < 8` restriction was only there to avoid re-incrementing past the supported table; since `calculateOptimizedValue` clamps `e` to 8, the correction can safely run at the ceiling.

**Decision 2: Expand scientific notation for string values in `applyNumberFormatting`.**
The precision path hands `applyNumberFormatting` a string from `toPrecision`. The existing expansion at line 376 only fires for `typeof result === "number"`. Extend it to also handle string values that contain `e`/`E`, converting them to a plain decimal.

**Alternatives considered:**
- Normalizing only in `applyPrecisionHandling` (not `applyNumberFormatting`): rejected because `applyNumberFormatting` is the single place that guarantees no scientific notation for all output paths, and the non-precision path already relies on it.
- Clamping `e` to 8 before the guard: rejected as it only addresses the ceiling case, not the `10n**27n` case where a single `e++` still yields `e` notation.

## Risks / Trade-offs

- [Double-rounding or lost significant digits] → Apply the expansion to the already-precision-formatted string without re-rounding; only convert notation to a plain decimal.
- [Regression in existing "extremely large" tolerance tests] → Verify the full suite still passes; those tests only assert `typeof result === "string"` and unit inclusion, so clean decimal output satisfies them.

## Migration Plan

No deployment concerns — this is a library behavior fix. Rollback is a revert of the change.

## Open Questions

None.
