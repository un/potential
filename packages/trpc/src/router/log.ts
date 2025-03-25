import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { aiInputLogs } from "@1up/db";

import { protectedProcedure } from "../trpc";

export const logRouter = {
  createTextLog: protectedProcedure
    .input(
      z.object({
        text: z.string().min(4),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, auth } = ctx;
      const user = auth.user;
      console.log(input);

      const newLog = await db.insert(aiInputLogs).values({
        ownerId: user.id,
        inputType: "text",
        resultFriendlyText: input.text,
        text: input.text,
      });
      console.log(newLog);

      return {
        success: true,
      };
    }),
  createVoiceLog: protectedProcedure
    .input(
      z.object({
        audioBlob: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, auth } = ctx;
      const user = auth.user;
      console.log(input);
      return {
        success: true,
      };
    }),
  createImageLog: protectedProcedure
    .input(
      z.object({
        imageBlob: z.string(),
        text: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, auth } = ctx;
      const user = auth.user;
      console.log(input);
      return {
        success: true,
      };
    }),
} satisfies TRPCRouterRecord;
