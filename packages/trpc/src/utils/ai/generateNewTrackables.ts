import { z } from "zod";

import { CONSTS } from "@potential/consts";

export const newTrackablesSchema = z.object({
  trackableName: z.string(),
  trackableDescription: z.string(),
  trackableConfig: CONSTS.TRACKABLE.CONFIG.CONFIG_SCHEMA,
  name: z.string().max(32),
  description: z.string().max(255),
  color: CONSTS.COLORS.SCHEMA,
  type: CONSTS.TRACKABLE.TYPES_SCHEMA,
  subType: CONSTS.TRACKABLE.SUB_TYPES_SCHEMA,
  subTypeCustomName: z.string().max(64),
  configType: CONSTS.TRACKABLE.CONFIG.TYPES_SCHEMA,
});
