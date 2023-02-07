export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['**/__tests__/**/*.test.ts'],
  testPathIgnorePatterns: ['node_modules/', 'dist/'],
  setupFilesAfterEnv: ['jest-extended/all'],
}
