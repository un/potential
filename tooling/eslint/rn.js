/**
 * @fileoverview ESLint rule to ensure importing from UI lib instead of react native
 */

/** @type {import('eslint').Rule.RuleModule} */
const rnImportRule = {
  meta: {
    type: "problem",
    docs: {
      description: "Ensure that importing from UI lib instead of react native",
      category: "Best Practices",
      recommended: true,
    },
    messages: {
      wrongImport:
        "Import from UI lib! This component should not be imported from react native",
    },
    schema: [],
  },
  create(context) {
    // Components that should not be imported from react-native
    const restrictedComponents = [
      "Text",
      // Add more components as needed
    ];

    return {
      ImportDeclaration(node) {
        // Check if importing from react-native
        if (node.source.value !== "react-native") {
          return;
        }

        // Check each imported specifier
        node.specifiers.forEach((specifier) => {
          if (
            specifier.type === "ImportSpecifier" &&
            specifier.imported.type === "Identifier" &&
            restrictedComponents.includes(specifier.imported.name)
          ) {
            context.report({
              node: specifier,
              messageId: "wrongImport",
            });
          }
        });
      },
    };
  },
};

/** @type {import('@eslint/eslintrc').FlatConfig[]} */
export default [
  {
    files: ["**/*.tsx", "**/*.ts", "**/*.jsx", "**/*.js"],
    plugins: {
      "@1up": {
        rules: {
          "no-direct-rn-import": rnImportRule,
        },
      },
    },
    rules: {
      "@1up/no-direct-rn-import": "error",
    },
  },
];
