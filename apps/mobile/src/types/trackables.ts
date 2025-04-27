import type { TrackableCustomConfig } from "@potential/consts";

export type TrackableType =
  | "measure"
  | "checkbox"
  | "range"
  | "rating"
  | "shortText"
  | "longText";

export interface Log {
  id: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
  loggedAt?: Date | string;
  ownerId?: string;
  trackableId?: string;
  parentLogId?: string | null;
  checked: boolean | null;
  numericValue: number | null;
  textValue: string | null;
  jsonValue?: {
    imageIds?: string[];
  } | null;
  source?: string;
}

export interface Trackable {
  id: string;
  name: string;
  configType: string;
  customConfig: TrackableCustomConfig;
}
