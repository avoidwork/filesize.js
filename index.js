module.exports = require(require("path").join(__dirname, "lib", Number(process.version.replace("v", "").split(".")[0]) >= 6 ? "filesize.es6" : "filesize"));
