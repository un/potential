import { tool } from "ai";
import { z } from "zod";

import type { CloudTypeId } from "@potential/utils";
import { db, desc, eq, trackableLogs, trackables } from "@potential/db";

export const getUserTrackablesWithLastLogTimestamp = ({
  userId,
}: {
  userId: CloudTypeId<"user">;
}) =>
  tool({
    description:
      "Get a list of existing data items the user is already tracking and the last time they entered data for it.",
    parameters: z.object({}),
    execute: async () => {
      const userTrackables = await db.query.trackables.findMany({
        where: eq(trackables.ownerId, userId),

        columns: {
          id: true,
          name: true,
          description: true,
          type: true,
          subType: true,
          subTypeCustomName: true,
        },
        with: {
          logs: {
            limit: 1,
            orderBy: desc(trackableLogs.createdAt),
            columns: {
              createdAt: true,
            },
          },
        },
      });
      const consumptionTrackables = userTrackables.filter(
        (trackable) => trackable.type === "consumption",
      );
      const nonConsumptionTrackables = userTrackables.filter(
        (trackable) => trackable.type !== "consumption",
      );
      return {
        trackables: nonConsumptionTrackables,
        hasConsumptionTrackables: consumptionTrackables.length > 0,
      };
    },
  });
