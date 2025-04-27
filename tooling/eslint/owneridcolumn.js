/**
 * @fileoverview ESLint rule to ensure that every mysql table has ownerId column
 */

/** @type {import('eslint').Rule.RuleModule} */
const ownerIdColumnRule = {
  meta: {
    type: "problem",
    docs: {
      description: "Ensure that every mysql table has ownerId column",
      category: "Best Practices",
      recommended: true,
    },
    messages: {
      missingOwnerId:
        "Every mysql table should have ownerId column with foreign key to orgs table which is not null",
    },
    schema: [],
  },
  create(context) {
    // Only check files in the /schema/ directory with .ts extension
    const filename = context.getFilename();
    if (!filename.includes("/schema/") || !filename.endsWith(".ts")) {
      return {};
    }

    console.log(`ownerIdColumnRule: Checking file ${filename}`);

    // Tables that are exempt from requiring an ownerId column
    const exemptTables = [
      "users",
      "orgs",
      "organizations",
      "accounts",
      "tenants",
    ];

    return {
      CallExpression(node) {
        // Check if this is a mysqlTable call with at least 2 arguments
        if (
          node.callee.type !== "Identifier" ||
          node.callee.name !== "mysqlTable" ||
          node.arguments.length < 2
        ) {
          return;
        }

        // Get the table name from the first argument
        const tableNameArg = node.arguments[0];
        if (
          !tableNameArg ||
          tableNameArg.type !== "Literal" ||
          typeof tableNameArg.value !== "string"
        ) {
          return;
        }

        const tableName = tableNameArg.value;
        console.log(
          `ownerIdColumnRule: Found mysqlTable call for table "${tableName}" in ${filename}`,
        );

        // Check if this table is exempt
        if (
          exemptTables.some((exemptTable) => tableName.includes(exemptTable))
        ) {
          console.log(
            `ownerIdColumnRule: Table "${tableName}" is exempt from ownerId requirement`,
          );
          return;
        }

        // Ensure the second argument is an object expression
        const schemaArg = node.arguments[1];
        if (!schemaArg || schemaArg.type !== "ObjectExpression") {
          console.log(
            `ownerIdColumnRule: Second argument is not an ObjectExpression, skipping`,
          );
          return;
        }

        const schemaProperties = schemaArg.properties;
        console.log(
          `ownerIdColumnRule: Found ${schemaProperties.length} properties in schema`,
        );

        // Find the ownerId property
        /** @type {import('estree').Property | null} */
        let ownerIdProperty = null;

        for (const prop of schemaProperties) {
          if (
            prop.type === "Property" &&
            prop.key.type === "Identifier" &&
            prop.key.name === "ownerId"
          ) {
            ownerIdProperty = /** @type {import('estree').Property} */ (prop);
            break;
          }
        }

        // Check if ownerId column exists
        if (!ownerIdProperty) {
          console.log(
            `ownerIdColumnRule: No ownerId column found in table "${tableName}"`,
          );
          context.report({
            node: schemaArg,
            messageId: "missingOwnerId",
          });
          return;
        }

        // Check if the value is a chain of method calls that includes .notNull() and .references()
        if (ownerIdProperty.value.type !== "CallExpression") {
          console.log(
            `ownerIdColumnRule: ownerId value is not a CallExpression`,
          );
          context.report({
            node: ownerIdProperty.value,
            messageId: "missingOwnerId",
          });
          return;
        }

        // Check for .notNull() in the chain
        let currentNode = ownerIdProperty.value;
        let hasNotNull = false;

        // Traverse the method chain to find .notNull() and .references()
        while (currentNode && currentNode.type === "CallExpression") {
          if (
            currentNode.callee.type === "MemberExpression" &&
            currentNode.callee.property.type === "Identifier"
          ) {
            const methodName = currentNode.callee.property.name;

            if (methodName === "notNull") {
              hasNotNull = true;
              console.log(`ownerIdColumnRule: Found .notNull() in the chain`);
            }
          }

          // Move up the chain
          if (
            currentNode.callee.type === "MemberExpression" &&
            currentNode.callee.object.type === "CallExpression"
          ) {
            currentNode = currentNode.callee.object;
          } else {
            break;
          }
        }

        // Check if both .notNull() and .references() are present
        if (!hasNotNull) {
          console.log(`ownerIdColumnRule: ownerId is missing .notNull()`);
          context.report({
            node: ownerIdProperty.value,
            messageId: "missingOwnerId",
          });
          return;
        }

        console.log(
          `ownerIdColumnRule: ownerId column is correctly defined in table "${tableName}"`,
        );
      },
    };
  },
};

/** @type {import('@eslint/eslintrc').FlatConfig[]} */
export default [
  {
    files: ["**/schema/**/*.ts", "**/schema/*.ts", "**/schema.ts"],
    plugins: {
      "@potential": {
        rules: {
          "every-db-table-needs-ownerid-column": ownerIdColumnRule,
        },
      },
    },
    rules: {
      "@potential/every-db-table-needs-ownerid-column": "error",
    },
  },
];
