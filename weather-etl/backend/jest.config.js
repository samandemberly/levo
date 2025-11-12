export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/'],
  coveragePathIgnorePatterns: ['node_modules', 'src/database', 'src/test', 'src/types'],
  reporters: ['default'],
  globals: { 'ts-jest': { diagnostics: false } },
  transform: {},
  testTimeout: 10000,
  forceExit: true
};
