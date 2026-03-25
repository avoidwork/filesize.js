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

// Plugin to ensure output files end with a newline
function ensureNewline() {
	return {
		name: "ensure-newline",
		renderChunk(code, map) {
			if (code.endsWith("\n")) {
				return null;
			}

			return {
				code: code + "\n",
				map: map || null,
			};
		},
	};
}

// Optimized terser configuration for better compression
const terserOptions = {
	compress: {
		passes: 2,
		drop_console: false,
		drop_debugger: true,
		pure_funcs: ["console.log"],
		unsafe_arrows: true,
		unsafe_methods: true,
	},
	mangle: {
		properties: {
			regex: /^_/,
		},
	},
	format: {
		comments: "some",
	},
};

const defaultOutBase = {
	compact: true,
	banner: bannerLong,
	name: pkg.name,
	generatedCode: {
		constBindings: true,
		arrowFunctions: true,
		objectShorthand: true,
	},
};

const cjOutBase = {
	...defaultOutBase,
	compact: false,
	format: "cjs",
	exports: "named",
	interop: "compat",
};

const esmOutBase = {
	...defaultOutBase,
	format: "esm",
};

const umdOutBase = {
	...defaultOutBase,
	format: "umd",
};

const minOutBase = {
	...defaultOutBase,
	banner: bannerShort,
	plugins: [terser(terserOptions)],
	sourcemap: true,
};

export default [
	{
		input: "./src/filesize.js",
		treeshake: {
			moduleSideEffects: false,
			propertyReadSideEffects: false,
			unknownGlobalSideEffects: false,
		},
		output: [
			{
				...cjOutBase,
				file: `dist/${pkg.name}.cjs`,
				plugins: [ensureNewline()],
			},
			{
				...esmOutBase,
				file: `dist/${pkg.name}.js`,
				plugins: [ensureNewline()],
			},
			{
				...esmOutBase,
				...minOutBase,
				file: `dist/${pkg.name}.min.js`,
				plugins: [...minOutBase.plugins, ensureNewline()],
			},
			{
				...umdOutBase,
				file: `dist/${pkg.name}.umd.js`,
				name: "filesize",
				plugins: [ensureNewline()],
			},
			{
				...umdOutBase,
				...minOutBase,
				file: `dist/${pkg.name}.umd.min.js`,
				name: "filesize",
				plugins: [...minOutBase.plugins, ensureNewline()],
			},
		],
	},
];
