module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  module: "esnext",
  testMatch: ["**/__tests__/**/*.+(ts|tsx)", "**/?(*.)+(test).+(ts|tsx)"]
};
