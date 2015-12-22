// CommonJS, AMD, script tag
if (typeof exports !== "undefined") {
	module.exports = filesize;
} else if (typeof define === "function" && define.amd) {
	define(() => {
		return filesize;
	});
} else {
	global.filesize = filesize;
}}(typeof window !== "undefined" ? window : global));
