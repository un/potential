// packages/templates/src/types.ts
import { z } from "zod";

import type { ConstsTypes, TrackableCustomConfig } from "@potential/consts";
import { CONSTS } from "@potential/consts";

type TrackableSubTypesKey = ConstsTypes["TRACKABLE"]["SUB_TYPES"]["KEY"];
type TrackableTypesKey = ConstsTypes["TRACKABLE"]["TYPES"]["KEY"];

// Core template types
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
  aiDescriptionHelper: z.string(),
  recommended: z.boolean().default(false),
  featured: z.boolean().default(false),
  uses: z.number().default(0),
  defaultConfig: z.custom<TrackableConfigWithMeta>(),
  type: CONSTS.TRACKABLE.TYPES_SCHEMA,
  subType: CONSTS.TRACKABLE.SUB_TYPES_SCHEMA,
});

export type BaseTemplate = z.infer<typeof baseTemplateSchema>;

export type TrackableTemplateRegistry = Record<
  TrackableTypesKey,
  Partial<Record<TrackableSubTypesKey, BaseTemplate>>
>;

export interface TrackableTemplateGroup {
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
      defaultConfig?: Partial<TrackableConfigWithMeta>;
    };
  }[];
  category?: string;
  tags?: string[];
}
