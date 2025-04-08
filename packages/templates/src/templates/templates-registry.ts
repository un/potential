import type { TrackableTemplateRegistry } from "../types";

export const TRACKABLE_TEMPLATES: TrackableTemplateRegistry = {
  body: {}, // We populate this later
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
