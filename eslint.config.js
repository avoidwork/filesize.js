import globals from "globals";
import pluginJs from "@eslint/js";

export default [
	{
		languageOptions: {
			globals: {
				...globals.browser, ...globals.node, ...globals.amd,
				it: true,
				describe: true,
				BigInt: true,
				beforeEach: true
			}
		}
	},
	pluginJs.configs.recommended,
];