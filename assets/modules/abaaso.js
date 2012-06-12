/**
 * Copyright (c) 2010 - 2012, Jason Mulligan <jason.mulligan@avoidwork.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of abaaso nor the
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
 * abaaso
 *
 * Events: init           Fires when abaaso is ready; register modules on this event
 *         ready          Fires when the DOM is available
 *         render         Fires when the window resources have loaded
 *         resize         Fires when the window resizes; parameter for listeners is abaaso.client.size
 *         afterCreate    Fires after an Element is created; parameter for listeners is the (new) Element
 *         afterDestroy   Fires after an Element is destroyed; parameter for listeners is the (removed) Element.id value
 *         beforeCreate   Fires when an Element is about to be created; parameter for listeners is the (new) Element.id value
 *         beforeDestroy  Fires when an Element is about to be destroyed; parameter for listeners is the (to be removed) Element
 *         error          Fires when an Error is caught; parameter for listeners is the logged Object (abaaso.error.log[n])
 *         beforeHash     Fires before the hash event
 *         hash           Fires when window.location.hash changes; parameter for listeners is the hash value
 *         afterHash      Fires after the hash event; parameter for listeners is the hash value
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @link http://abaaso.com/
 * @module abaaso
 * @version 2.1.6
 */
(function (global) {
"use strict";

var document  = global.document,
    location  = global.location,
    navigator = global.navigator;

if (typeof global.$ === "undefined")      global.$      = null;
if (typeof global.abaaso === "undefined") global.abaaso = (function () {
	var $, array, cache, client, cookie, data, element, json, label,
	    message, mouse, number, observer, string, utility, validate, xml, error;

	/**
	 * Array methods
	 *
	 * @class array
	 * @namespace abaaso
	 */
	array = {
		/**
		 * Returns an Object (NodeList, etc.) as an Array
		 *
		 * @method cast
		 * @param  {Object}  obj Object to cast
		 * @param  {Boolean} key [Optional] Returns key or value, only applies to Objects without a length property
		 * @return {Array}   Object as an Array
		 */
		cast : function (obj, key) {
			key   = (key === true);
			var o = [], i, nth;

			switch (true) {
				case !isNaN(obj.length):
					(!client.ie || client.version > 8) ? o = Array.prototype.slice.call(obj) : utility.iterate(obj, function (i, idx) { if (idx !== "length") o.push(i); });
					break;
				default:
					key ? o = array.keys(obj) : utility.iterate(obj, function (i) { o.push(i); });
			}
			return o;
		},

		/**
		 * Clones an Array
		 * 
		 * @method clone
		 * @param  {Array} obj Array to clone
		 * @return {Array} Clone of Array
		 */
		clone : function (obj) {
			return utility.clone(obj);
		},

		/**
		 * Finds the index of arg(s) in instance
		 *
		 * @method contains
		 * @param  {Array}  obj  Array to search
		 * @param  {String} arg  Comma delimited string of search values
		 * @return {Mixed}  Integer or an array of integers representing the location of the arg(s)
		 */
		contains : function (obj, arg) {
			var indices = [],
			    nth, i;

			arg = typeof arg.indexOf === "function" ? arg.explode() : [arg];
			nth = obj.length;
			arg.each(function (idx) { for (i = 0; i < nth; i++) if (idx === obj[i]) indices.push(i); });
			return indices.sort(function(a, b) { return a - b; });
		},

		/**
		 * Finds the difference between array1 and array2
		 *
		 * @method diff
		 * @param  {Array} array1 Source Array
		 * @param  {Array} array2 Comparison Array
		 * @return {Array} Array of the differences
		 */
		diff : function (array1, array2) {
			var a = array1.length > array2.length ? array1 : array2,
			    b = a === array1 ? array2 : array1;

			return a.filter(function (key) { if (b.indexOf(key) === -1) return true; });
		},

		/**
		 * Iterates obj and executes fn
		 * Parameters for fn are 'value', 'key'
		 * 
		 * @param  {Array}    obj Array to iterate
		 * @param  {Function} fn  Function to execute on index values
		 * @return {Array} Array
		 */
		each : function (obj, fn) {
			var n = 0;

			obj.forEach(function (i) { fn(i, n++); });
			return obj;
		},

		/**
		 * Returns the first Array node
		 *
		 * @method first
		 * @param  {Array} obj The array
		 * @return {Mixed} The first node of the array
		 */
		first : function (obj) {
			return obj[0];
		},

		/**
		 * Facade to indexOf for shorter syntax
		 *
		 * @method index
		 * @param  {Array} obj Array to search
		 * @param  {Mixed} arg Value to find index of
		 * @return {Number} The position of arg in instance
		 */
		index : function (obj, arg) {
			return obj.indexOf(arg);
		},

		/**
		 * Returns an Associative Array as an Indexed Array
		 *
		 * @method indexed
		 * @param  {Array} obj Array to index
		 * @return {Array} Indexed Array
		 */
		indexed : function (obj) {
			var indexed = [];

			utility.iterate(obj, function (v, k) { typeof v === "object" ? indexed = indexed.concat(array.indexed(v)) : indexed.push(v); });
			return indexed;
		},

		/**
		 * Finds the intersections between array1 and array2
		 *
		 * @method intersect
		 * @param  {Array} array1 Source Array
		 * @param  {Array} array2 Comparison Array
		 * @return {Array} Array of the intersections
		 */
		intersect : function (array1, array2) {
			var a = array1.length > array2.length ? array1 : array2,
			    b = a === array1 ? array2 : array1;

			return a.filter(function (key) { if (b.indexOf(key) > -1) return true; });
		},

		/**
		 * Returns the keys in an Associative Array
		 *
		 * @method keys
		 * @param  {Array} obj Array to extract keys from
		 * @return {Array} Array of the keys
		 */
		keys : function (obj) {
			var keys = [];

			typeof Object.keys === "function" ? keys = Object.keys(obj) : utility.iterate(obj, function (v, k) { keys.push(k); });
			return keys;
		},

		/**
		 * Returns the last node of the array
		 *
		 * @method last
		 * @param  {Array} obj Array
		 * @return {Mixed} Last node of Array
		 */
		last : function (obj) {
			var nth = obj.length;
			return nth > 1 ? obj[(nth - 1)] : obj.first();
		},

		/**
		 * Returns a range of indices from the Array
		 * 
		 * @param  {Array}  obj   Array to iterate
		 * @param  {Number} start Starting index
		 * @param  {Number} end   Ending index
		 * @return {Array}       Array of indices
		 */
		range : function (obj, start, end) {
			var result = [],
			    i;

			for (i = start; i <= end; i++) result.push(obj[i]);
			return result;
		},

		/**
		 * Removes indices from an Array without recreating it
		 *
		 * @method remove
		 * @param  {Array}   obj   Array to remove from
		 * @param  {Number} start Starting index
		 * @param  {Number} end   [Optional] Ending index
		 * @return {Array} Modified Array
		 */
		remove : function (obj, start, end) {
			if (typeof start === "string") {
				start = obj.index(start);
				if (start === -1) return obj;
			}
			else start = start || 0;

			var length    = obj.length,
			    remaining = obj.slice((end || start) + 1 || length);

			obj.length = start < 0 ? (length + start) : start;
			obj.push.apply(obj, remaining);
			return obj;
		},

		/**
		 * Sorts the Array by parsing values
		 * 
		 * @param  {Mixed} a Argument to compare
		 * @param  {Mixed} b Argument to compare
		 * @return {Boolean} Boolean indicating sort order
		 */
		sort : function (a, b) {
			var result;

			if (!isNaN(a)) a = number.parse(a);
			if (!isNaN(b)) b = number.parse(b);

			switch (true) {
				case a < b:
					result = -1;
					break;
				case a > b:
					result = 1;
					break;
				default:
					result = 0;
			}
			return result;
		},

		/**
		 * Gets the total keys in an Array
		 *
		 * @method total
		 * @param  {Array} obj Array to find the length of
		 * @return {Number} Number of keys in Array
		 */
		total : function (obj) {
			return array.indexed(obj).length;
		},

		/**
		 * Casts an Array to Object
		 * 
		 * @param  {Array} ar Array to transform
		 * @return {Object} New object
		 */
		toObject : function (ar) {
			var obj = {},
			    i   = ar.length;

			while (i--) obj[i.toString()] = ar[i];
			return obj;
		}
	};

	/**
	 * Cache for RESTful behavior
	 *
	 * @class cache
	 * @namespace abaaso
	 * @private
	 */
	cache = {
		// Collection URIs
		items : {},

		/**
		 * Garbage collector for the cached items
		 *
		 * @method clean
		 * @return {Undefined} undefined
		 */
		clean : function () {
			return utility.iterate(cache.items, function (v, k) { if (cache.expired(k)) cache.expire(k); });
		},

		/**
		 * Expires a URI from the local cache
		 * 
		 * Events: expire    Fires when the URI expires
		 *
		 * @method expire
		 * @param  {String}  uri    URI of the local representation
		 * @param  {Boolean} silent [Optional] If 'true', the event will not fire
		 * @return {Undefined} undefined
		 */
		expire : function (uri, silent) {
			silent = (silent === true);
			if (typeof cache.items[uri] !== "undefined") {
				delete cache.items[uri];
				if (!silent) uri.fire("beforeExpire").fire("expire").fire("afterExpire");
				return true;
			}
			else return false;
		},

		/**
		 * Determines if a URI has expired
		 *
		 * @method expired
		 * @param  {Object} uri Cached URI object
		 * @return {Boolean} True if the URI has expired
		 */
		expired : function (uri) {
			var item = cache.items[uri];
			return typeof item !== "undefined" && typeof item.expires !== "undefined" && item.expires < new Date();
		},

		/**
		 * Returns the cached object {headers, response} of the URI or false
		 *
		 * @method get
		 * @param  {String}  uri    URI/Identifier for the resource to retrieve from cache
		 * @param  {Boolean} expire [Optional] If 'false' the URI will not expire
		 * @param  {Boolean} silent [Optional] If 'true', the event will not fire
		 * @return {Mixed} URI Object {headers, response} or False
		 */
		get : function (uri, expire) {
			expire = (expire !== false);
			if (typeof cache.items[uri] === "undefined") return false;
			if (expire && cache.expired(uri)) {
				cache.expire(uri);
				return false;
			}
			return cache.items[uri];
		},

		/**
		 * Sets, or updates an item in cache.items
		 *
		 * @method set
		 * @param  {String} uri      URI to set or update
		 * @param  {String} property Property of the cached URI to set
		 * @param  {Mixed} value     Value to set
		 * @return {Mixed} URI Object {headers, response} or undefined
		 */
		set : function (uri, property, value) {
			if (typeof cache.items[uri] === "undefined") {
				cache.items[uri] = {};
				cache.items[uri].permission = 0;
			}
			property === "permission" ? cache.items[uri].permission |= value
			                          : (property === "!permission" ? cache.items[uri].permission &= ~value
			                                                        : cache.items[uri][property]   =  value);
			return cache.items[uri];
		}
	};

	/**
	 * Client properties and methods
	 *
	 * @class client
	 * @namespace abaaso
	 */
	client = {
		android : (function () { return /android/i.test(navigator.userAgent); })(),
		blackberry : (function () { return /blackberry/i.test(navigator.userAgent); })(),
		chrome  : (function () { return /chrome/i.test(navigator.userAgent); })(),
		css3    : (function () {
			switch (true) {
				case this.mobile:
				case this.tablet:
				case this.chrome  && this.version > 5:
				case this.firefox && this.version > 2:
				case this.ie      && this.version > 8:
				case this.opera   && this.version > 8:
				case this.safari  && this.version > 4:
					this.css3 = true;
					return true;
				default:
					this.css3 = false;
					return false;
			}
			}),
		firefox : (function () { return /firefox/i.test(navigator.userAgent); })(),
		ie      : (function () { return /msie/i.test(navigator.userAgent); })(),
		ios     : (function () { return /ipad|iphone/i.test(navigator.userAgent); })(),
		linux   : (function () { return /linux|bsd|unix/i.test(navigator.userAgent); })(),
		mobile  : (function () { abaaso.client.mobile = this.mobile = /blackberry|iphone|webos/i.test(navigator.userAgent) || (/android/i.test(navigator.userAgent) && (abaaso.client.size.x < 720 || abaaso.client.size.y < 720)); }),
		playbook: (function () { return /playbook/i.test(navigator.userAgent); })(),
		opera   : (function () { return /opera/i.test(navigator.userAgent); })(),
		osx     : (function () { return /macintosh/i.test(navigator.userAgent); })(),
		safari  : (function () { return /safari/i.test(navigator.userAgent.replace(/chrome.*/i, "")); })(),
		tablet  : (function () { abaaso.client.tablet = this.tablet = /ipad|playbook|webos/i.test(navigator.userAgent) || (/android/i.test(navigator.userAgent) && (abaaso.client.size.x >= 720 || abaaso.client.size.y >= 720)); }),
		webos   : (function () { return /webos/i.test(navigator.userAgent); })(),
		windows : (function () { return /windows/i.test(navigator.userAgent); })(),
		version : (function () {
			var version = 0;
			switch (true) {
				case this.chrome:
					version = navigator.userAgent.replace(/(.*chrome\/|safari.*)/gi, "");
					break;
				case this.firefox:
					version = navigator.userAgent.replace(/(.*firefox\/)/gi, "");
					break;
				case this.ie:
					version = navigator.userAgent.replace(/(.*msie|;.*)/gi, "");
					break;
				case this.opera:
					version = navigator.userAgent.replace(/(.*opera\/|\(.*)/gi, "");
					break;
				case this.safari:
					version = navigator.userAgent.replace(/(.*version\/|safari.*)/gi, "");
					break;
				default:
					version = (typeof navigator !== "undefined") ? navigator.appVersion : 0;
			}
			version = !isNaN(parseInt(version)) ? parseInt(version) : 0;
			abaaso.client.version = this.version = version;
			return version;
		}),

		/**
		 * Quick way to see if a URI allows a specific command
		 *
		 * @method allows
		 * @param  {String} uri     URI to query
		 * @param  {String} command Command to query for
		 * @return {Boolean} True if the command is allowed
		 */
		allows : function (uri, command) {
			try {
				if (uri.isEmpty() || command.isEmpty()) throw Error(label.error.invalidArguments);

				if (!cache.get(uri, false)) return undefined;

				command = command.toLowerCase();
				var result;

				switch (true) {
					case command === "delete":
						result = !((uri.permissions(command).bit & 1) === 0);
						break;
					case command === "get":
						result = !((uri.permissions(command).bit & 4) === 0);
						break;
					case (/post|put/.test(command)):
						result = !((uri.permissions(command).bit & 2) === 0);
						break;
					default:
						result = false;
				}
				return result;
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Gets bit value based on args
		 *
		 * 1 --d delete
		 * 2 -w- write
		 * 3 -wd write and delete
		 * 4 r-- read
		 * 5 r-x read and delete
		 * 6 rw- read and write
		 * 7 rwx read, write and delete
		 *
		 * @method bit
		 * @param  {Array} args Array of commands the URI accepts
		 * @return {Number} To be set as a bit
		 * @private
		 */
		bit : function (args) {
			var result = 0;

			args.each(function (a) {
				switch (a.toLowerCase()) {
					case "get":
						result |= 4;
						break;
					case "post":
					case "put":
						result |= 2;
						break;
					case "delete":
						result |= 1;
						break;
				}
			});
			return result;
		},

		/**
		 * Determines if a URI is a CORS end point
		 * 
		 * @method cors
		 * @param  {String} uri  URI to parse
		 * @return {Boolean} True if CORS
		 */
		cors : function (uri) {
			return (uri.indexOf("//") > -1 && uri.indexOf("//" + location.host) === -1);
		},

		/**
		 * Caches the headers from the XHR response
		 * 
		 * @method headers
		 * @param  {Object} xhr  XMLHttpRequest Object
		 * @param  {String} uri  URI to request
		 * @param  {String} type Type of request
		 * @return {Object} Cached URI representation
		 * @private
		 */
		headers : function (xhr, uri, type) {
			var headers = String(xhr.getAllResponseHeaders()).split("\n"),
			    items   = {},
			    o       = {},
			    allow   = null,
			    expires = new Date(),
			    header, value;

			headers.each(function (h) {
				if (!h.isEmpty()) {
					header        = h.toString();
					value         = header.substr((header.indexOf(':') + 1), header.length).replace(/\s/, "");
					header        = header.substr(0, header.indexOf(':')).replace(/\s/, "");
					header        = (function () { var x = []; header.explode("-").each(function (i) { x.push(i.capitalize()) }); return x.join("-"); })();
					items[header] = value;
					if (/allow|access-control-allow-methods/i.test(header)) allow = value;
				}
			});

			switch (true) {
				case typeof items["Cache-Control"] !== "undefined" && /no/.test(items["Cache-Control"]):
				case typeof items["Pragma"] !== "undefined" && /no/.test(items["Pragma"]):
					break;
				case typeof items["Cache-Control"] !== "undefined" && /\d/.test(items["Cache-Control"]):
					expires = expires.setSeconds(expires.getSeconds() + parseInt(/\d{1,}/.exec(items["Cache-Control"])[0]));
					break;
				case typeof items["Expires"] !== "undefined":
					expires = new Date(items["Expires"]);
					break;
				default:
					expires = expires.setSeconds(expires.getSeconds() + $.expires);
			}

			o.expires    = expires;
			o.headers    = items;
			o.permission = client.bit(allow !== null ? allow.explode() : [type]);

			if (type !== "head") {
				cache.set(uri, "expires",    o.expires);
				cache.set(uri, "headers",    o.headers);
				cache.set(uri, "permission", o.permission);
			}

			return o;
		},

		/**
		 * Returns the permission of the cached URI
		 *
		 * @method permissions
		 * @param  {String} uri URI to query
		 * @return {Object} Contains an Array of available commands, the permission bit and a map
		 */
		permissions : function (uri) {
			var cached = cache.get(uri, false),
			    bit    = !cached ? 0 : cached.permission,
				result = {allows: [], bit: bit, map: {read: 4, write: 2, "delete": 1}};

			if (bit & 1) result.allows.push("DELETE");
			if (bit & 2) (function () { result.allows.push("PUT"); result.allows.push("PUT"); })();
			if (bit & 4) result.allows.push("GET");
			return result;
		},

		/**
		 * Creates a JSONP request
		 *
		 * Events: beforeJSONP     Fires before the SCRIPT is made
		 *         afterJSONP      Fires after the SCRIPT is received
		 *         failedJSONP     Fires on error
		 *         timeoutJSONP    Fires 30s after SCRIPT is made
		 *
		 * @method jsonp
		 * @param  {String}   uri     URI to request
		 * @param  {Function} success A handler function to execute when an appropriate response been received
		 * @param  {Function} failure [Optional] A handler function to execute on error
		 * @param  {Mixed}    args    Custom JSONP handler parameter name, default is "callback"; or custom headers for GET request (CORS)
		 * @return {String} URI to query
		 */
		jsonp : function (uri, success, failure, args) {
			var curi = new String(uri).toString(),
			    guid = utility.guid(true),
			    callback, cbid, s;

			switch (true) {
				case typeof args === "undefined":
				case args === null:
				case args instanceof Object && (args.callback === null || typeof args.callback === "undefined"):
				case typeof args === "string" && args.isEmpty():
					callback = "callback";
					break;
				case args instanceof Object && typeof args.callback !== "undefined":
					callback = args.callback;
					break;
				default:
					callback = "callback";
			}

			curi = curi.replace(callback+"=?", "");

			curi.on("afterJSONP", function (arg) {
				this.un("afterJSONP", guid).un("failedJSONP", guid);
				if (typeof success === "function") success(arg);
			}, guid).on("failedJSONP", function () {
				this.un("afterJSONP", guid).un("failedJSONP", guid);
				if (typeof failure === "function") failure();
			}, guid);

			do cbid = utility.genId().slice(0, 10);
			while (typeof abaaso.callback[cbid] !== "undefined");

			uri = uri.replace(callback + "=?", callback + "=abaaso.callback." + cbid);

			abaaso.callback[cbid] = function (arg) {
				s.destroy();
				clearTimeout(abaaso.timer[cbid]);
				delete abaaso.timer[cbid];
				delete abaaso.callback[cbid];
				curi.fire("afterJSONP", arg);
			};

			s = $("head").create("script", {src: uri, type: "text/javascript"});
			abaaso.timer[cbid] = setTimeout(function () { curi.fire("failedJSONP"); }, 30000);

			return uri;
		},

		/**
		 * Creates an XmlHttpRequest to a URI (aliased to multiple methods)
		 *
		 * Events: beforeXHR       Fires before the XmlHttpRequest is made
		 *         before[type]    Fires before the XmlHttpRequest is made, type specific
		 *         failed[type]    Fires on error
		 *         progress[type]  Fires on progress (CORS)
		 *         received[type]  Fires on XHR readystate 2, clears the timeout only!
		 *         timeout[type]   Fires 30s after XmlHttpRequest is made
		 *
		 * @method request
		 * @param  {String}   uri     URI to query
		 * @param  {String}   type    Type of request (DELETE/GET/POST/PUT/HEAD)
		 * @param  {Function} success A handler function to execute when an appropriate response been received
		 * @param  {Function} failure [Optional] A handler function to execute on error
		 * @param  {Mixed}    args    Data to send with the request
		 * @param  {Object}   headers Custom request headers (can be used to set withCredentials)
		 * @return {String} URI to query
		 * @private
		 */
		request : function (uri, type, success, failure, args, headers) {
			try {
				if (/post|put/i.test(type) && typeof args === "undefined") throw Error(label.error.invalidArguments);

				type    = type.toLowerCase();
				headers = headers instanceof Object ? headers : null;

				var cors         = client.cors(uri),
				    xhr          = (client.ie && client.version < 10 && cors) ? new XDomainRequest() : new XMLHttpRequest(),
				    payload      = /post|put/i.test(type) && typeof args !== "undefined" ? args : null,
				    cached       = type === "get" ? cache.get(uri) : false,
				    typed        = type.capitalize(),
				    guid         = utility.guid(true),
				    contentType  = null,
				    fail         = function (arg) { uri.fire("failed" + typed, arg); },
				    timeout      = function (arg) { uri.fire("timeout" + typed, arg); },
				    doc          = (typeof Document !== "undefined"),
				    ab           = (typeof ArrayBuffer !== "undefined");

				if (type === "delete") {
					uri.on("afterDelete", function () {
						uri.un("afterDelete", guid);
						cache.expire(uri);
					}, guid);
				}

				uri.on("after" + typed, function (arg) {
				   		uri.un("after" + typed, guid).un("failed" + typed, guid);
				   		if (typeof success === "function") success(arg);
					}, guid)
				   .on("failed" + typed, function (arg) {
				   		uri.un("after" + typed, guid).un("failed" + typed, guid);
				   		if (typeof failure === "function") failure(arg);
				   	}, guid)
				   .fire("before" + typed);

				if (type !== "head" && uri.allows(type) === false) return uri.fire("failed" + typed);

				if (type === "get" && Boolean(cached)) uri.fire("afterGet", utility.clone(cached.response));
				else {
					xhr[xhr instanceof XMLHttpRequest ? "onreadystatechange" : "onload"] = function () { client.response(xhr, uri, type); };

					// Setting events
					if (typeof xhr.onerror === "object")    xhr.onerror    = fail;
					if (typeof xhr.ontimeout === "object")  xhr.ontimeout  = timeout;
					if (typeof xhr.onprogress === "object") xhr.onprogress = function (e) { uri.fire("progress" + typed, e); };

					xhr.open(type.toUpperCase(), uri, true);

					// Setting Content-Type value
					if (headers !== null && headers.hasOwnProperty("Content-Type")) contentType = headers["Content-Type"];
					if (cors && contentType === null) contentType = "text/plain";

					// Transforming payload
					if (payload !== null) {
						if (payload.hasOwnProperty("xml")) payload = payload.xml;
						if (doc && payload instanceof Document) payload = xml.decode(payload);
						if (typeof payload === "string" && /<[^>]+>[^<]*]+>/.test(payload)) contentType = "application/xml";
						if (!(ab && payload instanceof ArrayBuffer) && payload instanceof Object) {
							contentType = "application/json";
							payload = json.encode(payload);
						}
						if (contentType === null && ab && payload instanceof ArrayBuffer) contentType = "application/octet-stream";
						if (contentType === null) contentType = "application/x-www-form-urlencoded; charset=UTF-8";
					}

					// Setting headers
					if (typeof xhr.setRequestHeader === "function") {
						if (typeof cached === "object" && cached.headers.hasOwnProperty("ETag")) xhr.setRequestHeader("ETag", cached.headers.ETag);
						if (headers === null) headers = {};
						if (contentType !== null) headers["Content-Type"] = contentType;
						if (headers.hasOwnProperty("callback")) delete headers.callback;
						utility.iterate(headers, function (v, k) { if (v !== null && k !== "withCredentials") xhr.setRequestHeader(k, v); });
					}

					// Cross Origin Resource Sharing (CORS)
					if (typeof xhr.withCredentials === "boolean" && headers !== null && typeof headers.withCredentials === "boolean") xhr.withCredentials = headers.withCredentials;

					// Firing event & sending request
					uri.fire("beforeXHR", {xhr: xhr, uri: uri});
					payload !== null ? xhr.send(payload) : xhr.send();
				}
			}
			catch (e) {
				error(e, arguments, this);
				uri.fire("failed" + typed, xhr);
			}
			return uri;
		},

		/**
		 * Caches the URI headers & response if received, and fires the relevant events
		 *
		 * If abaaso.state.header is set, an application state change is possible
		 *
		 * Permissions are handled if the ACCEPT header is received; a bit is set on the cached
		 * resource
		 *
		 * Events: afterXHR     Fires after the XmlHttpRequest response is received
		 *         after[type]  Fires after the XmlHttpRequest response is received, type specific
		 *         reset        Fires if a 206 response is received
		 *         moved        Fires if a 301 response is received
		 *         success      Fires if a 400 response is received
		 *         failure      Fires if an exception is thrown
		 *
		 * @method response
		 * @param  {Object} xhr  XMLHttpRequest Object
		 * @param  {String} uri  URI to query
		 * @param  {String} type Type of request
		 * @return {String} uri  URI to query
		 * @private
		 */
		response : function (xhr, uri, type) {
			try {
				var typed = type.toLowerCase().capitalize(),
				    l     = location;

				switch (true) {
					case xhr.readyState === 2:
						uri.fire("received" + typed);
						break;
					case xhr.readyState === 4:
						uri.fire("afterXHR", {xhr: xhr, uri: uri});
						switch (xhr.status) {
							case 200:
							case 201:
							case 202:
							case 203:
							case 204:
							case 205:
							case 206:
							case 301:
								var state = null,
								    s     = abaaso.state,
								    o     = client.headers(xhr, uri, type),
								    cors  = client.cors(uri),
								    r, t, x;

								switch (true) {
									case type === "head":
										return uri.fire("afterHead", o.headers);
									case type !== "delete" && /200|301/.test(xhr.status):
										t = typeof o.headers["Content-Type"] !== "undefined" ? o.headers["Content-Type"] : "";
										switch (true) {
											case (/json|plain|javascript/.test(t) || t.isEmpty()) && Boolean(x = json.decode(/[\{\[].*[\}\]]/.exec(xhr.responseText))):
												r = x;
												break;
											case (/xml/.test(t) && String(xhr.responseText).isEmpty() && xhr.responseXML !== null):
												r = xml.decode(typeof xhr.responseXML.xml !== "undefined" ? xhr.responseXML.xml : xhr.responseXML);
												break;
											case (/<[^>]+>[^<]*]+>/.test(xhr.responseText)):
												r = xml.decode(xhr.responseText);
												break;
											default:
												r = xhr.responseText;
										}

										if (typeof r === "undefined") throw Error(label.error.serverError);

										cache.set(uri, "response", (o.response = r));
										break;
								}

								// Application state change triggered by hypermedia (HATEOAS)
								if (s.header !== null && Boolean(state = o.headers[s.header]) && s.current !== state) typeof s.change === "function" ? s.change(state) : s.current = state;

								switch (xhr.status) {
									case 200:
									case 201:
									case 202:
									case 203:
									case 206:
										uri.fire("after" + typed, utility.clone(o.response));
										break;
									case 204:
										uri.fire("after" + typed);
										break;
									case 205:
										uri.fire("reset");
										break;
									case 301:
										uri.fire("moved", o.response);
										break;
								}
								break;
							case 401:
								throw Error(label.error.serverUnauthorized);
								break;
							case 403:
								cache.set(uri, "!permission", client.bit([type]));
								throw Error(label.error.serverForbidden);
								break;
							case 405:
								cache.set(uri, "!permission", client.bit([type]));
								throw Error(label.error.serverInvalidMethod);
								break
							case 0:
							default:
								throw Error(label.error.serverError);
						}
						break;
					case client.ie && client.cors(uri): // XDomainRequest
						var r, x;

						switch (true) {
							case Boolean(x = json.decode(/[\{\[].*[\}\]]/.exec(xhr.responseText))):
								r = x;
								break;
							case (/<[^>]+>[^<]*]+>/.test(xhr.responseText)):
								r = xml.decode(xhr.responseText);
								break;
							default:
								r = xhr.responseText;
						}

						cache.set(uri, "permission", client.bit(["get"]));
						cache.set(uri, "response", r);
						uri.fire("afterGet", r);
						break;
				}
			}
			catch (e) {
				error(e, arguments, this, true);
				uri.fire("failed" + typed, xhr);
			}
			return uri;
		},


		/**
		 * Returns the visible area of the View
		 *
		 * @method size
		 * @return {Object} Describes the View {x: ?, y: ?}
		 */
		size : function () {
			var x = 0,
			    y = 0;

			x = typeof document.documentElement !== "undefined" ? document.documentElement.clientWidth  : document.body.clientWidth;
			y = typeof document.documentElement !== "undefined" ? document.documentElement.clientHeight : document.body.clientHeight;

			return {x: x, y: y};
		}
	};

	/**
	 * Cookie methods
	 *
	 * @class cookie
	 * @namespace abaaso
	 */
	cookie = {
		/**
		 * Expires a cookie if it exists
		 *
		 * @method expire
		 * @param  {String} name Name of the cookie to expire
		 * @param  {String} domain [Optional] Domain to set the cookie for
		 * @param  {Boolea} secure [Optional] Make the cookie only accessible via SSL
		 * @return {String} Name of the expired cookie
		 */
		expire : function (name, domain, secure) {
			if (typeof cookie.get(name) !== "undefined") cookie.set(name, "", "-1s", domain, secure);
			return name;
		},

		/**
		 * Gets a cookie
		 *
		 * @method get
		 * @param  {String} name Name of the cookie to get
		 * @return {Mixed} Cookie or undefined
		 */
		get : function (name) {
			return cookie.list()[name];
		},

		/**
		 * Gets the cookies for the domain
		 *
		 * @method list
		 * @return {Object} Collection of cookies
		 */
		list : function () {
			var result = {},
			    item, items;

			if (typeof document.cookie !== "undefined" && !document.cookie.isEmpty()) {
				items = document.cookie.explode(";");
				items.each(function (i) {
					item = i.explode("=");
					result[decodeURIComponent(item[0].toString().trim())] = decodeURIComponent(item[1].toString().trim());
				});
			}
			return result;
		},

		/**
		 * Creates a cookie
		 *
		 * The offset specifies a positive or negative span of time as day, hour, minute or second
		 *
		 * @method set
		 * @param  {String} name   Name of the cookie to create
		 * @param  {String} value  Value to set
		 * @param  {String} offset A positive or negative integer followed by "d", "h", "m" or "s"
		 * @param  {String} domain [Optional] Domain to set the cookie for
		 * @param  {Boolea} secure [Optional] Make the cookie only accessible via SSL
		 * @return {Object} The new cookie
		 */
		set : function (name, value, offset, domain, secure) {
			if (typeof value === "undefined") value = "";
			value     += ";";
			if (typeof offset === "undefined") offset = "";
			domain     = (typeof domain === "string") ? (" domain=" + domain + ";") : "";
			secure     = (secure === true) ? "; secure" : "";
			var expire = "",
			    span   = null,
			    type   = null,
			    types  = ["d", "h", "m", "s"],
			    regex  = new RegExp(),
			    i      = types.length;

			if (!offset.isEmpty()) {
				while (i--) {
					regex.compile(types[i]);
					if (regex.test(offset)) {
						type = types[i];
						span = parseInt(offset);
						break;
					}
				}

				if (isNaN(span)) throw Error(label.error.invalidArguments);

				expire = new Date();
				switch (type) {
					case "d":
						expire.setDate(expire.getDate() + span);
						break;
					case "h":
						expire.setHours(expire.getHours() + span);
						break;
					case "m":
						expire.setMinutes(expire.getMinutes() + span);
						break;
					case "s":
						expire.setSeconds(expire.getSeconds() + span);
						break;
				}
			}
			if (expire instanceof Date) expire = " expires=" + expire.toUTCString() + ";";
			document.cookie = (name.toString().trim() + "=" + value + expire + domain + " path=/" + secure);
			return cookie.get(name);
		}
	};

	/**
	 * Template data store, use $.store(obj), abaaso.store(obj) or abaaso.data.register(obj)
	 * to register it with an Object
	 *
	 * RESTful behavior is supported, by setting the 'key' & 'uri' properties
	 *
	 * Do not use this directly!
	 *
	 * @class data
	 * @namespace abaaso
	 */
	data = {
		// Inherited by data stores
		methods : {
			/**
			 * Batch sets or deletes data in the store
			 *
			 * Events: beforeDataBatch  Fires before the batch is queued
			 *         afterDataBatch   Fires after the batch is queued
			 *         failedDataBatch  Fires when an exception occurs
			 *
			 * @method batch
			 * @param  {String}  type Type of action to perform
			 * @param  {Mixed}   data Array of keys or indices to delete, or Object containing multiple records to set
			 * @param  {Boolean} sync [Optional] Syncs store with data, if true everything is erased
			 * @return {Object} Data store
			 */
			batch : function (type, data, sync) {
				try {
					type = type.toString().toLowerCase();
					sync = (sync === true);

					if (!/^(set|del)$/.test(type) || typeof data !== "object") throw Error(label.error.invalidArguments);

					var obj  = this.parentNode,
					    self = this,
					    r    = 0,
					    nth  = 0,
					    f    = false,
					    set  = function (rec, key) {
					    	var guid = utility.genId();

					    	if (self.key !== null && typeof rec[self.key] !== "undefined") {
								key = rec[self.key];
								delete rec[self.key];
							}

							obj.on("afterDataSet", function () {
								this.un("afterDataSet", guid).un("failedDataSet", guid);
								if (++r && r === nth) completed();
							}, guid).on("failedDataSet", function () {
								this.un("afterDataSet", guid).un("failedDataSet", guid);
							}, guid);

							self.set(key, rec, sync);
						},
						completed = function () {
							if (type === "del") this.reindex();
							obj.fire("afterDataBatch");
						},
						guid = utility.genId(true),
					    key;

					obj.fire("beforeDataBatch");

					switch (type) {
						case "set":
							if (sync) this.clear(true);
							obj.on("failedDataSet", function () {
								obj.un("failedDataSet", guid);
								if (!f) {
									f = true;
									obj.fire("failedDataBatch");
								}
							}, guid);
							break;
						case "del":
							obj.on("afterDataDelete", function () {
								if (r++ && r === nth) completed();
							}, guid).on("failedDataDelete", function () {
								obj.un("failedDataDelete", guid).un("afterDataDelete", guid);
								if (!f) {
									f = true;
									obj.fire("failedDataBatch");
								}
							}, guid);
							break;
					}

					if (data instanceof Array) {
						nth = data.length;
						switch (nth) {
							case 0:
								completed();
								break;
							default:
								data.each(function (i, idx) {
									idx = idx.toString();
									if (type === "set") switch (true) {
										case typeof i === "object":
											set(i, idx);
											break;
										case i.indexOf("//") === -1:
											i = self.uri + i;
										default:
											i.get(function (arg) { set(arg, idx); }, null, {Accept: "application/json", withCredentials: self.credentials});
											break;
									}
									else self.del(i, false, sync);
								});
						}
					}
					else {
						nth = array.cast(data, true).length;
						utility.iterate(data, function (v, k) {
							if (type === "set") {
								if (self.key !== null && typeof v[self.key] !== "undefined") {
									key = v[self.key];
									delete v[self.key];
								}
								else key = k.toString();
								self.set(key, v, sync);
							}
							else self.del(v, false, sync);
						});
					}

					return this;
				}
				catch (e) {
					error(e, arguments, this);
					obj.fire("failedDataBatch");
					return undefined;
				}
			},

			/**
			 * Clears the data object, unsets the uri property
			 *
			 * Events: beforeDataClear  Fires before the data is cleared
			 *         afterDataClear   Fires after the data is cleared
			 *
			 * @method clear
			 * @param {Boolean} sync [Optional] Boolean to limit clearing of properties
			 * @return {Object} Data store
			 */
			clear : function (sync) {
				sync    = (sync === true);
				var obj = this.parentNode;

				if (!sync) {
					obj.fire("beforeDataClear");
					this.callback    = null;
					this.credentials = null;
					this.expires     = null;
					this._expires    = null;
					this.key         = null;
					this.keys        = {};
					this.records     = [];
					this.source      = null;
					this.total       = 0;
					this.views       = {};
					this.uri         = null;
					this._uri        = null;
					obj.fire("afterDataClear");
				}
				else {
					this.keys        = {};
					this.records     = [];
					this.total       = 0;
					this.views       = {};
				}
				return this;
			},

			/**
			 * Deletes a record based on key or index
			 *
			 * Events: beforeDataDelete  Fires before the record is deleted
			 *         afterDataDelete   Fires after the record is deleted
			 *         syncDataDelete    Fires when the local store is updated
			 *         failedDataDelete  Fires if the store is RESTful and the action is denied
			 *
			 * @method del
			 * @param  {Mixed}   record  Record key or index
			 * @param  {Boolean} reindex Default is true, will re-index the data object after deletion
			 * @param  {Boolean} sync    [Optional] True if called by data.sync
			 * @return {Object} Data store
			 */
			del : function (record, reindex, sync) {
				if (typeof record === "undefined" || (typeof record !== "number" && typeof record !== "string")) throw Error(label.error.invalidArguments);

				reindex  = (reindex !== false);
				sync     = (sync === true);
				var obj  = this.parentNode,
				    r    = /true|undefined/,
				    key, args, uri, p;

				switch (typeof record) {
					case "string":
						key    = record;
						record = this.keys[key];
						if (typeof key === "undefined") throw Error(label.error.invalidArguments);
						record = record.index;
						break;
					default:
						key = this.records[record];
						if (typeof key === "undefined") throw Error(label.error.invalidArguments);
						key = key.key;
				}

				args   = {key: key, record: record, reindex: reindex};

				if (this.uri !== null) {
					uri = this.uri + "/" + key;
					p   = uri.allows("delete");
				}

				obj.fire("beforeDataDelete", args);
				switch (true) {
					case sync:
					case this.callback !== null:
					case this.uri === null:
						obj.fire("syncDataDelete", args);
						break;
					case r.test(p):
						uri.del(function () { obj.fire("syncDataDelete", args); }, function () { obj.fire("failedDataDelete", args); }, {Accept: "application/json", withCredentials: this.credentials});
						break;
					default:
						obj.fire("failedDataDelete", args);
				}
				return this;
			},

			/**
			 * Finds needle in the haystack
			 *
			 * @method find
			 * @param  {Mixed}  needle    String, Number or Pattern to test for
			 * @param  {Mixed}  haystack  [Optional] The field(s) to search
			 * @param  {String} modifiers [Optional] Regex modifiers
			 * @return {Array} Array of results
			 */
			find : function (needle, haystack, modifiers) {
				try {
					if (typeof needle === "undefined") throw Error(label.error.invalidArguments);
					if (typeof modifiers !== "string" || String(modifiers).isEmpty()) modifiers = "gi";

					var h      = [],
					    n      = typeof needle === "string" ? needle.explode() : needle,
					    result = [],
					    nth,
					    nth2   = n.length,
					    obj    = this.parentNode,
					    keys   = {},
					    regex  = new RegExp(),
					    x, y, f, r, s, p, i, a;

					r = this.records.first();
					switch (true) {
						case typeof haystack === "string":
							h = haystack.explode()
							i = h.length;
							while (i--) { if (!r.data.hasOwnProperty(h[i])) throw Error(label.error.invalidArguments); }
							break;
						default:
							utility.iterate(r.data, function (v, k) { h.push(k); });
					}

					nth = h.length;
					a   = this.total;

					for (i = 0; i < a; i++) {
						for (x = 0; x < nth; x++) {
							for (y = 0; y < nth2; y++) {
								f = h[x];
								p = n[y];
								regex.compile(p, modifiers);
								s = this.records[i].data[f];
								if (!keys[this.records[i].key] && regex.test(s)) {
									keys[this.records[i].key] = i;
									if (result.index(this.records[i]) < 0) result.push(this.records[i]);
								}
							}
						}
					}

					return result;
				}
				catch (e) {
					error(e, arguments, this);
					return undefined;
				}
			},

			/**
			 * Generates a micro-format form from a record
			 * 
			 * If record is null, an empty form based on the first record is generated.
			 * The submit action is data.set() which triggers a POST or PUT
			 * from the data store.
			 * 
			 * @method form
			 * @param  {Mixed}   record null, record, key or index
			 * @param  {Object}  target Target HTML Element
			 * @param  {Boolean} test   [Optional] Test form before setting values
			 * @return {Object} Generated HTML form
			 */
			form : function (record, target, test) {
				try {
					test      = (test !== false);
					var empty = (record === null),
					    self  = this,
					    entity, obj, handler, structure, key, data;

					switch (true) {
						case empty:
							record = this.get(0);
							break;
						case !(record instanceof Object):
							record = this.get(record);
							break;
					}

					switch (true) {
						case typeof record === "undefined":
							throw Error(label.error.invalidArguments);
						case this.uri !== null && !this.uri.allows("post"): // POST & PUT are interchangable for this bit
							throw Error(label.error.serverInvalidMethod);
					}

					key  = record.key;
					data = record.data;

					if (typeof target !== "undefined") target = utility.object(target);
					if (this.uri !== null) {
						entity = this.uri.replace(/.*\//, "").replace(/\?.*/, "")
						if (entity.isDomain()) entity = entity.replace(/\..*/g, "");
					}
					else entity = "record";

					/**
					 * Button handler
					 * 
					 * @method handler
					 * @param  {Object} event Window event
					 * @return {Undefined} undefined
					 */
					handler = function (event) {
						var form    = event.srcElement.parentNode,
						    nodes   = $("#" + form.id + " input"),
						    entity  = nodes[0].name.match(/(.*)\[/)[1],
						    result  = true,
						    newData = {},
						    guid;

						self.parentNode.fire("beforeDataFormSubmit");

						if (test) result = form.validate();

						switch (result) {
							case false:
								self.parentNode.fire("failedDataFormSubmit");
								break;
							case true:
								nodes.each(function (i) {
									if (typeof i.type !== "undefined" && /button|submit|reset/.test(i.type)) return;
									utility.define(i.name.replace("[", ".").replace("]", ""), i.value, newData);
								});
								guid = $.genId(true);
								self.parentNode.on("afterDataSet", function () {
									this.un("afterDataSet", guid);
									form.destroy();
								}, guid);
								self.set(key, newData[entity]);
								break;
						}

						self.parentNode.fire("afterDataFormSubmit", key);
					};

					/**
					 * Data structure in micro-format
					 * 
					 * @method structure
					 * @param  {Object} record Data store record
					 * @param  {Object} obj    [description]
					 * @param  {String} name   [description]
					 * @return {Undefined} undefined
					 */
					structure = function (record, obj, name) {
						var x, id;
						utility.iterate(record, function (v, k) {
							switch (true) {
								case v instanceof Array:
									x = 0;
									v.each(function (o) { structure(o, obj, name + "[" + k + "][" + (x++) + "]"); });
									break;
								case v instanceof Object:
									structure(v, obj, name + "[" + k + "]");
									break;
								default:
									id = (name + "[" + k + "]").replace(/\[|\]/g, "");
									obj.create("label", {"for": id}).html(k.capitalize());
									obj.create("input", {id: id, name: name + "[" + k + "]", type: "text", value: empty ? "" : v});
							}
						});
					};

					this.parentNode.fire("beforeDataForm");
					obj = element.create("form", {style: "display:none;"}, target);
					structure(data, obj, entity);
					obj.create("input", {type: "button", value: label.common.submit}).on("click", function(e) { handler(e); });
					obj.create("input", {type: "reset", value: label.common.reset});
					obj.css("display", "inherit");
					this.parentNode.fire("afterDataForm", obj);
					return obj;
				}
				catch (e) {
					error(e, arguments, this);
					return undefined;
				}
			},

			/**
			 * Retrieves a record based on key or index
			 *
			 * If the key is an integer, cast to a string before sending as an argument!
			 *
			 * @method get
			 * @param  {Mixed}  record Key, index or Array of pagination start & end
			 * @param  {Number} end    [Optional] Ceiling for pagination
			 * @return {Mixed} Individual record, or Array of records
			 */
			get : function (record, end) {
				var records = this.records.clone(),
				    obj     = this.parentNode,
				    r;

				switch (true) {
					case typeof record === "undefined":
					case String(record).length === 0:
						r = records;
						break;
					case typeof record === "string" && typeof this.keys[record] !== "undefined":
						r = records[this.keys[record].index];
						break;
					case typeof record === "number" && typeof end === "undefined":
						r = records[parseInt(record)];
						break;
					case typeof record === "number" && typeof end === "number":
						r = records.range(parseInt(record), parseInt(end));
						break;
					default:
						r = undefined;
				}

				return r;
			},

			/**
			 * Reindices the data store
			 *
			 * @method reindex
			 * @return {Object} Data store
			 */
			reindex : function () {
				var nth = this.total,
				    obj = this.parentNode,
				    i;

				this.views = {};
				for(i = 0; i < nth; i++) {
					if (this.records[i].key.isNumber()) {
						delete this.keys[this.records[i].key];
						this.keys[i.toString()] = {};
						this.records[i].key = i.toString();
					}
					this.keys[this.records[i].key].index = i;
				}
				return this;
			},

			/**
			 * Creates or updates an existing record
			 *
			 * If a POST is issued, and the data.key property is not set the
			 * first property of the response object will be used as the key
			 *
			 * Events: beforeDataSet  Fires before the record is set
			 *         afterDataSet   Fires after the record is set, the record is the argument for listeners
			 *         syncDataSet    Fires when the local store is updated
			 *         failedDataSet  Fires if the store is RESTful and the action is denied
			 *
			 * @method set
			 * @param  {Mixed}   key  Integer or String to use as a Primary Key
			 * @param  {Object}  data Key:Value pairs to set as field values
			 * @param  {Boolean} sync [Optional] True if called by data.sync
			 * @return {Object} The data store
			 */
			set : function (key, data, sync) {
				key  = key === null ? undefined : key.toString();
				sync = (sync === true);

				switch (true) {
					case (typeof key === "undefined" || key.isEmpty()) && this.uri === null:
					case typeof data === "undefined":
					case data instanceof Array:
					case data instanceof Number:
					case data instanceof String:
					case typeof data !== "object":
						throw Error(label.error.invalidArguments);
				}

				var record = typeof this.keys[key] === "undefined" && typeof this.records[key] === "undefined" ? undefined : this.get(key),
				    obj    = this.parentNode,
				    method = typeof key === "undefined" ? "post" : "put",
				    args   = {data: typeof record !== "undefined" ? $.merge(record.data, data) : data, key: key, record: undefined},
				    uri    = this.uri === null ? null : this.uri + "/" + key,
				    r      = /true|undefined/,
				    p;

				if (typeof record !== "undefined") args.record = this.records[this.keys[record.key].index];

				if (uri !== null) p = uri.allows(method);

				obj.fire("beforeDataSet");
				switch (true) {
					case sync:
					case this.callback !== null:
					case this.uri === null:
						obj.fire("syncDataSet", args);
						break;
					case r.test(p):
						uri[method](function (arg) { args["result"] = arg; obj.fire("syncDataSet", args); }, function () { obj.fire("failedDataSet"); }, data);
						break;
					default:
						obj.fire("failedDataSet", args);
				}
				return this;
			},

			/**
			 * Returns a view, or creates a view and returns it
			 *
			 * @method sort
			 * @param  {String} query       SQL (style) order by
			 * @param  {String} create      [Optional, default behavior is true, value is false] Boolean determines whether to recreate a view if it exists
			 * @param  {String} sensitivity [Optional] Sort sensitivity, defaults to "ci" (insensitive = "ci", sensitive = "cs", mixed = "ms")
			 * @return {Array} View of data
			 */
			sort : function (query, create, sensitivity) {
				try {
					if (typeof query === "undefined" || String(query).isEmpty()) throw Error(label.error.invalidArguments);
					if (!/ci|cs|ms/.test(sensitivity)) sensitivity = "ci";

					create       = (create === true);
					var view     = (query.replace(/\s*asc/g, "").replace(/,/g, " ").toCamelCase()) + sensitivity.toUpperCase(),
					    queries  = query.explode(),
					    needle   = /:::(.*)$/,
					    asc      = /\s*asc$/i,
					    desc     = /\s*desc$/i,
					    nil      = /^null/,
					    key      = this.key,
					    result   = [],
					    records  = [],
					    bucket, sort, crawl;

					queries.each(function (query) { if (String(query).isEmpty()) throw Error(label.error.invalidArguments); });

					if (!create && this.views[view] instanceof Array) return this.views[view];
					if (this.total === 0) return [];

					records = this.records.clone();

					crawl = function (q, data) {
						var queries = q.clone(),
						    query   = q.first(),
						    sorted  = {},
						    result  = [];

						queries.remove(0);
						sorted = bucket(query, data, desc.test(query));
						sorted.order.each(function (i) {
							if (sorted.registry[i].length < 2) return;
							if (queries.length > 0) sorted.registry[i] = crawl(queries, sorted.registry[i]);
						});
						sorted.order.each(function (i) { result = result.concat(sorted.registry[i]); });
						return result;
					}

					bucket = function (query, records, reverse) {
						query        = query.replace(asc, "");
						var prop     = query.replace(desc, ""),
						    pk       = (key === prop),
						    order    = [],
						    registry = {};

						records.each(function (r) {
							var val = pk ? r.key : r.data[prop],
							    k   = val === null ? "null" : String(val);

							switch (sensitivity) {
								case "ci":
									k = k.toCamelCase();
									break;
								case "cs":
									k = k.trim();
									break;
								case "ms":
									k = k.trim().slice(0, 1).toLowerCase();
									break;
							}

							if (!(registry[k] instanceof Array)) {
								registry[k] = [];
								order.push(k);
							}
							registry[k].push(r);
						});

						order.sort(array.sort);
						if (reverse) order.reverse();
						
						order.each(function (k) {
							if (registry[k].length === 1) return;
							registry[k] = sort(registry[k], query, prop, reverse, pk);
						});

						return {order: order, registry: registry};
					};

					sort = function (data, query, prop, reverse, pk) {
						var tmp    = [],
						    sorted = [];

						data.each(function (i, idx) {
							var v  = pk ? i.key : i.data[prop];

							v = String(v).trim() + ":::" + idx;
							tmp.push(v.replace(nil, "\"\""));
						});

						if (tmp.length > 1) {
							tmp.sort(array.sort);
							if (reverse) tmp.reverse();
						}

						tmp.each(function (v) { sorted.push(data[needle.exec(v)[1]]); });
						return sorted;
					};

					result           = crawl(queries, records);
					this.views[view] = result;
					return result;
				}
				catch (e) {
					error(e, arguments, this);
					return undefined;
				}
			},

			/**
			 * Syncs the data store with a URI representation
			 *
			 * Events: beforeDataSync  Fires before syncing the data store
			 *         afterDataSync   Fires after syncing the data store
			 *         failedDataSync  Fires when an exception occurs
			 *
			 * @method sync
			 * @param {Boolean} reindex [Optional] True will reindex the data store
			 * @return {Object} Data store
			 */
			sync : function (reindex) {
				try {
					if (this.uri === null || this.uri.isEmpty()) throw Error(label.error.invalidArguments);

					reindex  = (reindex === true);
					var self = this,
					    obj  = self.parentNode,
					    guid = utility.guid(true),
					    success, failure;

					success = function (arg) {
						try {
							if (typeof arg !== "object") throw Error(label.error.expectedObject);

							var data, found = false, guid = utility.genId(true);

							if (self.source !== null && typeof arg[self.source] !== "undefined") arg = arg[self.source];

							if (arg instanceof Array) data = arg.clone();
							else utility.iterate(arg, function (i) {
								if (!found && i instanceof Array) {
									found = true;
									data  = i.clone();
								}
							});

							obj.on("afterDataBatch", function () {
								obj.un("afterDataBatch", guid).un("failedDataBatch", guid);
								if (reindex) self.reindex();
								obj.fire("afterDataSync", arg);
							}, guid);

							obj.on("failedDataBatch", function () {
								obj.un("afterDataBatch", guid).un("failedDataBatch", guid).fire("failedDataSync");
							}, guid);

							self.batch("set", data, true);
						}
						catch (e) {
							error(e, arguments, this);
							obj.fire("failedDataSync");
						}
					};

					failure = function () { obj.fire("failedDataSync"); };

					obj.fire("beforeDataSync");
					this.callback !== null ? this.uri.jsonp(success, failure, {callback: this.callback}) : this.uri.get(success, failure, {Accept: "application/json", withCredentials: this.credentials});
					return this;
				}
				catch (e) {
					error(e, arguments, this);
					return this;
				}
			}
		},

		/**
		 * Registers a data store on an Object
		 *
		 * Events: beforeDataStore  Fires before registering the data store
		 *         afterDataStore   Fires after registering the data store
		 *
		 * @method register
		 * @param  {Object} obj  Object to register with
		 * @param  {Mixed}  data [Optional] Data to set with this.batch
		 * @return {Object} Object registered with
		 */
		register : function (obj, data) {
			if (obj instanceof Array) return obj.each(function (i) { data.register(i, data); });

			var methods = {
				expires : {
					getter : function () { return this._expires; },
					setter : function (arg) {
						try {
							if (this.uri === null || (arg !== null && (isNaN(arg) || typeof arg === "boolean"))) throw Error(label.error.invalidArguments);

							if (this._expires === arg) return;
							this._expires = arg;

							var id      = this.parentNode.id + "DataExpire",
							    expires = arg,
							    self    = this;

							clearTimeout($.repeating[id]);
							delete $.repeating[id];

							if (arg !== null) $.defer(function () { $.repeat(function () { if (!cache.expire(self.uri)) self.uri.fire("beforeExpire").fire("expire").fire("afterExpire"); }, expires, id); }, expires);
						}
						catch (e) {
							error(e, arguments, this);
							return undefined;
						}
					}
				},
				uri : {
					getter : function () { return this._uri; },
					setter : function (arg) {
						try {
							if (arg !== null && arg.isEmpty()) throw Error(label.error.invalidArguments);

							switch (true) {
								case this._uri === arg:
									return;
								case this._uri !== null:
									this._uri.un("expire", "dataSync");
									cache.expire(this._uri, true);
								default:
									this._uri = arg;
							}

							switch (true) {
								case arg !== null:
									arg.on("expire", function () { this.sync(true); }, "dataSync", this);
									cache.expire(arg, true);
									this.sync();
									break;
								default:
									this.clear(true);
							}
						}
						catch (e) {
							error(e, arguments, this);
							return undefined;
						}
					}
				}
			};

			obj = utility.object(obj);
			$.genId(obj);

			// Hooking observer if not present in prototype chain
			if (typeof obj.fire === "undefined")      obj.fire      = function (event, arg) { return $.fire.call(this, event, arg); };
			if (typeof obj.listeners === "undefined") obj.listeners = function (event) { return $.listeners.call(this, event); };
			if (typeof obj.on === "undefined")        obj.on        = function (event, listener, id, scope, standby) { return $.on.call(this, event, listener, id, scope, standby); };
			if (typeof obj.un === "undefined")        obj.un        = function (event, id) { return $.un.call(this, event, id); };

			obj.fire("beforeDataStore");

			obj.data = $.extend(this.methods);
			obj.data.parentNode = obj; // Recursion, useful
			obj.data.clear();          // Setting properties

			obj.on("syncDataDelete", function (data) {
				var record = this.get(data.record);
				this.records.remove(data.record);
				delete this.keys[data.key];
				this.total--;
				this.views = {};
				if (data.reindex) this.reindex();
				this.parentNode.fire("afterDataDelete", record);
				return this.parentNode;
			}, "recordDelete", obj.data);

			obj.on("syncDataSet", function (data) {
				var record;
				switch (true) {
					case typeof data.record === "undefined":
						var index = this.total;
						this.total++;
						if (typeof data.key === "undefined") {
							if (typeof data.result === "undefined") {
								this.fire("failedDataSet");
								throw Error(label.error.expectedObject);
							}
							data.key = this.key === null ? array.cast(data.result).first() : data.result[this.key];
							data.key = data.key.toString();
						}
						if (typeof data.data[data.key] !== "undefined") data.key = data.data[data.key];
						this.keys[data.key] = {};
						this.keys[data.key].index = index;
						this.records[index] = {};
						record      = this.records[index];
						record.data = utility.clone(data.data);
						record.key  = data.key;
						if (this.key !== null && this.records[index].data.hasOwnProperty(this.key)) delete this.records[index].data[this.key];
						break;
					default:
						data.record.data = utility.clone(data.data);
						record = data.record;
				}
				this.views = {};
				this.parentNode.fire("afterDataSet", record);
			}, "recordSet", obj.data);

			// Getters & setters
			switch (true) {
				case (!client.ie || client.version > 8):
					utility.property(obj.data, "uri",     {enumerable: true, get: methods.uri.getter,     set: methods.uri.setter});
					utility.property(obj.data, "expires", {enumerable: true, get: methods.expires.getter, set: methods.expires.setter});
					break;
				default: // Only exists when no getters/setters (IE8)
					obj.data.setExpires = function (arg) {
						obj.data.expires = arg;
						methods.expires.setter.call(obj.data, arg);
					};
					obj.data.setUri = function (arg) {
						obj.data.uri = arg;
						methods.uri.setter.call(obj.data, arg);
					};
			}

			if (typeof data === "object") obj.data.batch("set", data);
			obj.fire("afterDataStore");
			return obj;
		}
	};

	/**
	 * Element methods
	 *
	 * @class el
	 * @namespace abaaso
	 */
	element = {
		/**
		 * Gets or sets attributes of Element
		 * 
		 * @param  {Mixed}  obj   Element or Array of Elements or $ queries
		 * @param  {String} name  Attribute name
		 * @param  {Mixed}  value Attribute value
		 * @return {Object} Element or Array of Elements
		 */
		attr : function (obj, key, value) {
			try {
				if (typeof value === "string") value = value.trim();

				var target;

				obj = utility.object(obj);
				if (obj instanceof Array) return obj.attr(key, value);

				if (!(obj instanceof Element) || typeof key == "undefined" || String(key).isEmpty()) throw Error(label.error.invalidArguments);

				switch (true) {
					case /checked|disabled/.test(key) && typeof value === "undefined":
						return obj[key];
					case /checked|disabled/.test(key) && typeof value !== "undefined":
						obj[key] = value;
						return obj;
					case obj.nodeName === "SELECT" && key === "selected" && typeof value === "undefined":
						return $("#" + obj.id + " option[selected=\"selected\"]").first() || $("#" + obj.id + " option").first();
					case obj.nodeName === "SELECT" && key === "selected" && typeof value !== "undefined":
						target = $("#" + obj.id + " option[selected=\"selected\"]").first();
						if (typeof target !== "undefined") {
							target.selected = false;
							target.removeAttribute("selected");
						}
						target = $("#" + obj.id + " option[value=\"" + value + "\"]").first();
						target.selected = true;
						target.setAttribute("selected", "selected");
						return obj;
					case typeof value === "undefined":
						return obj.getAttribute(key);
					case value === null:
						obj.removeAttribute(key);
						return obj;
					default:
						obj.setAttribute(key, value);
						return obj;
				}
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Clears an object's innerHTML, or resets it's state
		 *
		 * Events: beforeClear  Fires before the Object is cleared
		 *         afterClear   Fires after the Object is cleared
		 *
		 * @method clear
		 * @param  {Mixed} obj Element or Array of Elements or $ queries
		 * @return {Mixed} Element or Array of Elements
		 */
		clear : function (obj) {
			try {
				obj = utility.object(obj);
				if (obj instanceof Array) return obj.each(function (i) { element.clear(i); });

				if (!(obj instanceof Element)) throw Error(label.error.invalidArguments);

				obj.fire("beforeClear");
				switch (true) {
					case typeof obj.reset === "function":
						obj.reset();
						break;
					case typeof obj.value !== "undefined":
						obj.update({innerHTML: "", value: ""});
						break;
					default:
						obj.update({innerHTML: ""});
				}
				obj.fire("afterClear");
				return obj;
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Creates an Element in document.body or a target Element
		 *
		 * An id is generated if not specified with args
		 *
		 * Events: beforeCreate  Fires after the Element has been created, but not set
		 *         afterCreate   Fires after the Element has been appended to it's parent
		 *
		 * @method create
		 * @param  {String} type   Type of Element to create
		 * @param  {Object} args   [Optional] Collection of properties to apply to the new element
		 * @param  {Mixed}  target [Optional] Target object or element.id value to append to
		 * @param  {Mixed}  pos    [Optional] "first", "last" or Object describing how to add the new Element, e.g. {before: referenceElement}
		 * @return {Object} Element that was created or undefined
		 */
		create : function (type, args, target, pos) {
			try {
				if (typeof type === "undefined" || String(type).isEmpty()) throw Error(label.error.invalidArguments);

				var obj, uid;

				switch (true) {
					case typeof target !== "undefined":
						target = utility.object(target);
						break;
					case typeof args !== "undefined" && (typeof args === "string" || typeof args.childNodes !== "undefined"):
						target = utility.object(args);
						break;
					default:
						target = document.body;
				}

				if (typeof target === "undefined") throw Error(label.error.invalidArguments);

				uid = typeof args !== "undefined"
				       && typeof args !== "string"
				       && typeof args.childNodes === "undefined"
				       && typeof args.id !== "undefined"
				       && typeof $("#" + args.id) === "undefined" ? args.id : utility.genId();

				if (typeof args !== "undefined" && typeof args.id !== "undefined") delete args.id;

				$.fire("beforeCreate", uid);
				uid.fire("beforeCreate");
				obj = document.createElement(type);
				obj.id = uid;
				if (typeof args === "object" && typeof args.childNodes === "undefined") obj.update(args);
				switch (true) {
					case typeof pos === "undefined":
					case pos === "last":
						target.appendChild(obj);
						break;
					case pos === "first":
						target.prependChild(obj);
						break;
					case pos === "after":
						pos = {};
						pos.after = target;
						target    = target.parentNode;
					case typeof pos.after !== "undefined":
						target.insertBefore(obj, pos.after.nextSibling);
						break;
					case pos === "before":
						pos = {};
						pos.before = target;
						target     = target.parentNode;
					case typeof pos.before !== "undefined":
						target.insertBefore(obj, pos.before);
						break;
					default:
						target.appendChild(obj);
				}
				obj.fire("afterCreate");
				$.fire("afterCreate", obj);
				return obj;
			}
			catch(e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Creates a CSS stylesheet in the View
		 *
		 * @method css
		 * @param  {String} content CSS to put in a style tag
		 * @return {Object} Element created or undefined
		 */
		css : function (content) {
			var ss, css;
			ss = $("head").first().create("style", {type: "text/css"});
			if (ss.styleSheet) ss.styleSheet.cssText = content;
			else {
				css = document.createTextNode(content);
				ss.appendChild(css);
			}
			return ss;
		},

		/**
		 * Data attribute facade acting as a getter (with coercion) & setter
		 *
		 * @method  data
		 * @param  {Mixed}  obj   Element or Array of Elements or $ queries
		 * @param  {String} key   Data key
		 * @param  {Mixed}  value Boolean, Number or String to set
		 * @return {Mixed}        undefined, Element or value
		 */
		data : function (obj, key, value) {
			var result = undefined;

			if (typeof value !== "undefined") {
				obj.hasOwnProperty("dataset") ? obj.dataset[key] = value : obj["data-" + key] = value.toString();
				result = obj;
			}
			else {
				switch (true) {
					case obj.hasOwnProperty("dataset") && key in obj.dataset:
						result = utility.coerce(obj.dataset[key]);
						break;
					case obj.hasOwnProperty("data-" + key):
						result = utility.coerce(obj["data-" + key]);
						break;
					default :
						result = undefined;
				}
			}
			return result;
		},

		/**
		 * Destroys an Element
		 *
		 * Events: beforeDestroy  Fires before the destroy starts
		 *         afterDestroy   Fires after the destroy ends
		 *
		 * @method destroy
		 * @param  {Mixed} obj Element or Array of Elements or $ queries
		 * @return {Mixed} Element, Array of Elements or undefined
		 */
		destroy : function (obj) {
			try {
				obj = utility.object(obj);
				if (obj instanceof Array) {
					obj.each(function (i) { element.destroy(i); });
					return [];
				}

				if (!(obj instanceof Element)) throw Error(label.error.invalidArguments);

				$.fire("beforeDestroy", obj);
				obj.fire("beforeDestroy");
				observer.remove(obj.id);
				if (obj.parentNode !== null) obj.parentNode.removeChild(obj);
				obj.fire("afterDestroy");
				$.fire("afterDestroy", obj.id);
			}
			catch(e) {
				error(e, arguments, this);
			}
			return undefined;
		},

		/**
		 * Disables an Element
		 *
		 * Events: beforeDisable  Fires before the disable starts
		 *         afterDisable   Fires after the disable ends
		 *
		 * @method disable
		 * @param  {Mixed} obj Element or Array of Elements or $ queries
		 * @return {Mixed} Element, Array of Elements or undefined
		 */
		disable : function (obj) {
			try {
				obj = utility.object(obj);
				if (obj instanceof Array) return obj.each(function (i) { element.disable(i); });

				if (!(obj instanceof Element)) throw Error(label.error.invalidArguments);

				if (typeof obj.disabled === "boolean" && !obj.disabled) {
					obj.fire("beforeDisable");
					obj.disabled = true;
					obj.fire("afterDisable");
				}
				return obj;
			}
			catch(e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Enables an Element
		 *
		 * Events: beforeEnable  Fires before the enable starts
		 *         afterEnable   Fires after the enable ends
		 *
		 * @method enable
		 * @param  {Mixed} obj Element or Array of Elements or $ queries
		 * @return {Mixed} Element, Array of Elements or undefined
		 */
		enable : function (obj) {
			try {
				obj = utility.object(obj);
				if (obj instanceof Array) return obj.each(function (i) { element.enable(i); });

				if (!(obj instanceof Element)) throw Error(label.error.invalidArguments);

				if (typeof obj.disabled === "boolean" && obj.disabled) {
					obj.fire("beforeEnable");
					obj.disabled = false;
					obj.fire("afterEnable");
				}
				return obj;
			}
			catch(e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Determines of "obj" has "klass" in it's cssName
		 * 
		 * @method hasClass
		 * @param  {Mixed} obj Element or Array of Elements or $ queries
		 * @return {Mixed} Element, Array of Elements or undefined
		 */
		hasClass : function (obj, klass) {
			try {
				obj = utility.object(obj);
				if (obj instanceof Array) return obj.each(function (i) { element.hide(i); });

				if (!(obj instanceof Element)) throw Error(label.error.invalidArguments);

				return obj.className.explode(" ").index(klass) > -1;
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Hides an Element if it's visible
		 *
		 * Events: beforeHide  Fires before the object is hidden
		 *         afterHide   Fires after the object is hidden
		 *
		 * @method hide
		 * @param  {Mixed} obj Element or Array of Elements or $ queries
		 * @return {Mixed} Element, Array of Elements or undefined
		 */
		hide : function (obj) {
			try {
				obj = utility.object(obj);
				if (obj instanceof Array) return obj.each(function (i) { element.hide(i); });

				if (!(obj instanceof Element)) throw Error(label.error.invalidArguments);

				obj.fire("beforeHide");
				switch (true) {
					case typeof obj.hidden === "boolean":
						obj.hidden = true;
						break;
					default:
						obj["data-display"] = obj.style.display;
						obj.style.display = "none";
				}
				obj.fire("afterHide");
				return obj;
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Returns a Boolean indidcating if the Object is hidden
		 *
		 * @method hidden
		 * @param  {Mixed} obj Element or $ query
		 * @return {Mixed} Boolean indicating if Object is hidden
		 */
		hidden : function (obj) {
			try {
				obj = utility.object(obj);

				if (!(obj instanceof Element)) throw Error(label.error.invalidArguments);

				return obj.style.display === "none" || (typeof obj.hidden === "boolean" && obj.hidden);
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Adds or removes a CSS class
		 *
		 * Events: beforeClassChange  Fires before the Object's class is changed
		 *         afterClassChange   Fires after the Object's class is changed
		 *
		 * @method clear
		 * @param  {Mixed}   obj Element or Array of Elements or $ queries
		 * @param  {String}  arg Class to add or remove (can be a wildcard)
		 * @param  {Boolean} add Boolean to add or remove, defaults to true
		 * @return {Mixed} Element or Array of Elements
		 */
		klass : function (obj, arg, add) {
			try {
				var classes;

				obj = utility.object(obj);

				if (obj instanceof Array) return obj.each(function (i) { element.klass(i, arg, add); });

				if (!(obj instanceof Element) || String(arg).isEmpty()) throw Error(label.error.invalidArguments);

				obj.fire("beforeClassChange");

				add     = (add !== false);
				arg     = arg.explode();
				classes = obj.className.explode(" ");

				arg.each(function (i) {
					if (add && classes.index(i) < 0) classes.push(i);
					else if (!add) arg === "*" ? classes = [] : classes.remove(i);
				});

				classes = classes.join(" ");
				client.ie && client.version < 9 ? obj.className = classes : obj.attr("class", classes);

				obj.fire("afterClassChange");

				return obj;
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Finds the position of an element
		 *
		 * @method position
		 * @param  {Mixed} obj Element or $ query
		 * @return {Object} Object {left: n, top: n}
		 */
		position : function (obj) {
			try {
				obj = utility.object(obj);
				if (obj instanceof Array) return obj.position();

				if (!(obj instanceof Element)) throw Error(label.error.invalidArguments);

				var left, top, height, width;

				left   = top = 0;
				width  = obj.offsetWidth;
				height = obj.offsetHeight;

				if (obj.offsetParent) {
					top    = obj.offsetTop;
					left   = obj.offsetLeft;

					while (obj = obj.offsetParent) {
						left += obj.offsetLeft;
						top  += obj.offsetTop;
					}
				}

				return {
					top    : top,
					right  : document.documentElement.clientWidth  - (left + width),
					bottom : document.documentElement.clientHeight + global.scrollY - (top + height),
					left   : left
				};
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Prepends an Element to an Element
		 * 
		 * @method prependChild
		 * @param  {Object} obj   Target Element
		 * @param  {Object} child Child Element
		 * @return {Object} Target Element
		 */
		prependChild : function (obj, child) {
			try {
				obj = utility.object(obj);

				if (!(obj instanceof Element) || !(child instanceof Element)) throw Error(label.error.invalidArguments);
				
				return obj.childNodes.length === 0 ? obj.appendChild(child) : obj.insertBefore(child, obj.childNodes[0]);
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Shows an Element if it's not visible
		 *
		 * Events: beforeEnable  Fires before the object is visible
		 *         afterEnable   Fires after the object is visible
		 *
		 * @method show
		 * @param  {Mixed} obj Element or Array of Elements or $ queries
		 * @return {Mixed} Element, Array of Elements or undefined
		 */
		show : function (obj) {
			try {
				obj = utility.object(obj);
				if (obj instanceof Array) return obj.each(function (i) { element.show(i); });

				if (!(obj instanceof Element)) throw Error(label.error.invalidArguments);

				obj.fire("beforeShow");
				switch (true) {
					case typeof obj.hidden === "boolean":
						obj.hidden = false;
						break;
					default:
						obj.style.display = obj.getAttribute("data-display") !== null ? obj.getAttribute("data-display") : "inherit";
				}
				obj.fire("afterShow");
				return obj;
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Returns the size of the Object
		 *
		 * @method size
		 * @param obj {Mixed} Instance, Array of Instances of $() friendly ID
		 * @return {Object} Size {x:, y:}, Array of sizes or undefined
		 */
		size : function (obj) {
			try {
				obj = utility.object(obj);
				if (obj instanceof Array) {
					var result = [];
					obj.each(function (i) { result.push(element.size(i)); });
					return result;
				}

				if (!(obj instanceof Element)) throw Error(label.error.invalidArguments);

				/**
				 * Casts n to a number or returns zero
				 *
				 * @param  {Mixed} n The value to cast
				 * @return {Number} The casted value or zero
				 */
				var num = function (n) {
					return !isNaN(parseInt(n)) ? parseInt(n) : 0;
				};

				var x = obj.offsetHeight + num(obj.style.paddingTop)  + num(obj.style.paddingBottom) + num(obj.style.borderTop)  + num(obj.style.borderBottom),
				    y = obj.offsetWidth  + num(obj.style.paddingLeft) + num(obj.style.paddingRight)  + num(obj.style.borderLeft) + num(obj.style.borderRight);

				return {x:x, y:y};
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Updates an Element
		 *
		 * Events: beforeUpdate  Fires before the update starts
		 *         afterUpdate   Fires after the update ends
		 *
		 * @method update
		 * @param  {Mixed}  obj  Element or Array of Elements or $ queries
		 * @param  {Object} args Collection of properties
		 * @return {Mixed} Element, Array of Elements or undefined
		 */
		update : function (obj, args) {
			try {
				obj  = utility.object(obj);
				args = args || {};
				var regex;

				if (obj instanceof Array) return obj.each(function (i) { element.update(i, args); });

				if (!(obj instanceof Element)) throw Error(label.error.invalidArguments);

				obj.fire("beforeUpdate");
				regex = /innerHTML|innerText|type|src/;

				utility.iterate(args, function (v, k) {
					switch (true) {
						case regex.test(k):
							obj[k] = v;
							break;
						case k === "class":
							!v.isEmpty() ? obj.addClass(v) : obj.removeClass("*");
							break;
						case k.indexOf("data") > -1:
							element.data(obj, k.replace("data-", ""), v);
							break;
						case "id":
							var o = observer.listeners;
							if (typeof o[obj.id] !== "undefined") {
								o[k] = utility.clone(o[obj.id]);
								delete o[obj.id];
							}
						default:
							obj.attr(k, v);
					}
				});

				obj.fire("afterUpdate");
				return obj;
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Gets or sets the value of Element
		 * 
		 * @param  {Mixed}  obj   Element or Array of Elements or $ queries
		 * @param  {Mixed}  value [Optional] Value to set
		 * @return {Object} Element or Array of Elements
		 */
		val : function (obj, value) {
			try {
				var output = null, items;

				obj = utility.object(obj);
				if (obj instanceof Array) return obj.each(function (i) { element.val(i, value); });

				if (!(obj instanceof Element)) throw Error(label.error.invalidArguments);

				switch (true) {
					case typeof value === "undefined":
						switch (true) {
							case (/radio|checkbox/gi.test(obj.type)):
								items = $("input[name='" + obj.name + "']");
								items.each(function (i) {
									if (output !== null) return;
									if (i.checked) output = i.value;
								});
								break;
							case (/select/gi.test(obj.type)):
								output = obj.options[obj.selectedIndex].value;
								break;
							default:
								output = typeof obj.value !== "undefined" ? obj.value : obj.innerText;
						}
						break;
					default:
						value = String(value);
						switch (true) {
							case (/radio|checkbox/gi.test(obj.type)):
								items = $("input[name='" + obj.name + "']");
								items.each(function (i) {
									if (output !== null) return;
									if (i.value === value) {
										i.checked = true;
										output    = i;
									}
								});
								break;
							case (/select/gi.test(obj.type)):
								array.cast(obj.options).each(function (i) {
									if (output !== null) return;
									if (i.value === value) {
										i.selected = true;
										output     = i;
									}
								});
								break;
							default:
								typeof obj.value !== "undefined" ? obj.value = value : obj.innerText = value;
						}
						output = obj;
				}
				return output;
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		}
	};

	/**
	 * JSON methods
	 *
	 * @class json
	 * @namespace abaaso
	 */
	json = {
		/**
		 * Decodes the argument
		 *
		 * @method decode
		 * @param  {String} arg String to parse
		 * @param  {Boolean} silent [Optional] Silently fail
		 * @return {Mixed} Entity resulting from parsing JSON, or undefined
		 */
		decode : function (arg, silent) {
			try {
				return JSON.parse(arg);
			}
			catch (e) {
				if (silent !== true) error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Encodes the argument as JSON
		 *
		 * @method encode
		 * @param  {Mixed}   arg    Entity to encode
		 * @param  {Boolean} silent [Optional] Silently fail
		 * @return {String} JSON, or undefined
		 */
		encode : function (arg, silent) {
			try {
				return JSON.stringify(arg);
			}
			catch (e) {
				if (silent !== true) error(e, arguments, this);
				return undefined;
			}
		}
	};

	/**
	 * Labels for localization
	 *
	 * Override this with another language pack
	 *
	 * @class label
	 * @namespace abaaso
	 */
	label = {
		// Common labels
		common : {
			back    : "Back",
			cancel  : "Cancel",
			clear   : "Clear",
			close   : "Close",
			cont    : "Continue",
			create	: "Create",
			del     : "Delete",
			edit    : "Edit",
			find    : "Find",
			gen     : "Generate",
			go      : "Go",
			loading : "Loading",
			next    : "Next",
			login   : "Login",
			ran     : "Random",
			reset   : "Reset",
			save    : "Save",
			search  : "Search",
			submit  : "Submit"
		},

		// Days of the week
		day : {
			0 : "Sunday",
			1 : "Monday",
			2 : "Tuesday",
			3 : "Wednesday",
			4 : "Thursday",
			5 : "Friday",
			6 : "Saturday"
		},

		// Error messages
		error : {
			databaseNotOpen       : "Failed to open the Database, possibly exceeded Domain quota",
			databaseNotSupported  : "Client does not support local database storage",
			databaseWarnInjection : "Possible SQL injection in database transaction, use the &#63; placeholder",
			elementNotCreated     : "Could not create the Element",
			elementNotFound       : "Could not find the Element",
			expectedArray         : "Expected an Array",
			expectedArrayObject   : "Expected an Array or Object",
			expectedBoolean       : "Expected a Boolean value",
			expectedNumber        : "Expected a Number",
			expectedObject        : "Expected an Object",
			invalidArguments      : "One or more arguments is invalid",
			invalidDate           : "Invalid Date",
			invalidFields         : "The following required fields are invalid: ",
			propertyNotFound      : "Could not find the requested property",
			serverError           : "Server error has occurred",
			serverForbidden       : "Forbidden to access URI",
			serverInvalidMethod   : "Method not allowed",
			serverUnauthorized    : "Authorization required to access URI"
		},

		// Months of the Year
		month : {
			0  : "January",
			1  : "February",
			2  : "March",
			3  : "April",
			4  : "May",
			5  : "June",
			6  : "July",
			7  : "August",
			8  : "September",
			9  : "October",
			10 : "November",
			11 : "December"
		}
	};

	/**
	 * Messaging between iframes
	 *
	 * @class abaaso
	 * @namespace abaaso
	 */
	message = {
		/**
		 * Clears the message listener
		 *
		 * @method clear
		 * @return {Object} abaaso
		 */
		clear : function () {
			return $.un(global, "message");
		},

		/**
		 * Posts a message to the target
		 *
		 * @method send
		 * @param  {Object} target Object to receive message
		 * @param  {Mixed}  arg    Entity to send as message
		 * @return {Object} target
		 */
		send : function (target, arg) {
			try {
				target.postMessage(arg, "*");
				return target;
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Sets a handler for recieving a message
		 *
		 * @method recv
		 * @param  {Function} fn  Callback function
		 * @return {Object} abaaso
		 */
		recv : function (fn) {
			return $.on(global, "message", fn);
		}
	};

	/**
	 * Mouse tracking
	 *
	 * @class mouse
	 * @namespace abaaso
	 */
	mouse = {
		//Indicates whether mouse tracking is enabled
		enabled : false,

		// Indicates whether to try logging co-ordinates to the console
		log     : false,

		// Mouse coordinates
		diff    : {x: null, y: null},
		pos     : {x: null, y: null},
		prev    : {x: null, y: null},

		/**
		 * Enables or disables mouse co-ordinate tracking
		 *
		 * @method track
		 * @param  {Mixed} n Boolean to enable/disable tracking, or Mouse Event
		 * @return {Object} abaaso.mouse
		 */
		track : function (e) {
			var m = abaaso.mouse;
			switch (true) {
				case typeof e === "object":
					var x = e.pageX ? e.pageX : ((client.ie && client.version < 9 ? document.documentElement.scrollLeft : document.body.scrollLeft) + e.clientX),
					    y = e.pageY ? e.pageY : ((client.ie && client.version < 9 ? document.documentElement.scrollTop  : document.body.scrollTop)  + e.clientY),
					    c = false;

					if (m.pos.x !== x) c = true;
					$.mouse.prev.x = m.prev.x = Number(m.pos.x);
					$.mouse.pos.x  = m.pos.x  = x;
					$.mouse.diff.x = m.diff.x = m.pos.x - m.prev.x;

					if (m.pos.y !== y) c = true;
					$.mouse.prev.y = m.prev.y = Number(m.pos.y);
					$.mouse.pos.y  = m.pos.y  = y;
					$.mouse.diff.y = m.diff.y = m.pos.y - m.prev.y;

					if (c && m.log) utility.log(m.pos.x + " [" + m.diff.x + "], " + m.pos.y + " [" + m.diff.y + "]");
					break;
				case typeof e === "boolean":
					e ? observer.add(document, "mousemove", abaaso.mouse.track) : observer.remove(document, "mousemove");
					$.mouse.enabled = m.enabled = e;
					break;
			}
			return m;
		}
	};


	/**
	 * Number methods
	 *
	 * @class number
	 * @namespace abaaso
	 */
	number = {
		/**
		 * Returns the difference of arg
		 *
		 * @method odd
		 * @param {Number} arg Number to compare
		 * @return {Number} The absolute difference
		 */
		diff : function (arg) {
			try {
				if (typeof arg !== "number" || typeof this !== "number") throw Error(label.error.expectedNumber);

				return Math.abs(this - arg);
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Formats a Number to a delimited String
		 * 
		 * @method format
		 * @param  {Number} arg       Number to format
		 * @param  {String} delimiter [Optional] String to delimit the Number with
		 * @param  {String} every     [Optional] Position to insert the delimiter, default is 3
		 * @return {String} Number represented as a comma delimited String
		 */
		format : function (arg, delimiter, every) {
			try {
				if (typeof arg !== "number") throw Error(label.error.expectedNumber);

				arg       = arg.toString();
				delimiter = delimiter || ",";
				every     = every || 3;

				var d = arg.indexOf(".") > -1 ? "." + arg.replace(/.*\./, "") : "",
				    a = arg.replace(/\..*/, "").split("").reverse(),
				    p = Math.floor(a.length / every),
				    i = 1, n, b;

				for (b = 0; b < p; b++) {
					n = i === 1 ? every : (every * i) + (i === 2 ? 1 : (i - 1));
					a.splice(n, 0, delimiter);
					i++;
				}

				a = a.reverse().join("");
				if (a.charAt(0) === delimiter) a = a.substring(1);
				return a + d;
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Tests if an number is even
		 *
		 * @method even
		 * @param {Number} arg Number to test
		 * @return {Boolean} True if even, or undefined
		 */
		even : function (arg) {
			return arg % 2 === 0;
		},

		/**
		 * Tests if a number is odd
		 *
		 * @method odd
		 * @param {Number} arg Number to test
		 * @return {Boolean} True if odd, or undefined
		 */
		odd : function (arg) {
			return !(arg % 2 === 0);
		},

		/**
		 * Parses the argument
		 * 
		 * @param  {Mixed} arg Number to parse
		 * @return {Number}     Integer or float
		 */
		parse : function (arg) {
			return String(arg).indexOf(".") < 0 ? parseInt(arg) : parseFloat(arg);
		}
	};

	/**
	 * Global Observer wired to a State Machine
	 *
	 * @class observer
	 * @namespace abaaso
	 */
	observer = {
		// Collection of listeners
		listeners : {},

		// Boolean indicating if events are logged to the console
		log : false,

		/**
		 * Adds a handler to an event
		 *
		 * @method add
		 * @param  {Mixed}    obj   Entity or Array of Entities or $ queries
		 * @param  {String}   event Event being fired
		 * @param  {Function} fn    Event handler
		 * @param  {String}   id    [Optional / Recommended] The id for the listener
		 * @param  {String}   scope [Optional / Recommended] The id of the object or element to be set as 'this'
		 * @param  {String}   state [Optional] The state the listener is for
		 * @return {Mixed} Entity, Array of Entities or undefined
		 */
		add : function (obj, event, fn, id, scope, state) {
			try {
				obj   = utility.object(obj);
				scope = scope || abaaso;
				state = state || "active";

				if (obj instanceof Array) return obj.each(function (i) { observer.add(i, event, fn, id, scope, state); });

				if (typeof id === "undefined" || !/\w/.test(id)) id = utility.guid(true);

				var instance = null,
				    regex    = /click|dragstart|dragenter|dragleave|dragend|key|mouse/,
				    l        = observer.listeners,
				    o        = this.id(obj),
				    n        = false,
				    item, add, reg;

				if (typeof o === "undefined" || typeof event === "undefined" || typeof fn !== "function") throw Error(label.error.invalidArguments);

				if (typeof l[o] === "undefined")                      l[o]               = {};
				if (typeof l[o][event] === "undefined" && (n = true)) l[o][event]        = {};
				if (typeof l[o][event].active === "undefined")        l[o][event].active = {};
				if (typeof l[o][event][state] === "undefined")        l[o][event][state] = {};

				if (state === "active" && n) {
					switch (true) {
						case (/body|document|window/i.test(o)):
						case !/\//g.test(o) && o !== "abaaso":
							instance = obj;
							break;
						default:
							instance = null;
					}

					if (instance !== null && event.toLowerCase() !== "afterjsonp" && typeof instance !== "undefined" && (/body|document|window/i.test(o) || (typeof instance.listeners === "function" && array.cast(instance.listeners(event).active).length === 0))) {
						add = (typeof instance.addEventListener === "function");
						reg = (typeof instance.attachEvent === "object" || add);
						if (reg) instance[add ? "addEventListener" : "attachEvent"]((add ? "" : "on") + event, function (e) {
							if (!regex.test(e.type)) {
								if (typeof e.cancelBubble !== "undefined")   e.cancelBubble = true;
								if (typeof e.preventDefault === "function")  e.preventDefault();
								if (typeof e.stopPropagation === "function") e.stopPropagation();
							}
							observer.fire(obj, event, e);
						}, false);
					}
				}

				item = {fn: fn, scope: scope};
				l[o][event][state][id] = item;

				return obj;
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Gets the Observer id of arg
		 *
		 * @method id
		 * @param  {Mixed} Object or String
		 * @return {String} Observer id
		 * @private
		 */
		id : function (arg) {
			var x;
			switch (true) {
				case arg === abaaso:
					x = "abaaso";
					break;
				case arg === global:
					x = "window";
					break;
				case arg === document:
					x = "document";
					break;
				case arg === document.body:
					x = "body";
					break;
				default:
					x = typeof arg.id !== "undefined" ? arg.id : (typeof arg.toString === "function" ? arg.toString() : arg);
			}
			return x;
		},

		/**
		 * Fires an event
		 *
		 * @method fire
		 * @param  {Mixed}  obj   Entity or Array of Entities or $ queries
		 * @param  {String} event Event being fired
		 * @param  {Mixed}  arg   [Optional] Argument supplied to the listener
		 * @return {Mixed} Entity, Array of Entities or undefined
		 */
		fire : function (obj, event, arg) {
			try {
				obj = utility.object(obj);

				if (obj instanceof Array) return obj.each(function (i) { observer.fire(obj[i], event, arg); });

				var o = this.id(obj),
				    a = arg,
				    c, l;

				if (typeof o === "undefined" || String(o).isEmpty() || typeof obj === "undefined" || typeof event === "undefined") throw Error(label.error.invalidArguments);

				if ($.observer.log || abaaso.observer.log) utility.log("[" + new Date().toLocaleTimeString() + " - " + o + "] " + event);
				l = this.list(obj, event).active;
				utility.iterate(l, function (i, k) { i.fn.call(i.scope, a); });
				return obj;
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Gets the listeners for an event
		 *
		 * @method list
		 * @param  {Mixed}  obj   Entity or Array of Entities or $ queries
		 * @param  {String} event Event being queried
		 * @return {Array} Array of listeners for the event
		 */
		list : function (obj, event) {
			obj   = utility.object(obj);
			var l = this.listeners,
			    o = this.id(obj),
			    r;

			switch (true) {
				case typeof l[o] === "undefined" && typeof event === "undefined":
					r = {};
					break;
				case typeof l[o] !== "undefined" && (typeof event === "undefined" || String(event).isEmpty()):
					r = l[o];
					break;
				case typeof l[o] !== "undefined" && typeof l[o][event] !== "undefined":
					r = l[o][event];
					break;
				default:
					r = {active: {}};
			}
			return r;
		},

		/**
		 * Removes listeners
		 *
		 * @method remove
		 * @param  {Mixed}  obj   Entity or Array of Entities or $ queries
		 * @param  {String} event [Optional] Event being fired
		 * @param  {String} id    [Optional] Listener id
		 * @param  {String} state [Optional] The state the listener is for
		 * @return {Mixed}  Entity, Array of Entities or undefined
		 */
		remove : function (obj, event, id, state) {
			obj   = utility.object(obj);
			state = state || "active";

			if (obj instanceof Array) return obj.each(function (i) { observer.remove(i, event, id, state); });

			var instance = null,
			    l = observer.listeners,
			    o = this.id(obj);

			switch (true) {
				case typeof o === "undefined":
				case typeof l[o] === "undefined":
				case typeof event !== "undefined" && typeof l[o][event] === "undefined":
					return obj;
			}

			if (typeof event === "undefined") delete l[o];
			else typeof id === "undefined" ? l[o][event][state] = {} : delete l[o][event][state][id];

			return obj;
		},

		/**
		 * Triggers an Observer state change
		 *
		 * @method state
		 * @param  {String} arg Application state
		 * @return {Object} abaaso
		 */
		state : function (arg) {
			var l = this.listeners,
			    p = $.state.previous,
			    e;

			utility.iterate(l, function (v, k) {
				utility.iterate(v, function (s, d) {
					v[p]     = v.active;
					v.active = v[arg] || {};
					if (typeof v[arg] !== "undefined") delete v[arg];
				});
			});
			$.fire(arg);
			return abaaso;
		}
	};

	/**
	 * String methods
	 * 
	 * @class string
	 * @namespace abaaso
	 */
	string = {
		/**
		 * Capitalizes the String
		 * 
		 * @param  {String} obj String to capitalize
		 * @return {String} Capitalized String
		 */
		capitalize : function (obj) {
			obj = string.trim(obj);
			return obj.charAt(0).toUpperCase() + obj.slice(1);
		},

		/**
		 * Splits a string on comma, or a parameter, and trims each value in the resulting Array
		 * 
		 * @param  {String} obj String to capitalize
		 * @param  {String} arg String to split on
		 * @return {Array} Array of the exploded String
		 */
		explode : function (obj, arg) {
			if (typeof arg === "undefined" || arg.toString() === "") arg = ",";
			return string.trim(obj).split(new RegExp("\\s*" + arg + "\\s*"));
		},

		/**
		 * Replaces all spaces in a string with dashes
		 * 
		 * @param  {String} obj String to hyphenate
		 * @return {String} String with dashes instead of spaces
		 */
		hyphenate : function (obj) {
			return string.trim(obj).replace(/\s+/g, "-");
		},

		/**
		 * Transforms the case of a String into CamelCase
		 * 
		 * @param  {String} obj String to capitalize
		 * @return {String} Camel case String
		 */
		toCamelCase : function (obj) {
			var s = string.trim(obj).toLowerCase().split(" "),
			    r = [],
			    x = 0,
			    i, nth;

			s.each(function (i) {
				i = string.trim(i);
				if (i.isEmpty()) return;
				r.push(x++ === 0 ? i : string.capitalize(i));
			});
			return r.join("");
		},

		/**
		 * Trims the whitespace around a String
		 * 
		 * @param  {String} obj String to capitalize
		 * @return {String} Trimmed String
		 */
		trim : function (obj) {
			return obj.replace(/^\s+|\s+$/g, "");
		},

		/**
		 * Uncapitalizes the String
		 * 
		 * @param  {String} obj String to capitalize
		 * @return {String} Uncapitalized String
		 */
		uncapitalize : function (obj) {
			obj = string.trim(obj);
			return obj.charAt(0).toLowerCase() + obj.slice(1);
		}
	};

	/**
	 * Utility methods
	 *
	 * @class utility
	 * @namespace abaaso
	 */
	utility = {
		/**
		 * Queries the DOM using CSS selectors and returns an Element or Array of Elements
		 * 
		 * Accepts comma delimited queries
		 *
		 * @method $
		 * @param  {String}  arg      Comma delimited string of target #id, .class, tag or selector
		 * @param  {Boolean} nodelist [Optional] True will return a NodeList (by reference) for tags & classes
		 * @return {Mixed} Element or Array of Elements
		 */
		$ : function (arg, nodelist) {
			// Blocking DOM query of unique URIs via $.on()
			if (String(arg).indexOf("?") > -1) return undefined;

			var result = [],
			    obj, sel;

			arg      = arg.trim();
			nodelist = (nodelist === true);

			// Recursive processing, ends up below
			if (arg.indexOf(",") > -1) arg = arg.explode();
			if (arg instanceof Array) {
				arg.each(function (i) { result.push($(i, nodelist)); });
				return result;
			}

			// Getting Element(s)
			switch (true) {
				case (/\s|>/.test(arg)):
					sel = arg.split(" ").filter(function (i) { if (i.trim() !== "" && i !== ">") return true; }).last();
					obj = document[sel.indexOf("#") > -1 && sel.indexOf(":") === -1 ? "querySelector" : "querySelectorAll"](arg);
					break;
				case arg.indexOf("#") === 0 && arg.indexOf(":") === -1:
					obj = isNaN(arg.charAt(1)) ? document.querySelector(arg) : document.getElementById(arg.substring(1));
					break;
				case arg.indexOf("#") > -1 && arg.indexOf(":") === -1:
					obj = document.querySelector(arg);
					break;
				default:
					obj = document.querySelectorAll(arg);
			}

			// Transforming obj if required
			if (typeof obj !== "undefined" && obj !== null && !(obj instanceof Element) && !nodelist) obj = array.cast(obj);
			if (obj === null) obj = undefined;

			return obj;
		},

		/**
		 * Aliases origin onto obj
		 *
		 * @method alias
		 * @param  {Object} obj    Object receiving aliasing
		 * @param  {Object} origin Object providing structure to obj
		 * @return {Object} Object receiving aliasing
		 */
		alias : function (obj, origin) {
			var o = obj,
			    s = origin;

			utility.iterate(s, function (v, k) {
				var getter, setter;

				switch (true) {
					case !(v instanceof RegExp) && typeof v === "function":
						o[k] = v.bind(o[k]);
						break;
					case !(v instanceof RegExp) && !(v instanceof Array) && v instanceof Object:
						if (typeof o[k] === "undefined") o[k] = {};
						utility.alias(o[k], s[k]);
						break;
					default:
						getter = function () { return s[k]; },
						setter = function (arg) { s[k] = arg; };
						utility.property(o, k, {enumerable: true, get: getter, set: setter, value: s[k]});
				}
			});
			return obj;
		},

		/**
		 * Clones an Object
		 *
		 * @method clone
		 * @param {Object}  obj     Object to clone
		 * @return {Object} Clone of obj
		 */
		clone : function (obj) {
			var clone;

			switch (true) {
				case obj instanceof Array:
					return [].concat(obj);
				case typeof obj === "boolean":
					return Boolean(obj);
				case typeof obj === "function":
					return obj;
				case typeof obj === "number":
					return Number(obj);
				case typeof obj === "string":
					return String(obj);
				case !client.ie && obj instanceof Document:
					return xml.decode(xml.encode(obj));
				case obj instanceof Object:
					clone = json.decode(json.encode(obj));
					if (typeof clone !== "undefined") {
						if (obj.hasOwnProperty("constructor")) clone.constructor = obj.constructor;
						if (obj.hasOwnProperty("prototype"))   clone.prototype   = obj.prototype;
					}
					return clone;
				default:
					return obj;
			}
		},

		/**
		 * Coerces a String to a Type
		 * 
		 * @param  {String} value String to coerce
		 * @return {Mixed}        Typed version of the String
		 */
		coerce : function (value) {
			var result = utility.clone(value),
			    regex  = new RegExp(),
			    tmp;

			switch (true) {
				case utility.compile(regex, "^\\d$") && regex.test(result):
					result = number.parse(result);
					break;
				case utility.compile(regex, "^(true|false)$", "i") && regex.test(result):
					result = (utility.compile(regex, "true", "i") && regex.test(result));
					break;
				case result === "undefined":
					result = undefined;
					break;
				case result === "null":
					result = null;
					break;
				case (tmp = json.decode(result, true)) && typeof tmp !== "undefined":
					result = tmp;
					break;
			}
			return result;
		},

		/**
		 * Recompiles a RegExp by reference
		 *
		 * This is ideal when you need to recompile a regex for use within a conditional statement
		 * 
		 * @param  {Object} regex     RegExp
		 * @param  {String} pattern   Regular expression pattern
		 * @param  {String} modifiers Modifiers to apply to the pattern
		 * @return {Boolean}          true
		 */
		compile : function (regex, pattern, modifiers) {
			return !regex.compile(pattern, modifiers);
		},

		/**
		 * Allows deep setting of properties without knowing
		 * if the structure is valid
		 *
		 * @method define
		 * @param  {String} args  Dot delimited string of the structure
		 * @param  {Mixed}  value Value to set
		 * @param  {Object} obj   Object receiving value
		 * @return {Object} Object receiving value
		 */
		define : function (args, value, obj) {
			args  = args.split(".");
			if (typeof obj   === "undefined") obj   = this;
			if (typeof value === "undefined") value = null;
			if (obj === $) obj = abaaso;

			var p   = obj,
			    nth = args.length;

			args.each(function (i, idx) {
				var num = idx + 1 < nth && !isNaN(parseInt(args[idx + 1])),
				    val = value;

				if (!isNaN(parseInt(i))) i = parseInt(i);
				
				// Creating or casting
				switch (true) {
					case typeof p[i] === "undefined":
						p[i] = num ? [] : {};
						break;
					case p[i] instanceof Object && num:
						p[i] = array.cast(p[i]);
						break;
					case p[i] instanceof Object:
						break;
					case p[i] instanceof Array && !num:
						p[i] = p[i].toObject();
						break;
					default:
						p[i] = {};
				}

				// Setting reference or value
				idx + 1 === nth ? p[i] = val : p = p[i];
			});

			return obj;
		},

		/**
		 * Defers the execution of Function by at least the supplied milliseconds
		 * Timing may vary under "heavy load" relative to the CPU & client JavaScript engine
		 *
		 * @method defer
		 * @param  {Function} fn Function to defer execution of
		 * @param  {Number}   ms Milliseconds to defer execution
		 * @param  {Number}   id [Optional] ID of the deferred function
		 * @return {Object} undefined
		 */
		defer : function (fn, ms, id) {
			if (typeof id === "undefined" || String(id).isEmpty()) id = utility.guid(true);
			var op = function () { delete abaaso.timer[id]; fn(); };

			abaaso.timer[id] = setTimeout(op, ms);
			return undefined;
		},

		/**
		 * Encodes a GUID to a DOM friendly ID
		 *
		 * @method domId
		 * @param  {String} GUID
		 * @return {String} DOM friendly ID
		 * @private
		 */
		domId : function (arg) {
			return "a" + arg.replace(/-/g, "").slice(1);
		},

		/**
		 * Error handling, with history in .log
		 *
		 * @method error
		 * @param  {Mixed}   e        Error object or message to display
		 * @param  {Array}   args     Array of arguments from the callstack
		 * @param  {Mixed}   scope    Entity that was "this"
		 * @param  {Boolean} warning  [Optional] Will display as console warning if true
		 * @return {Undefined} undefined
		 */
		error : function (e, args, scope, warning) {
			var o;

			if (typeof e !== "undefined") {
				warning = (warning === true);
				o = {
					arguments : args,
					message   : typeof e.message !== "undefined" ? e.message : e,
					number    : typeof e.number !== "undefined" ? (e.number & 0xFFFF) : undefined,
					scope     : scope,
					stack     : typeof e.stack === "string" ? e.stack : undefined,
					timestamp : new Date().toUTCString(),
					type      : typeof e.type !== "undefined" ? e.type : "TypeError"
				};

				if (typeof console !== "undefined") console[!warning ? "error" : "warn"](o.message);
				$.error.log.push(o);
				$.fire("error", o);
			}

			return undefined;
		},

		/**
		 * Creates a class extending obj, with optional decoration
		 *
		 * @method extend
		 * @param  {Object} obj Object to extend
		 * @param  {Object} arg [Optional] Object for decoration
		 * @return {Object} Decorated obj
		 */
		extend : function (obj, arg) {
			try {
				if (typeof obj === "undefined") throw Error(label.error.invalidArguments);

				if (typeof arg === "undefined") arg = {};

				var o, f;

				switch (true) {
					case typeof Object.create === "function":
						o = Object.create(obj);
						break;
					default:
						f = function () {};
						f.prototype = obj;
						o = new f();
				}

				utility.merge(o, arg);
				return o;
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Generates an ID value
		 *
		 * @method genId
		 * @param  {Mixed} obj [Optional] Object to receive id
		 * @return {Mixed} Object or id
		 */
		genId : function (obj) {
			switch (true) {
				case obj instanceof Array:
				case obj instanceof String:
				case typeof obj === "string":
				case typeof obj !== "undefined" && typeof obj.id !== "undefined" && /\w/.test(obj.id):
					return obj;
			}

			var id;

			do id = utility.domId(utility.guid(true));
			while (typeof $("#" + id) !== "undefined");

			if (typeof obj === "object") {
				obj.id = id;
				return obj;
			}
			else return id;
		},

		/**
		 * Generates a GUID
		 *
		 * @method guid
		 * @param {Boolean} safe [Optional] Strips - from GUID
		 * @return {String} GUID
		 */
		guid : function (safe) {
			safe  = (safe === true);
			var s = function () { return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); },
			    o;

			o = (s() + s() + "-" + s() + "-4" + s().substr(0,3) + "-" + s() + "-" + s() + s() + s()).toLowerCase();
			if (safe) o = o.replace(/-/gi, "");
			return o;
		},

		/**
		 * Iterates an Object and executes a function against the properties
		 * 
		 * @param  {Object}   obj Object to iterate
		 * @param  {Function} fn  Function to execute against properties
		 * @return {Object} Object
		 */
		iterate : function (obj, fn) {
			var i;

			for (i in obj) if (Object.prototype.hasOwnProperty.call(obj, i) && typeof fn === "function") fn.call(obj, obj[i], i);
			return obj;
		},

		/**
		 * Renders a loading icon in a target element,
		 * with a class of "loading"
		 *
		 * @method loading
		 * @param  {Mixed} obj Entity or Array of Entities or $ queries
		 * @return {Mixed} Entity, Array of Entities or undefined
		 */
		loading : function (obj) {
			try {
				var l = abaaso.loading;

				obj = utility.object(obj);
				if (obj instanceof Array) return obj.each(function (i) { utility.loading(i); });

				if (l.url === null) throw Error(label.error.elementNotFound);

				if (typeof obj === "undefined") throw Error(label.error.invalidArguments);

				// Setting loading image
				if (typeof l.image === "undefined") {
					l.image     = new Image();
					l.image.src = l.url;
				}

				// Clearing target element
				obj.clear();

				// Creating loading image in target element
				obj.create("div", {"class": "loading"}).create("img", {alt: label.common.loading, src: l.image.src});

				return obj;
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Writes argument to the console
		 *
		 * @method log
		 * @param  {String} arg String to write to the console
		 * @return undefined;
		 * @private
		 */
		log : function (arg) {
			try {
				console.log(arg);
			}
			catch (e) {
				error(e, arguments, this);
			}
			return undefined;
		},

		/**
		 * Merges obj with arg
		 * 
		 * @param  {Object} obj Object to decorate
		 * @param  {Object} arg Object to decorate with
		 * @return {Object} Object to decorate
		 */
		merge : function (obj, arg) {
			utility.iterate(arg, function (v, k) {
				obj[k] = utility.clone(v);
			});
			return obj;
		},
		
		/**
		 * Registers a module in the abaaso namespace
		 * 
		 * @method module
		 * @param  {String} arg Module name
		 * @param  {Object} obj Module structure
		 * @return {Object}
		 */
		module : function (arg, obj) {
			try {
				if (typeof $[arg] !== "undefined" || typeof abaaso[arg] !== "undefined" || !obj instanceof Object) throw Error(label.error.invalidArguments);
				
				abaaso[arg] = obj;
				if (typeof obj === "function") $[arg] = abaaso[arg].bind($[arg]);
				else {
					$[arg] = {};
					utility.alias($[arg], abaaso[arg]);
				}
				return $[arg];
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Returns Object, or reference to Element
		 *
		 * @method object
		 * @param  {Mixed} obj Entity or $ query
		 * @returns {Mixed} Entity
		 * @private
		 */
		object : function (obj) {
			return typeof obj === "object" ? obj : (obj.toString().charAt(0) === "#" ? $(obj) : obj);
		},

		/**
		 * Sets a property on an Object, if defineProperty cannot be used the value will be set classically
		 * 
		 * @param {Object} obj        Object to decorate
		 * @param {String} prop       Name of property to set
		 * @param {Object} descriptor Descriptor of the property
		 */
		property : function (obj, prop, descriptor) {
			if (!(descriptor instanceof Object)) throw Error(label.error.invalidArguments);

			var define;

			define = (!client.ie || client.version > 8) && typeof Object.defineProperty === "function";
			if (define && typeof descriptor.value !== "undefined" && typeof descriptor.get !== "undefined") delete descriptor.value;
			define ? Object.defineProperty(obj, prop, descriptor) : obj[prop] = descriptor.value;
		},

		/**
		 * Sets methods on a prototype object
		 *
		 * @method proto
		 * @param  {Object} obj Object receiving prototype extension
		 * @param  {String} type Identifier of obj, determines what Arrays to apply
		 * @return {Object} obj or undefined
		 * @private
		 */
		proto : function (obj, type) {
			// Collection of methods to add to prototypes
			var i,
			    methods = {
				array   : {addClass : function (arg) { return this.each(function (i) { if (typeof i.addClass === "function") i.addClass(arg); }); },
				           after    : function (type, args) { var a = []; this.each(function (i) { if (typeof i.after === "function") a.push(i.after(type, args)); }); return a; },
				           append   : function (type, args) { var a = []; this.each(function (i) { if (typeof i.append === "function") a.push(i.append(type, args)); }); return a; },
				           attr     : function (key, value) { var a = []; this.each(function (i) { if (typeof i.attr === "function") a.push(i.attr(key, value)); }); return a; },
				           before   : function (type, args) { var a = []; this.each(function (i) { if (typeof i.before === "function") a.push(i.before(type, args)); }); return a; },
				           clear    : function (arg) { return this.each(function (i) { if (typeof i.clear === "function") i.clear(); }); },
				           clone    : function () { return utility.clone(this); },
				           contains : function (arg) { return array.contains(this, arg); },
				           create   : function (type, args, position) { var a = []; this.each(function (i) { if (typeof i.create === "function") a.push(i.create(type, args, position)); }); return a; },
				           css      : function (key, value) { return this.each(function (i) { if (typeof i.css === "function") i.css(key, value); }); },
				           data     : function (key, value) { var a = []; this.each(function (i) { if (typeof i.data === "function") a.push(i.data(key, value)); }); return a; },
				           diff     : function (arg) { return array.diff(this, arg); },
				           disable  : function () { return this.each(function (i) { if (typeof i.disable === "function") i.disable(); }); },
				           destroy  : function () { this.each(function (i) { if (typeof i.destroy === "function") i.destroy(); }); return []; },
				           each     : function (arg) { return array.each(this, arg); },
				           enable   : function () { return this.each(function (i) { if (typeof i.enable === "function") i.enable(); }); },
				           first    : function () { return array.first(this); },
				           get      : function (uri, headers) { this.each(function (i) { if (typeof i.get === "function") i.get(uri, headers); }); return []; },
				           hasClass : function (arg) { var a = []; this.each(function (i) { if (typeof i.hasClass === "function") a.push(i.hasClass(arg)); }); return a; },
				           hide     : function () { return this.each(function (i){ if (typeof i.hide === "function") i.hide(); }); },
				           html     : function (arg) {
				           		if (typeof arg !== "undefined") return this.each(function (i){ if (typeof i.html === "function") i.html(arg); });
				           		else {
				           			var a = []; this.each(function (i) { if (typeof i.html === "function") a.push(i.html()); }); return a;
				           		}
				           },
				           index    : function (arg) { return array.index(this, arg); },
				           indexed  : function () { return array.indexed(this); },
				           intersect: function (arg) { return array.intersect(this, arg); },
				           isAlphaNum: function () { var a = []; this.each(function (i) { if (typeof i.isAlphaNum === "function") a.push(i.isAlphaNum()); }); return a; },
				           isBoolean: function () { var a = []; this.each(function (i) { if (typeof i.isBoolean === "function") a.push(i.isBoolean()); }); return a; },
				           isChecked: function () { var a = []; this.each(function (i) { if (typeof i.isChecked === "function") a.push(i.isChecked()); }); return a; },
				           isDate   : function () { var a = []; this.each(function (i) { if (typeof i.isDate === "function") a.push(i.isDate()); }); return a; },
				           isDisabled: function () { var a = []; this.each(function (i) { if (typeof i.isDisabled === "function") a.push(i.isDisabled()); }); return a; },
				           isDomain : function () { var a = []; this.each(function (i) { if (typeof i.isDomain === "function") a.push(i.isDomain()); }); return a; },
				           isEmail  : function () { var a = []; this.each(function (i) { if (typeof i.isEmail === "function") a.push(i.isEmail()); }); return a; },
				           isHidden : function () { var a = []; this.each(function (i) { if (typeof i.isHidden === "function") a.push(i.isHidden()); }); return a; },
				           isIP     : function () { var a = []; this.each(function (i) { if (typeof i.isIP === "function") a.push(i.isIP()); }); return a; },
				           isInt    : function () { var a = []; this.each(function (i) { if (typeof i.isInt === "function") a.push(i.isInt()); }); return a; },
				           isNumber : function () { var a = []; this.each(function (i) { if (typeof i.isNumber === "function") a.push(i.isNumber()); }); return a; },
				           isPhone  : function () { var a = []; this.each(function (i) { if (typeof i.isPhone === "function") a.push(i.isPhone()); }); return a; },
				           isString : function () { var a = []; this.each(function (i) { if (typeof i.isString === "function") a.push(i.isString()); }); return a; },
				           keys     : function () { return array.keys(this); },
				           last     : function (arg) { return array.last(this); },
				           loading  : function () { return this.each(function (i) { i.loading(); }); },
				           on       : function (event, listener, id, scope, state) { return this.each(function (i) { if (typeof i.on === "function") i.on(event, listener, id, typeof scope !== "undefined" ? scope : i, state); }); },
				           position : function () { var a = []; this.each(function (i) { if (typeof i.position === "function") a.push(i.position()); }); return a; },
				           prepend  : function (type, args) { var a = []; this.each(function (i) { if (typeof i.prepend === "function") a.push(i.prepend(type, args)); }); return a; },
				           range    : function (start, end) { return array.range(this, start, end); },
				           remove   : function (start, end) { return array.remove(this, start, end); },
				           removeClass: function (arg) { return this.each(function (i) { if (typeof i.removeClass === "function") i.removeClass(arg); }); },
				           show     : function () { return this.each(function (i){ if (typeof i.show === "function") i.show(); }); },
				           size     : function () { var a = []; this.each(function (i) { if (typeof i.size === "function") a.push(i.size()); }); return a; },
				           text     : function (arg) {
				           		return this.each(function (node) {
				           			if (typeof node !== "object") node = utility.object(node);
				           			if (typeof node.text === "function") node.text(arg);
				           		});
				           },
				           tpl      : function (arg) { return this.each(function (i) { if (typeof i.tpl === "function") i.tpl(arg); }); },
				           total    : function () { return array.total(this); },
				           toObject : function () { return array.toObject(this); },
				           un       : function (event, id, state) { return this.each(function (i) { if (typeof i.un === "function") i.un(event, id, state); }); },
				           update   : function (arg) { return this.each(function (i) { element.update(i, arg); }); },
				           val      : function (arg) {
				           		var a    = [],
				           		    type = null,
				           		    same = true;

				           		this.each(function (i) {
				           			if (type !== null) same = (type === i.type);
				           			type = i.type;
				           			if (typeof i.val === "function") a.push(i.val(arg));
				           		});
				           		return same ? a[0] : a;
				           	},
				           validate : function () { var a = []; this.each(function (i) { if (typeof i.validate === "function") a.push(i.validate()); }); return a; }},
				element : {addClass : function (arg) {
				           		this.genId();
				           		return element.klass(this, arg, true);
				           },
				           after    : function (type, args) {
				           		this.genId();
				           		return element.create(type, args, this, "after");
				           },
				           append   : function (type, args) {
				           		this.genId();
				           		return element.create(type, args, this, "last");
				           },
				           attr     : function (key, value) {
				           		this.genId();
				           		return element.attr(this, key, value);
				           },
				           before   : function (type, args) {
				           		this.genId();
				           		return element.create(type, args, this, "before");
				           },
				           clear    : function () {
				           		this.genId();
				           		return element.clear(this);
				           },
				           create   : function (type, args, position) {
				           		this.genId();
				           		return element.create(type, args, this, position);
				           },
				           css       : function (key, value) {
				           		var i;
				           		this.genId();
				           		if (!client.chrome && (i = key.indexOf("-")) && i > -1) {
				           			key = key.replace("-", "");
				           			key = key.slice(0, i) + key.charAt(i).toUpperCase() + key.slice(i + 1, key.length);
				           		}
				           		this.style[key] = value;
				           		return this;
				           },
				           data      : function (key, value) {
				           		this.genId();
				           		return element.data(this, key, value);
				           },
				           destroy   : function () { return element.destroy(this); },
				           disable   : function () { return element.disable(this); },
				           enable    : function () { return element.enable(this); },
				           get       : function (uri, headers) {
				           		this.fire("beforeGet");
				           		var cached = cache.get(uri),
				           		    guid   = utility.guid(true),
				           		    self   = this;

				           		!cached ? uri.get(function (a) { self.html(a).fire("afterGet"); }, null, headers)
				           		        : this.html(cached.response).fire("afterGet");

				           		return this;
				           },
				           hasClass : function (arg) {
				           		this.genId();
				           		return element.hasClass(this, arg);
				           },
				           hide     : function () {
				           		this.genId();
				           		return element.hide(this);
				           },
				           html     : function (arg) {
				           		this.genId();
				           		return typeof arg === "undefined" ? this.innerHTML : this.update({innerHTML: arg});
				           },
				           isAlphaNum: function () { return this.nodeName === "FORM" ? false : validate.test({alphanum: typeof this.value !== "undefined" ? this.value : this.innerText}).pass; },
				           isBoolean: function () { return this.nodeName === "FORM" ? false : validate.test({"boolean": typeof this.value !== "undefined" ? this.value : this.innerText}).pass; },
				           isChecked: function () { return this.nodeName !== "INPUT" ? false : this.attr("checked"); },
				           isDate   : function () { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isDate()   : this.innerText.isDate(); },
				           isDisabled: function () { return this.nodeName !== "INPUT" ? false : this.attr("disabled"); },
				           isDomain : function () { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isDomain() : this.innerText.isDomain(); },
				           isEmail  : function () { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isEmail()  : this.innerText.isEmail(); },
				           isEmpty  : function () { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isEmpty()  : this.innerText.isEmpty(); },
				           isHidden : function (arg) {
				           		this.genId();
				           		return element.hidden(this);
				           },
				           isIP     : function () { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isIP()     : this.innerText.isIP(); },
				           isInt    : function () { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isInt()    : this.innerText.isInt(); },
				           isNumber : function () { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isNumber() : this.innerText.isNumber(); },
				           isPhone  : function () { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isPhone()  : this.innerText.isPhone(); },
				           isString : function () { return this.nodeName === "FORM" ? false : typeof this.value !== "undefined" ? this.value.isString() : this.innerText.isString(); },
				           jsonp    : function (uri, property, callback) {
				           		var target = this,
				           		    arg    = property, fn;

				           		fn = function (response) {
				           			var self = target,
				           			    node = response,
				           			    prop = arg,
				           			    i, nth, result;

				           			try {
				           				if (typeof prop !== "undefined") {
				           					prop = prop.replace(/]|'|"/g, "").replace(/\./g, "[").split("[");
				           					prop.each(function (i) {
				           						node = node[!!isNaN(i) ? i : parseInt(i)];
				           						if (typeof node === "undefined") throw Error(label.error.propertyNotFound);
				           					});
				           					result = node;
				           				}
				           				else result = response;
				           			}
				           			catch (e) {
				           				result = label.error.serverError;
				           				error(e, arguments, this);
				           			}

				           			self.text(result);
				           		};
				           		client.jsonp(uri, fn, function () { target.text(label.error.serverError); }, callback);
				           		return this;
				           },
				           loading  : function () { return $.loading.create(this); },
				           on       : function (event, listener, id, scope, state) {
				           		this.genId();
				           		return $.on.call(this, event, listener, id, scope, state);
				           },
				           prepend  : function (type, args) {
				           		this.genId();
				           		return element.create(type, args, this, "first");
				           },
				           prependChild: function (child) {
				           		this.genId();
				           		return element.prependChild(this, child);
				           },
				           position : function () {
				           		this.genId();
				           		return element.position(this);
				           },
				           removeClass : function (arg) {
				           		this.genId();
				           		return element.klass(this, arg, false);
				           },
				           show     : function () {
				           		this.genId();
				           		return element.show(this);
				           },
				           size     : function () {
				           		this.genId();
				           		return element.size(this);
				           },
				           text     : function (arg) {
				           		this.genId();
				           		return typeof arg === "undefined" ? this.innerText : this.update({innerText: arg});
				           },
				           tpl      : function (arg) { return $.tpl(arg, this); },
				           un       : function (event, id, state) {
				           		this.genId();
				           		return $.un.call(this, event, id, state);
				           },
				           update   : function (args) {
				           		this.genId();
				           		return element.update(this, args);
				           },
				           val      : function (arg) {
				           		this.genId();
				           		return element.val(this, arg);
				           },
				           validate : function () { return this.nodeName === "FORM" ? validate.test(this).pass : typeof this.value !== "undefined" ? !this.value.isEmpty() : !this.innerText.isEmpty(); }},
				"function": {reflect: function () { return utility.reflect(this); }},
				number  : {diff     : function (arg) { return number.diff.call(this, arg); },
				           format   : function (delimiter, every) { return number.format(this, delimiter, every); },
				           isEven   : function () { return number.even(this); },
				           isOdd    : function () { return number.odd(this); },
				           on       : function (event, listener, id, scope, state) { return $.on.call(this, event, listener, id, scope, state); },
				           un       : function (event, id, state) { return $.un.call(this, event, id, state); }},
				shared  : {fire     : function (event, args) {
				           		this.genId();
				           		return $.fire.call(this, event, args);
				           },
				           genId    : function () { return utility.genId(this); },
				           listeners: function (event) {
				           		this.genId();
				           		return $.listeners.call(this, event);
				           }},
				string  : {allows   : function (arg) { return client.allows(this, arg); },
				           capitalize: function () { return string.capitalize(this); },
				           del      : function (success, failure, headers) { return client.request(this, "DELETE", success, failure, null, headers); },
				           explode  : function (arg) { return string.explode(this, arg); },
				           get      : function (success, failure, headers) { return client.request(this, "GET", success, failure, null, headers); },
				           isAlphaNum: function () { return validate.test({alphanum: this}).pass; },
				           isBoolean: function () { return validate.test({"boolean": this}).pass; },
				           isDate   : function () { return validate.test({date: this}).pass; },
				           isDomain : function () { return validate.test({domain: this}).pass; },
				           isEmail  : function () { return validate.test({email: this}).pass; },
				           isEmpty  : function () { return !validate.test({notEmpty: this}).pass; },
				           isIP     : function () { return validate.test({ip: this}).pass; },
				           isInt    : function () { return validate.test({integer: this}).pass; },
				           isNumber : function () { return validate.test({number: this}).pass; },
				           isPhone  : function () { return validate.test({phone: this}).pass; },
				           isString : function () { return validate.test({string: this}).pass; },
				           jsonp    : function (success, failure, callback) { return client.jsonp(this, success, failure, callback); },
				           post     : function (success, failure, args, headers) { return client.request(this, "POST", success, failure, args, headers); },
				           put      : function (success, failure, args, headers) { return client.request(this, "PUT", success, failure, args, headers); },
				           on       : function (event, listener, id, scope, state) { return $.on.call(this, event, listener, id, scope, state); },
				           options  : function (success, failure) { return client.request(this, "OPTIONS", success, failure); },
				           headers  : function (success, failure) { return client.request(this, "HEAD", success, failure); },
				           permissions: function () { return client.permissions(this); },
				           toCamelCase: function () { return string.toCamelCase(this); },
				           hyphenate: function () { return string.hyphenate(this); },
				           trim     : function () { return string.trim(this); },
				           un       : function (event, id, state) { return $.un.call(this, event, id, state); },
				           uncapitalize: function () { return string.uncapitalize(this); }}
			};

			utility.iterate(methods[type], function (v, k) { utility.property(obj.prototype, k, {value: v}); });
			if (type !== "function") utility.iterate(methods.shared, function (v, k) { utility.property(obj.prototype, k, {value: v}); });
			return obj;
		},

		/**
		 * Returns an Object containing 1 or all key:value pairs from the querystring
		 *
		 * @method queryString
		 * @param  {String} arg [Optional] Key to find in the querystring
		 * @return {Object} Object of 1 or all key:value pairs in the querystring
		 */
		queryString : function (arg) {
			arg        = arg || ".*";
			var obj    = {},
			    result = location.search.isEmpty() ? null : location.search.replace("?", ""),
			    item;

			if (result !== null) {
				result = result.split("&");
				result.each(function (prop) {
					item = prop.split("=");

					if (item[0].isEmpty()) return;

					switch (true) {
						case typeof item[1] === "undefined":
						case item[1].isEmpty():
							item[1] = "";
							break;
						case item[1].isNumber():
							item[1] = Number(item[1]);
							break;
						case item[1].isBoolean():
							item[1] = (item[1] === "true");
							break;
					}

					switch (true) {
						case typeof obj[item[0]] === "undefined":
							obj[item[0]] = item[1];
							break;
						case !(obj[item[0]] instanceof Array):
							obj[item[0]] = [obj[item[0]]];
						default:
							obj[item[0]].push(item[1]);
					}
				});
			}
			return obj;
		},

		/**
		 * Returns an Array of parameters of a Function
		 * 
		 * @method reflect
		 * @param  {Function} arg Function to reflect
		 * @return {Array} Array of parameters
		 */
		reflect : function (arg) {
			if (typeof arg === "undefined") arg = this;
			if (typeof arg === "undefined") arg = $;
			arg = arg.toString().match(/function\s+\w*\s*\((.*?)\)/)[1];
			return arg !== "" ? arg.explode() : [];
		},

		/**
		 * Creates a recursive function
		 * 
		 * Return false from the function to halt recursion
		 * 
		 * @method repeat
		 * @param  {Function} fn      Function to execute repeatedly
		 * @param  {Number}   timeout Milliseconds to stagger the execution
		 * @param  {String}   id      [Optional] Timeout ID
		 * @return {String} Timeout ID
		 */
		repeat : function (fn, timeout, id) {
			id = id || utility.guid(true);
			var r = function (fn, timeout, id) {
				var r = this;
				if (fn() !== false) $.repeating[id] = setTimeout(function () { r.call(r, fn, timeout, id); }, timeout);
				else delete $.repeating[id];
			};
			r.call(r, fn, timeout, id);
			return id;
		},

		/**
		 * Transforms JSON to HTML and appends to Body or target Element
		 *
		 * @method create
		 * @param  {Object} data   JSON Object describing HTML
		 * @param  {Mixed}  target [Optional] Target Element or Element.id to receive the HTML
		 * @return {Object} Target Element
		 */
		tpl : function (arg, target) {
			try {
				switch (true) {
					case typeof arg !== "object":
					case !(/object|undefined/.test(typeof target)) && typeof (target = target.charAt(0) === "#" ? $(target) : $(target)[0]) === "undefined":
						throw Error(label.error.invalidArguments);
				}

				if (typeof target === "undefined") target = $("body")[0];

				var frag = document.createDocumentFragment();

				switch (true) {
					case arg instanceof Array:
						arg.each(function (i, idx) { element.create(array.cast(i, true)[0], frag).html(array.cast(i)[0]); });
						break;
					default:
						utility.iterate(arg, function (i, k) {
							switch (true) {
								case typeof i === "string":
									element.create(k, frag).html(i);
									break;
								case i instanceof Array:
								case i instanceof Object:
									utility.tpl(i, element.create(k, frag));
									break;
							}
						});
				}

				target.appendChild(frag);
				return target;
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		}
	};

	/**
	 * Validation methods and patterns
	 *
	 * @class validate
	 * @namespace abaaso
	 */
	validate = {
		// Regular expression patterns to test against
		pattern : {
			alphanum : /^[a-zA-Z0-9]*$/,
			"boolean": /^(0|1|true|false)?$/,
			domain   : /^[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:\/~\+#]*[\w\-\@?^=%&amp;\/~\+#])?/,
			email    : /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
			ip       : /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
			integer  : /(^-?\d\d*$)/,
			notEmpty : /\w{1,}/,
			number   : /(^-?\d\d*\.\d*$)|(^-?\d\d*$)|(^-?\.\d\d*$)/,
			phone    : /^\([1-9]\d{2}\)\s?\d{3}\-\d{4}$/,
			string   : /\w/
		},

		/**
		 * Validates args based on the type or pattern specified
		 *
		 * @method test
		 * @param  {Object} args Object to test {(pattern[name] || /pattern/) : (value || #object.id)}
		 * @return {Object} Results
		 */
		test : function (args) {
			var exception = false,
			    invalid   = [],
			    value     = null;

			if (typeof args.nodeName !== "undefined" && args.nodeName === "FORM") {
				var i, p, v, c, o, x, t = {}, nth, result, invalid = [], tracked = {};

				if (args.id.isEmpty()) args.genId();
				c = $("#" + args.id + " > input").concat($("#" + args.id + " > select"));
				c.each(function (i) {
					p = validate.pattern[i.nodeName.toLowerCase()] ? validate.pattern[i.nodeName.toLowerCase()] : ((!i.id.isEmpty() && validate.pattern[i.id.toLowerCase()]) ? validate.pattern[i.id.toLowerCase()] : "notEmpty");
					v = i.val();
					if (v === null) v = "";
					t[p] = v;
				});
				result = this.test(t);
				return result;
			}
			else {
				utility.iterate(args, function (i, k) {
					if (typeof k === "undefined" || typeof i === "undefined") {
						invalid.push({test: k, value: i});
						exception = true;
						return
					}
					value = i.charAt(0) === "#" ? (typeof $(i) !== "undefined" ? $(i).val() : "") : i;
					switch (k) {
						case "date":
							if (isNaN(new Date(value).getYear())) {
								invalid.push({test: k, value: value});
								exception = true;
							}
							break;
						case "domain":
							if (!validate.pattern.domain.test(value.replace(/.*\/\//, ""))) {
								invalid.push({test: k, value: value});
								exception = true;
							}
							break;
						case "domainip":
							if (!validate.pattern.domain.test(value.replace(/.*\/\//, "")) || !validate.pattern.ip.test(value)) {
								invalid.push({test: k, value: value});
								exception = true;
							}
							break;
						default:
							var p = typeof validate.pattern[k] !== "undefined" ? validate.pattern[k] : k;
							if (!p.test(value)) {
								invalid.push({test: k, value: value});
								exception = true;
							}
					}
				});
				return {pass: !exception, invalid: invalid};
			}
		}
	};

	/**
	 * XML methods
	 *
	 * @class xml
	 * @namespace abaaso
	 */
	xml = {
		/**
		 * Returns XML (Document) Object from a String
		 *
		 * @method decode
		 * @param  {String} arg XML String
		 * @return {Object} XML Object or undefined
		 */
		decode : function (arg) {
			try {
				if (typeof arg !== "string" || arg.isEmpty()) throw Error(label.error.invalidArguments);

				var x;

				if (client.ie) {
					x = new ActiveXObject("Microsoft.XMLDOM");
					x.async = "false";
					x.loadXML(arg);
				}
				else x = new DOMParser().parseFromString(arg, "text/xml");
				return x;
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		},

		/**
		 * Returns XML String from an Object or Array
		 *
		 * @method encode
		 * @param  {Mixed} arg Object or Array to cast to XML String
		 * @return {String} XML String or undefined
		 */
		encode : function (arg, wrap) {
			try {
				if (typeof arg === "undefined") throw Error(label.error.invalidArguments);

				wrap = !(wrap === false);
				var x    = wrap ? "<xml>" : "",
				    top  = !(arguments[2] === false),
				    node, i;

				if (arg !== null && typeof arg.xml !== "undefined") arg = arg.xml;
				if (arg instanceof Document) arg = (new XMLSerializer()).serializeToString(arg);

				node = function (name, value) {
					var output = "<n>v</n>";
					if (/\&|\<|\>|\"|\'|\t|\r|\n|\@|\$/g.test(value)) output = output.replace(/v/, "<![CDATA[v]]>");
					return output.replace(/n/g, name).replace(/v/, value);
				}

				switch (true) {
					case typeof arg === "boolean":
					case typeof arg === "number":
					case typeof arg === "string":
						x += node("item", arg);
						break;
					case typeof arg === "object":
						utility.iterate(arg, function (v, k) { x += xml.encode(v, (typeof v === "object"), false).replace(/item|xml/g, isNaN(k) ? k : "item"); });
						break;
				}

				x += wrap ? "</xml>" : "";
				if (top) x = "<?xml version=\"1.0\" encoding=\"UTF8\"?>" + x;

				return x;
			}
			catch (e) {
				error(e, arguments, this);
				return undefined;
			}
		}
	};

	error = utility.error;

	// @constructor
	return {
		// Classes
		array           : array,
		callback        : {},
		client          : {
			// Properties
			android : client.android,
			blackberry : client.blackberry,
			css3    : false,
			chrome  : client.chrome,
			firefox : client.firefox,
			ie      : client.ie,
			ios     : client.ios,
			linux   : client.linux,
			mobile  : client.mobile,
			opera   : client.opera,
			osx     : client.osx,
			playbook: client.playbook,
			safari  : client.safari,
			tablet  : client.tablet,
			size    : {x: 0, y: 0},
			version : 0,
			webos   : client.webos,
			windows : client.windows,

			// Methods
			del     : function (uri, success, failure, headers) { return client.request(uri, "DELETE", success, failure, null, headers); },
			get     : function (uri, success, failure, headers) { return client.request(uri, "GET", success, failure, null, headers); },
			headers : function (uri, success, failure) { return client.request(uri, "HEAD", success, failure); },
			post    : function (uri, success, failure, args, headers) { return client.request(uri, "POST", success, failure, args, headers); },
			put     : function (uri, success, failure, args, headers) { return client.request(uri, "PUT", success, failure, args, headers); },
			jsonp   : function (uri, success, failure, callback) { return client.jsonp(uri, success, failure, callback); },
			options : function (uri, success, failure) { return client.request(uri, "OPTIONS", success, failure); },
			permissions : client.permissions
		},
		cookie          : cookie,
		data            : data,
		element         : element,
		json            : json,
		label           : label,
		loading         : {
			create  : utility.loading,
			url     : null
		},
		message         : message,
		mouse           : mouse,
		number          : number,
		observer        : {
			log     : observer.log,
			add     : observer.add,
			fire    : observer.fire,
			list    : observer.list,
			remove  : observer.remove
		},
		state           : {
			_current    : null,
			header      : null,
			previous    : null
		},
		string          : string,
		validate        : validate,
		xml             : xml,

		// Methods & Properties
		$               : utility.$,
		alias           : utility.alias,
		aliased         : "$",
		allows          : client.allows,
		append          : function (type, args, obj) {
			if (obj instanceof Element) obj.genId();
			return element.create(type, args, obj, "last");
		},
		bootstrap       : function () {
			var fn = function (e) {
				if (/complete|loaded/.test(document.readyState)) {
					if (typeof abaaso.timer.init !== "undefined") {
						clearInterval(abaaso.timer.init);
						delete abaaso.timer.init;
					}
					if (typeof abaaso.init === "function") abaaso.init();
				}
			};

			if (typeof Array.prototype.filter === "undefined") {
				Array.prototype.filter = function (fn) {
					"use strict";

					if (this === void 0 || this === null || typeof fn !== "function") throw Error(label.error.invalidArguments);

					var i      = null,
						t      = Object(this),
						nth    = t.length >>> 0,
						result = [],
						prop   = arguments[1],
						val    = null;

					for (i = 0; i < nth; i++) {
						if (i in t) {
							val = t[i];
							if (fn.call(prop, val, i, t)) result.push(val);
						}
					}

					return result;
				};
			}

			if (typeof Array.prototype.forEach === "undefined") {
				Array.prototype.forEach = function (callback, thisArg) {
					"use strict";

					if (this === null || typeof callback !== "function") throw Error(label.error.invalidArguments);

					var T,
					    k   = 0,
					    O   = Object(this),
					    len = O.length >>> 0;

					if (thisArg) T = thisArg;

					while (k < len) {
						var kValue;
						if (k in O) {
							kValue = O[k];
							callback.call(T, kValue, k, O);
						}
						k++;
					}
				};
			}

			if (typeof Array.prototype.indexOf === "undefined") {
				Array.prototype.indexOf = function(obj, start) {
					"use strict";

					for (var i = (start || 0), j = this.length; i < j; i++) {
						if (this[i] === obj) return i;
					}

					return -1;
				}
			}

			if (typeof Function.prototype.bind === "undefined") {
				Function.prototype.bind = function (arg) {
					"use strict";

					var fn    = this,
					    slice = Array.prototype.slice,
					    args  = slice.call(arguments, 1);
					
					return function () {
						return fn.apply(arg, args.concat(slice.call(arguments)));
					};
				};
			}

			// Describing the Client
			abaaso.client.size = client.size();
			client.version();
			client.mobile();
			client.tablet();
			client.css3();

			// IE7 and older is not supported
			if (client.ie && client.version < 8) return;

			// Binding helper & namespace to $
			$ = abaaso.$.bind($);
			utility.alias($, abaaso);
			delete $.$;
			delete $.bootstrap;
			delete $.callback;
			delete $.data;
			delete $.init;

			// Unbinding observer methods to maintain scope
			$.fire           = abaaso.fire;
			$.on             = abaaso.on;
			$.un             = abaaso.un;
			$.listeners      = abaaso.listeners;

			// Setting initial application state
			abaaso.state._current = abaaso.state.current = "initial";
			$.state._current      = $.state.current      = abaaso.state.current;

			// Setting sugar
			switch (true) {
				case global.$ === null:
					global.$ = $;
					break;
				default:
					global.a$ = $;
					abaaso.aliased = "a$";
			}

			// Hooking abaaso into native Objects
			utility.proto(Array, "array");
			if (typeof Element !== "undefined") utility.proto(Element, "element");
			if (client.ie && client.version === 8) utility.proto(HTMLDocument, "element");
			utility.proto(Function, "function");
			utility.proto(Number, "number");
			utility.proto(String, "string");

			// Creating a singleton
			abaaso.constructor = abaaso;

			// Creating error log
			$.error.log = abaaso.error.log = [];

			// Setting events & garbage collection
			$.on(global, "error",      function (e) { $.fire("error", e); });
			$.on(global, "hashchange", function ()  { $.fire("beforeHash").fire("hash", location.hash).fire("afterHash", location.hash); });
			$.on(global, "resize",     function ()  { $.client.size = abaaso.client.size = client.size(); $.fire("resize", abaaso.client.size); });
			$.on(global, "load",       function ()  { $.fire("render").un("render"); });
			$.on(global, "DOMNodeInserted", function (e) {
				var obj = e.target;
				if (typeof obj.id !== "undefined" && obj.id.isEmpty()) {
					obj.genId();
					$.fire("afterCreate", obj);
				}
			});
			$.on(global, "DOMNodeRemoved", function (e) {
				var id = e.target.id;
				if (typeof id !== "undefined" && !id.isEmpty()) observer.remove(e.target);
			});

			// abaaso.state.current getter/setter
			var getter, setter;
			getter = function () { return this._current; };
			setter = function (arg) {
				try {
					if (arg === null || typeof arg !== "string" || this.current === arg || arg.isEmpty()) throw Error(label.error.invalidArguments);

					abaaso.state.previous = abaaso.state._current;
					abaaso.state._current = arg;
					return observer.state(arg);
				}
				catch (e) {
					error(e, arguments, this);
					return undefined;
				}
			};

			switch (true) {
				case (!client.ie || client.version > 8):
					utility.property(abaaso.state, "current", {enumerable: true, get: getter, set: setter});
					utility.property($.state,      "current", {enumerable: true, get: getter, set: setter});
					break;
				default: // Pure hackery, only exists when needed
					abaaso.state.change = function (arg) { abaaso.state.current = arg; return setter.call(abaaso.state, arg); };
					$.state.change      = function (arg) { abaaso.state.current = arg; return setter.call(abaaso.state, arg); };
			}

			$.ready = true;

			// Preparing init()
			switch (true) {
				case typeof global.define === "function":
					global.define("abaaso", function () { return abaaso.init(); });
					break;
				case (/complete|loaded/.test(document.readyState)):
					abaaso.init();
					break;
				case typeof document.addEventListener === "function":
					document.addEventListener("DOMContentLoaded", abaaso.init, false);
					break;
				case typeof document.attachEvent === "function":
					document.attachEvent("onreadystatechange", fn);
					break;
				default:
					abaaso.timer.init = setInterval(fn, 10);
			}
		},
		clear           : element.clear,
		clone           : utility.clone,
		coerce          : utility.coerce,
		compile         : utility.compile,
		create          : element.create,
		css             : element.css,
		decode          : json.decode,
		defer           : utility.defer,
		define          : utility.define,
		del             : function (uri, success, failure, headers) { return client.request(uri, "DELETE", success, failure, null, headers); },
		destroy         : element.destroy,
		encode          : json.encode,
		error           : utility.error,
		expire          : cache.clean,
		expires         : 120000,
		extend          : utility.extend,
		fire            : function (obj, event, arg) {
			var all = typeof arg !== "undefined",
			    o, e, a;

			o = all ? obj   : this;
			e = all ? event : obj;
			a = all ? arg   : event;

			if (typeof o === "undefined" || o === $) o = abaaso;
			return observer.fire.call(observer, o, e, a);
		},
		genId           : utility.genId,
 		get             : function (uri, success, failure, headers) { return client.request(uri, "GET", success, failure, null, headers); },
		guid            : utility.guid,
		headers         : function (uri, success, failure) { return client.request(uri, "HEAD", success, failure); },
		hidden          : element.hidden,
		id              : "abaaso",
		init            : function () {
			// Stopping multiple executions
			delete abaaso.init;
			delete abaaso.bootstrap;

			// Setting up cache expiration
			var expiration = function () {
				var expiration = this;
				$.timer.expire = setTimeout(function () {
					cache.clean();
					expiration.call(expiration);
				}, $.expires);
			}
			expiration.call(expiration);

			// Firing events to setup
			return $.fire("init").un("init").fire("ready").un("ready");
		},
		iterate         : utility.iterate,
		jsonp           : function (uri, success, failure, callback) { return client.jsonp(uri, success, failure, callback); },
		listeners       : function (event) {
			var obj = this;

			if (typeof obj === "undefined" || obj === $) obj = abaaso;
			return observer.list.call(observer, obj, event);
		},
		log             : utility.log,
		merge           : utility.merge,
		module          : utility.module,
		object          : utility.object,
		on              : function (obj, event, listener, id, scope, state) {
			var all = typeof listener === "function",
			    o, e, l, i, s, st;

			o  = all ? obj      : this;
			e  = all ? event    : obj;
			l  = all ? listener : event;
			i  = all ? id       : listener;
			s  = all ? scope    : id;
			st = all ? state    : scope;

			if (typeof o === "undefined" || o === $) o = abaaso;
			if (typeof s === "undefined") s = o;
			return observer.add.call(observer, o, e, l, i, s, st);
		},
		options         : function (uri, success, failure) { return client.request(uri, "OPTIONS", success, failure); },
		permissions     : client.permissions,
		position        : element.position,
		post            : function (uri, success, failure, args, headers) { return client.request(uri, "POST", success, failure, args, headers); },
		prepend         : function (type, args, obj) {
			if (obj instanceof Element) obj.genId();
			return element.create(type, args, obj, "first");
		},
		property        : utility.property,
		put             : function (uri, success, failure, args, headers) { return client.request(uri, "PUT", success, failure, args, headers); },
		queryString     : utility.queryString,
		ready           : false,
		reflect         : utility.reflect,
		repeat          : utility.repeat,
		repeating       : {},
		store           : function (arg, args) { return data.register.call(data, arg, args); },
		timer           : {},
		tpl             : utility.tpl,
		un              : function (obj, event, id, state) {
			var all = typeof id !== "undefined",
			    o, e, i, s;

			o = all ? obj   : this;
			e = all ? event : obj;
			i = all ? id    : event;
			s = all ? state : id;

			if (typeof o === "undefined" || o === $) o = abaaso;
			return observer.remove.call(observer, o, e, i, s);
		},
		update          : element.update,
		version         : "2.1.6"
	};
})();
if (typeof abaaso.bootstrap === "function") abaaso.bootstrap();
})(this);
