import type { Config } from '@jest/types';

const jestConfig: Config.InitialOptions = {
  bail: true,
  clearMocks: true,
  coverageProvider: 'v8',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/src/__tests__/**/*.spec.ts?(x)'],
  rootDir: '.',
  moduleNameMapper: {
    '@modules/(.*)': '<rootDir>/src/modules/$1',
    '@shared/(.*)': '<rootDir>/src/shared/$1',
    '@config/(.*)': '<rootDir>/src/config/$1',
  },
  verbose: true,
};

export default jestConfig;
