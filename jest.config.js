/** @type {import('ts-jest').JestConfigWithTsJest} * */
export default {
  bail: 0,
  extensionsToTreatAsEsm: ['.ts'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '\\.[jt]sx?$': ['ts-jest', { diagnostics: false, useESM: true }],
  },
  watchman: true,
};
