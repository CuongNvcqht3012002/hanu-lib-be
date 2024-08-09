module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './',
  testEnvironment: 'node',
  testRegex: ['.e2e-spec.ts$', '.spec.ts$', '.test.ts$'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  verbose: true,
  setupFiles: ['dotenv/config'],
  moduleNameMapper: {
    '^src(.*)$': '<rootDir>/src/$1',
  },
}
