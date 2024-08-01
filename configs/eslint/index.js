/* eslint-disable no-undef */
module.exports = {
	parser: "@typescript-eslint/parser",
	extends: [
		"standard",
		"plugin:@typescript-eslint/recommended",
		"prettier",
		"plugin:prettier/recommended",
	],
	plugins: ["@typescript-eslint"],
	rules: {
		"@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
		semi: "error",
		indent: ["error", 2, { SwitchCase: 1 }],
		"no-multi-spaces": "error",
		"space-in-parens": "error",
		"no-multiple-empty-lines": "error",
		"prefer-const": "error",
		"import/no-unresolved": "error",
	},
	env: {
		es6: true,
		node: true,
	},
};
