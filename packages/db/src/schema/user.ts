import { relations } from "drizzle-orm";
import {
  boolean,
  int,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import { cloudTypeIdGenerator } from "@1up/utils/typeid";

import { typeIdColumn } from "../customColumnTypes";
import { users } from "./auth";

export const userProfiles = mysqlTable("user_profiles", {
  id: typeIdColumn("userProfile", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("userProfile")),
  ownerId: typeIdColumn("user", "user_id").notNull(),
  currentStreakStartDate: timestamp("currentStreakStart"),
  currentStreakEndDate: timestamp("currentStreakEnd"),
  currentStreakDays: int("currentStreakDays"),
  longestStreakDays: int("longestStreakDays"),
  avatarImage: text("avatarImage"),
  goals: text("goals"),
  who: text("whoAreYou"),
  following: text("whoDoYouFollow"),
  currentActivities: text("whatDoYouAlreadyDo"),
  conditions: text("conditions"),
  customAiName: varchar("customAiName", { length: 32 }),
  onboardingCompleted: boolean("onboardingCompleted"),
});

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  owner: one(users, {
    fields: [userProfiles.ownerId],
    references: [users.id],
  }),
}));

// User-specific tags
export const userTags = mysqlTable("userTags", {
  id: typeIdColumn("userTag", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("userTag")),
  ownerId: typeIdColumn("user", "user_id").notNull(),
  name: varchar("name", { length: 64 }).notNull(),
  color: varchar("color", { length: 7 }),
  createdAt: timestamp("created_at").notNull(),
});

export const userTagsRelations = relations(userTags, ({ one }) => ({
  owner: one(users, {
    fields: [userTags.ownerId],
    references: [users.id],
  }),
}));
