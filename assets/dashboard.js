/**
 * filesize.js dashboard
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @version 1.2.1
 */
(function ($) {
	"use strict";

	$.on("render", function () {
		// Setting viewport to maintain required size (until media queries are in place)
		if ($.client.mobile || $.client.tablet) $("head").create("meta", {name: "viewport", content: "width=1200"});

		// DOM decoration
		$("year").text(new Date().getFullYear());
		$(".amd").on("click", function (e) { location = "https://github.com/amdjs/amdjs-api/wiki/AMD"; });
		$(".node").on("click", function (e) { location = "http://nodejs.org"; });
		$(".license").on("click", function (e) { location = "http://www.opensource.org/licenses/BSD-3-Clause"; });
		$("body").css("opacity", 1);
	}, "gui");
})(abaaso);
