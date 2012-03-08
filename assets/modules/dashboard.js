/**
 * filesize.js dashboard
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @module dashboard
 * @requires  abaaso 1.9.9
 * @version 1.1
 */
(function (global) {
	"use strict";

	var dashboard = (function ($) {
		var init;

		init = function () {
			// Setting viewport to maintain required size (until media queries are in place)
			if ($.client.mobile || $.client.tablet) $("head").create("meta", {name: "viewport", content: "width=1200"});

			$.repeat(function () {
				if (/loaded|complete/.test(document.readyState) && typeof $("body")[0] !== "undefined") {
					$("year").text(new Date().getFullYear());
					$(".amd").on("click", function (e) { location = "https://github.com/amdjs/amdjs-api/wiki/AMD"; });
					$(".license").on("click", function (e) { location = "http://www.opensource.org/licenses/BSD-3-Clause"; });
					$("body").css("opacity", 1);
					return false;
				}
			}, 10);
		};

		// @constructor
		return {init : init };
	});

	// AMD support
	define("dashboard", ["abaaso"], function (abaaso) { return dashboard(global[abaaso["aliased"]]); });
})(this);
