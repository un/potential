import type { Context } from "hono";
import { openai } from "@ai-sdk/openai";
import { createDataStreamResponse, generateObject, streamText } from "ai";
import { Hono } from "hono";
import { z } from "zod";

import { CONSTS } from "@potential/consts";
import { desc, eq, trackableLogs, trackables } from "@potential/db";

import type { AppContext } from "../index";

const newTrackablesSchema = z.object({
  trackableName: z.string(),
  trackableDescription: z.string(),
  trackableConfig: CONSTS.TRACKABLE.CONFIG.CONFIG_SCHEMA,
  name: z.string().max(32),
  description: z.string().max(255),
  color: z.union([CONSTS.COLORS.SCHEMA, z.string()]),
  type: CONSTS.TRACKABLE.TYPES_SCHEMA,
  subType: CONSTS.TRACKABLE.SUB_TYPES_SCHEMA,
  subTypeCustomName: z.string().max(64),
  configType: CONSTS.TRACKABLE.CONFIG.TYPES_SCHEMA,
});

const ai = new Hono<AppContext>();

async function saveToDatabase({
  content,
  chatId,
}: {
  content: string;
  chatId: string | undefined;
}) {
  console.log("Saving to database:", content);

  await new Promise((resolve) => setTimeout(resolve, 100));
  console.log("Saved to database.");
}

ai.post("/chat", async (c: Context<AppContext>) => {
  const { messages, chatId } = await c.req.json();
  const { user } = c.get("auth");
  const db = c.get("db");

  return createDataStreamResponse({
    execute: (dataStream) => {
      let accumulatedResponse = "";

      const result = streamText({
        model: openai("gpt-4o-mini"),
        maxSteps: 10,
        toolCallStreaming: true,
        messages,
        system:
          "You are a dedicated Ai model to help users make positive health changes." +
          "You work on addressing chronic health issues as well as helping users set and achieve health goals." +
          "A user will tell you what they want to improve and you should ask the user for more information that will help you work out their goals and current habits better." +
          "Before calling any tools, you should tell the user that you will call a tool." +
          "If you asked for clarifying information, you should acknowledge that you have received the information and that you will use it before calling any tools." +
          "You can check what they are already tracking including the last time they entered data for it by calling the getUserExistingTrackables tool" +
          "It is advisable to call the getUserExistingTrackables tool before the first response to know what the user is already tracking and not ask the user for information that is already known." +
          "You can also call a tool to generate a new trackable item by providing a description of the trackable item." +
          "You should only call the generateNewTrackable tool once you have enough information to generate a trackable item." +
          "You should also explain to the user what you are doing and why you are doing it." +
          "You should also call the getUserExistingTrackables tool to check what the user is already tracking before you call any other tools or ask the user for more information." +
          "Sometimes things will be obvious to you, you should be able to make a good guess at what the user wants to improve and generate a trackable item for them." +
          "You should also be able to ask the user for more information if you need it." +
          "Try to limit your clarifying questions to 2 or 3 at most." +
          "Once you have generated some new trackable items, the user will be shown a list of them and they will be able to select which ones they want to track." +
          "You should provide an explanation to the user about the trackable items you have generated and ask them if they want to add any more or change anything.",
        tools: {
          getUserExistingTrackables: {
            description:
              "Get a list of existing data items the user is already tracking and the last time they entered data for it.",

            parameters: z.object({}),
            execute: async () => {
              const userTrackables = await db.query.trackables.findMany({
                where: eq(trackables.ownerId, user!.id),
                with: {
                  logs: {
                    limit: 1,
                    orderBy: desc(trackableLogs.createdAt),
                    columns: {
                      createdAt: true,
                    },
                  },
                },
              });
              return { trackables: userTrackables };
            },
          },
          generateNewTrackable: {
            description: "Generate a new trackable for the user.",
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
                schema: newTrackablesSchema,
                system:
                  "You design systems for users to track health items with the aim of improving them. Another Ai model will converse with a user and call you with a description of a single trackable item the user should track. You will also create a name and description for each trackable. As an example, if the user wants to improve their mood, you should create a trackable data type for mood, and a trackable data type for anxiety, and a trackable data type for depression, and a trackable data type for journaling. It is important to set the trackableConfig for each trackable. Type Rating is a type that allows the user to rate something on a scale of 1 to n (where n is a number between 2 and 10) either using the default of STARs icons for visual representation in the UI, or a configurable emoji. Type Measure is a type that allows the user to measure something and provides a UI to increment or decrement a number. Type Range is a type that allows the user to enter a range for something and set it using a slider in the UI - this has max, min and step properties. This is preferable over the rating type if there could be a lot of variability in the data being entered. Type Checkbox is a type that allows the user to check a box. Type ShortText is a type that allows the user to enter a short text. Type LongText is a type that allows the user to enter a long text.",
                prompt: description,
              });
              newTrackable.forEach((trackable) => {
                console.log("TRACKABLE", {
                  trackable,
                  config: trackable.trackableConfig,
                });
              });
              return { trackable: newTrackable };
            },
          },
        },
        onChunk(delta) {
          if (delta.chunk.type === "text-delta") {
            accumulatedResponse += delta.chunk.textDelta;
          }
        },
        async onFinish() {
          await saveToDatabase({ content: accumulatedResponse, chatId });
        },
      });

      result.mergeIntoDataStream(dataStream);
    },
    onError: (error) => {
      console.error("Error during AI stream:", error);
      // Error messages are masked by default for security reasons.
      // If you want to expose the error message to the client, you can do so here:
      return error instanceof Error ? error.message : String(error);
    },
  });
});

export default ai;
