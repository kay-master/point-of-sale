module.exports = {
	preset: 'ts-jest',
	clearMocks: true,
	coverageProvider: 'v8',
	testEnvironment: 'node',
	maxConcurrency: 1,
	roots: ['<rootDir>/tests'],
	testMatch: ['<rootDir>/tests/**/*.test.ts'],
	setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],
	moduleFileExtensions: ['ts', 'js', 'json', 'node'],
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest',
	},
};
