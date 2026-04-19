import {
	EMPTY,
	EXPONENT,
	FUNCTION,
	INVALID_NUMBER,
	INVALID_ROUND,
	ROUND,
	SPACE,
	STRING,
} from "./constants.js";
import {
	applyPrecisionHandling,
	applyRounding,
	calculateExponent,
	calculateOptimizedValue,
	decorateResult,
	formatOutput,
	getBaseConfiguration,
	handleZeroValue,
	resolveSymbol,
} from "./helpers.js";

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
export function filesize(
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
		num = Number(arg),
		result = [],
		val = 0,
		u = EMPTY;

	const { isDecimal, ceil, actualStandard } = getBaseConfiguration(standard, base);

	const full = fullform === true,
		neg = num < 0,
		roundingFunc = Math[roundingMethod];

	if (typeof arg !== "bigint" && isNaN(arg)) {
		throw new TypeError(INVALID_NUMBER);
	}

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
export function partial({
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
} = {}) {
	return (arg) =>
		filesize(arg, {
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
			precision,
		});
}
