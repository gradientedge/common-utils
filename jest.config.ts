export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  passWithNoTests: true,
  rootDir: '.',
  testMatch: ['**/__tests__/**/*.test.ts'],
  testPathIgnorePatterns: ['node_modules/', 'dist/'],
  setupFilesAfterEnv: ['jest-extended/all'],
  projects: ['<rootDir>/packages/*/jest.config.ts'],
}
