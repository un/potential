import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../trpc";

export const logRouter = {
  createFoodDrinkLog: protectedProcedure
    .input(
      z.object({
        text: z.string(),
        imageIds: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, auth } = ctx;
      const user = auth.user;

      // Validate that at least text or imageIds is provided
      if (input.text.trim() === "" && input.imageIds.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Either text or at least one image must be provided",
        });
      }

      console.log(input);

      // Example of an await operation (commented out for now)
      // const newLog = await _db.insert(aiInputLogs).values({
      //   ownerId: _user.id,
      //   inputType: "text",
      //   resultFriendlyText: input.text,
      //   text: input.text,
      // });
      // console.log(newLog);

      // This is a placeholder - in a real app, you'd have some database operation here
      await Promise.resolve();

      return {
        success: true,
      };
    }),
} satisfies TRPCRouterRecord;
