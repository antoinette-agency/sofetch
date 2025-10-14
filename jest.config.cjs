/** @type {import("jest").Config} **/
module.exports = {
  projects:[
    {
      displayName: 'ts-tests',
      testMatch: ["<rootDir>/test/integration/**/*.tests.ts"],
      testEnvironment: "node",
      preset: 'ts-jest',
      globalSetup: '<rootDir>/jest.setup.ts',
      globalTeardown: '<rootDir>/jest.teardown.ts',
    },
    {
      displayName: 'puppeteer-tests',
      testMatch: ["<rootDir>/test/browser/**/*.tests.js"],
      preset: 'jest-puppeteer',
    }
  ],
};