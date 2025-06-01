import type { TrackerTemplateRegistry } from "../types";

export const TRACKER_TEMPLATES: TrackerTemplateRegistry = {
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
