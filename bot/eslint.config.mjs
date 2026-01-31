// @ts-check
import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";

export default tseslint.config(
  {ignores: ['eslint.config.mjs'],},
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      globals: {...globals.node, ...globals.jest,},
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: {
      import: importPlugin,
      "unused-imports": unusedImports,
    }
  },
  {
    rules: {
      // Запрещено использование any
      '@typescript-eslint/no-explicit-any': 'off',
      // Запрещеные плавающие промисы
      '@typescript-eslint/no-floating-promises': 'warn',
      // Предупреждение о несоответсвии типов передаваемых аргументов
      '@typescript-eslint/no-unsafe-argument': 'warn',
      // Запрет однострочных блоков
      "curly": ["error", "all"],
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
      // Удаление неиспользуемых переменных
      "unused-imports/no-unused-vars": [
        "warn",
        { vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" },
      ],
    },
  },
);