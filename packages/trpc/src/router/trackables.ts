import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { TrackableCustomConfig } from "@1up/consts";
import { CONSTS } from "@1up/consts";
import { and, eq, trackables } from "@1up/db";
import { cloudTypeIdGenerator, cloudTypeIdValidator } from "@1up/utils/typeid";

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
} satisfies TRPCRouterRecord;
