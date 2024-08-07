module.exports = {
	preset: 'ts-jest',
	clearMocks: true,
	coverageProvider: 'v8',
	testEnvironment: 'node',
	roots: ['<rootDir>/tests'],
	testMatch: ['<rootDir>/tests/**/*.test.ts'],
	moduleFileExtensions: ['ts', 'js', 'json', 'node'],
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest',
	},
};
