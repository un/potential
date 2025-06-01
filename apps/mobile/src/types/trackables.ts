import type { TrackerCustomConfig } from "@potential/consts";

export type TrackerType =
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
  trackerId?: string;
  parentLogId?: string | null;
  checked: boolean | null;
  numericValue: number | null;
  textValue: string | null;
  jsonValue?: {
    imageIds?: string[];
  } | null;
  source?: string;
}

export interface Tracker {
  id: string;
  name: string;
  configType: string;
  customConfig: TrackerCustomConfig;
}
