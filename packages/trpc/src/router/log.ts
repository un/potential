import type { TRPCRouterRecord } from "@trpc/server";
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
      console.log(input);

      // const newLog = await db.insert(aiInputLogs).values({
      //   ownerId: user.id,
      //   inputType: "text",
      //   resultFriendlyText: input.text,
      //   text: input.text,
      // });
      // console.log(newLog);

      return {
        success: true,
      };
    }),
} satisfies TRPCRouterRecord;
