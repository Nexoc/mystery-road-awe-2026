import tseslint from "typescript-eslint";

const browserGlobals = {
  document: "readonly",
  window: "readonly",
  localStorage: "readonly",
  console: "readonly",
  alert: "readonly",
  fetch: "readonly",
  setTimeout: "readonly",
};

const typescriptRecommended = tseslint.configs.recommended.map((config) => ({
  ...config,
  files: ["**/*.{ts,tsx}"],
}));

export default [
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: browserGlobals,
    },
    rules: {
      "no-unused-vars": "error",
      "no-undef": "error",
    },
  },
  ...typescriptRecommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      globals: browserGlobals,
    },
  },
];
