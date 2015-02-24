// CommonJS, AMD, script tag
if ( typeof exports !== "undefined" ) {
	module.exports = filesize;
}
else if ( typeof define === "function" ) {
	define( () => {
		return filesize;
	} );
}
else {
	global.filesize = filesize;
}
}( typeof global !== "undefined" ? global : window );
