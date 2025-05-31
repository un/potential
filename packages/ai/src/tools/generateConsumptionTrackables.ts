import { tool } from "ai";
import { z } from "zod";

import type { CloudTypeId } from "@potential/utils";

import { createConsumptionTrackables } from "../functions";

export const generateConsumptionTrackables = ({
  userId,
}: {
  userId: CloudTypeId<"user">;
}) =>
  tool({
    description:
      "Generate a list of trackable items related to food and drink consumption. This is a special tool that should only be called if the user does not already have trackables of type 'consumption'.",
    parameters: z.object({}),
    execute: async () => {
      console.log("🍕 GENERATE CONSUMPTION TRACKABLES");
      await createConsumptionTrackables({ userId });
      return { completed: true };
    },
  });
