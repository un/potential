// packages/templates/src/templates/index.ts
import { bodyTemplates } from "./body";
import { consumptionTemplates } from "./consumption";
import { mindTemplates } from "./mind";
import { TRACKABLE_TEMPLATES } from "./templates-registry";

// Populate the registry
TRACKABLE_TEMPLATES.body = bodyTemplates;
TRACKABLE_TEMPLATES.mind = mindTemplates;
TRACKABLE_TEMPLATES.consumption = consumptionTemplates;

export * from "./body";
export * from "./consumption";
export * from "./mind";

export { TRACKABLE_TEMPLATES };
