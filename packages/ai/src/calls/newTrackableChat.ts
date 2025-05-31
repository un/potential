import type { CoreMessage } from "ai";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

import type { CloudTypeId } from "@potential/utils";

import { PROMPTS } from "../prompts";
import {
  generateConsumptionTrackables,
  generateNewNonConsumptionTrackable,
  getUserTrackablesWithLastLogTimestamp,
} from "../tools";

interface CreateNewTrackableChatStreamParams {
  messages: CoreMessage[];
  userId: CloudTypeId<"user">;
}

export const createNewTrackableChatStream = ({
  messages,
  userId,
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
      generateNewNonConsumptionTrackable: generateNewNonConsumptionTrackable(),
      generateConsumptionTrackables: generateConsumptionTrackables({
        userId: userId,
      }),
    },
  });
