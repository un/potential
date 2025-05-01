import type { CloudTypeId } from "@potential/utils";
import { db, eq, userProfiles, userXpLogs } from "@potential/db";

export async function awardXpPoints({
  userId,
  action,
  actionId,
}: {
  userId: CloudTypeId<"user">;
  action: "newLog" | "newTrackable";
  actionId: CloudTypeId<"trackable"> | CloudTypeId<"trackableLog">;
}) {
  const user = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.ownerId, userId),
  });

  if (!user) {
    console.error("User not found when adding xp points", { userId, action });
    return;
  }

  const baseXpPoints = action === "newTrackable" ? 25 : 10;

  const hoursBetweenNowAndStreakEnd = user.streakCurrentEndDate
    ? differenceInHours(new Date(), user.streakCurrentEndDate)
    : 0;

  let streakDays = user.streakCurrentDays;

  // If current streakEndData is more than 48 hours ago, we reset the streak
  if (hoursBetweenNowAndStreakEnd > 48) {
    await db
      .update(userProfiles)
      .set({
        streakCurrentDays: 1,
        streakCurrentEndDate: new Date(),
        streakCurrentStartDate: new Date(),
      })
      .where(eq(userProfiles.ownerId, userId));
    streakDays = 1;
  } else {
    streakDays = user.streakCurrentStartDate
      ? daysBetweenDates(user.streakCurrentStartDate, new Date())
      : 1;

    await db
      .update(userProfiles)
      .set({
        ...(!user.streakCurrentStartDate && {
          streakCurrentStartDate: new Date(),
        }),
        streakCurrentDays: streakDays,
        streakCurrentEndDate: new Date(),
        streakLongestDays:
          streakDays > (user.streakLongestDays ?? 0)
            ? streakDays
            : (user.streakLongestDays ?? 1),
      })
      .where(eq(userProfiles.ownerId, userId));
  }
  const pointsMultiplier = streakDays / 100 + 1;
  const multipliedXpPoints = baseXpPoints * pointsMultiplier;
  console.log("🔥", { multipliedXpPoints });
  await db.insert(userXpLogs).values({
    ownerId: userId,
    points: multipliedXpPoints.toString(),
    originalPoints: baseXpPoints.toString(),
    multiplier: pointsMultiplier.toString(),
    actionId: actionId,
    friendlyName: action === "newLog" ? "New Log" : "New Trackable",
    createdAt: new Date(),
  });
  await db
    .update(userProfiles)
    .set({
      xpTotal: (Number(user.xpTotal) + multipliedXpPoints).toString(),
    })
    .where(eq(userProfiles.ownerId, userId));
  return;
}

function differenceInHours(date1: Date, date2: Date) {
  const diff = date1.getTime() - date2.getTime();
  return Math.abs(diff) / (1000 * 60 * 60);
}

function daysBetweenDates(date1: Date, date2: Date) {
  const diff = date1.getTime() - date2.getTime();
  return Math.ceil(Math.abs(diff) / (1000 * 60 * 60 * 24));
}
