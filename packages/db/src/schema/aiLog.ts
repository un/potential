import { relations } from "drizzle-orm";
import { mysqlEnum, mysqlTable, text, varchar } from "drizzle-orm/mysql-core";

import { cloudTypeIdGenerator } from "@1up/utils/typeid";

import { typeIdColumn } from "../customColumnTypes";
import { users } from "./auth";
import { timestamps } from "./helpers";

export const aiInputLogs = mysqlTable("ai_input_logs", {
  id: typeIdColumn("aiInputLog", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("aiInputLog")),
  ownerId: typeIdColumn("user", "user_id").notNull(),
  inputType: mysqlEnum("inputType", ["text", "voice", "image"]).notNull(),
  text: text("text"),
  voiceBlob: text("voiceUrl"),
  imageBlob: text("imageUrl"),
  resultFriendlyText: text("resultFriendlyText").notNull(),
  resultTrackableId: varchar("resultTrackableId", { length: 64 }),
  ...timestamps.createUpdate,
});

export const aiInputLogsRelations = relations(aiInputLogs, ({ one }) => ({
  owner: one(users, {
    fields: [aiInputLogs.ownerId],
    references: [users.id],
  }),
}));
