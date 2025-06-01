import type { InferInsertModel } from "@potential/db";
import type { CloudTypeId } from "@potential/utils";
import { and, db, eq, trackers } from "@potential/db";
import { TRACKER_TEMPLATES } from "@potential/templates";
import { cloudTypeIdGenerator } from "@potential/utils";

export async function createConsumptionTrackers({
  userId,
}: {
  userId: CloudTypeId<"user">;
}) {
  console.log("🍕 CREATING CONSUMPTION TRACKERS FUNCTION");
  const userTrackers = await db.query.trackers.findMany({
    where: and(eq(trackers.ownerId, userId), eq(trackers.type, "consumption")),
    columns: {
      id: true,
    },
  });
  if (userTrackers.length > 0) {
    return;
  }

  const templates = TRACKER_TEMPLATES.consumption;

  const newTrackersToInsertArray: InferInsertModel<typeof trackers>[] = [];
  for (const template of Object.values(templates)) {
    newTrackersToInsertArray.push({
      id: cloudTypeIdGenerator("tracker"),
      ownerId: userId,
      name: template.name,
      description: template.description,
      color: null,
      configType: template.defaultConfig.type,
      public: false,
      type: "consumption",
      subType: template.subType,
      customConfig: template.defaultConfig,
    });
  }
  console.log("🍕 INSERTING CONSUMPTION TRACKERS", {
    newTrackersToInsertArray,
  });
  await db.insert(trackers).values(newTrackersToInsertArray);

  return;
}
