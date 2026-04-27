/**
 * filesize
 *
 * @copyright 2026 Jason Mulligan <jason.mulligan@avoidwork.com>
 * @license BSD-3-Clause
 * @version 11.0.17
 */
'use strict';

// Error Messages
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
			bytes: ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"],
		},
		jedec: {
			bits: ["bit", "Kbit", "Mbit", "Gbit", "Tbit", "Pbit", "Ebit", "Zbit", "Ybit"],
			bytes: ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
		},
	},
	fullform: {
		iec: ["", "kibi", "mebi", "gibi", "tebi", "pebi", "exbi", "zebi", "yobi"],
		jedec: ["", "kilo", "mega", "giga", "tera", "peta", "exa", "zetta", "yotta"],
	},
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
	1208925819614629174706176, // 2^80
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
	1000000000000000000000000, // 10^24
];

// Pre-computed log values for faster exponent calculation
const LOG_2_1024 = Math.log(1024);
const LOG_10_1000 = Math.log(1000);

// Cached configuration lookup for better performance
const STANDARD_CONFIGS = {
	[SI]: { isDecimal: true, ceil: 1000, actualStandard: JEDEC },
	[IEC]: { isDecimal: false, ceil: 1024, actualStandard: IEC },
	[JEDEC]: { isDecimal: false, ceil: 1024, actualStandard: JEDEC },
};

/**
 * Optimized base configuration lookup
 * @param {string} standard - Standard type
 * @param {number} base - Base number
 * @returns {Object} Configuration object
 */
