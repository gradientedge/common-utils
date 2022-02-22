function getProjectConfig(config) {
  return {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true,
    passWithNoTests: true,
    displayName: config.packageName,
    rootDir: '<rootDir>/' + config.path,
    roots: ['src'],
    testMatch: ['**/__tests__/**/*.test.ts'],
    testPathIgnorePatterns: ['node_modules/', 'dist/'],
    setupFilesAfterEnv: ['jest-extended/all'],
  }
}

const projects = [
  { path: 'packages/logger', packageName: '@gradientedge/logger' },
].map((config) => getProjectConfig(config))

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  passWithNoTests: true,
  rootDir: '.',
  testPathIgnorePatterns: ['node_modules', 'dist'],
  projects: [...projects],
}
