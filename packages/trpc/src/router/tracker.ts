import type { TRPCRouterRecord } from "@trpc/server";
import { openai } from "@ai-sdk/openai";
import { TRPCError } from "@trpc/server";
import { generateObject } from "ai";
import { newTrackersSchema } from "src/utils/ai/generateNewTracker";
import { z } from "zod";

import type { TrackerCustomConfig } from "@potential/consts";
import { CONSTS } from "@potential/consts";
import { and, eq, trackers } from "@potential/db";
import { cloudTypeIdGenerator, cloudTypeIdValidator } from "@potential/utils";

import { protectedProcedure } from "../trpc";
import { awardXpPoints } from "../utils/xpPoints";

export const trackerRouter = {
  createTracker: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(32),
        description: z.string().max(255).optional(),
        type: CONSTS.TRACKER.TYPES_SCHEMA,
        subType: CONSTS.TRACKER.SUB_TYPES_SCHEMA,
        configType: CONSTS.TRACKER.CONFIG.TYPES_SCHEMA,
        config: z.custom<TrackerCustomConfig>((val) => {
          // At minimum, ensure it has a type
          return typeof val === "object" && val !== null && "type" in val;
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, auth } = ctx;
      const user = auth.user;
      console.log("input", input);

      try {
        const newTrackerId = cloudTypeIdGenerator("tracker");

        await db.insert(trackers).values({
          id: newTrackerId,
          ownerId: user.id,
          name: input.name,
          description: input.description ?? null,
          type: input.type,
          subType: input.subType,
          configType: input.configType,
          customConfig: input.config,
        });

        await awardXpPoints({
          userId: user.id,
          action: "newTracker",
          actionId: newTrackerId,
        });

        return {
          success: true,
          id: newTrackerId,
        };
      } catch (error: unknown) {
        console.error("Error creating tracker:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create tracker",
        });
      }
    }),
  getTrackersForParentType: protectedProcedure
    .input(
      z.object({
        trackerParentType: CONSTS.TRACKER.TYPES_SCHEMA,
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db, auth } = ctx;
      const user = auth.user;

      const logTypeTrackers = await db.query.trackers.findMany({
        where: and(
          eq(trackers.ownerId, user.id),
          eq(trackers.type, input.trackerParentType),
        ),
      });

      return logTypeTrackers;
    }),
  getTrackerById: protectedProcedure
    .input(
      z.object({
        id: cloudTypeIdValidator("tracker"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db, auth } = ctx;
      const user = auth.user;

      const tracker = await db.query.trackers.findFirst({
        where: and(eq(trackers.id, input.id), eq(trackers.ownerId, user.id)),
      });

      if (!tracker) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tracker not found",
        });
      }

      return tracker;
    }),
  promptAiForNewTrackers: protectedProcedure
    .input(z.object({}))
    .mutation(async ({ ctx, input }) => {
      const { db, auth } = ctx;
      const user = auth.user;
      console.log("input", input);

      try {
        const { object } = await generateObject({
          // issue with thinking models and optional fields in structured output: https://github.com/vercel/ai/issues/4662
          model: openai("gpt-4o-mini"),
          // schemaName: "NewTracker",
          // schemaDescription:
          //   "A tracker health item thats used to track a specific health metric for a user.",
          output: "array",
          schema: newTrackersSchema,
          system:
            "You design systems for users to track health items with the aim of improving them. Users will tell you what they want to improve, and you will create a system with multiple tracker data types for them to track. You will also create a name and description for each tracker. The system should be a list of tracker data types that the user should track to achieve their goal. As an example, if the user wants to improve their mood, you should create a tracker data type for mood, and a tracker data type for anxiety, and a tracker data type for depression, and a tracker data type for journaling. It is important to set the trackerConfig for each tracker. Type Rating is a type that allows the user to rate something on a scale of 1 to 5 wither using the defualt of STARs respresentation, or a standard emoji. Type Measure is a type that allows the user to measure something and provides a UI to increment or decrement a number. Type Range is a type that allows the user to set a range for something and set it using a slider in the UI. Type Checkbox is a type that allows the user to check a box. Type ShortText is a type that allows the user to enter a short text. Type LongText is a type that allows the user to enter a long text.",
          prompt:
            "I wake up super tired and crash by early afternoon. If i have a coffee i can survive a bit longer, but by evening i am exhausted. I want to find out whats causing this and how to fix it.",
        });
        // const { object } = await generateObject({
        //   model: openai("gpt-4-turbo"),
        //   schema: z.object({
        //     recipe: z.object({
        //       name: z.string(),
        //       ingredients: z.array(
        //         z.object({
        //           name: z.string(),
        //           amount: z.string(),
        //         }),
        //       ),
        //       steps: z.array(z.string()),
        //     }),
        //   }),
        //   prompt: "Generate a lasagna recipe.",
        // });

        object.forEach((tracker) => {
          console.log("TRACKER", {
            tracker,
            config: tracker.trackerConfig,
          });
        });
        return;
      } catch (error: unknown) {
        console.error("Error creating tracker:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create tracker",
        });
      }
    }),
} satisfies TRPCRouterRecord;
