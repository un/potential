import { z } from "zod";

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
export type TrackableTypesValues = TrackableTypesMap[TrackableTypesKey];

export const trackableTypesSchema = z.enum(
  Object.keys(TRACKABLE_TYPES) as [TrackableTypesKey, ...TrackableTypesKey[]],
);
export type TrackableTypesSchema = z.infer<typeof trackableTypesSchema>;

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
  "supplement.generic": "Supplement",
  "symptom.generic": "Symptom",
  "blood.generic": "Blood",
  "body.weight": "Weight",
  "body.height": "Height",
  "body.bodyFat": "Body Fat",
  "body.muscle": "Muscle",
  "body.generic": "Body",
  "custom.generic": "Custom",
} as const;

// Then derive the types from the object
export type TrackableSubTypesMap = typeof TRACKABLE_SUB_TYPES;
export type TrackableSubTypesKey = keyof TrackableSubTypesMap;
export type TrackableSubTypesValues =
  TrackableSubTypesMap[TrackableSubTypesKey];

export const trackableSubTypesSchema = z.enum(
  Object.keys(TRACKABLE_SUB_TYPES) as [
    TrackableSubTypesKey,
    ...TrackableSubTypesKey[],
  ],
);
export type TrackableSubTypesSchema = z.infer<typeof trackableSubTypesSchema>;

export function getSubTypeDisplayValue(key: TrackableSubTypesKey): string {
  return TRACKABLE_SUB_TYPES[key];
}

// Custom config
export type TrackableCustomConfig =
  | ({
      cumulative: boolean;
      limitOnePerDay: boolean;
    } & {
      type: "measure";
      // used to display input and logs
      measureUnitType:
        | "volume"
        | "mass"
        | "length"
        | "time"
        | "temperature"
        | "percentage";
      measureUnitSource: string;
      measureUnitDisplay: string;
      measureTarget: number | null;
      // Additional flexibility
      measureMin?: number;
      measureMax?: number;
      cumulative: boolean;
      // For aggregation and reporting
      aggregationType?: "sum" | "average" | "latest";
    })
  | {
      type: "checkbox";
      // used to display input and logs
      checkboxName: string;
    }
  | {
      type: "range";
      // used to limit inputs
      rangeMin: number;
      rangeMax: number;
      // Labels for range extremes
      rangeUnit?: string;
      rangeMinLabel?: string;
      rangeMaxLabel?: string;
      // Step for input control
      rangeStepLabels: Record<number, string>[];
    }
  | {
      type: "rating";
      // used to limit inputs
      ratingMax: number;
      // Labels for range extremes
      ratingUnit?: string;
      ratingIcon?: string;
      ratingEmoji?: string;
    }
  | {
      type: "note";
      // For text-based tracking
      maxLength?: number;
    };
