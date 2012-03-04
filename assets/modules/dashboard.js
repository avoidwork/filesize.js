/**
 * filesize.js dashboard
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @version 1.0
 */
(function (window) {
	"use strict";

	var dashboard = (function () {
		var ready, render;

		ready = function () {
			var dashboard = window.dashboard

			delete dashboard.ready;
		};

		render = function () {
			var stage     = $("#stage"),
			    dashboard = window.dashboard;

			delete dashboard.render;

			$("year").text(new Date().getFullYear());
			$("body").css("opacity", 1);
			$(".amd").on("click", function (e) { location = "https://github.com/amdjs/amdjs-api/wiki/AMD"; });
			$(".license").on("click", function (e) { location = "http://www.opensource.org/licenses/BSD-3-Clause"; });
		};

		// @constructor
		return {
			ready  : ready,
			render : render
		}
	});

	// AMD support
	switch (true) {
		case typeof define === "function":
			define("dashboard", ["abaaso"], function () {
				var $ = window[abaaso.aliased];
				window.dashboard = dashboard();
				window.dashboard.ready();
				window.dashboard.render();
			});
			break;
		default:
			window.dashboard = dashboard();
			abaaso.on("ready", window.dashboard.ready).on("render", window.dashboard.render);
	}
})(window);
