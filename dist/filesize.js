/**
 * filesize
 *
 * @copyright 2025 Jason Mulligan <jason.mulligan@avoidwork.com>
 * @license BSD-3-Clause
 * @version 11.0.8
 */
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
const LOG_10_1000 = Math.log(1000);/**
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

	// Optimized base & standard synchronization with early returns
	let isDecimal, ceil, actualStandard;
	if (standard === SI) {
		isDecimal = true;
		ceil = 1000;
		actualStandard = JEDEC;
	} else if (standard === IEC) {
		isDecimal = false;
		ceil = 1024;
		actualStandard = IEC;
	} else if (standard === JEDEC) {
		isDecimal = false; // JEDEC uses binary (1024) by default
		ceil = 1024;
		actualStandard = JEDEC;
	} else if (base === 2) {
		isDecimal = false;
		ceil = 1024;
		actualStandard = IEC;
	} else {
		isDecimal = true;
		ceil = 1000;
		actualStandard = JEDEC;
	}

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
		result[0] = precision > 0 ? (0).toPrecision(precision) : 0;
		u = result[1] = STRINGS.symbol[actualStandard][bits ? BITS : BYTES][0];
		
		if (output === EXPONENT) {
			return 0;
		}
		
		// Skip most processing for zero case
		if (symbols[result[1]]) {
			result[1] = symbols[result[1]];
		}
		
		if (full) {
			result[1] = fullforms[0] || STRINGS.fullform[actualStandard][0] + (bits ? BIT : BYTE);
		}
		
		return output === ARRAY ? result : output === OBJECT ? {
			value: result[0],
			symbol: result[1],
			exponent: 0,
			unit: u
		} : result.join(spacer);
	}

	// Optimized exponent calculation using pre-computed log values
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

	// Use pre-computed lookup tables (e is always <= 8, arrays have 9 elements)
	let d;
	if (isDecimal) {
		d = DECIMAL_POWERS[e];
	} else {
		d = BINARY_POWERS[e];
	}
	
	val = num / d;

	if (bits) {
		val = val * 8;

		if (val >= ceil && e < 8) {
			val = val / ceil;
			e++;
		}
	}

	// Optimize rounding calculation
	const p = e > 0 && round > 0 ? Math.pow(10, round) : 1;
	result[0] = p === 1 ? roundingFunc(val) : roundingFunc(val * p) / p;

	if (result[0] === ceil && e < 8 && exponent === -1) {
		result[0] = 1;
		e++;
	}

	// Setting optional precision
	if (precision > 0) {
		result[0] = result[0].toPrecision(precision);

		if (result[0].includes(E) && e < 8) {
			e++;
			// Recalculate with new exponent (e is always <= 8)
			if (isDecimal) {
				d = DECIMAL_POWERS[e];
			} else {
				d = BINARY_POWERS[e];
			}
			val = num / d;
			result[0] = (p === 1 ? roundingFunc(val) : roundingFunc(val * p) / p).toPrecision(precision);
		}
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

	// Optimized locale/separator handling
	if (locale === true) {
		result[0] = result[0].toLocaleString();
	} else if (locale.length > 0) {
		result[0] = result[0].toLocaleString(locale, localeOptions);
	} else if (separator.length > 0) {
		result[0] = result[0].toString().replace(PERIOD, separator);
	}

	if (pad && round > 0) {
		const resultStr = result[0].toString(),
			x = separator || ((resultStr.match(/(\D)/g) || []).pop() || PERIOD),
			tmp = resultStr.split(x),
			s = tmp[1] || EMPTY,
			l = s.length,
			n = round - l;

		result[0] = `${tmp[0]}${x}${s.padEnd(l + n, ZERO)}`;
	}

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
}export{filesize,partial};