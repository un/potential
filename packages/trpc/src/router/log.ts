import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { CONSTS } from "@1up/consts";
import { trackableLogs } from "@1up/db";
import { cloudTypeIdValidator } from "@1up/utils";

import { protectedProcedure } from "../trpc";

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
      console.log("🔥", { id: input.trackableId, value: input.trackableValue });
      // Check if a trackable was selected
      if (input.trackableId && input.trackableValue) {
        try {
          // Construct the log data that would be saved to the database

          await db.insert(trackableLogs).values({
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

        // This is a placeholder - in a real app, you'd have some database operation here
        await Promise.resolve();

        return {
          success: true,
        };
      }
    }),
} satisfies TRPCRouterRecord;
