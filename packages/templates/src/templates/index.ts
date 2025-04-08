// packages/templates/src/templates/index.ts
import type { TrackableTemplateRegistry } from "../types";
import { bodyTemplates } from "./body";

export const TRACKABLE_TEMPLATES: TrackableTemplateRegistry = {
  body: bodyTemplates,
  sleep: {},
  consumption: {},
  supplement: {},
  medication: {},
  energy: {},
  blood: {},
  activity: {},
  mind: {},
  symptom: {},
  custom: {},
} as const;

export * from "./body";
