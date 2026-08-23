module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/jest.setup.ts'],
  transform: { '^.+\\.(t|j)sx?$': 'babel-jest' },
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/src/test/styleMock.js',
  },
};
