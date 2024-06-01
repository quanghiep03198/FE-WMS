module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:react-hooks/recommended",
		"plugin:eslint-plugin-unused-import"
	],
	ignorePatterns: ["dist", ".eslintrc.cjs"],
	parser: "@typescript-eslint/parser",
	plugins: ["react-refresh", ""],
	rules: {
		"react-refresh/only-export-components": [
			"warn",
			{ allowConstantExport: true }
		],
		"@typescript-eslint/no-unused-vars": "off",
		"no-unused-vars": "off",
		"unused-imports/no-unused-imports": "error",
		"unused-imports/no-unused-vars": [
			"warn",
			{
				 "vars": "all",
				 "varsIgnorePattern": "^_",
				 "args": "after-used",
				 "argsIgnorePattern": "^_",
			},
	  ]
	}
};
