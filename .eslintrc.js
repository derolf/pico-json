module.exports = {
  root: true,
  env: { node: true, browser: true },
  parser: "@typescript-eslint/parser",
  extends: ["eslint:recommended", "prettier"],
  overrides: [
    {
      files: ["*.ts"],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ["./packages/**/tsconfig.json"],
      },
      extends: ["plugin:@typescript-eslint/recommended", "plugin:@typescript-eslint/recommended-requiring-type-checking"],
      rules: {
        "@typescript-eslint/switch-exhaustiveness-check": "warn",
        "@typescript-eslint/require-await": "off",
        "@typescript-eslint/no-unused-vars": [
          "warn",
          {
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_",
          },
        ],
      },
    },
  ],
};
