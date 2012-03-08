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
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @version 1.3
 */
(function (global) {
	"use strict";

	/**
	 * Transforms a file size into a readable String
	 * 
	 * @param  {Mixed}  arg String, Int or Float to transform
	 * @param  {Number} pos Position to round to
	 * @return {String} Readable file size String
	 */
	var filesize = function (arg, pos) {
		var num    = String(arg).indexOf(".") > -1 ? parseFloat(arg) : parseInt(arg),
		    sizes  = [{"B": 0}, {"KB": 1024}, {"MB": 1048576}, {"GB": 1073741824}, {"TB": 1099511627776}],
		    i      = sizes.length,
		    result = "",
		    size, suffix, n, x;

		pos = typeof pos === "undefined" ? 2 : parseInt(pos);

		while (i--) {
			x = sizes[i];
			for (n in x) {
				if (x.hasOwnProperty(n)) {
					size   = x[n];
					suffix = n
					break;
				}
			}
			if (num >= size) {
				result = (suffix === "B" ? num : (num / size).toFixed(pos)) + suffix;
				break;
			}
		}

		return result;
	};

	// AMD support
	typeof define === "function" ? define("filesize", function () { return filesize; }) : global.filesize = filesize;
})(this);