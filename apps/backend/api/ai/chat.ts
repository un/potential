import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { Hono } from "hono";

const ai = new Hono();

ai.post("/chat", async (c) => {
  const { messages } = await c.req.json();

  const result = await streamText({
    model: openai("gpt-4o"), // You can change the model here
    messages,
  });

  // Return the data stream response
  return result.toDataStreamResponse();
});

export default ai;
