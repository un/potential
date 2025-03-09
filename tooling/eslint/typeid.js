/**
 * @fileoverview ESLint rule to prevent duplicate values in any TypesMapNameToPrefix object
 */

/** @type {import('eslint').Rule.RuleModule} */
const typeidRule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow duplicate prefix values in any TypesMapNameToPrefix object',
      category: 'Possible Errors',
      recommended: true,
      url: 'https://github.com/your-org/eslint-plugin-1up/blob/main/docs/rules/typeid.md'
    },
    messages: {
      duplicatePrefix:
        'Duplicate prefix "{{prefix}}" found. Already used for key "{{previousKey}}" and now for "{{currentKey}}".'
    },
    schema: [],
    hasSuggestions: false
  },
  create(context) {
    console.log('typeidRule: Rule created for file:', context.getFilename());

    return {
      VariableDeclarator(node) {
        console.log(
          'typeidRule: Checking VariableDeclarator node:',
          node.id && node.id.type === 'Identifier'
            ? node.id.name
            : 'non-identifier'
        );

        // Check if this is any object ending with TypesMapNameToPrefix
        if (
          node.id &&
          node.id.type === 'Identifier' &&
          node.id.name.endsWith('TypesMapNameToPrefix') &&
          context.getFilename().endsWith('.ts')
        ) {
          console.log(
            `typeidRule: Found ${node.id.name} in ${context.getFilename()}`
          );
          console.log('typeidRule: Node init type:', node.init?.type);

          // Get the object expression, handling TypeScript's 'as const' assertion
          let objectExpression = null;
          if (node.init && node.init.type === 'ObjectExpression') {
            objectExpression = node.init;
          } else if (node.init) {
            // Handle TypeScript's 'as const' assertion
            // TypeScript AST types are not directly available in ESLint's types
            // so we need to check properties dynamically
            const tsNode = /** @type {any} */ (node.init);
            if (
              tsNode.type === 'TSAsExpression' &&
              tsNode.expression &&
              tsNode.expression.type === 'ObjectExpression'
            ) {
              objectExpression = tsNode.expression;
              console.log(
                'typeidRule: Found object expression inside TSAsExpression'
              );
            }
          }

          // Make sure it's an object expression
          if (objectExpression) {
            console.log(
              'typeidRule: It is an object expression with',
              objectExpression.properties.length,
              'properties'
            );

            /**
             * @param {any} p - The property to map
             * @returns {object} The mapped property info
             */
            const mapProperty = (p) => {
              if (p.type === 'Property' && p.key.type === 'Identifier') {
                return {
                  key: p.key.name,
                  valueType: p.value.type,
                  value:
                    p.value.type === 'Literal' ? p.value.value : 'non-literal'
                };
              }
              return { type: p.type };
            };

            console.log(
              'typeidRule: Properties:',
              JSON.stringify(objectExpression.properties.map(mapProperty))
            );

            // Filter to only include Property nodes (not SpreadElement)
            const properties = objectExpression.properties.filter(
              /** @param {any} prop */ (prop) =>
                prop.type === 'Property' && !prop.computed
            );

            console.log(
              'typeidRule: Filtered to',
              properties.length,
              'valid properties'
            );

            const values = new Map();

            for (const prop of properties) {
              // We know these are Property nodes from the filter above
              const property = /** @type {import('estree').Property} */ (prop);

              // Get key name for logging
              let keyName = '';
              if (property.key.type === 'Identifier') {
                keyName = property.key.name;
              } else if (property.key.type === 'Literal') {
                keyName = String(property.key.value);
              }

              console.log(
                `typeidRule: Checking property "${keyName}" with value type:`,
                property.value.type
              );

              // Only check string literals
              if (
                property.value.type === 'Literal' &&
                typeof property.value.value === 'string'
              ) {
                const valueText = property.value.value;
                console.log(
                  `typeidRule: Property "${keyName}" has string value: "${valueText}"`
                );

                if (values.has(valueText)) {
                  const previousProp =
                    /** @type {import('estree').Property} */ (
                      values.get(valueText)
                    );

                  // Get key names safely
                  let previousKey = '';
                  if (previousProp.key.type === 'Identifier') {
                    previousKey = previousProp.key.name;
                  } else if (previousProp.key.type === 'Literal') {
                    previousKey = String(previousProp.key.value);
                  }

                  let currentKey = '';
                  if (property.key.type === 'Identifier') {
                    currentKey = property.key.name;
                  } else if (property.key.type === 'Literal') {
                    currentKey = String(property.key.value);
                  }

                  console.log(
                    `typeidRule: DUPLICATE FOUND! Value "${valueText}" used for both "${previousKey}" and "${currentKey}"`
                  );

                  context.report({
                    node: property.value,
                    messageId: 'duplicatePrefix',
                    data: {
                      prefix: valueText,
                      previousKey,
                      currentKey
                    }
                  });
                } else {
                  console.log(
                    `typeidRule: Adding value "${valueText}" to tracked values`
                  );
                  values.set(valueText, property);
                }
              } else {
                console.log(
                  `typeidRule: Property "${keyName}" does not have a string literal value, skipping`
                );
              }
            }
          } else {
            console.log('typeidRule: Not an object expression, skipping');
          }
        }
      }
    };
  }
};

/** @type {import('@eslint/eslintrc').FlatConfig[]} */
export default [
  {
    files: ['**/typeid.ts'],
    plugins: {
      '@1up': {
        rules: {
          'no-duplicate-typeid-prefixes': typeidRule
        }
      }
    },
    rules: {
      '@1up/no-duplicate-typeid-prefixes': 'error'
    }
  }
];
