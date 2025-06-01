import { tool } from "ai";
import { z } from "zod";

import type { CloudTypeId } from "@potential/utils";
import { db, desc, eq, trackerLogs, trackers } from "@potential/db";

export const getUserTrackersWithLastLogTimestamp = ({
  userId,
}: {
  userId: CloudTypeId<"user">;
}) =>
  tool({
    description:
      "Get a list of existing data items the user is already tracking and the last time they entered data for it.",
    parameters: z.object({}),
    execute: async () => {
      const userTrackers = await db.query.trackers.findMany({
        where: eq(trackers.ownerId, userId),

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
            orderBy: desc(trackerLogs.createdAt),
            columns: {
              createdAt: true,
            },
          },
        },
      });
      const consumptionTrackers = userTrackers.filter(
        (tracker) => tracker.type === "consumption",
      );
      const nonConsumptionTrackers = userTrackers.filter(
        (tracker) => tracker.type !== "consumption",
      );
      return {
        trackers: nonConsumptionTrackers,
        hasConsumptionTrackers: consumptionTrackers.length > 0,
      };
    },
  });
