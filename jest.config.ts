/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  preset: 'ts-jest',
  globalSetup: '<rootDir>/test/jest.setup.ts',
  globalTeardown: '<rootDir>/test/jest.teardown.ts',
};