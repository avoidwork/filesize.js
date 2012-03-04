/**
 * filesize.js dashboard
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @version 1.0
 */
(function (window) {
	"use strict";

	var dashboard = (function () {
		var $ = window[abaaso.aliased],
		    render;

		render = function () {
			// Setting viewport to maintain required size (until media queries are in place)
			if ($.client.mobile || $.client.tablet) $("head").create("meta", {name: "viewport", content: "width=1200"});

			$.repeat(function () {
				if (/loaded|complete/.test(document.readyState) && typeof $("body")[0] !== "undefined") {
					$("year").text(new Date().getFullYear());
					$("body").css("opacity", 1);
					$(".amd").on("click", function (e) { location = "https://github.com/amdjs/amdjs-api/wiki/AMD"; });
					$(".license").on("click", function (e) { location = "http://www.opensource.org/licenses/BSD-3-Clause"; });
					delete window.dashboard;
					return false;
				}
			}, 10);
		};

		// @constructor
		return {
			render : render
		}
	});

	// AMD support
	switch (true) {
		case typeof define === "function":
			define("dashboard", ["abaaso"], function () {
				var $ = window[abaaso.aliased];
				window.dashboard = dashboard();
				window.dashboard.render();
			});
			break;
		default:
			window.dashboard = dashboard();
			abaaso.on("ready", window.dashboard.ready).on("render", window.dashboard.render);
	}
})(window);
