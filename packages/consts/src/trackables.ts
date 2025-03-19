export enum TRACKABLE_TYPES {
  consumption = "consumption",
  sleep = "sleep",
  activity = "activity",
  mind = "mind",
  custom = "custom",
}

export const TRACKABLE_TYPES_ARRAY = [
  TRACKABLE_TYPES.consumption,
  TRACKABLE_TYPES.sleep,
  TRACKABLE_TYPES.activity,
  TRACKABLE_TYPES.mind,
  TRACKABLE_TYPES.custom,
] as const;

export const trackableTypesToNameMap: { [I in TRACKABLE_TYPES]: string } = {
  [TRACKABLE_TYPES.consumption]: "Food and Drink",
  [TRACKABLE_TYPES.sleep]: "Sleep",
  [TRACKABLE_TYPES.activity]: "Activity",
  [TRACKABLE_TYPES.mind]: "Mind",
  [TRACKABLE_TYPES.custom]: "Custom",
};
