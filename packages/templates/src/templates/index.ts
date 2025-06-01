// packages/templates/src/templates/index.ts
import { bodyTemplates } from "./body";
import { consumptionTemplates } from "./consumption";
import { mindTemplates } from "./mind";
import { TRACKER_TEMPLATES } from "./templates-registry";

// Populate the registry
TRACKER_TEMPLATES.body = bodyTemplates;
TRACKER_TEMPLATES.mind = mindTemplates;
TRACKER_TEMPLATES.consumption = consumptionTemplates;

export * from "./body";
export * from "./consumption";
export * from "./mind";

export { TRACKER_TEMPLATES };
