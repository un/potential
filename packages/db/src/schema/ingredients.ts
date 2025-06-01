import { relations } from "drizzle-orm";
import { mysqlTable, text, varchar } from "drizzle-orm/mysql-core";

import { cloudTypeIdGenerator } from "@potential/utils/typeid";

import { typeIdColumn } from "../columns/custom/typeId";
import { timestamps } from "../columns/timestamps";
import { users } from "./auth";
import { trackerLogs } from "./trackers";

// Ingredient library
export const ingredients = mysqlTable("ingredients", {
  id: typeIdColumn("ingredientLibrary", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("ingredientLibrary")),
  ownerId: typeIdColumn("user", "user_id").notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  description: text("description"),
  ...timestamps.createUpdate,
});

export const ingredientsRelations = relations(ingredients, ({ one, many }) => ({
  owner: one(users, {
    fields: [ingredients.ownerId],
    references: [users.id],
  }),
  logs: many(ingredientLogs),
}));

export const ingredientLogs = mysqlTable("ingredientLogs", {
  id: typeIdColumn("ingredientLog", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("ingredientLog")),
  ingredientId: typeIdColumn("ingredientLibrary", "id").notNull(),
  logId: typeIdColumn("trackerLog", "id").notNull(),
  ownerId: typeIdColumn("user", "user_id").notNull(),
  ...timestamps.createUpdateLogged,
});

export const ingredientLogsRelations = relations(ingredientLogs, ({ one }) => ({
  ingredient: one(ingredients, {
    fields: [ingredientLogs.ingredientId],
    references: [ingredients.id],
  }),
  log: one(trackerLogs, {
    fields: [ingredientLogs.logId],
    references: [trackerLogs.id],
  }),
}));
