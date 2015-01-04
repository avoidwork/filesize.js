// CommonJS, AMD, script tag
if ( typeof exports !== "undefined" ) {
	module.exports = filesize;
}
else if ( typeof define === "function" ) {
	define( function () {
		return filesize;
	} );
}
else {
	global.filesize = filesize;
}
} )( this );
