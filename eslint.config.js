export default [
  {
    files: ["**/*.js"],
    ignores: ["dist/**", "node_modules/**"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        document: "readonly",
        window: "readonly",
        localStorage: "readonly",
        console: "readonly",
        alert: "readonly",
        fetch: "readonly",
        setTimeout: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "error",
      "no-undef": "error",
    },
  },
];
