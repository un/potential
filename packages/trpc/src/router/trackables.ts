import type { TRPCRouterRecord } from "@trpc/server";
import { openai } from "@ai-sdk/openai";
import { TRPCError } from "@trpc/server";
import { generateObject } from "ai";
import { newTrackablesSchema } from "src/utils/ai/generateNewTrackables";
import { z } from "zod";

import type { TrackableCustomConfig } from "@potential/consts";
import { CONSTS } from "@potential/consts";
import { and, eq, trackables } from "@potential/db";
import { cloudTypeIdGenerator, cloudTypeIdValidator } from "@potential/utils";

import { protectedProcedure } from "../trpc";
import { awardXpPoints } from "../utils/xpPoints";

export const trackablesRouter = {
  createTrackable: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(32),
        description: z.string().max(255).optional(),
        type: CONSTS.TRACKABLE.TYPES_SCHEMA,
        subType: CONSTS.TRACKABLE.SUB_TYPES_SCHEMA,
        configType: CONSTS.TRACKABLE.CONFIG.TYPES_SCHEMA,
        config: z.custom<TrackableCustomConfig>((val) => {
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
        const newTrackableId = cloudTypeIdGenerator("trackable");

        await db.insert(trackables).values({
          id: newTrackableId,
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
          action: "newTrackable",
          actionId: newTrackableId,
        });

        return {
          success: true,
          id: newTrackableId,
        };
      } catch (error: unknown) {
        console.error("Error creating trackable:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create trackable",
        });
      }
    }),
  getTrackablesForParentType: protectedProcedure
    .input(
      z.object({
        trackableParentType: CONSTS.TRACKABLE.TYPES_SCHEMA,
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db, auth } = ctx;
      const user = auth.user;

      const logTypeTrackables = await db.query.trackables.findMany({
        where: and(
          eq(trackables.ownerId, user.id),
          eq(trackables.type, input.trackableParentType),
        ),
      });

      return logTypeTrackables;
    }),
  getTrackableById: protectedProcedure
    .input(
      z.object({
        id: cloudTypeIdValidator("trackable"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db, auth } = ctx;
      const user = auth.user;

      const trackable = await db.query.trackables.findFirst({
        where: and(
          eq(trackables.id, input.id),
          eq(trackables.ownerId, user.id),
        ),
      });

      if (!trackable) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Trackable not found",
        });
      }

      return trackable;
    }),
  promptAiForNewTrackables: protectedProcedure
    .input(z.object({}))
    .mutation(async ({ ctx, input }) => {
      const { db, auth } = ctx;
      const user = auth.user;
      console.log("input", input);

      try {
        const { object } = await generateObject({
          model: openai("gpt-4o-mini"),
          // schemaName: "NewTrackable",
          // schemaDescription:
          //   "A trackable health item thats used to track a specific health metric for a user.",
          output: "array",
          schema: newTrackablesSchema,
          system:
            "You design systems for users to track health items with the aim of improving them. Users will tell you what they want to improve, and you will create a system with multiple trackable data types for them to track. You will also create a name and description for each trackable. The system should be a list of trackable data types that the user should track to achieve their goal. As an example, if the user wants to improve their mood, you should create a trackable data type for mood, and a trackable data type for anxiety, and a trackable data type for depression, and a trackable data type for journaling. It is important to set the trackableConfig for each trackable. Type Rating is a type that allows the user to rate something on a scale of 1 to 5 wither using the defualt of STARs respresentation, or a standard emoji. Type Measure is a type that allows the user to measure something and provides a UI to increment or decrement a number. Type Range is a type that allows the user to set a range for something and set it using a slider in the UI. Type Checkbox is a type that allows the user to check a box. Type ShortText is a type that allows the user to enter a short text. Type LongText is a type that allows the user to enter a long text.",
          prompt:
            "I want to improve my overall mood. I have high anxiety and depression. I want to improve these.",
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

        object.forEach((trackable) => {
          console.log("TRACKABLE", {
            trackable,
            config: trackable.trackableConfig,
          });
        });
        return;
      } catch (error: unknown) {
        console.error("Error creating trackable:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create trackable",
        });
      }
    }),
} satisfies TRPCRouterRecord;
