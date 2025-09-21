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
  spacer: string
): string | [number | string, string] | { value: number | string; symbol: string; exponent: number; unit: string } | number;

/**
 * Optimized value calculation with bits handling
 * @param num - Input number
 * @param e - Exponent
 * @param isDecimal - Whether to use decimal powers
 * @param bits - Whether to calculate bits
 * @param ceil - Ceiling value for auto-increment
 * @returns Object with result and e properties
 */
export function calculateOptimizedValue(
  num: number,
  e: number,
  isDecimal: boolean,
  bits: boolean,
  ceil: number
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
  round: number
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
