(function (global) {
	const b = /^(b|B)$/,
		symbol = {
			iec: {
				bits: ["b", "Kib", "Mib", "Gib", "Tib", "Pib", "Eib", "Zib", "Yib"],
				bytes: ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"]
			},
			jedec: {
				bits: ["b", "Kb", "Mb", "Gb", "Tb", "Pb", "Eb", "Zb", "Yb"],
				bytes: ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
			}
		},
		fullform = {
			iec: ["", "kibi", "mebi", "gibi", "tebi", "pebi", "exbi", "zebi", "yobi"],
			jedec: ["", "kilo", "mega", "giga", "tera", "peta", "exa", "zetta", "yotta"]
		};
