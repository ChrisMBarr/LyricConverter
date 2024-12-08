import typescriptEslint from "@typescript-eslint/eslint-plugin";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import prettier from "eslint-plugin-prettier";
import onlyWarn from "eslint-plugin-only-warn";
import tsParser from "@typescript-eslint/parser";
import parser from "@angular-eslint/template-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    plugins: {
      "@typescript-eslint": typescriptEslint,
      "simple-import-sort": simpleImportSort,
      prettier,
      "only-warn": onlyWarn,
    },
  },
  ...compat
    .extends(
      "plugin:@typescript-eslint/strict-type-checked",
      "plugin:@typescript-eslint/stylistic-type-checked",
      "plugin:@angular-eslint/recommended",
      "plugin:@angular-eslint/all",
      "plugin:@angular-eslint/template/process-inline-templates",
      "plugin:prettier/recommended",
    )
    .map((config) => ({
      ...config,
      files: ["**/*.ts"],
    })),
  {
    files: ["**/*.ts"],

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 5,
      sourceType: "script",

      parserOptions: {
        project: ["tsconfig.(app|spec).json"],
      },
    },

    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        { type: "attribute", prefix: "app", style: "camelCase" },
      ],
      "@angular-eslint/component-selector": [
        "error",
        { type: "element", prefix: "app", style: "kebab-case" },
      ],
      "@angular-eslint/prefer-standalone": "off",
      "@angular-eslint/prefer-standalone-component": "off",
      "@angular-eslint/prefer-on-push-component-change-detection": "off",
      "@angular-eslint/prefer-signals": "off",
      "no-loop-func": "off",
      "@typescript-eslint/no-loop-func": "warn",
      "no-shadow": "off",
      "@typescript-eslint/no-shadow": "warn",
      "no-use-before-define": "off",
      "@typescript-eslint/no-use-before-define": "warn",
      "no-return-await": "off",
      "@typescript-eslint/return-await": "warn",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/array-type": ["warn", { default: "generic" }],
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/method-signature-style": "warn",
      "@typescript-eslint/naming-convention": [
        "warn",
        { selector: "enum", format: ["StrictPascalCase"], suffix: ["Enum"] },
        { selector: "enumMember", format: ["StrictPascalCase"] },
        { selector: ["interface", "typeAlias"], format: ["StrictPascalCase"], prefix: ["I"] },
      ],
      "@typescript-eslint/no-extraneous-class": "off",
      "@typescript-eslint/no-unnecessary-qualifier": "warn",
      "@typescript-eslint/prefer-readonly": "warn",
      "@typescript-eslint/prefer-regexp-exec": "warn",
      "@typescript-eslint/strict-boolean-expressions": "warn",
      "@typescript-eslint/member-ordering": [
        "warn",
        {
          classes: [
            "private-readonly-field",
            "private-field",
            "decorated-field",
            "field",
            "constructor",
            "public-method",
            "private-method",
          ],
        },
      ],
      "array-callback-return": "warn",
      complexity: ["warn", { max: 8 }],
      eqeqeq: ["warn", "always", { null: "ignore" }],
      "object-shorthand": ["warn", "always"],
      "simple-import-sort/imports": "warn",
      "no-restricted-imports": [
        "warn",
        {
          patterns: [
            {
              group: ["rxjs/internal/*"],
              message:
                "Don't import from 'rxjs/internal/*', this can cause optimization bailouts. See this for more details: https://bobbyhadz.com/blog/angular-commonjs-or-amd-dependencies-can-cause-optimization-bailouts ",
            },
            {
              group: ["src/*"],
              message:
                "Please use a relative import path beginning with './' or '../' so they can be more easily sorted and grouped",
            },
          ],
        },
      ],

      "prettier/prettier": ["warn", { endOfLine: "auto" }],
    },
  },
  ...compat
    .extends(
      "plugin:@angular-eslint/template/all",
      "plugin:tailwindcss/recommended",
      "plugin:prettier/recommended",
    )
    .map((config) => ({
      ...config,
      files: ["**/*.html"],
    })),
  {
    files: ["**/*.html"],
    languageOptions: {
      parser: parser,
    },
    rules: {
      "@angular-eslint/template/i18n": "off",
      "@angular-eslint/template/prefer-ngsrc": "off",
      "@angular-eslint/template/no-inline-styles": "off",
      "prettier/prettier": ["warn", { endOfLine: "auto" }],
    },
  },
  {
    files: ["**/*.spec.ts", "test/**/*.ts"],
    rules: {
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/unbound-method": "off",
      "prettier/prettier": ["warn", { endOfLine: "auto" }],
    },
  },
];
