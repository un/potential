// packages/templates/src/templates/index.ts
import { bodyTemplates } from "./body";
import { TRACKABLE_TEMPLATES } from "./templates-registry";

// Populate the registry
TRACKABLE_TEMPLATES.body = bodyTemplates;

export * from "./body";
export { TRACKABLE_TEMPLATES };
