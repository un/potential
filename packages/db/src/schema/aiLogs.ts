import { relations } from "drizzle-orm";
import { json, mysqlEnum, mysqlTable, text } from "drizzle-orm/mysql-core";

import type { CloudTypeId } from "@potential/utils/typeid";
import { cloudTypeIdGenerator } from "@potential/utils/typeid";

import { typeIdColumn } from "../columns/custom/typeId";
import { timestamps } from "../columns/timestamps";
import { users } from "./auth";
import { trackerLogs } from "./trackers";

export const aiInputLogs = mysqlTable("ai_input_logs", {
  id: typeIdColumn("aiInputLog", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("aiInputLog")),
  ownerId: typeIdColumn("user", "user_id").notNull(),
  inputType: mysqlEnum("inputType", ["text", "voice", "image"]).notNull(),
  text: text("text"),
  voiceBlob: json("imageIds").$type<CloudTypeId<"userUpload">[]>(),
  imageIds: json("imageIds").$type<CloudTypeId<"userUpload">[]>(),
  resultAiLog: text("resultAiLog"),
  resultFriendlyText: text("resultFriendlyText"),
  resultLogId: typeIdColumn("trackerLog", "trackerLogId"),
  ...timestamps.createUpdateLogged,
});

export const aiInputLogsRelations = relations(aiInputLogs, ({ one }) => ({
  owner: one(users, {
    fields: [aiInputLogs.ownerId],
    references: [users.id],
  }),
  resultLog: one(trackerLogs, {
    fields: [aiInputLogs.resultLogId],
    references: [trackerLogs.id],
  }),
}));
