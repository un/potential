import { relations } from "drizzle-orm";
import {
  date,
  decimal,
  mysqlTable,
  smallint,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import { cloudTypeIdGenerator } from "@potential/utils";

import { typeIdColumn } from "../columns/custom/typeId";
import { genderAtBirthColumn } from "../columns/custom/user";
import { users } from "./auth";

export const userProfiles = mysqlTable("user_profiles", {
  id: typeIdColumn("userProfile", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("userProfile")),
  ownerId: typeIdColumn("user", "user_id").notNull(),
  lastOnboardingVersion: varchar("lastOnboardingVersion", {
    length: 12,
  })
    .notNull()
    .default("0.0.0"),

  // Health
  healthDateOfBirth: date("healthDateOfBirth"),
  healthGenderAtBirth: genderAtBirthColumn("healthGenderAtBirth"),
  healthHeight: smallint("healthHeight", { unsigned: true }), //in cm
  healthWeight: smallint("healthWeight", { unsigned: true }), //in kg

  // experience Points
  xpTotal: decimal("xpTotal", {
    unsigned: true,
    precision: 12,
    scale: 2,
  }).notNull(),

  // Streak
  streakCurrentStartDate: timestamp("streakCurrentStart"),
  streakCurrentEndDate: timestamp("streakCurrentEnd"),
  streakCurrentDays: smallint("streakCurrentDays", {
    unsigned: true,
  }).notNull(),
  streakLongestDays: smallint("streakLongestDays", { unsigned: true }).default(
    1,
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
  ownerId: typeIdColumn("user", "ownerId").notNull(),
  points: decimal("points", {
    unsigned: true,
    precision: 6,
    scale: 2,
  }).notNull(),
  originalPoints: decimal("originalPoints", {
    unsigned: true,
    precision: 6,
    scale: 2,
  }).notNull(),
  multiplier: decimal("multiplier", {
    unsigned: true,
    precision: 4,
    scale: 2,
  }).notNull(),
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

export const userNotificationTokens = mysqlTable("userNotificationTokens", {
  id: typeIdColumn("userNotificationToken", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("userNotificationToken")),
  ownerId: typeIdColumn("user", "ownerId").notNull(),
  token: varchar("token", { length: 255 }).notNull(),
  lastSeenAt: timestamp("lastSeenAt").notNull(),
});
