import pluginJs from '@eslint/js'
import pluginQuery from '@tanstack/eslint-plugin-query'
import pluginRouter from '@tanstack/eslint-plugin-router'
import noBarrelFiles from 'eslint-plugin-no-barrel-files'
import pluginReact from 'eslint-plugin-react'
import globals from 'globals'
import tseslint from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
export default [
	pluginJs.configs.recommended,
	pluginReact.configs.flat.recommended,
	...pluginQuery.configs['flat/recommended'],
	...pluginRouter.configs['flat/recommended'],
	...noBarrelFiles.configs['flat/recommended'],
	...tseslint.configs.recommended,
	{
		files: ['./src/**/*.{js,mjs,cjs,ts,jsx,tsx}'],
		settings: {
			react: {
				fragment: 'Fragment', // Fragment to use (may be a property of <pragma>), default to "Fragment"
				version: 'detect'
			}
		},
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'react/react-in-jsx-scope': 'off',
			'@typescript-eslint/no-unused-vars': 'warn',
			'@typescript-eslint/no-non-null-asserted-optional-chain': 'warn',
			'@typescript-eslint/no-empty-object-type': 'warn',
			'@typescript-eslint/consistent-type-imports': 'warn',
			'@typescript-eslint/no-unused-expressions': 'warn',
			'@typescript-eslint/ban-ts-comment': 'warn',
			'prefer-spread': 'warn',
			'react/prop-types': 'off',
			'react/display-name': 'warn',
			'react/no-unknown-property': 'warn',
			'react/no-unescaped-entities': 'warn',
			'react/jsx-no-target-blank': 'warn',
			'react/jsx-key': 'error',
			'react/jsx-sort-props': [
				'warn',
				{
					callbacksLast: true,
					multiline: 'last',
					ignoreCase: false,
					shorthandFirst: true
				}
			],
			'no-barrel-files/prefer-source-imports': ['error', { fixStyle: 'auto' }],
			'no-barrel-files/no-barrel-files': 'warn'
		},
		languageOptions: { globals: globals.browser },
		ignores: ['dist', 'node_modules', 'eslint.config.js']
	}
]
