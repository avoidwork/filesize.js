/**
 * filesize.js dashboard
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @version 1.3.0
 */
(function ($) {
	"use strict";

	$.on("render", function () {
		var result = $("#result"),
		    input  = $("input")[0],
		    demo   = $("#demo"),
		    handler;

		// Input handler
		handler = function () {
			var val = input.val();

			if (!val.isEmpty()) {
				try {
					result.html(filesize(val, input.data("short"), input.data("bit")));
				}
				catch (e) {
					result.html(e);
				}
			}
			else {
				result.html("&nbsp;");
			}
		};

		$("#year").text(new Date().getFullYear());

		// Displaying demo
		demo.removeClass("hidden");

		// Demo filters
		demo.find(".clickable").on("click", function (e) {
			var obj   = $.target(e),
			    param = obj.data("param");

			if (obj.hasClass("icon-check-empty")) {
				obj.removeClass("icon-check-empty").addClass("icon-check");
			}
			else {
				obj.removeClass("icon-check").addClass("icon-check-empty");
			}

			input.data(param, !input.data(param));
			handler();
		}, "click");

		// Capturing debounced input (125ms)
		input.on("input", function (e) {
			$.defer(function () {
				handler();
			}, 125, "keyUp");
		}, "input");

		// Halting form submission
		$("form")[0].on("submit", function (e) {
			$.stop(e);
			return false;
		});
	}, "gui");
})(abaaso);
