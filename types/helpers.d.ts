/**
 * Configuration object returned by getBaseConfiguration
 */
export interface BaseConfiguration {
  /** Whether to use decimal (base 10) calculations */
  isDecimal: boolean;
  /** Ceiling value for auto-increment calculations */
  ceil: number;
  /** The actual standard to use for formatting */
  actualStandard: string;
}

/**
 * Value calculation result
 */
export interface OptimizedValueResult {
  /** The calculated result value */
  result: number;
  /** The adjusted exponent */
  e: number;
}

/**
 * Precision handling result
 */
export interface PrecisionHandlingResult {
  /** The formatted value */
  value: string | number;
  /** The adjusted exponent */
  e: number;
}

/**
 * Optimized base configuration lookup
 * @param standard - Standard type
 * @param base - Base number
 * @returns Configuration object
 */
export function getBaseConfiguration(standard: string, base: number): BaseConfiguration;

/**
 * Optimized zero value handling
 * @param precision - Precision value
 * @param actualStandard - Standard to use
 * @param bits - Whether to use bits
 * @param symbols - Custom symbols
 * @param full - Whether to use full form
 * @param fullforms - Custom full forms
 * @param output - Output format
 * @param spacer - Spacer character
 * @param symbol - Symbol to use (optional, defaults based on bits/standard)
 * @returns Formatted result
 */
export function handleZeroValue(
  precision: number,
  actualStandard: string,
  bits: boolean,
  symbols: Record<string, string>,
  full: boolean,
  fullforms: string[],
  output: string,
  spacer: string,
  symbol?: string
): string | [number | string, string] | { value: number | string; symbol: string; exponent: number; unit: string } | number;

/**
 * Optimized value calculation with bits handling
 * @param num - Input number
 * @param e - Exponent
 * @param isDecimal - Whether to use decimal powers
 * @param bits - Whether to calculate bits
 * @param ceil - Ceiling value for auto-increment
 * @param autoExponent - Whether exponent is auto (-1 or NaN)
 * @returns Object with result and e properties
 */
export function calculateOptimizedValue(
  num: number,
  e: number,
  isDecimal: boolean,
  bits: boolean,
  ceil: number,
  autoExponent?: boolean
): OptimizedValueResult;

/**
 * Optimized precision handling with scientific notation correction
 * @param value - Current value
 * @param precision - Precision to apply
 * @param e - Current exponent
 * @param num - Original number
 * @param isDecimal - Whether using decimal base
 * @param bits - Whether calculating bits
 * @param ceil - Ceiling value
 * @param roundingFunc - Rounding function
 * @param round - Round value
 * @param exponent - Forced exponent (-1 for auto)
 * @returns Object with value and e properties
 */
export function applyPrecisionHandling(
  value: number,
  precision: number,
  e: number,
  num: number,
  isDecimal: boolean,
  bits: boolean,
  ceil: number,
  roundingFunc: (x: number) => number,
  round: number,
  exponent: number
): PrecisionHandlingResult;

/**
 * Optimized number formatting with locale, separator, and padding
 * @param value - Value to format
 * @param locale - Locale setting
 * @param localeOptions - Locale options
 * @param separator - Custom separator
 * @param pad - Whether to pad
 * @param round - Round value
 * @returns Formatted value
 */
export function applyNumberFormatting(
  value: number | string,
  locale: string | boolean,
  localeOptions: Intl.NumberFormatOptions,
  separator: string,
  pad: boolean,
  round: number
): string | number;

/**
 * Result of exponent calculation and precision adjustment
 */
export interface ExponentCalculationResult {
  /** The computed exponent value */
  e: number;
  /** The possibly adjusted precision value */
  precision: number;
}

/**
 * Calculates exponent from the input value using pre-computed log values and clamps to supported range
 * Also adjusts precision when exponent exceeds the lookup table bounds
 * @param num - Input file size in bytes
 * @param e - Current exponent value
 * @param exponent - Original user-provided exponent option (-1 for auto)
 * @param isDecimal - Whether to use decimal (SI) base
 * @param precision - Current precision value (modified when e > 8)
 * @returns Object with computed e value and possibly adjusted precision
 */
export function calculateExponent(
  num: number,
  e: number,
  exponent: number,
  isDecimal: boolean,
  precision: number
): ExponentCalculationResult;

/**
 * Applies rounding to the raw calculated value and handles auto-increment ceiling
 * @param val - Raw value before rounding
 * @param ceil - Ceiling threshold (1000 for SI, 1024 for IEC)
 * @param e - Current exponent value
 * @param round - Number of decimal places
 * @param roundingFunc - Rounding method (Math.round, Math.floor, Math.ceil)
 * @param autoExponent - Whether exponent is auto-calculated (-1 or NaN)
 * @returns Object with rounded value and possibly incremented exponent
 */
export function applyRounding(
  val: number,
  ceil: number,
  e: number,
  round: number,
  roundingFunc: (x: number) => number,
  autoExponent: boolean
): { value: number; e: number };

/**
 * Resolves the unit symbol for the given standard, bits mode, and exponent
 * Handles SI standard special case where exponent 1 always uses "kB" or "kbit"
 * @param actualStandard - The resolved standard (iec, jedec)
 * @param bits - Whether formatting bit values
 * @param e - Current exponent index
 * @param isDecimal - Whether using decimal (SI) base
 * @returns The resolved unit symbol string
 */
export function resolveSymbol(
  actualStandard: string,
  bits: boolean,
  e: number,
  isDecimal: boolean
): string;

/**
 * Decorates the result: applies negation, custom symbols, number formatting, and full form names
 * Mutates the result array in-place; result[0] becomes string | number via applyNumberFormatting(),
 * result[1] may be updated for custom symbols or full form names
 * @param result - Result array with value at [0] (string | number) and symbol at [1] (string)
 * @param neg - Whether the original input was negative
 * @param symbols - Custom symbol override map
 * @param locale - Locale string for formatting
 * @param localeOptions - Additional locale formatting options
 * @param separator - Custom decimal separator
 * @param pad - Whether zero-pad decimals
 * @param round - Target decimal count for padding
 * @param full - Whether to use full unit names
 * @param fullforms - Custom full unit name overrides
 * @param actualStandard - Unit standard for full form lookup
 * @param e - Current exponent index
 * @param bits - Whether formatting bit values
 */
export function decorateResult(
  result: (number | string)[],
  neg: boolean,
  symbols: Record<string, string>,
  locale: string | boolean,
  localeOptions: Record<string, unknown>,
  separator: string,
  pad: boolean,
  round: number,
  full: boolean,
  fullforms: string[],
  actualStandard: string,
  e: number,
  bits: boolean
): void;

/**
 * Formats the computed result array into the requested output type
 * @param result - Result array with formatted value at [0] (string | number) and symbol at [1] (string)
 * @param e - Current exponent
 * @param u - Original resolved symbol (before custom override)
 * @param output - Output type (ARRAY, OBJECT, STRING)
 * @param spacer - String separator between value and unit
 * @returns Formatted result in requested type
 */
export function formatOutput(
  result: (string | number)[],
  e: number,
  u: string,
  output: string,
  spacer: string
): string | (string | number)[] | { value: string | number; symbol: string; exponent: number; unit: string };
