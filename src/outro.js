	// CommonJS, AMD, script tag
	if (typeof exports !== "undefined") {
		module.exports = filesize;
	} else if (typeof define === "function" && define.amd !== void 0) {
		define(() => filesize);
	} else {
		global.filesize = filesize;
	}
}(typeof window !== "undefined" ? window : global));
