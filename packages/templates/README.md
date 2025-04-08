# @1up/templates

This package contains all trackable templates and template groups for the 1up health tracking app.

## Structure

- `/types` - Type definitions for templates
- `/trackables` - Individual trackable templates organized by type
- `/groups` - Template groups for creating multiple trackables together
- `/utils` - Utility functions for working with templates

## Adding New Templates

1. Choose the appropriate category in `/trackables`
2. Create a new file for your template(s)
3. Export your templates using the `defineTemplate` helper
4. Add your templates to the category's index file
5. Update tests if necessary

Example:

```typescript
// /trackables/body/custom-template.ts
export const customTemplates = [
  defineTemplate({
    id: "custom-measurement",
    version: 1,
    name: "Custom Measurement",
    // ... template definition
  }),
];
```

## Adding Template Groups

1. Choose or create an appropriate category in `/groups`
2. Create your group definition
3. Add it to the groups index

## Running Tests

```bash
yarn workspace @1up/templates test
```

```

This organization provides several benefits:

1. **Clear Structure**: Easy to find and modify templates
2. **Separation of Concerns**: Templates are separate from application logic
3. **Type Safety**: Maintained across the entire template system
4. **Contributor Friendly**: Clear organization and documentation
5. **Scalability**: Easy to add new templates and groups
6. **Maintainability**: Each template and group is in its own file

Would you like me to expand on any part of this structure or show more implementation details?
```
