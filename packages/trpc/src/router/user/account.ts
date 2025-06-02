import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import {
  accounts,
  aiInputLogs,
  eq,
  ingredientLogs,
  ingredients,
  integrations,
  passkeys,
  sessions,
  trackerLogs,
  trackers,
  userNotificationTokens,
  userProfiles,
  users,
  userXpLogs,
} from "@potential/db";

import { protectedProcedure, publicProcedure } from "../../trpc";

export const accountRouter = {
  setNotificationToken: protectedProcedure
    .input(
      z.object({
        token: z.string().max(255),
        previousToken: z.string().max(255),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, auth } = ctx;
      const user = auth.user;
      console.log("👋 setNotificationToken", {
        token: input.token,
        previousToken: input.previousToken,
      });

      // delete previous token
      if (input.previousToken && input.previousToken.length > 0) {
        await db
          .delete(userNotificationTokens)
          .where(eq(userNotificationTokens.token, input.previousToken));
      }

      // create new token
      await db.insert(userNotificationTokens).values({
        ownerId: user.id,
        token: input.token,
        lastSeenAt: new Date(),
      });

      return {
        success: true,
      };
    }),
  deleteNotificationToken: protectedProcedure
    .input(z.object({ token: z.string().max(255) }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      console.log("👋 deleteNotificationToken", { token: input.token });

      await db
        .delete(userNotificationTokens)
        .where(eq(userNotificationTokens.token, input.token));

      return {
        success: true,
      };
    }),
  deleteAccount: protectedProcedure
    .input(
      z.object({
        confirm: z.boolean(),
      }),
    )
    .mutation(async ({ ctx }) => {
      const { db, auth } = ctx;
      const user = auth.user;

      console.log("👋 user requested account deletion", { userId: user.id });

      const aiInputLogsDeleted = await db
        .delete(aiInputLogs)
        .where(eq(aiInputLogs.ownerId, user.id));
      console.log("👋 aiInputLogsDeleted", aiInputLogsDeleted);
      const usersDeleted = await db.delete(users).where(eq(users.id, user.id));
      console.log("👋 usersDeleted", usersDeleted);
      const sessionsDeleted = await db
        .delete(sessions)
        .where(eq(sessions.userId, user.id));
      console.log("👋 sessionsDeleted", sessionsDeleted);
      const accountsDeleted = await db
        .delete(accounts)
        .where(eq(accounts.userId, user.id));
      console.log("👋 accountsDeleted", accountsDeleted);
      const passkeysDeleted = await db
        .delete(passkeys)
        .where(eq(passkeys.userId, user.id));
      console.log("👋 passkeysDeleted", passkeysDeleted);
      const ingredientsDeleted = await db
        .delete(ingredients)
        .where(eq(ingredients.ownerId, user.id));
      console.log("👋 ingredientsDeleted", ingredientsDeleted);
      const ingredientLogsDeleted = await db
        .delete(ingredientLogs)
        .where(eq(ingredientLogs.ownerId, user.id));
      console.log("👋 ingredientLogsDeleted", ingredientLogsDeleted);
      const integrationsDeleted = await db
        .delete(integrations)
        .where(eq(integrations.ownerId, user.id));
      console.log("👋 integrationsDeleted", integrationsDeleted);
      const trackersDeleted = await db
        .delete(trackers)
        .where(eq(trackers.ownerId, user.id));
      console.log("👋 trackersDeleted", trackersDeleted);
      const trackerLogsDeleted = await db
        .delete(trackerLogs)
        .where(eq(trackerLogs.ownerId, user.id));
      console.log("👋 trackerLogsDeleted", trackerLogsDeleted);
      const userProfilesDeleted = await db
        .delete(userProfiles)
        .where(eq(userProfiles.ownerId, user.id));
      console.log("👋 userProfilesDeleted", userProfilesDeleted);
      const userXpLogsDeleted = await db
        .delete(userXpLogs)
        .where(eq(userXpLogs.ownerId, user.id));
      console.log("👋 userXpLogsDeleted", userXpLogsDeleted);
      return;
    }),
  checkEmailRegistered: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;

      const user = await db.query.users.findFirst({
        where: eq(users.email, input.email),
      });

      return !!user;
    }),
} satisfies TRPCRouterRecord;
