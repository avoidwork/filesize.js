/**
 * filesize
 *
 * @copyright 2025 Jason Mulligan <jason.mulligan@avoidwork.com>
 * @license BSD-3-Clause
 * @version 11.0.11
 */
(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?f(exports):typeof define==='function'&&define.amd?define(['exports'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,f(g.filesize={}));})(this,(function(exports){'use strict';// Error Messages
const INVALID_NUMBER = "Invalid number";
const INVALID_ROUND = "Invalid rounding method";

// Standard Types
const IEC = "iec";
const JEDEC = "jedec";
const SI = "si";

// Unit Types
const BIT = "bit";
const BITS = "bits";
const BYTE = "byte";
const BYTES = "bytes";
const SI_KBIT = "kbit";
const SI_KBYTE = "kB";

// Output Format Types
const ARRAY = "array";
const FUNCTION = "function";
const OBJECT = "object";
const STRING = "string";

// Processing Constants
const EXPONENT = "exponent";
const ROUND = "round";

// Special Characters and Values
const E = "e";
const EMPTY = "";
const PERIOD = ".";
const S = "s";
const SPACE = " ";
const ZERO = "0";

// Data Structures
const STRINGS = {
	symbol: {
		iec: {
			bits: ["bit", "Kibit", "Mibit", "Gibit", "Tibit", "Pibit", "Eibit", "Zibit", "Yibit"],
			bytes: ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"]
		},
		jedec: {
			bits: ["bit", "Kbit", "Mbit", "Gbit", "Tbit", "Pbit", "Ebit", "Zbit", "Ybit"],
			bytes: ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
		}
	},
	fullform: {
		iec: ["", "kibi", "mebi", "gibi", "tebi", "pebi", "exbi", "zebi", "yobi"],
		jedec: ["", "kilo", "mega", "giga", "tera", "peta", "exa", "zetta", "yotta"]
	}
};

// Pre-computed lookup tables for performance optimization
const BINARY_POWERS = [
	1, // 2^0
	1024, // 2^10
	1048576, // 2^20
	1073741824, // 2^30
	1099511627776, // 2^40
	1125899906842624, // 2^50
	1152921504606846976, // 2^60
	1180591620717411303424, // 2^70
	1208925819614629174706176 // 2^80
];

const DECIMAL_POWERS = [
	1, // 10^0
	1000, // 10^3
	1000000, // 10^6
	1000000000, // 10^9
	1000000000000, // 10^12
	1000000000000000, // 10^15
	1000000000000000000, // 10^18
	1000000000000000000000, // 10^21
	1000000000000000000000000 // 10^24
];

// Pre-computed log values for faster exponent calculation
const LOG_2_1024 = Math.log(1024);
const LOG_10_1000 = Math.log(1000);// Cached configuration lookup for better performance
const STANDARD_CONFIGS = {
	[SI]: {isDecimal: true, ceil: 1000, actualStandard: JEDEC},
	[IEC]: {isDecimal: false, ceil: 1024, actualStandard: IEC},
	[JEDEC]: {isDecimal: false, ceil: 1024, actualStandard: JEDEC}
};

/**
 * Optimized base configuration lookup
 * @param {string} standard - Standard type
 * @param {number} base - Base number
 * @returns {Object} Configuration object
 */
function getBaseConfiguration (standard, base) {
	// Use cached lookup table for better performance
	if (STANDARD_CONFIGS[standard]) {
		return STANDARD_CONFIGS[standard];
	}

	// Base override
	if (base === 2) {
		return {isDecimal: false, ceil: 1024, actualStandard: IEC};
	}

	// Default
	return {isDecimal: true, ceil: 1000, actualStandard: JEDEC};
}

/**
 * Optimized zero value handling
 * @param {number} precision - Precision value
 * @param {string} actualStandard - Standard to use
 * @param {boolean} bits - Whether to use bits
 * @param {Object} symbols - Custom symbols
 * @param {boolean} full - Whether to use full form
 * @param {Array} fullforms - Custom full forms
 * @param {string} output - Output format
 * @param {string} spacer - Spacer character
 * @returns {string|Array|Object|number} Formatted result
 */
function handleZeroValue (precision, actualStandard, bits, symbols, full, fullforms, output, spacer) {
	const result = [];
	result[0] = precision > 0 ? (0).toPrecision(precision) : 0;
	const u = result[1] = STRINGS.symbol[actualStandard][bits ? BITS : BYTES][0];

	if (output === EXPONENT) {
		return 0;
	}

	// Apply symbol customization
	if (symbols[result[1]]) {
		result[1] = symbols[result[1]];
	}

	// Apply full form
	if (full) {
		result[1] = fullforms[0] || STRINGS.fullform[actualStandard][0] + (bits ? BIT : BYTE);
	}

	// Return in requested format
	return output === ARRAY ? result : output === OBJECT ? {
		value: result[0],
		symbol: result[1],
		exponent: 0,
		unit: u
	} : result.join(spacer);
}

/**
 * Optimized value calculation with bits handling
 * @param {number} num - Input number
 * @param {number} e - Exponent
 * @param {boolean} isDecimal - Whether to use decimal powers
 * @param {boolean} bits - Whether to calculate bits
 * @param {number} ceil - Ceiling value for auto-increment
 * @returns {Object} Object with val and e properties
 */
function calculateOptimizedValue (num, e, isDecimal, bits, ceil) {
	const d = isDecimal ? DECIMAL_POWERS[e] : BINARY_POWERS[e];
	let result = num / d;

	if (bits) {
		result *= 8;
		// Handle auto-increment for bits
		if (result >= ceil && e < 8) {
			result /= ceil;
			e++;
		}
	}

	return {result, e};
}

/**
 * Optimized precision handling with scientific notation correction
 * @param {number} value - Current value
 * @param {number} precision - Precision to apply
 * @param {number} e - Current exponent
 * @param {number} num - Original number
 * @param {boolean} isDecimal - Whether using decimal base
 * @param {boolean} bits - Whether calculating bits
 * @param {number} ceil - Ceiling value
 * @param {Function} roundingFunc - Rounding function
 * @param {number} round - Round value
 * @returns {Object} Object with value and e properties
 */
function applyPrecisionHandling (value, precision, e, num, isDecimal, bits, ceil, roundingFunc, round) {
	let result = value.toPrecision(precision);

	// Handle scientific notation by recalculating with incremented exponent
	if (result.includes(E) && e < 8) {
		e++;
		const {result: valueResult} = calculateOptimizedValue(num, e, isDecimal, bits, ceil);
		const p = round > 0 ? Math.pow(10, round) : 1;
		result = (p === 1 ? roundingFunc(valueResult) : roundingFunc(valueResult * p) / p).toPrecision(precision);
	}

	return {value: result, e};
}

/**
 * Optimized number formatting with locale, separator, and padding
 * @param {number|string} value - Value to format
 * @param {string|boolean} locale - Locale setting
 * @param {Object} localeOptions - Locale options
 * @param {string} separator - Custom separator
 * @param {boolean} pad - Whether to pad
 * @param {number} round - Round value
 * @returns {string|number} Formatted value
 */
function applyNumberFormatting (value, locale, localeOptions, separator, pad, round) {
	let result = value;

	// Apply locale formatting
	if (locale === true) {
		result = result.toLocaleString();
	} else if (locale.length > 0) {
		result = result.toLocaleString(locale, localeOptions);
	} else if (separator.length > 0) {
		result = result.toString().replace(PERIOD, separator);
	}

	// Apply padding
	if (pad && round > 0) {
		const resultStr = result.toString();
		const x = separator || ((resultStr.match(/(\D)/g) || []).pop() || PERIOD);
		const tmp = resultStr.split(x);
		const s = tmp[1] || EMPTY;
		const l = s.length;
		const n = round - l;

		result = `${tmp[0]}${x}${s.padEnd(l + n, ZERO)}`;
	}

	return result;
}/**
 * Converts a file size in bytes to a human-readable string with appropriate units
 * @param {number|string|bigint} arg - The file size in bytes to convert
 * @param {Object} [options={}] - Configuration options for formatting
 * @param {boolean} [options.bits=false] - If true, calculates bits instead of bytes
 * @param {boolean} [options.pad=false] - If true, pads decimal places to match round parameter
 * @param {number} [options.base=-1] - Number base (2 for binary, 10 for decimal, -1 for auto)
 * @param {number} [options.round=2] - Number of decimal places to round to
 * @param {string|boolean} [options.locale=""] - Locale for number formatting, true for system locale
 * @param {Object} [options.localeOptions={}] - Additional options for locale formatting
 * @param {string} [options.separator=""] - Custom decimal separator
 * @param {string} [options.spacer=" "] - String to separate value and unit
 * @param {Object} [options.symbols={}] - Custom unit symbols
 * @param {string} [options.standard=""] - Unit standard to use (SI, IEC, JEDEC)
 * @param {string} [options.output="string"] - Output format: "string", "array", "object", or "exponent"
 * @param {boolean} [options.fullform=false] - If true, uses full unit names instead of abbreviations
 * @param {Array} [options.fullforms=[]] - Custom full unit names
 * @param {number} [options.exponent=-1] - Force specific exponent (-1 for auto)
 * @param {string} [options.roundingMethod="round"] - Math rounding method to use
 * @param {number} [options.precision=0] - Number of significant digits (0 for auto)
 * @returns {string|Array|Object|number} Formatted file size based on output option
 * @throws {TypeError} When arg is not a valid number or roundingMethod is invalid
 * @example
 * filesize(1024) // "1 KB"
 * filesize(1024, {bits: true}) // "8 Kb"
 * filesize(1024, {output: "object"}) // {value: 1, symbol: "KB", exponent: 1, unit: "KB"}
 */
function filesize (arg, {
	bits = false,
	pad = false,
	base = -1,
	round = 2,
	locale = EMPTY,
	localeOptions = {},
	separator = EMPTY,
	spacer = SPACE,
	symbols = {},
	standard = EMPTY,
	output = STRING,
	fullform = false,
	fullforms = [],
	exponent = -1,
	roundingMethod = ROUND,
	precision = 0
} = {}) {
	let e = exponent,
		num = Number(arg),
		result = [],
		val = 0,
		u = EMPTY;

	// Optimized base & standard configuration lookup
	const {isDecimal, ceil, actualStandard} = getBaseConfiguration(standard, base);

	const full = fullform === true,
		neg = num < 0,
		roundingFunc = Math[roundingMethod];

	if (typeof arg !== "bigint" && isNaN(arg)) {
		throw new TypeError(INVALID_NUMBER);
	}

	if (typeof roundingFunc !== FUNCTION) {
		throw new TypeError(INVALID_ROUND);
	}

	// Flipping a negative number to determine the size
	if (neg) {
		num = -num;
	}

	// Fast path for zero
	if (num === 0) {
		return handleZeroValue(precision, actualStandard, bits, symbols, full, fullforms, output, spacer);
	}

	// Optimized exponent calculation using pre-computed log values
	if (e === -1 || isNaN(e)) {
		e = isDecimal ? Math.floor(Math.log(num) / LOG_10_1000) : Math.floor(Math.log(num) / LOG_2_1024);
		if (e < 0) {
			e = 0;
		}
	}

	// Exceeding supported length, time to reduce & multiply
	if (e > 8) {
		if (precision > 0) {
			precision += 8 - e;
		}
		e = 8;
	}

	if (output === EXPONENT) {
		return e;
	}

	// Calculate value with optimized lookup and bits handling
	const {result: valueResult, e: valueExponent} = calculateOptimizedValue(num, e, isDecimal, bits, ceil);
	val = valueResult;
	e = valueExponent;

	// Optimize rounding calculation
	const p = e > 0 && round > 0 ? Math.pow(10, round) : 1;
	result[0] = p === 1 ? roundingFunc(val) : roundingFunc(val * p) / p;

	if (result[0] === ceil && e < 8 && exponent === -1) {
		result[0] = 1;
		e++;
	}

	// Apply precision handling
	if (precision > 0) {
		const precisionResult = applyPrecisionHandling(result[0], precision, e, num, isDecimal, bits, ceil, roundingFunc, round);
		result[0] = precisionResult.value;
		e = precisionResult.e;
	}

	// Cache symbol lookup
	const symbolTable = STRINGS.symbol[actualStandard][bits ? BITS : BYTES];
	u = result[1] = (isDecimal && e === 1) ? (bits ? SI_KBIT : SI_KBYTE) : symbolTable[e];

	// Decorating a 'diff'
	if (neg) {
		result[0] = -result[0];
	}

	// Applying custom symbol
	if (symbols[result[1]]) {
		result[1] = symbols[result[1]];
	}

	// Apply locale, separator, and padding formatting
	result[0] = applyNumberFormatting(result[0], locale, localeOptions, separator, pad, round);

	if (full) {
		result[1] = fullforms[e] || STRINGS.fullform[actualStandard][e] + (bits ? BIT : BYTE) + (result[0] === 1 ? EMPTY : S);
	}

	// Optimized return logic
	if (output === ARRAY) {
		return result;
	}

	if (output === OBJECT) {
		return {
			value: result[0],
			symbol: result[1],
			exponent: e,
			unit: u
		};
	}

	return spacer === SPACE ? `${result[0]} ${result[1]}` : result.join(spacer);
}

/**
 * Creates a partially applied version of filesize with preset options
 * @param {Object} [options={}] - Default options to apply to the returned function
 * @param {boolean} [options.bits=false] - If true, calculates bits instead of bytes
 * @param {boolean} [options.pad=false] - If true, pads decimal places to match round parameter
 * @param {number} [options.base=-1] - Number base (2 for binary, 10 for decimal, -1 for auto)
 * @param {number} [options.round=2] - Number of decimal places to round to
 * @param {string|boolean} [options.locale=""] - Locale for number formatting, true for system locale
 * @param {Object} [options.localeOptions={}] - Additional options for locale formatting
 * @param {string} [options.separator=""] - Custom decimal separator
 * @param {string} [options.spacer=" "] - String to separate value and unit
 * @param {Object} [options.symbols={}] - Custom unit symbols
 * @param {string} [options.standard=""] - Unit standard to use (SI, IEC, JEDEC)
 * @param {string} [options.output="string"] - Output format: "string", "array", "object", or "exponent"
 * @param {boolean} [options.fullform=false] - If true, uses full unit names instead of abbreviations
 * @param {Array} [options.fullforms=[]] - Custom full unit names
 * @param {number} [options.exponent=-1] - Force specific exponent (-1 for auto)
 * @param {string} [options.roundingMethod="round"] - Math rounding method to use
 * @param {number} [options.precision=0] - Number of significant digits (0 for auto)
 * @returns {Function} A function that takes a file size and returns formatted output
 * @example
 * const formatBytes = partial({round: 1, standard: "IEC"});
 * formatBytes(1024) // "1.0 KiB"
 * formatBytes(2048) // "2.0 KiB"
 */
// Partial application for functional programming
function partial ({
	bits = false,
	pad = false,
	base = -1,
	round = 2,
	locale = EMPTY,
	localeOptions = {},
	separator = EMPTY,
	spacer = SPACE,
	symbols = {},
	standard = EMPTY,
	output = STRING,
	fullform = false,
	fullforms = [],
	exponent = -1,
	roundingMethod = ROUND,
	precision = 0
} = {}) {
	return arg => filesize(arg, {
		bits,
		pad,
		base,
		round,
		locale,
		localeOptions,
		separator,
		spacer,
		symbols,
		standard,
		output,
		fullform,
		fullforms,
		exponent,
		roundingMethod,
		precision
	});
}exports.filesize=filesize;exports.partial=partial;}));