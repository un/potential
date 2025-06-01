import { z } from "zod";

export const TRACKER_TYPES = {
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

export type TrackerTypesMap = typeof TRACKER_TYPES;
export type TrackerTypesKey = keyof TrackerTypesMap;
export type TrackerTypesValues = TrackerTypesMap[TrackerTypesKey];

export const trackerTypesSchema = z
  .enum(Object.keys(TRACKER_TYPES) as [TrackerTypesKey, ...TrackerTypesKey[]])
  .describe(
    "The system type of the tracker item. This will be used to group similar tracker items together. It is also used to show some visual representation of the tracker item in the UI. Possible values are: " +
      Object.keys(TRACKER_TYPES).join(", "),
  );
export type TrackerTypesSchema = z.infer<typeof trackerTypesSchema>;

export function getTypeDisplayValue(key: TrackerTypesKey): string {
  return TRACKER_TYPES[key];
}

export const TRACKER_SUB_TYPES = {
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
export type TrackerSubTypesMap = typeof TRACKER_SUB_TYPES;
export type TrackerSubTypesKey = keyof TrackerSubTypesMap;
export type TrackerSubTypesValues = TrackerSubTypesMap[TrackerSubTypesKey];

export const trackerSubTypesSchema = z
  .enum(
    Object.keys(TRACKER_SUB_TYPES) as [
      TrackerSubTypesKey,
      ...TrackerSubTypesKey[],
    ],
  )
  .describe(
    "The sub type of the tracker item. This will be used to group similar tracker items together and ensure no duplicates. It is also used to show some visual representation of the tracker item in the UI. It is made up of a string of the form 'type.parent.sub' not all have a sub. Possible values are: " +
      Object.keys(TRACKER_SUB_TYPES).join(", ") +
      "be sure to only use values from this list and not make up any others",
  );
export type TrackerSubTypesSchema = z.infer<typeof trackerSubTypesSchema>;

export function getSubTypeDisplayValue(key: TrackerSubTypesKey): string {
  return TRACKER_SUB_TYPES[key];
}

// Custom config

export const TRACKER_CUSTOM_CONFIG_TYPES = {
  measure: "Measure",
  checkbox: "Checkbox",
  range: "Range",
  rating: "Rating",
  shortText: "Short Text",
  longText: "Long Text",
} as const;

export type TrackerCustomConfigTypesMap = typeof TRACKER_CUSTOM_CONFIG_TYPES;
export type TrackerCustomConfigTypesKey = keyof TrackerCustomConfigTypesMap;
export type TrackerCustomConfigTypesValues =
  TrackerCustomConfigTypesMap[TrackerCustomConfigTypesKey];

export const trackerCustomConfigTypesSchema = z
  .enum(
    Object.keys(TRACKER_CUSTOM_CONFIG_TYPES) as [
      TrackerCustomConfigTypesKey,
      ...TrackerCustomConfigTypesKey[],
    ],
  )
  .describe(
    "The config type of the tracker item. This will be used to visually display entered data and provide a UI for the user to enter data. Possible values are: " +
      Object.keys(TRACKER_CUSTOM_CONFIG_TYPES).join(", "),
  );
export type TrackerCustomConfigTypesSchema = z.infer<
  typeof trackerCustomConfigTypesSchema
>;

export function getCustomConfigTypeDisplayValue(
  key: TrackerCustomConfigTypesKey,
): string {
  return TRACKER_CUSTOM_CONFIG_TYPES[key];
}

export const TRACKER_CONFIG_MEASURE_UNITS = {
  volume: "Volume",
  mass: "Mass",
  length: "Length",
  time: "Time",
  temperature: "Temperature",
  percentage: "Percentage",
} as const;

export type TrackerCustomConfigMeasureUnitsMap =
  typeof TRACKER_CONFIG_MEASURE_UNITS;
export type TrackerCustomConfigMeasureUnitsKey =
  keyof TrackerCustomConfigMeasureUnitsMap;
export type TrackerCustomConfigMeasureUnitsValues =
  TrackerCustomConfigMeasureUnitsMap[TrackerCustomConfigMeasureUnitsKey];

export const trackerCustomConfigMeasureUnitsSchema = z
  .enum(
    Object.keys(TRACKER_CONFIG_MEASURE_UNITS) as [
      TrackerCustomConfigMeasureUnitsKey,
      ...TrackerCustomConfigMeasureUnitsKey[],
    ],
  )
  .describe(
    "The unit of measure for the tracker item. This will be used to display the unit of measure in the UI and to act as the conversion factor for the measure. Possible values are: " +
      Object.keys(TRACKER_CONFIG_MEASURE_UNITS).join(", "),
  );

export const TRACKER_CONFIG_MEASURE_CUMULATION = {
  hourly: "Hourly",
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
} as const;

export type TrackerCustomConfigMeasureCumulationMap =
  typeof TRACKER_CONFIG_MEASURE_CUMULATION;
export type TrackerCustomConfigMeasureCumulationKey =
  keyof TrackerCustomConfigMeasureCumulationMap;
export type TrackerCustomConfigMeasureCumulationValues =
  TrackerCustomConfigMeasureCumulationMap[TrackerCustomConfigMeasureCumulationKey];

export const trackerCustomConfigMeasureCumulationSchema = z
  .enum(
    Object.keys(TRACKER_CONFIG_MEASURE_CUMULATION) as [
      TrackerCustomConfigMeasureCumulationKey,
      ...TrackerCustomConfigMeasureCumulationKey[],
    ],
  )
  .describe(
    "The cumulation type for the tracker item. This will be used to determine how the data is aggregated over time. Possible values are: " +
      Object.keys(TRACKER_CONFIG_MEASURE_CUMULATION).join(", "),
  );

export const TRACKER_CONFIG_MEASURE_AGGREGATION = {
  sum: "Sum",
  average: "Average",
  latest: "Latest",
} as const;

export type TrackerCustomConfigMeasureAggregationMap =
  typeof TRACKER_CONFIG_MEASURE_AGGREGATION;
export type TrackerCustomConfigMeasureAggregationKey =
  keyof TrackerCustomConfigMeasureAggregationMap;
export type TrackerCustomConfigMeasureAggregationValues =
  TrackerCustomConfigMeasureAggregationMap[TrackerCustomConfigMeasureAggregationKey];

export const trackerCustomConfigMeasureAggregationSchema = z
  .enum(
    Object.keys(TRACKER_CONFIG_MEASURE_AGGREGATION) as [
      TrackerCustomConfigMeasureAggregationKey,
      ...TrackerCustomConfigMeasureAggregationKey[],
    ],
  )
  .describe(
    "The aggregation type for the tracker item. This will be used to determine how the data is aggregated over time. Possible values are: " +
      Object.keys(TRACKER_CONFIG_MEASURE_AGGREGATION).join(", "),
  );

const trackerMeasureSchema = z.object({
  type: z.literal("measure"),
  measureUnitType: trackerCustomConfigMeasureUnitsSchema,
  measureUnitSource: z
    .string()
    .describe(
      "The source of the unit of measure for the tracker item. This will be used to display the unit of measure in the UI and to act as the conversion factor for the measure. e.g. 'grams'",
    ),
  measureUnitDisplay: z
    .string()
    .describe(
      "The display name of the unit of measure for the tracker item. This will be used to display the unit of measure in the UI and to run conversions. e.g. 'lbs'.",
    ),
  measureTarget: z
    .number()
    .nullable()
    .describe(
      "The target value for the tracker item. This will be used to display the target value in the UI and to run conversions. e.g. '100'",
    ),
  measureMin: z
    .number()
    .optional()
    .describe(
      "The minimum value for the tracker item. This will be used to limit the input range.",
    ),
  measureMax: z
    .number()
    .optional()
    .describe(
      "The maximum value for the tracker item. This will be used to limit the input range.",
    ),
  cumulative: z
    .boolean()
    .describe(
      "Whether the data is cumulative over time. If true, the data will be aggregated over time. If false, the data will be displayed as a single value.",
    ),
  cumulation: trackerCustomConfigMeasureCumulationSchema.optional(),
  aggregationType: trackerCustomConfigMeasureAggregationSchema.optional(),
});

const trackerCheckboxSchema = z.object({
  type: z.literal("checkbox"),
  checkboxName: z
    .string()
    .describe(
      "The name of the checkbox for the tracker item. This will be used to add a label to the display of the checkbox in the UI.",
    ),
});

const trackerRangeSchema = z.object({
  type: z.literal("range"),
  rangeMin: z
    .number()
    .describe(
      "The minimum value for the tracker item. This will be used to limit the input range.",
    ),
  rangeMax: z
    .number()
    .describe(
      "The maximum value for the tracker item. This will be used to limit the input range.",
    ),
  rangeUnit: z
    .string()
    .optional()
    .describe(
      "The unit of measure for the tracker item. This will be used to display the unit of measure in the UI and to run conversions. e.g. '%'.",
    ),
  rangeMinLabel: z
    .string()
    .optional()
    .describe(
      "The label for the minimum value for the tracker item. This will be used to display the label in the UI.",
    ),
  rangeMaxLabel: z
    .string()
    .optional()
    .describe(
      "The label for the maximum value for the tracker item. This will be used to display the label in the UI.",
    ),
  rangeStepLabels: z
    .array(z.record(z.string()))
    .optional()
    .describe(
      "An array of objects with string keys and values. The keys are the values for where to place the item on the range input slider and the values are the labels for the steps for the tracker item. This will be used to display the labels in the UI. e.g. [{'1': '100%'}, {'2': '90%'}, {'3': '80%'}, {'4': '70%'}, {'5': '60%'}, {'6': '50%'}, {'7': '40%'}, {'8': '30%'}, {'9': '20%'}, {'10': '10%'}]",
    ), // Record<number, string>[] translates to array of objects with string keys
});

const trackerRatingSchema = z.object({
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
      "The maximum number of stars for the tracker item. This will be used to limit the input range. accepted values are: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10",
    ),
  ratingUnit: z
    .string()
    .optional()
    .describe(
      "The unit of measure for the tracker item. This will be used to display the unit of measure in the UI and to run conversions. e.g. '%'.",
    ),
  ratingIcon: z
    .string()
    .optional()
    .describe(
      "The icon for the tracker item. this is not yet implemented and should be ignored.",
    ),
  ratingEmoji: z
    .string()
    .optional()
    .describe(
      "The emoji for the tracker item. This will be used to display the emoji in the UI as the input and display value. e.g. '🌟' with a value of 4 will be displayed as '🌟🌟🌟🌟'.",
    ),
});

const trackerShortTextSchema = z.object({
  type: z.literal("shortText"),
});

const trackerLongTextSchema = z.object({
  type: z.literal("longText"),
});

export type TrackerCustomConfigDataFields =
  | {
      type: "measure";
      // used to display input and logs
      measureUnitType: TrackerCustomConfigMeasureUnitsKey;
      measureUnitSource: string;
      measureUnitDisplay: string;
      measureTarget: number | null;
      // Additional flexibility
      measureMin?: number;
      measureMax?: number;
      // For aggregation and reporting
      cumulative: boolean;
      cumulation?: TrackerCustomConfigMeasureCumulationKey;
      aggregationType?: TrackerCustomConfigMeasureAggregationKey;
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

export type TrackerCustomConfig = TrackerCustomConfigDataFields & {
  limitOnePerDay: boolean;
};

// export const trackerCustomConfigSchema = z.intersection(
//   z.object({
//     limitOnePerDay: z.boolean(),
//   }),
//   z.discriminatedUnion("type", [
//     trackerMeasureSchema,
//     trackerCheckboxSchema,
//     trackerRangeSchema,
//     trackerRatingSchema,
//     trackerShortTextSchema,
//     trackerLongTextSchema,
//   ]),
// );
export const trackerCustomConfigSchema = z.discriminatedUnion("type", [
  trackerMeasureSchema,
  trackerCheckboxSchema,
  trackerRangeSchema,
  trackerRatingSchema,
  trackerShortTextSchema,
  trackerLongTextSchema,
]);
