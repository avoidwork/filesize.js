(function (global) {
const b = /^(b|B)$/;
const symbol = {
	bits: ["b", "Kb", "Mb", "Gb", "Tb", "Pb", "Eb", "Zb", "Yb"],
	"bytes-jedec": ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
	"bytes-iec": ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"]
};
