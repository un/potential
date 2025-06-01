// packages/templates/src/types.ts
import { z } from "zod";

import type { ConstsTypes, TrackerCustomConfig } from "@potential/consts";
import { CONSTS } from "@potential/consts";

type TrackerSubTypesKey = ConstsTypes["TRACKER"]["SUB_TYPES"]["KEY"];
type TrackerTypesKey = ConstsTypes["TRACKER"]["TYPES"]["KEY"];

// Core template types
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
  aiDescriptionHelper: z.string(),
  recommended: z.boolean().default(false),
  featured: z.boolean().default(false),
  uses: z.number().default(0),
  defaultConfig: z.custom<TrackerConfigWithMeta>(),
  type: CONSTS.TRACKER.TYPES_SCHEMA,
  subType: CONSTS.TRACKER.SUB_TYPES_SCHEMA,
});

export type BaseTemplate = z.infer<typeof baseTemplateSchema>;

export type TrackerTemplateRegistry = Record<
  TrackerTypesKey,
  Partial<Record<TrackerSubTypesKey, BaseTemplate>>
>;

export interface TrackerTemplateGroup {
  id: string;
  version: number;
  name: string;
  description?: string;
  aiDescriptionHelper: string;
  recommended?: boolean;
  featured?: boolean;
  uses?: number;
  templates: {
    templateId: string;
    overrides?: {
      name?: string;
      description?: string;
      defaultConfig?: Partial<TrackerConfigWithMeta>;
    };
  }[];
  category?: string;
  tags?: string[];
}
