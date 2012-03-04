/**
 * filesize.js dashboard
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @version 1.0
 */
(function () {
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
})();
