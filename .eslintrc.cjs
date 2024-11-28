module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react-hooks/recommended',
		'plugin:storybook/recommended'
	],
	ignorePatterns: ['dist', '.eslintrc.cjs'],
	parser: '@typescript-eslint/parser',
	plugins: ['react-refresh', 'unused-imports', '@tanstack/eslint-plugin-router'],
	rules: {
		'@tanstack/router/create-route-property-order': 'warn',
		'no-unused-vars': 'off',
		'unused-imports/no-unused-imports': 'warn',
		'react-hooks/rules-of-hooks': 'warn',
		'react/jsx-uses-react': 'off',
		'react/jsx-uses-vars': 'off',
		'@typescript-eslint/no-unused-vars': 'off',
		'@typescript-eslint/ban-types': 'off',
		'prefer-spread': 'off',
		'no-sparse-arrays': 'off',
		'@typescript-eslint/ban-ts-comment': 'off',
		'no-unsafe-optional-chaining': 'warn',
		'@typescript-eslint/no-explicit-any': 'off',
		'react-hooks/exhaustive-deps': 'off',
		'@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
		'react-refresh/only-export-components': 'off'
	}
}
