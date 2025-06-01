import { openai } from "@ai-sdk/openai";
import { generateObject, tool } from "ai";
import { z } from "zod";

import { PROMPTS } from "../prompts";

export const generateNewNonConsumptionTracker = () =>
  tool({
    description:
      "Generate a new tracker data schema for the user. DO NOT CALL THIS TOOL IF YOU WANT TO GENERATE TRACKERS RELATED TO CONSUMPTION. INSTEAD CALL generateConsumptionTrackers TOOL.",
    parameters: z.object({
      description: z
        .string()
        .describe(
          "A description of the tracker to generate with a single goal in mind.",
        ),
    }),
    execute: async ({ description }: { description: string }) => {
      const { object: newTracker } = await generateObject({
        // issue with thinking models and optional fields in structured output: https://github.com/vercel/ai/issues/4662
        model: openai("gpt-4o-mini"),
        output: "array",
        schema:
          PROMPTS.TOOLS.GENERATE_NEW_NON_CONSUMPTION_TRACKER.EXECUTE.PROMPT
            .SCHEMA,
        system:
          PROMPTS.TOOLS.GENERATE_NEW_NON_CONSUMPTION_TRACKER.EXECUTE.PROMPT
            .SYSTEM,
        prompt: description,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (newTracker as any[]).forEach((tracker: any) => {
        console.log("TRACKER", {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          tracker,
        });
      });
      return { tracker: newTracker };
    },
  });
