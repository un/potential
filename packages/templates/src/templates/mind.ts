// packages/templates/src/templates/body.ts
import { defineTemplate } from "../utils";

export const mindTemplates = {
  "mind.journal": defineTemplate({
    id: "journal",
    version: 1,
    name: "Daily Journal",
    // description: "Track your body weight",
    aiDescriptionHelper:
      "A tracking item to help a user track their daily journal entries",
    recommended: true,
    featured: true,
    uses: 0,
    defaultConfig: {
      type: "longText",
      limitOnePerDay: false,
      _meta: {
        templateId: "mind.journal",
        templateVersion: 1,
        isCustomized: false,
      },
    },
  }),
  "mind.stress": defineTemplate({
    id: "stress",
    version: 2,
    name: "Stress Level",
    // description: "Track your body fat percentage",
    aiDescriptionHelper:
      "A tracking item to help a user track their stress level over time",
    recommended: true,
    featured: true,
    uses: 0,
    defaultConfig: {
      type: "rating",
      ratingMax: 10,
      ratingUnit: "out of 10",
      ratingEmoji: "😥",
      limitOnePerDay: false,
      _meta: {
        templateId: "mind.stress",
        templateVersion: 1,
        isCustomized: false,
      },
    },
  }),
  "mind.anxiety": defineTemplate({
    id: "anxiety",
    version: 2,
    name: "Anxiety Level",
    // description: "Track your body fat percentage",
    aiDescriptionHelper:
      "A tracking item to help a user track their anxiety level over time",
    recommended: true,
    featured: true,
    uses: 0,
    defaultConfig: {
      type: "rating",
      ratingMax: 10,
      ratingUnit: "out of 10",
      ratingEmoji: "😨",
      limitOnePerDay: false,
      _meta: {
        templateId: "mind.anxiety",
        templateVersion: 1,
        isCustomized: false,
      },
    },
  }),
  "mind.focus": defineTemplate({
    id: "focus",
    version: 2,
    name: "Focus",
    aiDescriptionHelper:
      "A tracking item to help a user track their focus level over time",
    recommended: true,
    featured: true,
    uses: 0,
    defaultConfig: {
      type: "rating",
      ratingMax: 10,
      ratingUnit: "out of 10",
      ratingEmoji: "🤓",
      limitOnePerDay: false,
      _meta: {
        templateId: "mind.focus",
        templateVersion: 1,
        isCustomized: false,
      },
    },
  }),
  "mind.productivity": defineTemplate({
    id: "productivity",
    version: 1,
    name: "Productivity",
    aiDescriptionHelper:
      "A tracking item to help a user track their productivity level over time",
    recommended: true,
    featured: true,
    uses: 0,
    defaultConfig: {
      type: "rating",
      ratingMax: 10,
      ratingUnit: "out of 10",
      ratingEmoji: "💪",
      limitOnePerDay: false,
      _meta: {
        templateId: "mind.productivity",
        templateVersion: 1,
        isCustomized: false,
      },
    },
  }),
  "mind.creativity": defineTemplate({
    id: "creativity",
    version: 1,
    name: "Creativity",
    aiDescriptionHelper:
      "A tracking item to help a user track their creativity level over time",
    recommended: true,
    featured: true,
    uses: 0,
    defaultConfig: {
      type: "rating",
      ratingMax: 10,
      ratingUnit: "out of 10",
      ratingEmoji: "🧑‍🎨",
      limitOnePerDay: false,
      _meta: {
        templateId: "mind.creativity",
        templateVersion: 1,
        isCustomized: false,
      },
    },
  }),
};
