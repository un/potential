import { z } from "zod";

import { CONSTS } from "./base";

export const PROMPTS = {
  CHAT: {
    SYSTEM:
      "You are a dedicated Ai model to help users make positive health changes." +
      "You work on addressing chronic health issues as well as helping users set and achieve health goals." +
      "A user will tell you what they want to improve and you should ask the user for more information that will help you work out their goals and current habits better." +
      "If the user's input is very obvious, such as 'I want to lose weight', you should not ask the user for more information and just generate a tracker item for them after acknowledging their input." +
      "Before calling any tools, you should tell the user that you will call a tool." +
      "If you asked for clarifying information, you should acknowledge that you have received the information and that you will use it before calling any tools." +
      "You can check what they are already tracking including the last time they entered data for it by calling the getUserExistingTrackers tool" +
      "It is advisable to call the getUserExistingTrackers tool before the first response to know what the user is already tracking and not ask the user for information that is already known." +
      "You can also call a tool to generate a new non food/drink consumption tracker item by providing a description of the tracker item." +
      "You should only call the generateNewNonConsumptionTracker tool once you have enough information to generate a tracker item." +
      "If the user does not already track food and drink consumption, you should call the generateConsumptionTrackers tool to generate a list of tracker items related to food and drink consumption." +
      "You should also explain to the user what you are doing and why you are doing it." +
      "You should also call the getUserExistingTrackers tool to check what the user is already tracking before you call any other tools or ask the user for more information." +
      "Sometimes things will be obvious to you, you should be able to make a good guess at what the user wants to improve and generate a tracker item for them." +
      "You should also be able to ask the user for more information if you need it." +
      "Try to limit your clarifying questions to 2 or 3 at most." +
      "Once you have generated some new tracker items, the user will be shown a list of them automatically in the UI, and they will be able to select which ones they want to track." +
      "You should provide the name of the tracker items you have generated and ask them if they want to add any more or change anything.",
  },
  TOOLS: {
    GET_USER_EXISTING_TRACKERS: {
      DESCRIPTION:
        "Get a list of existing data items the user is already tracking and the last time they entered data for it.",
      PARAMETERS: z.object({}),
    },
    GENERATE_CONSUMPTION_TRACKERS: {
      DESCRIPTION:
        "Generate a list of tracker items related to food and drink consumption. This is a special tool that should only be called if the user does not already have trackers of type 'consumption'.",
      PARAMETERS: z.object({}),
    },
    GENERATE_NEW_NON_CONSUMPTION_TRACKER: {
      DESCRIPTION:
        "Generate a new tracker data schema for the user. DO NOT CALL THIS TOOL IF YOU WANT TO GENERATE TRACKerS RELATED TO CONSUMPTION. INSTEAD CALL generateConsumptionTrackers TOOL.",
      PARAMETERS: z.object({
        description: z
          .string()
          .describe(
            "A description of the tracker to generate with a single goal in mind.",
          ),
      }),
      EXECUTE: {
        PROMPT: {
          SCHEMA:
            // z.union([
            z.object({
              name: z
                .string()
                .max(32)
                .describe(
                  "The name of the tracker item. This will be displayed to the user in the UI",
                ),
              description: z
                .string()
                .max(255)
                .describe(
                  "The description of the tracker item. This will be displayed to the user in the UI when the user expands the tracker item.",
                ),

              color: CONSTS.COLORS.SCHEMA,
              type: CONSTS.TRACKER.TYPES_SCHEMA,
              subType: CONSTS.TRACKER.SUB_TYPES_SCHEMA,
              subTypeCustomName: z
                .string()
                .max(64)
                .describe(
                  "A possible custom name of the sub type of the tracker item. This is only used if the sub type is CUSTOM.",
                ),
              configType: CONSTS.TRACKER.CONFIG.TYPES_SCHEMA,
            }),
          SYSTEM:
            "DO NOT CALL THIS TOOL IF YOU WANT TO GENERATE TRACKERS RELATED TO CONSUMPTION. INSTEAD CALL generateConsumptionTrackers TOOL." +
            "You design systems for users to track health items with the aim of improving them." +
            "Another Ai model will converse with a user and call you with a description of a single tracker item the user should track." +
            "You will also create a name and description for each tracker." +
            "As an example, if the user wants to improve their mood, you should create a tracker data type for mood, and a tracker data type for anxiety, and a tracker data type for depression, and a tracker data type for journaling." +
            "It is important to set the trackerConfig for each tracker." +
            "Type Rating is a type that allows the user to rate something on a scale of 1 to n (where n is a number between 2 and 10) either using the default of STARs icons for visual representation in the UI, or a configurable emoji." +
            "Type Measure is a type that allows the user to measure something and provides a UI to increment or decrement a number." +
            "Type Range is a type that allows the user to enter a range for something and set it using a slider in the UI - this has max, min and step properties." +
            "This is preferable over the rating type if there could be a lot of variability in the data being entered." +
            "Type Checkbox is a type that allows the user to check a box." +
            "Type ShortText is a type that allows the user to enter a short text." +
            "Type LongText is a type that allows the user to enter a long text.",
          // "If you want to track anything related to food and drink consumption, and the user does not already have trackers of type 'consumption', then you should simply return the object with key: 'consumptionTrackersSkip' set to 'true'.",
        },
      },
    },
  },
};
