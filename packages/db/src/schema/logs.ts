import { relations } from "drizzle-orm";
import {
  boolean,
  json,
  mysqlEnum,
  mysqlTable,
  smallint,
  text,
  varchar,
} from "drizzle-orm/mysql-core";

import type { CloudTypeId } from "@1up/utils/typeid";
import { cloudTypeIdGenerator } from "@1up/utils/typeid";

import { colorsColumn } from "../columns/custom/color";
import {
  trackableSubTypeColumn,
  trackableTypeColumn,
} from "../columns/custom/trackable";
import { typeIdColumn } from "../columns/custom/typeId";
import { timestamps } from "../columns/timestamps";
import { users } from "./auth";
import { ingredientLogs } from "./ingredients";

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
  name: varchar("name", { length: 32 }).notNull(),
  description: varchar("description", { length: 255 }),
  color: colorsColumn("color"),
  type: trackableTypeColumn("type"),
  subType: trackableSubTypeColumn("subType"),
  subTypeCustomName: varchar("subTypeCustomName", { length: 64 }),
  customConfig: json("customConfig").$type<TrackableCustomConfig>(),
  public: boolean("public").default(false),
  ...timestamps.createUpdate,
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
  parentLogId: typeIdColumn("trackableLog", "id"),
  ownerId: typeIdColumn("user", "user_id").notNull(),
  checked: boolean("checked"),
  numericValue: smallint("numericValue"),
  textValue: text("textValue"),
  jsonValue: json("jsonValue").$type<TrackableLogJsonValue>(),
  source: mysqlEnum("source", ["app", "api", "integration"]),
  ...timestamps.createUpdateLogged,
});

export const trackableLogsRelations = relations(
  trackableLogs,
  ({ one, many }) => ({
    trackable: one(trackables, {
      fields: [trackableLogs.trackableId],
      references: [trackables.id],
    }),
    parent: one(trackableLogs, {
      fields: [trackableLogs.parentLogId],
      references: [trackableLogs.id],
      relationName: "parent",
    }),
    children: many(trackableLogs, {
      relationName: "children",
    }),
    owner: one(users, {
      fields: [trackableLogs.ownerId],
      references: [users.id],
    }),
    ingredientLogs: many(ingredientLogs),
  }),
);
