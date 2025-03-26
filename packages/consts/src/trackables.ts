export enum TRACKABLE_TYPES {
  consumption = "consumption",
  supplement = "supplement",
  medication = "medication",
  energy = "energy",
  blood = "blood",
  body = "body",
  sleep = "sleep",
  activity = "activity",
  mind = "mind",
  symptom = "symptom",
  custom = "custom",
}

export const TRACKABLE_TYPES_ARRAY = [
  TRACKABLE_TYPES.consumption,
  TRACKABLE_TYPES.supplement,
  TRACKABLE_TYPES.medication,
  TRACKABLE_TYPES.energy,
  TRACKABLE_TYPES.blood,
  TRACKABLE_TYPES.body,
  TRACKABLE_TYPES.sleep,
  TRACKABLE_TYPES.activity,
  TRACKABLE_TYPES.mind,
  TRACKABLE_TYPES.symptom,
  TRACKABLE_TYPES.custom,
] as const;

export const trackableTypesToNameMap: { [I in TRACKABLE_TYPES]: string } = {
  [TRACKABLE_TYPES.consumption]: "Food and Drink",
  [TRACKABLE_TYPES.supplement]: "Supplements",
  [TRACKABLE_TYPES.medication]: "Medication",
  [TRACKABLE_TYPES.energy]: "Energy",
  [TRACKABLE_TYPES.blood]: "Blood",
  [TRACKABLE_TYPES.body]: "Body",
  [TRACKABLE_TYPES.sleep]: "Sleep",
  [TRACKABLE_TYPES.activity]: "Activity",
  [TRACKABLE_TYPES.mind]: "Mind",
  [TRACKABLE_TYPES.symptom]: "Symptoms",
  [TRACKABLE_TYPES.custom]: "Custom",
};
