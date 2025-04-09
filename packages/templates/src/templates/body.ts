// packages/templates/src/templates/body.ts
import { defineTemplate } from "../utils";

export const bodyTemplates = {
  "body.weight": defineTemplate({
    id: "weight",
    version: 1,
    name: "Body Weight",
    // description: "Track your body weight",
    aiDescriptionHelper:
      "A tracking item to help a user track their body weight over time",
    recommended: true,
    featured: true,
    uses: 0,
    defaultConfig: {
      type: "measure",
      measureUnitType: "mass",
      measureUnitSource: "kg",
      measureUnitDisplay: "kg",
      measureTarget: null,
      measureMin: 20,
      measureMax: 300,
      cumulative: false,
      aggregationType: "latest",
      limitOnePerDay: true,
      _meta: {
        templateId: "body.weight",
        templateVersion: 1,
        isCustomized: false,
      },
    },
  }),
  "body.bodyFat": defineTemplate({
    id: "body-fat-percentage",
    version: 2,
    name: "Body Fat Percentage",
    // description: "Track your body fat percentage",
    aiDescriptionHelper:
      "A tracking item to help a user track their body fat percentage over time",
    recommended: true,
    featured: true,
    uses: 0,
    defaultConfig: {
      type: "measure",
      measureUnitType: "percentage",
      measureUnitSource: "%",
      measureUnitDisplay: "%",
      measureTarget: null,
      measureMin: 2,
      measureMax: 50,
      cumulative: false,
      aggregationType: "latest",
      limitOnePerDay: true,
      _meta: {
        templateId: "body.bodyFat",
        templateVersion: 1,
        isCustomized: false,
      },
    },
  }),
  "body.bodyMuscle": defineTemplate({
    id: "body-muscle-percentage",
    version: 2,
    name: "Body Muscle Percentage",
    // description: "Track your body fat percentage",
    aiDescriptionHelper:
      "A tracking item to help a user track their body muscle percentage over time",
    recommended: true,
    featured: true,
    uses: 0,
    defaultConfig: {
      type: "measure",
      measureUnitType: "percentage",
      measureUnitSource: "%",
      measureUnitDisplay: "%",
      measureTarget: null,
      measureMin: 2,
      measureMax: 50,
      cumulative: false,
      aggregationType: "latest",
      limitOnePerDay: true,
      _meta: {
        templateId: "body.bodyFat",
        templateVersion: 1,
        isCustomized: false,
      },
    },
  }),
};
