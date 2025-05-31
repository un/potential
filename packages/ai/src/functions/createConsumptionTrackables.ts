import type { InferInsertModel } from "@potential/db";
import type { CloudTypeId } from "@potential/utils";
import { and, db, eq, trackables } from "@potential/db";
import { TRACKABLE_TEMPLATES } from "@potential/templates";
import { cloudTypeIdGenerator } from "@potential/utils";

export async function createConsumptionTrackables({
  userId,
}: {
  userId: CloudTypeId<"user">;
}) {
  console.log("🍕 CREATING CONSUMPTION TRACKABLES FUNCTION");
  const userTrackables = await db.query.trackables.findMany({
    where: and(
      eq(trackables.ownerId, userId),
      eq(trackables.type, "consumption"),
    ),
    columns: {
      id: true,
    },
  });
  if (userTrackables.length > 0) {
    return;
  }

  const templates = TRACKABLE_TEMPLATES.consumption;

  const newTrackablesToInsertArray: InferInsertModel<typeof trackables>[] = [];
  for (const template of Object.values(templates)) {
    newTrackablesToInsertArray.push({
      id: cloudTypeIdGenerator("trackable"),
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
  console.log("🍕 INSERTING CONSUMPTION TRACKABLES", {
    newTrackablesToInsertArray,
  });
  await db.insert(trackables).values(newTrackablesToInsertArray);

  return;
}
