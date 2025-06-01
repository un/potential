import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { CONSTS } from "@potential/consts";
import { and, desc, eq, trackerLogs } from "@potential/db";
import { cloudTypeIdGenerator, cloudTypeIdValidator } from "@potential/utils";

import { protectedProcedure } from "../trpc";
import { awardXpPoints } from "../utils/xpPoints";

export const logRouter = {
  createLog: protectedProcedure
    .input(
      z.object({
        text: z.string(),
        imageIds: z.array(z.string()),
        trackerParentType: CONSTS.TRACKER.TYPES_SCHEMA,
        trackerSubType: CONSTS.TRACKER.SUB_TYPES_SCHEMA,
        trackerId: cloudTypeIdValidator("tracker").optional(),
        trackerValue: z
          .union([z.number(), z.boolean(), z.string(), z.null()])
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, auth } = ctx;
      const user = auth.user;
      // Check if a tracker was selected
      if (input.trackerId && (input.trackerValue || input.trackerValue === 0)) {
        try {
          // Construct the log data that would be saved to the database

          const newLogId = cloudTypeIdGenerator("trackerLog");
          await db.insert(trackerLogs).values({
            id: newLogId,
            trackerId: input.trackerId,
            ownerId: user.id,
            source: "app",

            // Set appropriate value field based on type
            ...(typeof input.trackerValue === "number"
              ? { numericValue: input.trackerValue }
              : typeof input.trackerValue === "boolean"
                ? { checked: input.trackerValue }
                : typeof input.trackerValue === "string"
                  ? { textValue: input.trackerValue }
                  : {}),
            // Add note text if provided and not already set as textValue
            ...(input.text.trim() !== "" &&
            typeof input.trackerValue !== "string"
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
          console.error("Error processing tracker log:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to process tracker log",
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

        console.log("Regular log (no tracker selected):", input);

        await Promise.resolve();

        return {
          success: true,
        };
      }
    }),

  getLogsByTrackerId: protectedProcedure
    .input(
      z.object({
        trackerId: cloudTypeIdValidator("tracker"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db, auth } = ctx;
      const user = auth.user;

      try {
        const logs = await db.query.trackerLogs.findMany({
          where: and(
            eq(trackerLogs.ownerId, user.id),
            eq(trackerLogs.trackerId, input.trackerId),
          ),
          orderBy: [desc(trackerLogs.createdAt)],
          limit: 100,
        });

        return logs;
      } catch (error) {
        console.error("Error fetching tracker logs:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch tracker logs",
        });
      }
    }),
} satisfies TRPCRouterRecord;
