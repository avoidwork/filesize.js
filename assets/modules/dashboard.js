/**
 * filesize.js dashboard
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @version 1.0
 */
(function () {
	"use strict";

	var dashboard = (function () {
		var blog    = {id: "blog"},
			ready, render;

		ready = function () {
			var dashboard = window.dashboard,
			    uri = {
			    	tumblr  : "http://api.tumblr.com/v2/blog/attackio.tumblr.com/posts?api_key=cm7cZbxWpFDtv8XFD5XFuWsn5MnzupVpUtaCjYIJAurfPj5B1V&tag=filesizejs&limit=1000000&jsonp=?"
			    };

			delete dashboard.ready;

			$.store(dashboard.blog);
			dashboard.blog.data.key         = "id";
			dashboard.blog.data.callback    = "jsonp";
			dashboard.blog.data.source      = "response";
			typeof dashboard.blog.data.setUri === "function" ? dashboard.blog.data.setUri(uri.tumblr) : dashboard.blog.data.uri = uri.tumblr;
		};

		render = function () {
			var stage     = $("#stage"),
			    dashboard = window.dashboard,
			    obj, root;

			delete dashboard.render;

			// Creating tabs
			stage.tabs(["Main", "Blog", "Download"]);

			// Setting routing
			$.route.set("download", function () {
				var guid = $.guid();

				obj = $("section[data-hash='download']")[0];
				obj.on("afterGet", function () {
					this.un("afterGet", guid);
					$("#download-debugging").on("click", function () { location = "https://raw.github.com/avoidwork/filesize.js/master/debug/filesize.js"; }, "click");
					$("#download-production").on("click", function () { location = "https://raw.github.com/avoidwork/filesize.js/master/production/filesize.js"; }, "click");
				}, guid).get("views/download.htm");
			});

			$.route.set("blog", function () {
				obj = $("section[data-hash='blog']")[0];
				var fn  = function () {
					if (dashboard.blog.data.total > 0) {
						var items = dashboard.blog.data.get([0, 10]),
						    d, o;

						obj.clear();

						items.each(function (item) {
							d = item.data.date.replace(/\s.*/, "").explode("-"); // Parsing String because some browsers will not cast to Date
							o = obj.create("article");
							o.create("h3").create("a", {href: item.data.post_url, innerHTML: item.data.title});
							o.create("date").text($.label.month[parseInt(d[1] -1 ).toString()]+" "+d[2]+", "+d[0]);
							o.create("entry").text(item.data.body);
						});

						obj.create("p").create("a", {innerHTML: "Read more on attack.io", href: "http://attack.io"});
						return false;
					}
				};

				obj.loading();
				$.repeat(fn, 10, "blog");
			});

			$.route.set("main", function () {
				obj = $("section[data-hash='main']")[0];
				obj.get("views/intro.htm");
			});

			// Prepping the UI
			$.loading.url = "assets/loading.gif";
			$("version").text($.version);
			$("year").text(new Date().getFullYear());
			$("section").on("beforeGet", function () { this.loading(); }, "loading");
			$("section[data-hash='main']").on("afterGet", function () { twitter.display(); }, "twitter");
			$("ul.tab a").addClass("shadow round button padded");
			$("body").css("opacity", 1);

			// Setting the hash
			if (!/\w/.test(location.hash)) location.hash = "#!/main";
			else {
				$.tabs.active(location.hash);
				$.route.load(location.hash);
			}
		};

		// @constructor
		return {
			api     : api,
			blog    : blog,
			collabs : collabs,
			ready   : ready,
			render  : render,
			twitter : twitter
		}
	});

	// AMD support
	switch (true) {
		case typeof define === "function":
			define("dashboard", ["abaaso", "abaaso.route", "abaaso.tabs"], function () {
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
