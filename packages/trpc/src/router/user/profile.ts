import type { TRPCRouterRecord } from "@trpc/server";

import { eq, userProfiles, userXpLogs } from "@1up/db";

import { protectedProcedure } from "../../trpc";

export const profileRouter = {
  getUserProfileOverview: protectedProcedure.query(async ({ ctx }) => {
    const { db, auth } = ctx;
    const user = auth.user;

    const userProfileResponse = await db.query.userProfiles.findFirst({
      where: eq(userProfiles.ownerId, user.id),
    });

    if (!userProfileResponse) {
      // assume is new user and create a profile for them
      await db.insert(userProfiles).values({
        ownerId: user.id,
        streakCurrentDays: 1,
        streakLongestDays: 1,
        streakCurrentStartDate: new Date(),
        streakCurrentEndDate: null,
        xpTotal: 50,
        lastOnboardingVersion: 0,
        healthDateOfBirth: null,
        healthGenderAtBirth: null,
        healthHeight: null,
        healthWeight: null,
      });

      await db.insert(userXpLogs).values({
        ownerId: user.id,
        actionId: "onboarding",
        friendlyName: "Onboarding",
        points: 50,
        createdAt: new Date(),
        originalPoints: 50,
        multiplier: 1,
      });
    }

    return {
      streakCurrentDays: userProfileResponse?.streakCurrentDays ?? 1,
      streakCurrentStartDate:
        userProfileResponse?.streakCurrentStartDate ?? new Date(),
      xpTotal: userProfileResponse?.xpTotal ?? 50,
      lastOnboardingVersion: userProfileResponse?.lastOnboardingVersion ?? 0,
    };
  }),
} satisfies TRPCRouterRecord;
