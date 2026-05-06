import { fileURLToPath } from "node:url";

import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import { defineConfig } from "eslint/config";
import { importX } from "eslint-plugin-import-x";
import globals from "globals";
import { configs as tseslintConfigs } from "typescript-eslint";

const gitignorePath = fileURLToPath(new URL("./.gitignore", import.meta.url));

export default defineConfig(
  includeIgnoreFile(gitignorePath),
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    extends: [
      js.configs.recommended,
      importX.flatConfigs.recommended,
      stylistic.configs.customize({
        braceStyle: "1tbs",
        quoteProps: "as-needed",
        quotes: "double",
        semi: true,
      }),
    ],
    rules: {
      "@stylistic/arrow-parens": ["error", "always"],
      "@stylistic/comma-dangle": [
        "error",
        {
          arrays: "always-multiline",
          enums: "always-multiline",
          exports: "always-multiline",
          imports: "always-multiline",
          objects: "always-multiline",
          tuples: "always-multiline",
        },
      ],
      "import-x/first": ["error"],
      "import-x/newline-after-import": ["error"],
      "import-x/order": [
        "error",
        {
          alphabetize: {
            order: "asc",
          },
          distinctGroup: true,
          groups: ["builtin", "external", "internal", "parent", "sibling", "index", "type"],
          "newlines-between": "always",
          sortTypesGroup: true,
        },
      ],
      "no-empty": [
        "error",
        {
          allowEmptyCatch: true,
        },
      ],
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      tseslintConfigs.recommendedTypeChecked,
      tseslintConfigs.strictTypeChecked,
      tseslintConfigs.stylisticTypeChecked,
      importX.flatConfigs.typescript,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: process.cwd(),

      },
    },
    rules: {
      "import-x/consistent-type-specifier-style": ["error"],
      "@typescript-eslint/consistent-type-imports": ["error"],
      "@typescript-eslint/explicit-function-return-type": [
        "warn",
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  }
);
