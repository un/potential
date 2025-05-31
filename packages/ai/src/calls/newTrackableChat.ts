import type { CoreMessage } from "ai";
import { openai } from "@ai-sdk/openai";
import { generateObject, streamText } from "ai";

// FIXME: Adjust the import path for createConsumptionTrackables
import type { CloudTypeId } from "@potential/utils";

import { createConsumptionTrackables } from "../functions";
import { PROMPTS } from "../prompts";
import { getUserTrackablesWithLastLogTimestamp } from "../tools/getUserTrackables";

interface CreateNewTrackableChatStreamParams {
  messages: CoreMessage[];
  userId: CloudTypeId<"user">;
  chatId: string;
}

export const createNewTrackableChatStream = ({
  messages,
  userId,
  chatId,
}: CreateNewTrackableChatStreamParams) =>
  streamText({
    model: openai("gpt-4o-mini"),
    maxSteps: 10,
    toolCallStreaming: true,
    messages,
    system: PROMPTS.CHAT.SYSTEM,
    tools: {
      getUserExistingTrackables: getUserTrackablesWithLastLogTimestamp({
        userId: userId,
      }),
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
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          // The type of newTrackable is inferred from generateObject and may not always be an array.
          // Add more specific type handling here depending on the expected output of generateObject.
          (newTrackable as any[]).forEach((trackable: any) => {
            console.log("TRACKABLE", {
              trackable,
            });
          });
          return { trackable: newTrackable };
        },
      },
      generateConsumptionTrackables: {
        description: PROMPTS.TOOLS.GENERATE_CONSUMPTION_TRACKABLES.DESCRIPTION,
        parameters: PROMPTS.TOOLS.GENERATE_CONSUMPTION_TRACKABLES.PARAMETERS,
        execute: async () => {
          console.log("🍕 GENERATE CONSUMPTION TRACKABLES");
          await createConsumptionTrackables({ userId });
          return { completed: true };
        },
      },
    },
  });
