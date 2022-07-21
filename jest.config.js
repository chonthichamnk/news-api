module.exports = {
  bail: true,
  collectCoverage: true,
  coverageDirectory: './target/coverage',
  coveragePathIgnorePatterns: ['<rootDir>/node_modules/','<rootDir>/test/unit/fixtures/'],
  moduleFileExtensions: ['js', 'ts'],
  moduleNameMapper: {
    '^@actions/(.*)$': '<rootDir>/src/actions/$1',
    '^@mixins/(.*)$': '<rootDir>/src/mixins/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@stores/(.*)$': '<rootDir>/src/services/stores/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
  },
  preset: 'ts-jest',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        ancestorSeparator: '.',
        classNameTemplate: '{classname}',
        output: './test-results/jest/results.xml',
        suiteNameTemplate: '{filepath}',
        titleTemplate: '{title}',
      },
    ],
  ],
  roots: ['<rootDir>/test'],
  testEnvironment: 'node',
};
