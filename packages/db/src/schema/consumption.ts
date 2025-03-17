import { relations } from "drizzle-orm";
import {
  boolean,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  tinyint,
  varchar,
} from "drizzle-orm/mysql-core";

import {
  MINERALS_ARRAY_AS_ENUM,
  VITAMINS_ARRAY_AS_ENUM,
} from "@1up/consts/consumption";
import { cloudTypeIdGenerator } from "@1up/utils/typeid";

import { typeIdColumn } from "../customColumnTypes";
import { users } from "./auth";

// Ingredient library
export const ingredientLibrary = mysqlTable("ingredientLibrary", {
  id: typeIdColumn("ingredientLibrary", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("ingredientLibrary")),
  ownerId: typeIdColumn("user", "user_id").notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  description: text("description"),
  type: mysqlEnum("type", [
    "BASIC",
    "SUPPLEMENT",
    "MEDICATION",
    "OTHER",
  ]).notNull(),
  defaultServingSize: int("defaultServingSize"),
  defaultServingUnit: varchar("defaultServingUnit", { length: 32 }),
  imageUrl: text("imageUrl"),
  isPublic: boolean("isPublic").default(false),
  isVerified: boolean("isVerified").default(false),
  alternativeNames: json("alternativeNames").$type<string[]>(),
  brand: varchar("brand", { length: 128 }),
  barcode: varchar("barcode", { length: 64 }),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const ingredientLibraryTableRelations = relations(
  ingredientLibrary,
  ({ many, one }) => ({
    owner: one(users, {
      fields: [ingredientLibrary.ownerId],
      references: [users.id],
    }),
    ingredientNutrition: many(ingredientNutrition),
    ingredientVitamins: many(ingredientVitamins),
    ingredientMinerals: many(ingredientMinerals),
  }),
);

// Nutritional data for ingredients
export const ingredientNutrition = mysqlTable("ingredientNutrition", {
  id: typeIdColumn("ingredientNutrition", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("ingredientNutrition")),
  ownerId: typeIdColumn("user", "user_id").notNull(),
  ingredientLibraryId: typeIdColumn(
    "ingredientLibrary",
    "ingredientLibraryId",
  ).notNull(),
  type: mysqlEnum("type", [
    "CALORIES",
    "PROTEIN",
    "CARBS",
    "FAT",
    "FIBER",
    "SUGAR",
    "CAFFEINE",
    "ALCOHOL",
    "WATER",
  ]).notNull(),
  amount: int("amount").notNull(),
  unit: varchar("unit", { length: 32 }).notNull(),
  per100g: boolean("per100g").default(false),
  perServing: boolean("perServing").default(false),
});

export const ingredientNutritionRelations = relations(
  ingredientNutrition,
  ({ one }) => ({
    owner: one(users, {
      fields: [ingredientNutrition.ownerId],
      references: [users.id],
    }),
    ingredientLibrary: one(ingredientLibrary, {
      fields: [ingredientNutrition.ingredientLibraryId],
      references: [ingredientLibrary.id],
    }),
  }),
);

// Vitamins in ingredients
export const ingredientVitamins = mysqlTable("ingredientVitamins", {
  id: typeIdColumn("ingredientVitamin", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("ingredientVitamin")),
  ownerId: typeIdColumn("user", "user_id").notNull(),
  ingredientLibraryId: typeIdColumn(
    "ingredientLibrary",
    "ingredientLibraryId",
  ).notNull(),
  type: mysqlEnum("type", [...VITAMINS_ARRAY_AS_ENUM]).notNull(),
  amount: int("amount").notNull(),
  unit: varchar("unit", { length: 32 }).notNull(),
  per100g: boolean("per100g").default(false),
  perServing: boolean("perServing").default(false),
});

export const ingredientVitaminsRelations = relations(
  ingredientVitamins,
  ({ one }) => ({
    owner: one(users, {
      fields: [ingredientVitamins.ownerId],
      references: [users.id],
    }),
    ingredientLibrary: one(ingredientLibrary, {
      fields: [ingredientVitamins.ingredientLibraryId],
      references: [ingredientLibrary.id],
    }),
  }),
);

// Minerals in ingredients
export const ingredientMinerals = mysqlTable("ingredientMinerals", {
  id: typeIdColumn("ingredientMineral", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("ingredientMineral")),
  ownerId: typeIdColumn("user", "user_id").notNull(),
  ingredientLibraryId: typeIdColumn(
    "ingredientLibrary",
    "ingredientLibraryId",
  ).notNull(),
  type: mysqlEnum("type", [...MINERALS_ARRAY_AS_ENUM]).notNull(),
  amount: int("amount").notNull(),
  unit: varchar("unit", { length: 32 }).notNull(),
  per100g: boolean("per100g").default(false),
  perServing: boolean("perServing").default(false),
});

export const ingredientMineralsRelations = relations(
  ingredientMinerals,
  ({ one }) => ({
    owner: one(users, {
      fields: [ingredientMinerals.ownerId],
      references: [users.id],
    }),
    ingredientLibrary: one(ingredientLibrary, {
      fields: [ingredientMinerals.ingredientLibraryId],
      references: [ingredientLibrary.id],
    }),
  }),
);

// Consumable items (foods, drinks, supplement stacks, etc.)
export const consumableItems = mysqlTable("consumableItems", {
  id: typeIdColumn("consumableItem", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("consumableItem")),
  ownerId: typeIdColumn("user", "user_id").notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  type: mysqlEnum("type", [
    "FOOD",
    "DRINK",
    "SUPPLEMENT_STACK",
    "MEDICATION",
    "OTHER",
  ]).notNull(),
  description: text("description"),
  defaultServingSize: int("defaultServingSize"),
  defaultServingUnit: varchar("defaultServingUnit", { length: 32 }),
  barcode: varchar("barcode", { length: 64 }),
  imageUrl: text("imageUrl"),
  isPublic: boolean("isPublic").default(false),
  isVerified: boolean("isVerified").default(false),
  alternativeNames: json("alternativeNames").$type<string[]>(),
  brand: varchar("brand", { length: 128 }),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const consumableItemsRelations = relations(
  consumableItems,
  ({ one }) => ({
    owner: one(users, {
      fields: [consumableItems.ownerId],
      references: [users.id],
    }),
  }),
);

// Link between consumable items and their ingredients
export const consumableItemIngredients = mysqlTable(
  "consumableItemIngredients",
  {
    id: typeIdColumn("consumableItemIngredient", "id")
      .primaryKey()
      .$default(() => cloudTypeIdGenerator("consumableItemIngredient")),
    ownerId: typeIdColumn("user", "user_id").notNull(),
    consumableItemId: typeIdColumn(
      "consumableItem",
      "consumableItemId",
    ).notNull(),
    ingredientLibraryId: typeIdColumn(
      "ingredientLibrary",
      "ingredientLibraryId",
    ).notNull(),
    quantity: int("quantity").notNull(),
    unit: varchar("unit", { length: 32 }).notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at").notNull(),
  },
);

export const consumableItemIngredientsRelations = relations(
  consumableItemIngredients,
  ({ one }) => ({
    owner: one(users, {
      fields: [consumableItemIngredients.ownerId],
      references: [users.id],
    }),
    consumableItem: one(consumableItems, {
      fields: [consumableItemIngredients.consumableItemId],
      references: [consumableItems.id],
    }),
    ingredientLibrary: one(ingredientLibrary, {
      fields: [consumableItemIngredients.ingredientLibraryId],
      references: [ingredientLibrary.id],
    }),
  }),
);

// Optional direct nutritional overrides for consumable items
export const consumableItemNutrition = mysqlTable("consumableItemNutrition", {
  id: typeIdColumn("consumableItemNutrition", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("consumableItemNutrition")),
  ownerId: typeIdColumn("user", "user_id").notNull(),
  consumableItemId: typeIdColumn(
    "consumableItem",
    "consumableItemId",
  ).notNull(),
  type: mysqlEnum("type", [
    "CALORIES",
    "PROTEIN",
    "CARBS",
    "FAT",
    "FIBER",
    "SUGAR",
    "CAFFEINE",
    "ALCOHOL",
    "WATER",
  ]).notNull(),
  amount: int("amount").notNull(),
  unit: varchar("unit", { length: 32 }).notNull(),
  per100g: boolean("per100g").default(false),
  perServing: boolean("perServing").default(false),
});

export const consumableItemNutritionRelations = relations(
  consumableItemNutrition,
  ({ one }) => ({
    owner: one(users, {
      fields: [consumableItemNutrition.ownerId],
      references: [users.id],
    }),
    consumableItem: one(consumableItems, {
      fields: [consumableItemNutrition.consumableItemId],
      references: [consumableItems.id],
    }),
  }),
);

// Optional direct vitamin overrides for consumable items
export const consumableItemVitamins = mysqlTable("consumableItemVitamins", {
  id: typeIdColumn("consumableItemVitamin", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("consumableItemVitamin")),
  ownerId: typeIdColumn("user", "user_id").notNull(),
  consumableItemId: typeIdColumn(
    "consumableItem",
    "consumableItemId",
  ).notNull(),
  type: mysqlEnum("type", [...VITAMINS_ARRAY_AS_ENUM]).notNull(),
  amount: int("amount").notNull(),
  unit: varchar("unit", { length: 32 }).notNull(),
  per100g: boolean("per100g").default(false),
  perServing: boolean("perServing").default(false),
});

export const consumableItemVitaminsRelations = relations(
  consumableItemVitamins,
  ({ one }) => ({
    owner: one(users, {
      fields: [consumableItemVitamins.ownerId],
      references: [users.id],
    }),
    consumableItem: one(consumableItems, {
      fields: [consumableItemVitamins.consumableItemId],
      references: [consumableItems.id],
    }),
  }),
);

// Optional direct mineral overrides for consumable items
export const consumableItemMinerals = mysqlTable("consumableItemMinerals", {
  id: typeIdColumn("consumableItemMineral", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("consumableItemMineral")),
  ownerId: typeIdColumn("user", "user_id").notNull(),
  consumableItemId: typeIdColumn(
    "consumableItem",
    "consumableItemId",
  ).notNull(),
  type: mysqlEnum("type", [...MINERALS_ARRAY_AS_ENUM]).notNull(),
  amount: int("amount").notNull(),
  unit: varchar("unit", { length: 32 }).notNull(),
  per100g: boolean("per100g").default(false),
  perServing: boolean("perServing").default(false),
});

export const consumableItemMineralsRelations = relations(
  consumableItemMinerals,
  ({ one }) => ({
    owner: one(users, {
      fields: [consumableItemMinerals.ownerId],
      references: [users.id],
    }),
    consumableItem: one(consumableItems, {
      fields: [consumableItemMinerals.consumableItemId],
      references: [consumableItems.id],
    }),
  }),
);
// Consumption logs
export const consumptionLogs = mysqlTable("consumptionLogs", {
  id: typeIdColumn("consumptionLog", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("consumptionLog")),
  ownerId: typeIdColumn("user", "user_id").notNull(),
  consumableItemId: typeIdColumn(
    "consumableItem",
    "consumableItemId",
  ).notNull(),
  quantity: int("quantity").notNull(),
  unit: varchar("unit", { length: 32 }).notNull(),
  notes: text("notes"),
  consumedAt: timestamp("consumed_at").notNull(),
  location: varchar("location", { length: 128 }),
  mood: tinyint("mood"),
  tags: json("tags").$type<string[]>(),
  imageUrl: text("imageUrl"),
  createdAt: timestamp("created_at").notNull(),
});

export const consumptionLogsRelations = relations(
  consumptionLogs,
  ({ one }) => ({
    owner: one(users, {
      fields: [consumptionLogs.ownerId],
      references: [users.id],
    }),
    consumableItem: one(consumableItems, {
      fields: [consumptionLogs.consumableItemId],
      references: [consumableItems.id],
    }),
  }),
);

// Derived ingredient consumption (calculated from consumption logs)
export const consumptionLogIngredients = mysqlTable(
  "consumptionLogIngredients",
  {
    id: typeIdColumn("consumptionLogIngredient", "id")
      .primaryKey()
      .$default(() => cloudTypeIdGenerator("consumptionLogIngredient")),
    ownerId: typeIdColumn("user", "user_id").notNull(),
    consumptionLogId: typeIdColumn(
      "consumptionLog",
      "consumptionLogId",
    ).notNull(),
    ingredientLibraryId: typeIdColumn(
      "ingredientLibrary",
      "ingrLibId",
    ).notNull(),
    amount: int("amount").notNull(),
    unit: varchar("unit", { length: 32 }).notNull(),
    createdAt: timestamp("created_at").notNull(),
  },
);

export const consumptionLogIngredientsRelations = relations(
  consumptionLogIngredients,
  ({ one }) => ({
    owner: one(users, {
      fields: [consumptionLogIngredients.ownerId],
      references: [users.id],
    }),
    consumptionLog: one(consumptionLogs, {
      fields: [consumptionLogIngredients.consumptionLogId],
      references: [consumptionLogs.id],
    }),
    ingredientLibrary: one(ingredientLibrary, {
      fields: [consumptionLogIngredients.ingredientLibraryId],
      references: [ingredientLibrary.id],
    }),
  }),
);

// Derived nutritional breakdown for each consumption log
export const consumptionLogNutrition = mysqlTable("consumptionLogNutrition", {
  id: typeIdColumn("consumptionLogNutrition", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("consumptionLogNutrition")),
  ownerId: typeIdColumn("user", "user_id").notNull(),
  consumptionLogId: typeIdColumn(
    "consumptionLog",
    "consumptionLogId",
  ).notNull(),
  type: mysqlEnum("type", [
    "CALORIES",
    "PROTEIN",
    "CARBS",
    "FAT",
    "FIBER",
    "SUGAR",
    "CAFFEINE",
    "ALCOHOL",
    "WATER",
  ]).notNull(),
  amount: int("amount").notNull(),
  unit: varchar("unit", { length: 32 }).notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export const consumptionLogNutritionRelations = relations(
  consumptionLogNutrition,
  ({ one }) => ({
    owner: one(users, {
      fields: [consumptionLogNutrition.ownerId],
      references: [users.id],
    }),
    consumptionLog: one(consumptionLogs, {
      fields: [consumptionLogNutrition.consumptionLogId],
      references: [consumptionLogs.id],
    }),
  }),
);

// Derived vitamin breakdown for each consumption log
export const consumptionLogVitamins = mysqlTable("consumptionLogVitamins", {
  id: typeIdColumn("consumptionLogVitamin", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("consumptionLogVitamin")),
  ownerId: typeIdColumn("user", "user_id").notNull(),
  consumptionLogId: typeIdColumn(
    "consumptionLog",
    "consumptionLogId",
  ).notNull(),
  type: mysqlEnum("type", [...VITAMINS_ARRAY_AS_ENUM]).notNull(),
  amount: int("amount").notNull(),
  unit: varchar("unit", { length: 32 }).notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export const consumptionLogVitaminsRelations = relations(
  consumptionLogVitamins,
  ({ one }) => ({
    owner: one(users, {
      fields: [consumptionLogVitamins.ownerId],
      references: [users.id],
    }),
    consumptionLog: one(consumptionLogs, {
      fields: [consumptionLogVitamins.consumptionLogId],
      references: [consumptionLogs.id],
    }),
  }),
);

// Derived mineral breakdown for each consumption log
export const consumptionLogMinerals = mysqlTable("consumptionLogMinerals", {
  id: typeIdColumn("consumptionLogMineral", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("consumptionLogMineral")),
  ownerId: typeIdColumn("user", "user_id").notNull(),
  consumptionLogId: typeIdColumn(
    "consumptionLog",
    "consumptionLogId",
  ).notNull(),
  type: mysqlEnum("type", [...MINERALS_ARRAY_AS_ENUM]).notNull(),
  amount: int("amount").notNull(),
  unit: varchar("unit", { length: 32 }).notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export const consumptionLogMineralsRelations = relations(
  consumptionLogMinerals,
  ({ one }) => ({
    owner: one(users, {
      fields: [consumptionLogMinerals.ownerId],
      references: [users.id],
    }),
    consumptionLog: one(consumptionLogs, {
      fields: [consumptionLogMinerals.consumptionLogId],
      references: [consumptionLogs.id],
    }),
  }),
);
