import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { CONSTS } from "@potential/consts";
import { and, desc, eq, trackableLogs } from "@potential/db";
import { cloudTypeIdGenerator, cloudTypeIdValidator } from "@potential/utils";

import { protectedProcedure } from "../trpc";
import { awardXpPoints } from "../utils/xpPoints";

export const logRouter = {
  createLog: protectedProcedure
    .input(
      z.object({
        text: z.string(),
        imageIds: z.array(z.string()),
        trackableParentType: CONSTS.TRACKABLE.TYPES_SCHEMA,
        trackableSubType: CONSTS.TRACKABLE.SUB_TYPES_SCHEMA,
        trackableId: cloudTypeIdValidator("trackable").optional(),
        trackableValue: z
          .union([z.number(), z.boolean(), z.string(), z.null()])
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, auth } = ctx;
      const user = auth.user;
      // Check if a trackable was selected
      if (
        input.trackableId &&
        (input.trackableValue || input.trackableValue === 0)
      ) {
        try {
          // Construct the log data that would be saved to the database

          const newLogId = cloudTypeIdGenerator("trackableLog");
          await db.insert(trackableLogs).values({
            id: newLogId,
            trackableId: input.trackableId,
            ownerId: user.id,
            source: "app",

            // Set appropriate value field based on type
            ...(typeof input.trackableValue === "number"
              ? { numericValue: input.trackableValue }
              : typeof input.trackableValue === "boolean"
                ? { checked: input.trackableValue }
                : typeof input.trackableValue === "string"
                  ? { textValue: input.trackableValue }
                  : {}),
            // Add note text if provided and not already set as textValue
            ...(input.text.trim() !== "" &&
            typeof input.trackableValue !== "string"
              ? { textValue: input.text }
              : {}),
            // Add images if provided
            ...(input.imageIds.length > 0
              ? {
                  jsonValue: {
                    imageIds: input.imageIds,
                    voiceClipIds: [],
                  },
                }
              : {}),
          });

          await awardXpPoints({
            userId: user.id,
            action: "newLog",
            actionId: newLogId,
          });

          return {
            success: true,
          };
        } catch (error) {
          console.error("Error processing trackable log:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to process trackable log",
          });
        }
      } else {
        // Original validation for regular logs
        if (input.text.trim() === "" && input.imageIds.length === 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Either text or at least one image must be provided",
          });
        }

        console.log("Regular log (no trackable selected):", input);

        await Promise.resolve();

        return {
          success: true,
        };
      }
    }),

  getLogsByTrackableId: protectedProcedure
    .input(
      z.object({
        trackableId: cloudTypeIdValidator("trackable"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db, auth } = ctx;
      const user = auth.user;

      try {
        const logs = await db.query.trackableLogs.findMany({
          where: and(
            eq(trackableLogs.ownerId, user.id),
            eq(trackableLogs.trackableId, input.trackableId),
          ),
          orderBy: [desc(trackableLogs.createdAt)],
          limit: 100,
        });

        return logs;
      } catch (error) {
        console.error("Error fetching trackable logs:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch trackable logs",
        });
      }
    }),
} satisfies TRPCRouterRecord;
