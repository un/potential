import type { CloudTypeId } from "@1up/utils";
import { db, eq, userProfiles, userXpLogs } from "@1up/db";

export async function awardXpPoints({
  userId,
  action,
  actionId,
}: {
  userId: CloudTypeId<"user">;
  action: "newLog" | "newTrackable";
  actionId: CloudTypeId<"trackable"> | CloudTypeId<"trackableLog">;
}) {
  console.log("🔥", { userId, action, actionId });
  const user = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.ownerId, userId),
  });

  if (!user) {
    console.error("User not found when adding xp points", { userId, action });
    return;
  }

  const baseXpPoints = action === "newTrackable" ? 25 : 10;
  console.log("🔥", { baseXpPoints });

  const hoursBetweenNowAndStreakEnd = user.streakCurrentEndDate
    ? differenceInHours(new Date(), user.streakCurrentEndDate)
    : 0;
  console.log("🔥", { hoursBetweenNowAndStreakEnd });
  let streakDays = user.streakCurrentDays;
  console.log("🔥", { streakDays });
  // If current streakEndData is more than 48 hours ago, we reset the streak
  if (hoursBetweenNowAndStreakEnd > 48) {
    console.log("🔥 caught in more than 48 hours");
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
    console.log("🔥 caught in less than 48 hours");
    streakDays = user.streakCurrentStartDate
      ? daysBetweenDates(user.streakCurrentStartDate, new Date())
      : 1;

    await db
      .update(userProfiles)
      .set({
        ...(!user.streakCurrentStartDate && {
          streakCurrentStartDate: new Date(),
        }),
        streakCurrentDays: 1,
        streakCurrentEndDate: new Date(),
        streakCurrentStartDate: new Date(),
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
