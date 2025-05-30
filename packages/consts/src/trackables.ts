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

export const trackableTypesSchema = z
  .enum(
    Object.keys(TRACKABLE_TYPES) as [TrackableTypesKey, ...TrackableTypesKey[]],
  )
  .describe(
    "The system type of the trackable item. This will be used to group similar trackable items together. It is also used to show some visual representation of the trackable item in the UI. Possible values are: " +
      Object.keys(TRACKABLE_TYPES).join(", "),
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
  "calories.net": "Calories Net",
  "calories.intake": "Calories Intake",
  "calories.burn": "Calories Burn",
  "supplement.generic": "Supplement",
  "symptom.generic": "Custom Symptom",
  "blood.generic": "Custom Blood",
  "body.weight": "Weight",
  "body.height": "Height",
  "body.fat": "Fat",
  "body.muscle": "Muscle",
  "body.measurement": "Measurement",
  "body.energy": "Energy",
  "body.generic": "Custom Body",
  "custom.generic": "Custom",
  "mind.journal": "Daily Journal",
  "mind.stress": "Stress Level",
  "mind.anxiety": "Anxiety Level",
  "mind.focus": "Focus",
  "mind.productivity": "Productivity",
  "mind.creativity": "Creativity",
  "mind.generic": "Custom Mind",
  "medication.generic": "Custom Medication",
  "sleep.quality": "Sleep Quality",
  "sleep.duration": "Sleep Duration",
  "sleep.generic": "Custom Sleep",
  "activity.generic": "Custom Activity",
} as const;

// Then derive the types from the object
export type TrackableSubTypesMap = typeof TRACKABLE_SUB_TYPES;
export type TrackableSubTypesKey = keyof TrackableSubTypesMap;
export type TrackableSubTypesValues =
  TrackableSubTypesMap[TrackableSubTypesKey];

export const trackableSubTypesSchema = z
  .enum(
    Object.keys(TRACKABLE_SUB_TYPES) as [
      TrackableSubTypesKey,
      ...TrackableSubTypesKey[],
    ],
  )
  .describe(
    "The sub type of the trackable item. This will be used to group similar trackable items together and ensure no duplicates. It is also used to show some visual representation of the trackable item in the UI. It is made up of a string of the form 'type.parent.sub' not all have a sub. Possible values are: " +
      Object.keys(TRACKABLE_SUB_TYPES).join(", ") +
      "be sure to only use values from this list and not make up any others",
  );
export type TrackableSubTypesSchema = z.infer<typeof trackableSubTypesSchema>;

export function getSubTypeDisplayValue(key: TrackableSubTypesKey): string {
  return TRACKABLE_SUB_TYPES[key];
}

// Custom config

export const TRACKABLE_CUSTOM_CONFIG_TYPES = {
  measure: "Measure",
  checkbox: "Checkbox",
  range: "Range",
  rating: "Rating",
  shortText: "Short Text",
  longText: "Long Text",
} as const;

export type TrackableCustomConfigTypesMap =
  typeof TRACKABLE_CUSTOM_CONFIG_TYPES;
export type TrackableCustomConfigTypesKey = keyof TrackableCustomConfigTypesMap;
export type TrackableCustomConfigTypesValues =
  TrackableCustomConfigTypesMap[TrackableCustomConfigTypesKey];

export const trackableCustomConfigTypesSchema = z
  .enum(
    Object.keys(TRACKABLE_CUSTOM_CONFIG_TYPES) as [
      TrackableCustomConfigTypesKey,
      ...TrackableCustomConfigTypesKey[],
    ],
  )
  .describe(
    "The config type of the trackable item. This will be used to visually display entered data and provide a UI for the user to enter data. Possible values are: " +
      Object.keys(TRACKABLE_CUSTOM_CONFIG_TYPES).join(", "),
  );
export type TrackableCustomConfigTypesSchema = z.infer<
  typeof trackableCustomConfigTypesSchema
>;

export function getCustomConfigTypeDisplayValue(
  key: TrackableCustomConfigTypesKey,
): string {
  return TRACKABLE_CUSTOM_CONFIG_TYPES[key];
}

export const TRACKABLE_CONFIG_MEASURE_UNITS = {
  volume: "Volume",
  mass: "Mass",
  length: "Length",
  time: "Time",
  temperature: "Temperature",
  percentage: "Percentage",
} as const;

export type TrackableCustomConfigMeasureUnitsMap =
  typeof TRACKABLE_CONFIG_MEASURE_UNITS;
