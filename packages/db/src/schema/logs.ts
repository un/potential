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

import type { TrackerCustomConfig } from "@potential/consts";
import type { CloudTypeId } from "@potential/utils/typeid";
import { cloudTypeIdGenerator } from "@potential/utils/typeid";

import { colorsColumn } from "../columns/custom/color";
import {
  trackerSubTypeColumn,
  trackerTypeColumn,
  trackerTypeConfigColumn,
} from "../columns/custom/tracker";
import { typeIdColumn } from "../columns/custom/typeId";
import { timestamps } from "../columns/timestamps";
import { users } from "./auth";
import { ingredientLogs } from "./ingredients";

export const trackers = mysqlTable("trackers", {
  id: typeIdColumn("tracker", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("tracker")),
  ownerId: typeIdColumn("user", "user_id").notNull(),
  name: varchar("name", { length: 32 }).notNull(),
  description: varchar("description", { length: 255 }),
  color: colorsColumn("color"),
  type: trackerTypeColumn("type"),
  subType: trackerSubTypeColumn("subType"),
  subTypeCustomName: varchar("subTypeCustomName", { length: 64 }),
  configType: trackerTypeConfigColumn("configType"),
  customConfig: json("customConfig").$type<TrackerCustomConfig>(),
  public: boolean("public").default(false),
  ...timestamps.createUpdate,
});

export const trackersRelations = relations(trackers, ({ one, many }) => ({
  owner: one(users, {
    fields: [trackers.ownerId],
    references: [users.id],
  }),
  logs: many(trackerLogs),
}));

export type TrackerLogJsonValue = {
  integrationId?: CloudTypeId<"integration">;
} & {
  imageIds: string[];
  voiceClipIds: string[];
};

export const trackerLogs = mysqlTable("tracker_logs", {
  id: typeIdColumn("trackerLog", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("trackerLog")),
  trackerId: typeIdColumn("tracker", "trackerId").notNull(),
  parentLogId: typeIdColumn("trackerLog", "parentLogId"),
  ownerId: typeIdColumn("user", "userId").notNull(),
  checked: boolean("checked"),
  numericValue: mediumint("numericValue", { unsigned: true }),
  textValue: text("textValue"),
  jsonValue: json("jsonValue").$type<TrackerLogJsonValue>(),
  source: mysqlEnum("source", ["app", "api", "integration"]),
  ...timestamps.createUpdateLogged,
});

export const trackerLogsRelations = relations(trackerLogs, ({ one, many }) => ({
  tracker: one(trackers, {
    fields: [trackerLogs.trackerId],
    references: [trackers.id],
  }),
  parent: one(trackerLogs, {
    fields: [trackerLogs.parentLogId],
    references: [trackerLogs.id],
    relationName: "parent",
  }),
  children: many(trackerLogs, {
    relationName: "children",
  }),
  owner: one(users, {
    fields: [trackerLogs.ownerId],
    references: [users.id],
  }),
  ingredientLogs: many(ingredientLogs),
}));
