export const ARRAY = "array";
export const BIT = "bit";
export const BITS = "bits";
export const BYTE = "byte";
export const BYTES = "bytes";
export const EMPTY = "";
export const EXPONENT = "exponent";
export const FUNCTION = "function";
export const IEC = "iec";
export const INVALID_NUMBER = "Invalid number";
export const INVALID_ROUND = "Invalid rounding method";
export const JEDEC = "jedec";
export const OBJECT = "object";
export const PERIOD = ".";
export const ROUND = "round";
export const S = "s";
export const SI = "si";
export const SI_KBIT = "kbit";
export const SI_KBYTE = "kB";
export const SPACE = " ";
export const STRING = "string";
export const ZERO = "0";
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