export type TrackableCustomConfigMeasureUnitsKey =
  keyof TrackableCustomConfigMeasureUnitsMap;
export type TrackableCustomConfigMeasureUnitsValues =
  TrackableCustomConfigMeasureUnitsMap[TrackableCustomConfigMeasureUnitsKey];

export const trackableCustomConfigMeasureUnitsSchema = z
  .enum(
    Object.keys(TRACKABLE_CONFIG_MEASURE_UNITS) as [
      TrackableCustomConfigMeasureUnitsKey,
      ...TrackableCustomConfigMeasureUnitsKey[],
    ],
  )
  .describe(
    "The unit of measure for the trackable item. This will be used to display the unit of measure in the UI and to act as the conversion factor for the measure. Possible values are: " +
      Object.keys(TRACKABLE_CONFIG_MEASURE_UNITS).join(", "),
  );

export const TRACKABLE_CONFIG_MEASURE_CUMULATION = {
  hourly: "Hourly",
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
} as const;

export type TrackableCustomConfigMeasureCumulationMap =
  typeof TRACKABLE_CONFIG_MEASURE_CUMULATION;
export type TrackableCustomConfigMeasureCumulationKey =
  keyof TrackableCustomConfigMeasureCumulationMap;
export type TrackableCustomConfigMeasureCumulationValues =
  TrackableCustomConfigMeasureCumulationMap[TrackableCustomConfigMeasureCumulationKey];

export const trackableCustomConfigMeasureCumulationSchema = z
  .enum(
    Object.keys(TRACKABLE_CONFIG_MEASURE_CUMULATION) as [
      TrackableCustomConfigMeasureCumulationKey,
      ...TrackableCustomConfigMeasureCumulationKey[],
    ],
  )
  .describe(
    "The cumulation type for the trackable item. This will be used to determine how the data is aggregated over time. Possible values are: " +
      Object.keys(TRACKABLE_CONFIG_MEASURE_CUMULATION).join(", "),
  );

export const TRACKABLE_CONFIG_MEASURE_AGGREGATION = {
  sum: "Sum",
  average: "Average",
  latest: "Latest",
} as const;

export type TrackableCustomConfigMeasureAggregationMap =
  typeof TRACKABLE_CONFIG_MEASURE_AGGREGATION;
export type TrackableCustomConfigMeasureAggregationKey =
  keyof TrackableCustomConfigMeasureAggregationMap;
export type TrackableCustomConfigMeasureAggregationValues =
  TrackableCustomConfigMeasureAggregationMap[TrackableCustomConfigMeasureAggregationKey];

export const trackableCustomConfigMeasureAggregationSchema = z
  .enum(
    Object.keys(TRACKABLE_CONFIG_MEASURE_AGGREGATION) as [
      TrackableCustomConfigMeasureAggregationKey,
      ...TrackableCustomConfigMeasureAggregationKey[],
    ],
  )
  .describe(
    "The aggregation type for the trackable item. This will be used to determine how the data is aggregated over time. Possible values are: " +
      Object.keys(TRACKABLE_CONFIG_MEASURE_AGGREGATION).join(", "),
  );

const trackableMeasureSchema = z.object({
  type: z.literal("measure"),
  measureUnitType: trackableCustomConfigMeasureUnitsSchema,
  measureUnitSource: z
    .string()
    .describe(
      "The source of the unit of measure for the trackable item. This will be used to display the unit of measure in the UI and to act as the conversion factor for the measure. e.g. 'grams'",
    ),
  measureUnitDisplay: z
    .string()
    .describe(
      "The display name of the unit of measure for the trackable item. This will be used to display the unit of measure in the UI and to run conversions. e.g. 'lbs'.",
    ),
  measureTarget: z
    .number()
    .nullable()
    .describe(
      "The target value for the trackable item. This will be used to display the target value in the UI and to run conversions. e.g. '100'",
    ),
  measureMin: z
    .number()
    .optional()
    .describe(
      "The minimum value for the trackable item. This will be used to limit the input range.",
    ),
  measureMax: z
    .number()
    .optional()
    .describe(
      "The maximum value for the trackable item. This will be used to limit the input range.",
    ),
  cumulative: z
    .boolean()
    .describe(
      "Whether the data is cumulative over time. If true, the data will be aggregated over time. If false, the data will be displayed as a single value.",
    ),
  cumulation: trackableCustomConfigMeasureCumulationSchema.optional(),
  aggregationType: trackableCustomConfigMeasureAggregationSchema.optional(),
});

