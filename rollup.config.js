import terser from "@rollup/plugin-terser";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const pkg = require("./package.json");
const year = new Date().getFullYear();
const bannerLong = `/**
 * ${pkg.name}
 *
 * @copyright ${year} ${pkg.author}
 * @license ${pkg.license}
 * @version ${pkg.version}
 */`;
const bannerShort = `/*!
 ${year} ${pkg.author}
 @version ${pkg.version}
*/`;
const defaultOutBase = {compact: true, banner: bannerLong, name: pkg.name};
const cjOutBase = {...defaultOutBase, compact: false, format: "cjs", exports: "named"};
const esmOutBase = {...defaultOutBase, format: "esm"};
const umdOutBase = {...defaultOutBase, format: "umd"};
const minOutBase = {banner: bannerShort, name: pkg.name, plugins: [terser()], sourcemap: true};


export default [
	{
		input: "./src/filesize.js",
		output: [
			{
				...cjOutBase,
				file: `dist/${pkg.name}.cjs`
			},
			{
				...esmOutBase,
				file: `dist/${pkg.name}.js`
			},
			{
				...esmOutBase,
				...minOutBase,
				file: `dist/${pkg.name}.min.js`
			},
			{
				...umdOutBase,
				file: `dist/${pkg.name}.umd.js`,
				name: "filesize"
			},
			{
				...umdOutBase,
				...minOutBase,
				file: `dist/${pkg.name}.umd.min.js`,
				name: "filesize"
			}
		]
	}
];
