import { openai } from "@ai-sdk/openai";
import { generateObject, tool } from "ai";
import { z } from "zod";

import { PROMPTS } from "../prompts";

export const generateNewNonConsumptionTrackable = () =>
  tool({
    description:
      "Generate a new trackable data schema for the user. DO NOT CALL THIS TOOL IF YOU WANT TO GENERATE TRACKABLES RELATED TO CONSUMPTION. INSTEAD CALL generateConsumptionTrackables TOOL.",
    parameters: z.object({
      description: z
        .string()
        .describe(
          "A description of the trackable to generate with a single goal in mind.",
        ),
    }),
    execute: async ({ description }: { description: string }) => {
      const { object: newTrackable } = await generateObject({
        // issue with thinking models and optional fields in structured output: https://github.com/vercel/ai/issues/4662
        model: openai("gpt-4o-mini"),
        output: "array",
        schema:
          PROMPTS.TOOLS.GENERATE_NEW_NON_CONSUMPTION_TRACKABLE.EXECUTE.PROMPT
            .SCHEMA,
        system:
          PROMPTS.TOOLS.GENERATE_NEW_NON_CONSUMPTION_TRACKABLE.EXECUTE.PROMPT
            .SYSTEM,
        prompt: description,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (newTrackable as any[]).forEach((trackable: any) => {
        console.log("TRACKABLE", {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          trackable,
        });
      });
      return { trackable: newTrackable };
    },
  });
