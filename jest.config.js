module.exports = {
  testEnvironment: 'node',
  coverageDirectory: './coverage/',
  collectCoverageFrom: [
    'lib/!(app)/**',
    '!lib/builder/webpack/plugins/vue/**'
  ],
  setupTestFrameworkScriptFile: './test/utils/setup',
  testPathIgnorePatterns: ['test/fixtures/.*/.*?/'],
  moduleFileExtensions: ['js', 'mjs', 'json']
}
