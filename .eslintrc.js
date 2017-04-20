module.exports = {
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: "2017",
		ecmaFeatures: {
			jsx: true,
			impliedStrict: true,
			experimentalObjectRestSpread: true
		}
	},
	env: {
		node: true,
		browser: true
	},
	extends: ['eslint:recommended', 'plugin:react/recommended'],
	plugins: [
		'require-path-exists',
		'react'
	]
};
