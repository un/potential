// packages/templates/src/types/templates.ts
import { z } from "zod";

import type { ConstsTypes, TrackableCustomConfig } from "@potential/consts";

type TrackableSubTypesKey = ConstsTypes["TRACKABLE"]["SUB_TYPES"]["KEY"];
type TrackableTypesKey = ConstsTypes["TRACKABLE"]["TYPES"]["KEY"];

export interface TrackableConfigMetadata {
  templateId?: string;
  templateVersion?: number;
  isCustomized?: boolean;
}

export type TrackableConfigWithMeta = TrackableCustomConfig & {
  _meta?: TrackableConfigMetadata;
};

export const baseTemplateSchema = z.object({
  id: z.string(),
  version: z.number(),
  name: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
  recommended: z.boolean().default(false),
  defaultConfig: z.custom<TrackableConfigWithMeta>(),
});

export type BaseTemplate = z.infer<typeof baseTemplateSchema>;

export type TrackableTemplateRegistry = Record<
  TrackableTypesKey,
  Partial<Record<TrackableSubTypesKey, BaseTemplate[]>>
>;
