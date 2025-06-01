import type { Context } from "hono";
import { createDataStreamResponse } from "ai";
import { Hono } from "hono";

import type { CloudTypeId } from "@potential/utils";
import { createNewTrackerChatStream } from "@potential/ai";

import type { AppContext } from "../index";

const ai = new Hono<AppContext>();

async function saveToDatabase({
  content,
  chatId,
}: {
  content: string;
  chatId: CloudTypeId<"chat"> | undefined;
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

      const result = createNewTrackerChatStream({
        messages,
        userId: user!.id,
        chatId,
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
