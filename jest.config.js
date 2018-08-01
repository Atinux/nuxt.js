module.exports = {
  testEnvironment: 'node',
  coverageDirectory: './coverage/',
  collectCoverageFrom: [
    'lib/!(app)/**',
    '!lib/builder/webpack/plugins/vue/**'
  ],
  setupTestFrameworkScriptFile: './test/utils/setup',
  testPathIgnorePatterns: ['test/fixtures/.*/.*?/'],
  moduleFileExtensions: ['js', 'mjs', 'json'],
  expand: true,
  forceExit: true,
  // https://github.com/facebook/jest/pull/6747 fix warning here
  detectOpenHandles: true
}
