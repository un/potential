import type { Context } from "hono";
import { openai } from "@ai-sdk/openai";
import { createDataStreamResponse, generateObject, streamText } from "ai";
import { Hono } from "hono";

import { PROMPTS } from "@potential/consts";
import { desc, eq, trackableLogs, trackables } from "@potential/db";

import type { AppContext } from "../index";
import { createConsumptionTrackables } from "./functions";

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
        system: PROMPTS.CHAT.SYSTEM,
        tools: {
          getUserExistingTrackables: {
            description: PROMPTS.TOOLS.GET_USER_EXISTING_TRACKABLES.DESCRIPTION,
            parameters: PROMPTS.TOOLS.GET_USER_EXISTING_TRACKABLES.PARAMETERS,
            execute: async () => {
              const userTrackables = await db.query.trackables.findMany({
                where: eq(trackables.ownerId, user!.id),

                columns: {
                  id: true,
                  name: true,
                  description: true,
                  type: true,
                  subType: true,
                  subTypeCustomName: true,
                },
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
              const consumptionTrackables = userTrackables.filter(
                (trackable) => trackable.type === "consumption",
              );
              const nonConsumptionTrackables = userTrackables.filter(
                (trackable) => trackable.type !== "consumption",
              );
              return {
                trackables: nonConsumptionTrackables,
                hasConsumptionTrackables: consumptionTrackables.length > 0,
              };
            },
          },
          generateNewNonConsumptionTrackable: {
            description:
              PROMPTS.TOOLS.GENERATE_NEW_NON_CONSUMPTION_TRACKABLE.DESCRIPTION,
            parameters:
              PROMPTS.TOOLS.GENERATE_NEW_NON_CONSUMPTION_TRACKABLE.PARAMETERS,
            execute: async ({ description }: { description: string }) => {
              const { object: newTrackable } = await generateObject({
                // issue with thinking models and optional fields in structured output: https://github.com/vercel/ai/issues/4662
                model: openai("gpt-4o-mini"),
                output: "array",
                schema:
                  PROMPTS.TOOLS.GENERATE_NEW_NON_CONSUMPTION_TRACKABLE.EXECUTE
                    .PROMPT.SCHEMA,
                system:
                  PROMPTS.TOOLS.GENERATE_NEW_NON_CONSUMPTION_TRACKABLE.EXECUTE
                    .PROMPT.SYSTEM,
                prompt: description,
              });
              newTrackable.forEach((trackable) => {
                console.log("TRACKABLE", {
                  trackable,
                });
              });
              return { trackable: newTrackable };
            },
          },
          generateConsumptionTrackables: {
            description:
              PROMPTS.TOOLS.GENERATE_CONSUMPTION_TRACKABLES.DESCRIPTION,
            parameters:
              PROMPTS.TOOLS.GENERATE_CONSUMPTION_TRACKABLES.PARAMETERS,
            execute: async () => {
              console.log("🍕 GENERATE CONSUMPTION TRACKABLES");
              await createConsumptionTrackables({ userId: user!.id });
              return { completed: true };
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
