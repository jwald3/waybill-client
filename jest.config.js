/** @type {import('jest').Config} */
export default {
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: true,
      tsconfig: 'jest.tsconfig.json'
    }]
  },
  testEnvironment: 'node',
  moduleNameMapper: {
    '^\\$lib/(.*)': '<rootDir>/src/lib/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
}; 