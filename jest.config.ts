/** @type {import("jest").Config} **/
module.exports = {
  testMatch: "<rootDir>/test/**/*.tests.ts",
  testEnvironment: "node",
  preset: 'ts-jest',
  globalSetup: '<rootDir>/jest.setup.ts',
  globalTeardown: '<rootDir>/jest.teardown.ts',
};