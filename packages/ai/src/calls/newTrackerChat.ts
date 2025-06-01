import type { CoreMessage } from "ai";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

import type { CloudTypeId } from "@potential/utils";

import { PROMPTS } from "../prompts";
import {
  generateConsumptionTrackers,
  generateNewNonConsumptionTracker,
  getUserTrackersWithLastLogTimestamp,
} from "../tools";

interface CreateNewTrackerChatStreamParams {
  messages: CoreMessage[];
  userId: CloudTypeId<"user">;
}

export const createNewTrackerChatStream = ({
  messages,
  userId,
}: CreateNewTrackerChatStreamParams) =>
  streamText({
    model: openai("gpt-4o-mini"),
    maxSteps: 10,
    toolCallStreaming: true,
    messages,
    system: PROMPTS.CHAT.SYSTEM,
    tools: {
      getUserExistingTrackers: getUserTrackersWithLastLogTimestamp({
        userId: userId,
      }),
      generateNewNonConsumptionTracker: generateNewNonConsumptionTracker(),
      generateConsumptionTrackers: generateConsumptionTrackers({
        userId: userId,
      }),
    },
  });
