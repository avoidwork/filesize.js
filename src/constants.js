// Error Messages
export const INVALID_NUMBER = "Invalid number";
export const INVALID_ROUND = "Invalid rounding method";

// Standard Types
export const IEC = "iec";
export const JEDEC = "jedec";
export const SI = "si";

// Unit Types
export const BIT = "bit";
export const BITS = "bits";
export const BYTE = "byte";
export const BYTES = "bytes";
export const SI_KBIT = "kbit";
export const SI_KBYTE = "kB";

// Output Format Types
export const ARRAY = "array";
export const FUNCTION = "function";
export const OBJECT = "object";
export const STRING = "string";

// Processing Constants
export const EXPONENT = "exponent";
export const ROUND = "round";

// Special Characters and Values
export const E = "e";
export const EMPTY = "";
export const PERIOD = ".";
export const S = "s";
export const SPACE = " ";
export const ZERO = "0";

// Data Structures
export const STRINGS = {
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
export const BINARY_POWERS = [
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

export const DECIMAL_POWERS = [
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
export const LOG_2_1024 = Math.log(1024);
export const LOG_10_1000 = Math.log(1000);
