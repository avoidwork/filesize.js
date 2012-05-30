require.config({baseUrl: "assets/modules"});
require(["abaaso", "dashboard", "filesize"], function (abaaso, dashboard, filesize) {
    window.filesize  = filesize;
    dashboard.init();
});