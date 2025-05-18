// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import tsParser from "@typescript-eslint/parser";
import angularEslint from "angular-eslint";
import eslintPluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import eslintPluginTailwindCSS from "eslint-plugin-tailwindcss";
import eslintPluginOnlyWarn from "eslint-plugin-only-warn"; //just importing this will activate it, no need to do anything else!

export default tseslint.config(
  eslintPluginPrettier,
  {
    // Everything in this config object targets our TypeScript files (Components, Directives, Pipes etc)
    files: ["**/*.ts"],
    plugins: {
      "simple-import-sort": eslintPluginSimpleImportSort,
    },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      ...angularEslint.configs.tsAll,
    ],
    processor: angularEslint.processInlineTemplates,
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
        "warn",
        { type: "attribute", prefix: "app", style: "camelCase" },
      ],
      "@angular-eslint/component-selector": [
        "warn",
        { type: "element", prefix: "app", style: "kebab-case" },
      ],
      "@angular-eslint/prefer-standalone": "off",
      "@angular-eslint/prefer-standalone-component": "off",
      "@angular-eslint/prefer-on-push-component-change-detection": "off",
      "@angular-eslint/prefer-signals": "off",
      "@angular-eslint/prefer-output-emitter-ref": "off",
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
  {
    files: ["**/*.html"],
    extends: [
      ...angularEslint.configs.templateAll,
      ...eslintPluginTailwindCSS.configs["flat/recommended"],
    ],
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
);
