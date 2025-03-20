import { relations } from "drizzle-orm";
import {
  boolean,
  json,
  mysqlEnum,
  mysqlTable,
  smallint,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import type { CloudTypeId } from "@1up/utils/typeid";
import { TRACKABLE_TYPES_ARRAY } from "@1up/consts/trackables";
import { uiColors } from "@1up/consts/uiColors";
import { cloudTypeIdGenerator } from "@1up/utils/typeid";

import { typeIdColumn } from "../customColumnTypes";
import { users } from "./auth";

export type TrackableCustomConfig =
  | ({
      cumulative: boolean;
      limitOnePerDay: boolean;
    } & {
      type: "measure";
      // used to display input and logs
      measureUnit: string;
      measureTarget: number | null;
      // Additional flexibility
      measureMin?: number;
      measureMax?: number;
      cumulative: boolean;
      // For aggregation and reporting
      aggregationType?: "sum" | "average" | "latest";
    })
  | {
      type: "checkbox";
      // used to display input and logs
      checkboxName: string;
    }
  | {
      type: "range";
      // used to limit inputs
      rangeMin: number;
      rangeMax: number;
      // Labels for range extremes
      rangeUnit?: string;
      rangeMinLabel?: string;
      rangeMaxLabel?: string;
      // Step for input control
      rangeStepLabels: Record<number, string>[];
    }
  | {
      type: "rating";
      // used to limit inputs
      ratingMax: number;
      // Labels for range extremes
      ratingUnit?: string;
      ratingIcon?: string;
      ratingEmoji?: string;
    }
  | {
      type: "note";
      // For text-based tracking
      maxLength?: number;
    };

export const trackables = mysqlTable("trackables", {
  id: typeIdColumn("trackable", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("trackable")),
  ownerId: typeIdColumn("user", "user_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  color: mysqlEnum("color", [...uiColors]).notNull(),
  type: mysqlEnum("type", [...TRACKABLE_TYPES_ARRAY]).notNull(),
  customConfig: json("customConfig").$type<TrackableCustomConfig>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const trackablesRelations = relations(trackables, ({ one, many }) => ({
  owner: one(users, {
    fields: [trackables.ownerId],
    references: [users.id],
  }),
  logs: many(trackableLogs),
}));

export type TrackableLogJsonValue = {
  integrationId?: CloudTypeId<"integration">;
} & {
  imageUrl: string;
  voiceClipUrl: string;
};

export const trackableLogs = mysqlTable("trackable_logs", {
  id: typeIdColumn("trackableLog", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("trackableLog")),
  trackableId: typeIdColumn("trackable", "id").notNull(),
  ownerId: typeIdColumn("user", "user_id").notNull(),
  checked: boolean("checked"),
  numericValue: smallint("numericValue"),
  textValue: text("textValue"),
  jsonValue: json("jsonValue").$type<TrackableLogJsonValue>(),
  source: mysqlEnum("source", ["app", "api", "integration"]),
  loggedAt: timestamp("loggedAt").notNull().defaultNow(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow().onUpdateNow(),
});

export const trackableLogsRelations = relations(trackableLogs, ({ one }) => ({
  trackable: one(trackables, {
    fields: [trackableLogs.trackableId],
    references: [trackables.id],
  }),
  owner: one(users, {
    fields: [trackableLogs.ownerId],
    references: [users.id],
  }),
}));
