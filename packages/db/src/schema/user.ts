import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  int,
  mysqlEnum,
  mysqlTable,
  smallint,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import { genderAtBirthValues } from "@1up/consts/users";
import { cloudTypeIdGenerator } from "@1up/utils/typeid";

import { typeIdColumn } from "../customColumnTypes";
import { users } from "./auth";

export const userProfiles = mysqlTable("user_profiles", {
  id: typeIdColumn("userProfile", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("userProfile")),
  ownerId: typeIdColumn("user", "user_id").notNull(),
  onboardingCompleted: boolean("onboardingCompleted"),

  // Health
  healthDateOfBirth: date("healthDateOfBirth"),
  healthGenderAtBirth: mysqlEnum(
    "healthGenderAtBirth",
    genderAtBirthValues as [string, ...string[]],
  ),
  healthHeight: smallint("healthHeight", { unsigned: true }), //in cm
  healthWeight: smallint("healthWeight", { unsigned: true }), //in kg

  // experience Points
  xpTotal: int("xpTotal", {
    unsigned: true,
  }).default(0),

  // Streak
  streakCurrentStartDate: timestamp("streakCurrentStart"),
  streakCurrentEndDate: timestamp("streakCurrentEnd"),
  streakCurrentDays: smallint("streakCurrentDays", { unsigned: true }).default(
    0,
  ),
  streakLongestDays: smallint("streakLongestDays", { unsigned: true }).default(
    0,
  ),
});

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  owner: one(users, {
    fields: [userProfiles.ownerId],
    references: [users.id],
  }),
}));

export const userXpLogs = mysqlTable("userXpLogs", {
  id: typeIdColumn("userXpLog", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("userXpLog")),
  ownerId: typeIdColumn("user", "user_id").notNull(),
  points: int("points", { unsigned: true }).notNull(),
  actionId: varchar("actionId", { length: 64 }).notNull(),
  friendlyName: varchar("friendlyName", { length: 64 }).notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export const userXpLogsRelations = relations(userXpLogs, ({ one }) => ({
  owner: one(users, {
    fields: [userXpLogs.ownerId],
    references: [users.id],
  }),
}));
