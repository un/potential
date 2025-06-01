# @potential/templates

This package contains all tracker templates and template groups for the 1up health tracking app.

## Structure

- `/types` - Type definitions for templates
- `/trackers` - Individual tracker templates organized by type
- `/groups` - Template groups for creating multiple trackers together
- `/utils` - Utility functions for working with templates

## Adding New Templates

1. Choose the appropriate category in `/templates`
2. Follow the pattern in the template file
3. Export your templates using the `defineTemplate` helper

Example:

```typescript
// /trackers/body/custom-template.ts
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
