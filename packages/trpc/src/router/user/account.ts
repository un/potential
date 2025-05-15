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
  trackableLogs,
  trackables,
  userProfiles,
  users,
  userXpLogs,
} from "@potential/db";

import { protectedProcedure } from "../../trpc";

export const accountRouter = {
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
      const trackablesDeleted = await db
        .delete(trackables)
        .where(eq(trackables.ownerId, user.id));
      console.log("👋 trackablesDeleted", trackablesDeleted);
      const trackableLogsDeleted = await db
        .delete(trackableLogs)
        .where(eq(trackableLogs.ownerId, user.id));
      console.log("👋 trackableLogsDeleted", trackableLogsDeleted);
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
} satisfies TRPCRouterRecord;
