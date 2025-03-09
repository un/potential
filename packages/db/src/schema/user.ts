import { cloudTypeIdGenerator } from "@1up/utils/typeid";
import {
  bigint,
  binary,
  boolean,
  customType,
  index,
  int,
  json,
  longtext,
  mediumint,
  mediumtext,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  tinyint,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

import { typeIdColumn } from "../customColumnTypes";
import { users } from "./auth";

export const userProfiles = mysqlTable("user_profiles", {
  id: typeIdColumn("userProfile", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("userProfile")),
  ownerId: typeIdColumn("user", "user_id")
    .notNull()
    .references(() => users.id),
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

// User-specific tags
export const userTags = mysqlTable("userTags", {
  id: typeIdColumn("userTag", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("userTag")),
  ownerId: typeIdColumn("user", "user_id")
    .notNull()
    .references(() => users.id),
  name: varchar("name", { length: 64 }).notNull(),
  color: varchar("color", { length: 7 }),
  createdAt: timestamp("created_at").notNull(),
});
