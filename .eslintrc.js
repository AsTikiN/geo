module.exports = {
  extends: ["next/core-web-vitals"],
  rules: {
    "@typescript-eslint/no-unused-expressions": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-this-alias": "off",
  },
  ignorePatterns: [
    "src/generated/**/*",
    "**/prisma/runtime/**/*",
    "**/wasm-*.js",
    "node_modules/**/*",
  ],
  overrides: [
    {
      files: ["src/generated/**/*"],
      rules: {
        "@typescript-eslint/no-unused-expressions": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-this-alias": "off",
      },
    },
  ],
};