const trackableCheckboxSchema = z.object({
  type: z.literal("checkbox"),
  checkboxName: z
    .string()
    .describe(
      "The name of the checkbox for the trackable item. This will be used to add a label to the display of the checkbox in the UI.",
    ),
});

const trackableRangeSchema = z.object({
  type: z.literal("range"),
  rangeMin: z
    .number()
    .describe(
      "The minimum value for the trackable item. This will be used to limit the input range.",
    ),
  rangeMax: z
    .number()
    .describe(
      "The maximum value for the trackable item. This will be used to limit the input range.",
    ),
  rangeUnit: z
    .string()
    .optional()
    .describe(
      "The unit of measure for the trackable item. This will be used to display the unit of measure in the UI and to run conversions. e.g. '%'.",
    ),
  rangeMinLabel: z
    .string()
    .optional()
    .describe(
      "The label for the minimum value for the trackable item. This will be used to display the label in the UI.",
    ),
  rangeMaxLabel: z
    .string()
    .optional()
    .describe(
      "The label for the maximum value for the trackable item. This will be used to display the label in the UI.",
    ),
  rangeStepLabels: z
    .array(z.record(z.string()))
    .optional()
    .describe(
      "An array of objects with string keys and values. The keys are the values for where to place the item on the range input slider and the values are the labels for the steps for the trackable item. This will be used to display the labels in the UI. e.g. [{'1': '100%'}, {'2': '90%'}, {'3': '80%'}, {'4': '70%'}, {'5': '60%'}, {'6': '50%'}, {'7': '40%'}, {'8': '30%'}, {'9': '20%'}, {'10': '10%'}]",
    ), // Record<number, string>[] translates to array of objects with string keys
});

const trackableRatingSchema = z.object({
  type: z.literal("rating"),
  ratingMax: z
    .union([
      z.literal(1),
      z.literal(2),
      z.literal(3),
      z.literal(4),
      z.literal(5),
      z.literal(6),
      z.literal(7),
      z.literal(8),
      z.literal(9),
      z.literal(10),
    ])
    .describe(
      "The maximum number of stars for the trackable item. This will be used to limit the input range. accepted values are: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10",
    ),
  ratingUnit: z
    .string()
    .optional()
    .describe(
      "The unit of measure for the trackable item. This will be used to display the unit of measure in the UI and to run conversions. e.g. '%'.",
    ),
  ratingIcon: z
    .string()
    .optional()
    .describe(
      "The icon for the trackable item. this is not yet implemented and should be ignored.",
    ),
  ratingEmoji: z
    .string()
    .optional()
    .describe(
      "The emoji for the trackable item. This will be used to display the emoji in the UI as the input and display value. e.g. '🌟' with a value of 4 will be displayed as '🌟🌟🌟🌟'.",
    ),
});

const trackableShortTextSchema = z.object({
  type: z.literal("shortText"),
});

const trackableLongTextSchema = z.object({
  type: z.literal("longText"),
});

export type TrackableCustomConfigDataFields =
  | {
      type: "measure";
      // used to display input and logs
      measureUnitType: TrackableCustomConfigMeasureUnitsKey;
      measureUnitSource: string;
      measureUnitDisplay: string;
      measureTarget: number | null;
      // Additional flexibility
      measureMin?: number;
      measureMax?: number;
      // For aggregation and reporting
      cumulative: boolean;
      cumulation?: TrackableCustomConfigMeasureCumulationKey;
      aggregationType?: TrackableCustomConfigMeasureAggregationKey;
    }
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
      ratingMax: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
      ratingUnit?: string;
      ratingIcon?: string;
      ratingEmoji?: string;
    }
  | {
      type: "shortText";
    }
  | {
      type: "longText";
    };

export type TrackableCustomConfig = TrackableCustomConfigDataFields & {
  limitOnePerDay: boolean;
};

// export const trackableCustomConfigSchema = z.intersection(
//   z.object({
//     limitOnePerDay: z.boolean(),
//   }),
//   z.discriminatedUnion("type", [
//     trackableMeasureSchema,
//     trackableCheckboxSchema,
//     trackableRangeSchema,
//     trackableRatingSchema,
//     trackableShortTextSchema,
//     trackableLongTextSchema,
//   ]),
// );
export const trackableCustomConfigSchema = z.discriminatedUnion("type", [
  trackableMeasureSchema,
  trackableCheckboxSchema,
  trackableRangeSchema,
  trackableRatingSchema,
  trackableShortTextSchema,
  trackableLongTextSchema,
]);
