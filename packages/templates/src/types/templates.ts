// packages/templates/src/types/templates.ts
import { z } from "zod";

import type { ConstsTypes, TrackerCustomConfig } from "@potential/consts";

type TrackerSubTypesKey = ConstsTypes["TRACKER"]["SUB_TYPES"]["KEY"];
type TrackerTypesKey = ConstsTypes["TRACKER"]["TYPES"]["KEY"];

export interface TrackerConfigMetadata {
  templateId?: string;
  templateVersion?: number;
  isCustomized?: boolean;
}

export type TrackerConfigWithMeta = TrackerCustomConfig & {
  _meta?: TrackerConfigMetadata;
};

export const baseTemplateSchema = z.object({
  id: z.string(),
  version: z.number(),
  name: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
  recommended: z.boolean().default(false),
  defaultConfig: z.custom<TrackerConfigWithMeta>(),
});

export type BaseTemplate = z.infer<typeof baseTemplateSchema>;

export type TrackerTemplateRegistry = Record<
  TrackerTypesKey,
  Partial<Record<TrackerSubTypesKey, BaseTemplate[]>>
>;
