/**
 * Options interface for configuring filesize behavior
 */
export interface FilesizeOptions {
  /** If true, calculates bits instead of bytes */
  bits?: boolean;
  /** If true, pads decimal places to match round parameter */
  pad?: boolean;
  /** Number base (2 for binary, 10 for decimal, -1 for auto) */
  base?: number;
  /** Number of decimal places to round to */
  round?: number;
  /** Locale for number formatting, true for system locale */
  locale?: string | boolean;
  /** Additional options for locale formatting */
  localeOptions?: Intl.NumberFormatOptions;
  /** Custom decimal separator */
  separator?: string;
  /** String to separate value and unit */
  spacer?: string;
  /** Custom unit symbols */
  symbols?: Record<string, string>;
  /** Unit standard to use (SI, IEC, JEDEC) */
  standard?: "si" | "iec" | "jedec" | "";
  /** Output format: "string", "array", "object", or "exponent" */
  output?: "string" | "array" | "object" | "exponent";
  /** If true, uses full unit names instead of abbreviations */
  fullform?: boolean;
  /** Custom full unit names */
  fullforms?: string[];
  /** Force specific exponent (-1 for auto) */
  exponent?: number;
  /** Math rounding method to use */
  roundingMethod?: "round" | "floor" | "ceil";
  /** Number of significant digits (0 for auto) */
  precision?: number;
}

/**
 * Object format return type when output is "object"
 */
export interface FilesizeObject {
  /** The numeric value */
  value: number | string;
  /** The unit symbol */
  symbol: string;
  /** The exponent used in calculation */
  exponent: number;
  /** The original unit before symbol customization */
  unit: string;
}

/**
 * Array format return type when output is "array"
 */
export type FilesizeArray = [number | string, string];

/**
 * Return type based on output option
 */
export type FilesizeReturn<T extends FilesizeOptions = {}> = 
  T['output'] extends "object" ? FilesizeObject :
  T['output'] extends "array" ? FilesizeArray :
  T['output'] extends "exponent" ? number :
  string;

/**
 * Converts a file size in bytes to a human-readable string with appropriate units
 * @param arg - The file size in bytes to convert
 * @param options - Configuration options for formatting
 * @returns Formatted file size based on output option
 * @throws {TypeError} When arg is not a valid number or roundingMethod is invalid
 * @example
 * filesize(1024) // "1 KB"
 * filesize(1024, {bits: true}) // "8 Kb"
 * filesize(1024, {output: "object"}) // {value: 1, symbol: "KB", exponent: 1, unit: "KB"}
 */
export function filesize<T extends FilesizeOptions = {}>(
  arg: number | bigint,
  options?: T
): FilesizeReturn<T>;

/**
 * Creates a partially applied version of filesize with preset options
 * @param options - Default options to apply to the returned function
 * @returns A function that takes a file size and returns formatted output
 * @example
 * const formatBytes = partial({round: 1, standard: "iec"});
 * formatBytes(1024) // "1.0 KiB"
 * formatBytes(2048) // "2.0 KiB"
 */
export function partial<T extends FilesizeOptions = {}>(
  options?: T
): (arg: number | bigint) => FilesizeReturn<T>; 