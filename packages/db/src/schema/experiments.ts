import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  mysqlEnum,
  mysqlTable,
  smallint,
  text,
  varchar,
} from "drizzle-orm/mysql-core";

import { cloudTypeIdGenerator } from "@potential/utils/typeid";

import { typeIdColumn } from "../columns/custom/typeId";
import { timestamps } from "../columns/timestamps";
import { users } from "./auth";
import { trackerGroupTrackers } from "./trackers";

export const experiments = mysqlTable("experiments", {
  id: typeIdColumn("experiment", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("experiment")),
  ownerId: typeIdColumn("user", "user_id").notNull(),
  name: varchar("name", { length: 32 }).notNull(),
  descriptionHuman: varchar("description_human", { length: 255 }).notNull(),
  descriptionAi: text("description_ai").notNull(),
  desiredOutcomeHuman: varchar("desired_outcome_human", {
    length: 255,
  }).notNull(),
  desiredOutcomeAi: text("desired_outcome_ai").notNull(),
  aiChatId: typeIdColumn("aiChat", "chatId").notNull(),
  public: boolean("public").default(false),
  status: mysqlEnum("status", [
    "pending",
    "active",
    "completed",
    "cancelled",
  ]).notNull(),
  ...timestamps.createUpdate,
});

export const experimentRelations = relations(experiments, ({ one, many }) => ({
  owner: one(users, {
    fields: [experiments.ownerId],
    references: [users.id],
  }),
  phases: many(experimentPhases),
}));

export const experimentPhases = mysqlTable("experiment_phases", {
  id: typeIdColumn("experimentPhase", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("experimentPhase")),
  ownerId: typeIdColumn("user", "user_id").notNull(),
  experimentId: typeIdColumn("experiment", "experimentId").notNull(),
  name: varchar("name", { length: 32 }).notNull(),
  descriptionHuman: varchar("description_human", { length: 255 }).notNull(),
  descriptionAi: text("description_ai").notNull(),
  desiredOutcomeHuman: varchar("desired_outcome_human", {
    length: 255,
  }).notNull(),
  desiredOutcomeAi: text("desired_outcome_ai").notNull(),
  expectedDurationDays: smallint("expected_duration").notNull(),
  startDate: date("start_date"),
  endDate: date("end_date"),
  status: mysqlEnum("status", [
    "pending",
    "active",
    "completed",
    "cancelled",
  ]).notNull(),
  ...timestamps.createUpdate,
});

export const experimentPhaseRelations = relations(
  experimentPhases,
  ({ one, many }) => ({
    owner: one(users, {
      fields: [experimentPhases.ownerId],
      references: [users.id],
    }),
    experiment: one(experiments, {
      fields: [experimentPhases.experimentId],
      references: [experiments.id],
    }),
    trackerGroups: many(trackerGroupTrackers),
  }),
);
