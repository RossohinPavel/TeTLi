import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";

export default defineConfig([
  globalIgnores(["dist", "node_modules"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [js.configs.recommended, tseslint.configs.recommended, reactRefresh.configs.vite],
    plugins: {
      'react-hooks': reactHooks,
      import: importPlugin,
      "unused-imports": unusedImports,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "linebreak-style": ["error", "windows"],
      // Запрет однострочных блоков
      curly: ["error", "all"],
      // Проверка пробельных символов
      "no-irregular-whitespace": ["error", { skipStrings: false, skipTemplates: false }],
      // Правило для использования console
      "no-console": ["error", { allow: ["info", "error", "warn"] }],
      // Сортировка импортов по алфавиту
      "import/order": [
        "error",
        {
          groups: [
            ["builtin", "external", "internal", "parent", "sibling", "index", "object", "type"],
          ],
          alphabetize: { order: "asc", caseInsensitive: true },
          "newlines-between": "never",
        },
      ],
      "import/export": "error",
      // 2 линии после импортов
      "import/newline-after-import": ["error", { count: 2, exactCount: true }],
      // Удаление неиспользуемых импортов
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        { vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" },
      ],
    },
  },
  {
    // Особые настройки для vite.config.ts
    files: ["vite.config.ts"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.node.json",
      },
    },
  },
]);