function getBaseConfiguration(standard, base) {
	// Use cached lookup table for better performance
	if (STANDARD_CONFIGS[standard]) {
		return STANDARD_CONFIGS[standard];
	}

	// Base override
	if (base === 2) {
		return { isDecimal: false, ceil: 1024, actualStandard: IEC };
	}

	// Default
	return { isDecimal: true, ceil: 1000, actualStandard: JEDEC };
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
 * @param {string} [symbol] - Symbol to use (defaults based on bits/standard)
 * @returns {string|Array|Object|number} Formatted result
 */
function handleZeroValue(
	precision,
	actualStandard,
	bits,
	symbols,
	full,
	fullforms,
	output,
	spacer,
	symbol,
) {
	let value;
	if (precision > 0) {
		value = (0).toPrecision(precision);
	} else {
		value = 0;
	}

	if (output === EXPONENT) {
		return 0;
	}

	// Set default symbol if not provided
	if (!symbol) {
		symbol = bits
			? STRINGS.symbol[actualStandard].bits[0]
			: STRINGS.symbol[actualStandard].bytes[0];
	}

	// Apply symbol customization
	if (symbols[symbol]) {
		symbol = symbols[symbol];
	}

	// Apply full form
	if (full) {
		if (fullforms[0]) {
			symbol = fullforms[0];
		} else {
			symbol = STRINGS.fullform[actualStandard][0];
			if (bits) {
				symbol += BIT;
			} else {
				symbol += BYTE;
			}
		}
	}

	// Return in requested format
	if (output === ARRAY) {
		return [value, symbol];
	}

	if (output === OBJECT) {
		return { value, symbol, exponent: 0, unit: symbol };
	}

	return value + spacer + symbol;
}

/**
 * Optimized value calculation with bits handling
 * @param {number} num - Input number
 * @param {number} e - Exponent
 * @param {boolean} isDecimal - Whether to use decimal powers
 * @param {boolean} bits - Whether to calculate bits
 * @param {number} ceil - Ceiling value for auto-increment
 * @param {boolean} autoExponent - Whether exponent is auto (-1 or NaN)
 * @returns {Object} Object with result and e properties
 */
function calculateOptimizedValue(num, e, isDecimal, bits, ceil, autoExponent = true) {
	let d;
	if (isDecimal) {
		d = DECIMAL_POWERS[e];
	} else {
		d = BINARY_POWERS[e];
	}
	let result = num / d;

	if (bits) {
		result *= 8;
		// Handle auto-increment for bits (only when exponent is auto)
		if (autoExponent && result >= ceil && e < 8) {
			result /= ceil;
			e++;
		}
	}

	return { result, e };
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
 * @param {number} exponent - Forced exponent (-1 for auto)
 * @returns {Object} Object with value and e properties
 */
function applyPrecisionHandling(
	value,
	precision,
	e,
	num,
	isDecimal,
	bits,
	ceil,
	roundingFunc,
	round,
	exponent,
) {
	if (typeof value === "string") {
		value = parseFloat(value);
	}

	let result = value.toPrecision(precision);

	const autoExponent = exponent === -1 || isNaN(exponent);

	// Handle scientific notation by recalculating with incremented exponent
	if (result.includes(E) && e < 8 && autoExponent) {
		e++;
		const { result: valueResult } = calculateOptimizedValue(num, e, isDecimal, bits, ceil);
		let p;
		if (round > 0) {
			p = Math.pow(10, round);
		} else {
			p = 1;
		}
		let computed;
		if (p === 1) {
			computed = roundingFunc(valueResult);
		} else {
			computed = roundingFunc(valueResult * p) / p;
		}
		result = computed.toPrecision(precision);
	}

	return { value: result, e };
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
function applyNumberFormatting(value, locale, localeOptions, separator, pad, round) {
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
		const x = separator || (resultStr.slice(1).match(/[.,]/g) || []).pop() || PERIOD;
		const tmp = resultStr.split(x);
		const s = tmp[1] || EMPTY;

		const l = s.length;
		const n = round - l;

		result = `${tmp[0]}${x}${s.padEnd(l + n, ZERO)}`;
	}

	return result;
}

/**
 * Calculates exponent from the input value using pre-computed log values and clamps to supported range
 * Also adjusts precision when exponent exceeds the lookup table bounds
 * @param {number} num - Input file size in bytes
 * @param {number} e - Current exponent value
 * @param {number} exponent - Original user-provided exponent option (-1 for auto)
 * @param {boolean} isDecimal - Whether to use decimal (SI) base
 * @param {number} precision - Current precision value (modified when e > 8)
 * @returns {Object} Object with computed e value and possibly adjusted precision
 */
function calculateExponent(num, e, exponent, isDecimal, precision) {
	if (e === -1 || isNaN(e)) {
		if (isDecimal) {
			e = Math.floor(Math.log(num) / LOG_10_1000);
		} else {
			e = Math.floor(Math.log(num) / LOG_2_1024);
		}
		if (e < 0) {
			e = 0;
		}
	}

	if (e > 8) {
		if (precision > 0) {
			precision += 8 - e;
		}
		return { e: 8, precision };
	}

	return { e, precision };
}

/**
 * Applies rounding to the raw calculated value and handles auto-increment ceiling
 * @param {number} val - Raw value before rounding
 * @param {number} ceil - Ceiling threshold (1000 for SI, 1024 for IEC)
 * @param {number} e - Current exponent value
 * @param {number} round - Number of decimal places
 * @param {Function} roundingFunc - Rounding method (Math.round, Math.floor, Math.ceil)
 * @param {boolean} autoExponent - Whether exponent is auto-calculated (-1 or NaN)
 * @returns {Object} Object with rounded value and possibly incremented exponent
 */
function applyRounding(val, ceil, e, round, roundingFunc, autoExponent) {
	let p;
	if (e > 0 && round > 0) {
		p = Math.pow(10, round);
	} else {
		p = 1;
	}
	let r;
	if (p === 1) {
		r = roundingFunc(val);
	} else {
		r = roundingFunc(val * p) / p;
	}

	if (r === ceil && e < 8 && autoExponent) {
		r = 1;
		e++;
	}

	return { value: r, e };
}

/**
 * Resolves the unit symbol for the given standard, bits mode, and exponent
 * Handles SI standard special case where exponent 1 always uses "kB" or "kbit"
 * @param {string} actualStandard - The resolved standard (iec, jedec)
 * @param {boolean} bits - Whether formatting bit values
 * @param {number} e - Current exponent index
 * @param {boolean} isDecimal - Whether using decimal (SI) base
 * @returns {string} The resolved unit symbol string
 */
function resolveSymbol(actualStandard, bits, e, isDecimal) {
	const symbolTable = STRINGS.symbol[actualStandard][bits ? BITS : BYTES];
	let result;
	if (isDecimal && e === 1) {
		if (bits) {
			result = SI_KBIT;
		} else {
			result = SI_KBYTE;
		}
	} else {
		result = symbolTable[e];
	}
	return result;
}

/**
 * Decorates the result: applies negation, custom symbols, number formatting, and full form names
 * Mutates the result array in-place for both value (index 0) and symbol (index 1)
 * @param {Array} result - Result array with numeric value at [0] and string symbol at [1]
 * @param {boolean} neg - Whether the original input was negative
 * @param {Object} symbols - Custom symbol override map
 * @param {string|boolean} locale - Locale string for formatting
 * @param {Object} localeOptions - Additional locale formatting options
 * @param {string} separator - Custom decimal separator
 * @param {boolean} pad - Whether zero-pad decimals
 * @param {number} round - Target decimal count for padding
 * @param {boolean} full - Whether to use full unit names
 * @param {Array} fullforms - Custom full unit name overrides
 * @param {string} actualStandard - Unit standard for full form lookup
 * @param {number} e - Current exponent index
 * @param {boolean} bits - Whether formatting bit values
 * @returns {void} Mutates result array in place
 */
function decorateResult(
	result,
	neg,
	symbols,
	locale,
	localeOptions,
	separator,
	pad,
	round,
	full,
	fullforms,
	actualStandard,
	e,
	bits,
) {
	if (neg) {
		result[0] = -result[0];
	}

	if (symbols[result[1]]) {
		result[1] = symbols[result[1]];
	}

	result[0] = applyNumberFormatting(result[0], locale, localeOptions, separator, pad, round);

	if (full) {
		let unit;
		if (bits) {
			unit = BIT;
		} else {
			unit = BYTE;
		}
		let val;
		if (typeof result[0] === "string") {
			val = parseFloat(result[0]);
		} else {
			val = result[0];
		}
		// Determine singular/plural suffix
		let suffix;
		if (val === 1) {
			suffix = EMPTY;
		} else {
			suffix = S;
		}
		// Determine symbol — custom fullforms are the complete name, defaults get unit+suffix
		if (fullforms[e]) {
			result[1] = fullforms[e];
		} else {
			result[1] = STRINGS.fullform[actualStandard][e] + unit + suffix;
		}
	}
}

/**
 * Formats the computed result array into the requested output type
 * @param {Array} result - Result array with formatted value at [0] and symbol at [1]
 * @param {number} e - Current exponent
 * @param {string} u - Original resolved symbol (before custom override)
 * @param {string} output - Output type (ARRAY, OBJECT, STRING)
 * @param {string} spacer - String separator between value and unit
 * @returns {string|Array|Object|number} Formatted result in requested type
 */
function formatOutput(result, e, u, output, spacer) {
	if (output === ARRAY) {
		return result;
	}

	if (output === OBJECT) {
		return {
			value: result[0],
			symbol: result[1],
			exponent: e,
			unit: u,
		};
	}

	let formatted;
	if (spacer === SPACE) {
		formatted = `${result[0]} ${result[1]}`;
	} else {
		formatted = result.join(spacer);
	}
	return formatted;
}

/**
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
 * filesize(1024) // "1.02 kB"
 * filesize(1024, {bits: true}) // "8.19 kbit"
 * filesize(1024, {output: "object"}) // {value: 1.02, symbol: "kB", exponent: 1, unit: "kB"}
 */
function filesize(
	arg,
	{
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
		precision = 0,
	} = {},
) {
	let e = exponent,
		num,
		result = [],
		val = 0,
		u = EMPTY;

	if (typeof arg === "bigint") {
		num = Number(arg);
	} else {
		num = Number(arg);

		if (isNaN(arg)) {
			throw new TypeError(INVALID_NUMBER);
		}

		if (!isFinite(num)) {
			throw new TypeError(INVALID_NUMBER);
		}
	}

	const { isDecimal, ceil, actualStandard } = getBaseConfiguration(standard, base);

	const full = fullform === true,
		neg = num < 0,
		roundingFunc = Math[roundingMethod];

	if (typeof roundingFunc !== FUNCTION) {
		throw new TypeError(INVALID_ROUND);
	}

	if (neg) {
		num = -num;
	}

	if (num === 0) {
		return handleZeroValue(
			precision,
			actualStandard,
			bits,
			symbols,
			full,
			fullforms,
			output,
			spacer,
		);
	}

	// Exponent calculation + clamp + precision adjustment
	const { e: calculatedE, precision: precisionAdjusted } = calculateExponent(
		num,
		e,
		exponent,
		isDecimal,
		precision,
	);
	e = calculatedE;
	const autoExponent = exponent === -1 || isNaN(exponent);

	if (output === EXPONENT) {
		return e;
	}

	const { result: valueResult, e: valueExponent } = calculateOptimizedValue(
		num,
		e,
		isDecimal,
		bits,
		ceil,
		autoExponent,
	);
	val = valueResult;
	e = valueExponent;

	// Rounding + auto-increment ceiling
	const rounded = applyRounding(val, ceil, e, round, roundingFunc, autoExponent);
	result[0] = rounded.value;
	e = rounded.e;

	// Precision handling
	if (precisionAdjusted > 0) {
		const precisionResult = applyPrecisionHandling(
			result[0],
			precisionAdjusted,
			e,
			num,
			isDecimal,
			bits,
			ceil,
			roundingFunc,
			round,
			exponent,
		);
		result[0] = precisionResult.value;
		e = precisionResult.e;
	}

	u = resolveSymbol(actualStandard, bits, e, isDecimal);
	result[1] = u;

	decorateResult(
		result,
		neg,
		symbols,
		locale,
		localeOptions,
		separator,
		pad,
		round,
		full,
		fullforms,
		actualStandard,
		e,
		bits,
	);

	return formatOutput(result, e, u, output, spacer);
}

/**
 * Creates a partially applied version of filesize with preset options
 * @param {Object} [options={}] - Configuration options (same as filesize)
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
 * const formatBytes = partial({round: 1, standard: "iec"});
 * formatBytes(1024) // "1 KiB"
 * formatBytes(2048) // "2 KiB"
 * formatBytes(1536) // "1.5 KiB"
 */
function partial({
	bits = false,
	pad = false,
	base = -1,
	round = 2,
	locale = EMPTY,
	separator = EMPTY,
	spacer = SPACE,
	standard = EMPTY,
	output = STRING,
	fullform = false,
	exponent = -1,
	roundingMethod = ROUND,
	precision = 0,
	localeOptions = {},
	symbols = {},
	fullforms = [],
} = {}) {
	const cloned = {
		localeOptions: JSON.parse(JSON.stringify(localeOptions)),
		symbols: JSON.parse(JSON.stringify(symbols)),
		fullforms: JSON.parse(JSON.stringify(fullforms)),
	};

	return (arg) =>
		filesize(arg, {
			bits,
			pad,
			base,
			round,
			locale,
			localeOptions: cloned.localeOptions,
			separator,
			spacer,
			symbols: cloned.symbols,
			standard,
			output,
			fullform,
			fullforms: cloned.fullforms,
			exponent,
			roundingMethod,
			precision,
		});
}

exports.filesize = filesize;
exports.partial = partial;
