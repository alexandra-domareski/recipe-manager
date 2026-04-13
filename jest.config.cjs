/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom", // Essential for testing React components
  setupFilesAfterEnv: ["<rootDir>/src/tests-private/setupTests.ts"],
  moduleNameMapper: {
    // Catch CSS/SASS files
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    // Catch all common image/resource formats
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/src/tests-private/__mocks__/fileMock.js",
  },
};
