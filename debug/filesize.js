/**
 * Copyright (c) 2012, Jason Mulligan <jason.mulligan@avoidwork.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of filesize.js nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL JASON MULLIGAN BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * filesize.js
 *
 * Transforms a file size Number into a readable String
 * 
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @module filesize
 * @version 1.6.4
 * 
 * @param  {Mixed}   arg   String, Int or Float to transform
 * @param  {Number}  pos   [Optional] Position to round to, defaults to 2 if short is ommitted
 * @param  {Boolean} short [Optional] Shorthand output, similar to "ls -lh", overrides pos to 1
 * @return {String} Readable file size String
 */
(function (global) {
	"use strict";

	var filesize = function (arg) {
		var pos, short, num, sizes, size, result, regex, suffix, i, n, x, z;

		if (typeof arguments[2] !== "undefined") {
			pos   = arguments[1];
			short = arguments[2];
		}
		else typeof arguments[1] === "boolean" ? short = arguments[1] : pos = arguments[1];

		if (isNaN(arg) || (typeof pos !== "undefined" && isNaN(pos))) throw Error("Invalid arguments");

		short  = (short === true);
		pos    = short ? 1 : (typeof pos === "undefined" ? 2 : parseInt(pos));
		num    = String(arg).indexOf(".") > -1 ? parseFloat(arg) : parseInt(arg);
		sizes  = ["B:0", "KB:1024", "MB:1048576", "GB:1073741824", "TB:1099511627776"]
		i      = sizes.length;
		result = "";
		regex  = /\.(.*)/;

		while (i--) {
			x = sizes[i].split(":");
			size   = parseInt(x[1]);
			suffix = x[0];
			if (num >= size) {
				result = (suffix === "B" ? num : (num / size)).toFixed(pos);
				if (short) {
					suffix = suffix.slice(0, 1);
					z      = regex.exec(result);
					if (z !== null && typeof z[1] !== "undefined" && z[1] === "0") result = parseInt(result);
				}
				result += suffix;
				break;
			}
		}

		return result;
	};

	switch (true) {
		case typeof exports !== "undefined":
			module.exports = filesize;
			break;
		case typeof define === "function":
			define("filesize", function () { return filesize; });
			break;
		default:
			global.filesize  = filesize;
	}
})(this);