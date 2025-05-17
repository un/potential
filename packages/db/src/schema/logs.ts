import { relations } from "drizzle-orm";
import {
  boolean,
  json,
  mediumint,
  mysqlEnum,
  mysqlTable,
  text,
  varchar,
} from "drizzle-orm/mysql-core";

import type { TrackableCustomConfig } from "@potential/consts";
import type { CloudTypeId } from "@potential/utils";
import { cloudTypeIdGenerator } from "@potential/utils";

import { colorsColumn } from "../columns/custom/color";
import {
  trackableSubTypeColumn,
  trackableTypeColumn,
  trackableTypeConfigColumn,
} from "../columns/custom/trackable";
import { typeIdColumn } from "../columns/custom/typeId";
import { timestamps } from "../columns/timestamps";
import { users } from "./auth";
import { ingredientLogs } from "./ingredients";

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
  configType: trackableTypeConfigColumn("configType"),
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
  imageIds: string[];
  voiceClipIds: string[];
};

export const trackableLogs = mysqlTable("trackable_logs", {
  id: typeIdColumn("trackableLog", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("trackableLog")),
  trackableId: typeIdColumn("trackable", "trackableId").notNull(),
  parentLogId: typeIdColumn("trackableLog", "parentLogId"),
  ownerId: typeIdColumn("user", "userId").notNull(),
  checked: boolean("checked"),
  numericValue: mediumint("numericValue", { unsigned: true }),
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
