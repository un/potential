import { z } from "zod";

import { CONSTS } from "@potential/consts";

export const newTrackersSchema = z.object({
  trackerName: z.string(),
  trackerDescription: z.string(),
  trackerConfig: CONSTS.TRACKER.CONFIG.CONFIG_SCHEMA,
  name: z.string().max(32),
  description: z.string().max(255),
  color: z.union([CONSTS.COLORS.SCHEMA, z.string()]),
  type: CONSTS.TRACKER.TYPES_SCHEMA,
  subType: CONSTS.TRACKER.SUB_TYPES_SCHEMA,
  subTypeCustomName: z.string().max(64),
  configType: CONSTS.TRACKER.CONFIG.TYPES_SCHEMA,
});
