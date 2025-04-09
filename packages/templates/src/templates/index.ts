// packages/templates/src/templates/index.ts
import { bodyTemplates } from "./body";
import { mindTemplates } from "./mind";
import { TRACKABLE_TEMPLATES } from "./templates-registry";

// Populate the registry
TRACKABLE_TEMPLATES.body = bodyTemplates;
TRACKABLE_TEMPLATES.mind = mindTemplates;

export * from "./body";
export * from "./mind";
export { TRACKABLE_TEMPLATES };
