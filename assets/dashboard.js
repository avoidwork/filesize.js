/**
 * filesize.js dashboard
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @version 1.3.1
 */
(function ($) {
	"use strict";

	var result, input, demo;

	/**
	 * Input handler
	 * 
	 * @return {Undefined} undefined
	 */
	function handler () {
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

	// Setting event handler
	$.on("ready", function () {
		result = $("#result");
		input  = $("#filesize");
		demo   = $("#demo");

		$("#year").text(new Date().getFullYear());

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
