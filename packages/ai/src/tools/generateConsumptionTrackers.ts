import { tool } from "ai";
import { z } from "zod";

import type { CloudTypeId } from "@potential/utils";

import { createConsumptionTrackers } from "../functions";

export const generateConsumptionTrackers = ({
  userId,
}: {
  userId: CloudTypeId<"user">;
}) =>
  tool({
    description:
      "Generate a list of tracker items related to food and drink consumption. This is a special tool that should only be called if the user does not already have trackers of type 'consumption'.",
    parameters: z.object({}),
    execute: async () => {
      console.log("🍕 GENERATE CONSUMPTION TRACKERS");
      await createConsumptionTrackers({ userId });
      return { completed: true };
    },
  });
