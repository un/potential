export const TRACKABLE_TYPES = {
  consumption: "Consumption",
  supplement: "Supplement",
  medication: "Medication",
  energy: "Energy",
  blood: "Blood",
  body: "Body",
  sleep: "Sleep",
  activity: "Activity",
  mind: "Mind",
  symptom: "Symptom",
  custom: "Custom",
} as const;

export type TrackableTypesMap = typeof TRACKABLE_TYPES;
export type TrackableTypesKey = keyof TrackableTypesMap;
export function getTypeDisplayValue(key: TrackableTypesKey): string {
  return TRACKABLE_TYPES[key];
}

export const TRACKABLE_SUB_TYPES = {
  "consumption.parent.food": "Food",
  "consumption.parent.drink": "Drink",
  "consumption.parent.other": "Other",
  "consumption.macros.protein": "Protein",
  "consumption.macros.carbs": "Carbs",
  "consumption.macros.fat": "Fat",
  "consumption.macros.fatSaturated": "Saturated Fat",
  "consumption.macros.fatMonounsaturated": "Monounsaturated Fat",
  "consumption.macros.fatPolyunsaturated": "Polyunsaturated Fat",
  "consumption.macros.fatTrans": "Trans Fat",
  "consumption.macros.cholesterol": "Cholesterol",
  "consumption.macros.sugar": "Sugar",
  "consumption.macros.sugarAdded": "Added Sugar",
  "consumption.macros.sugarNatural": "Natural Sugar",
  "consumption.macros.fiber": "Fiber",
  "consumption.macros.water": "Water",
  "consumption.macros.alcohol": "Alcohol",
  "consumption.macros.caffeine": "Caffeine",
  "consumption.minerals.sodium": "Sodium",
  "consumption.minerals.magnesium": "Magnesium",
  "consumption.minerals.calcium": "Calcium",
  "consumption.minerals.iron": "Iron",
  "consumption.minerals.zinc": "Zinc",
  "consumption.minerals.potassium": "Potassium",
  "consumption.minerals.copper": "Copper",
  "consumption.minerals.manganese": "Manganese",
  "consumption.minerals.selenium": "Selenium",
  "consumption.minerals.phosphorus": "Phosphorus",
  "consumption.minerals.chromium": "Chromium",
  "consumption.minerals.iodine": "Iodine",
  "consumption.minerals.molybdenum": "Molybdenum",
  "consumption.minerals.chloride": "Chloride",
  "consumption.minerals.fluoride": "Fluoride",
  "consumption.minerals.sulfur": "Sulfur",
  "consumption.vitamins.A": "A",
  "consumption.vitamins.B1": "B1",
  "consumption.vitamins.B2": "B2",
  "consumption.vitamins.B3": "B3",
  "consumption.vitamins.B5": "B5",
  "consumption.vitamins.B6": "B6",
  "consumption.vitamins.B7": "B7",
  "consumption.vitamins.B9": "B9",
  "consumption.vitamins.B12": "B12",
  "consumption.vitamins.C": "C",
  "consumption.vitamins.D": "D",
  "consumption.vitamins.E": "E",
  "consumption.vitamins.K": "K",
  "energy.calories.net": "Calories Net",
  "energy.calories.intake": "Calories Intake",
  "energy.calories.burn": "Calories Burn",
  "body.weight": "Weight",
  "body.height": "Height",
  "body.bodyFat": "Body Fat",
  "body.muscle": "Muscle",
  "custom.generic": "Custom",
} as const;

// Then derive the types from the object
export type TrackableSubTypesMap = typeof TRACKABLE_SUB_TYPES;
export type TrackableSubTypesKey = keyof TrackableSubTypesMap;

export function getSubTypeDisplayValue(key: TrackableSubTypesKey): string {
  return TRACKABLE_SUB_TYPES[key];
}
// export enum TRACKABLE_TYPES {
//   consumption = "consumption",
//   supplement = "supplement",
//   medication = "medication",
//   energy = "energy",
//   blood = "blood",
//   body = "body",
//   sleep = "sleep",
//   activity = "activity",
//   mind = "mind",
//   symptom = "symptom",
//   custom = "custom",
// }

// export const TRACKABLE_TYPES_ARRAY = [
//   TRACKABLE_TYPES.consumption,
//   TRACKABLE_TYPES.supplement,
//   TRACKABLE_TYPES.medication,
//   TRACKABLE_TYPES.energy,
//   TRACKABLE_TYPES.blood,
//   TRACKABLE_TYPES.body,
//   TRACKABLE_TYPES.sleep,
//   TRACKABLE_TYPES.activity,
//   TRACKABLE_TYPES.mind,
//   TRACKABLE_TYPES.symptom,
//   TRACKABLE_TYPES.custom,
// ] as const;

// export const trackableTypesToNameMap: { [I in TRACKABLE_TYPES]: string } = {
//   [TRACKABLE_TYPES.consumption]: "Food and Drink",
//   [TRACKABLE_TYPES.supplement]: "Supplements",
//   [TRACKABLE_TYPES.medication]: "Medication",
//   [TRACKABLE_TYPES.energy]: "Energy",
//   [TRACKABLE_TYPES.blood]: "Blood",
//   [TRACKABLE_TYPES.body]: "Body",
//   [TRACKABLE_TYPES.sleep]: "Sleep",
//   [TRACKABLE_TYPES.activity]: "Activity",
//   [TRACKABLE_TYPES.mind]: "Mind",
//   [TRACKABLE_TYPES.symptom]: "Symptoms",
//   [TRACKABLE_TYPES.custom]: "Custom",
// };
