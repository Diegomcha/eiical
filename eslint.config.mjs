// import pluginJs from '@eslint/js';

// import globals from 'globals';
// import tseslint from 'typescript-eslint';

// /** @type {import('eslint').Linter.Config[]} */
// export default [
// 	{ files: ['**/*.{js,mjs,cjs,ts}'] },
// 	{ languageOptions: { globals: globals.browser } },
// 	pluginJs.configs.recommended,
// 	...tseslint.configs.strict,
// 	...tseslint.configs.stylistic,
// 	eslintConfigPrettier,
// ];

import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
	eslint.configs.recommended,
	tseslint.configs.strictTypeChecked,
	tseslint.configs.stylisticTypeChecked,
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	eslintConfigPrettier
);
