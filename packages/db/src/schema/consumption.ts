import type { CloudIdTypePrefixNames, CloudTypeId } from "@1up/utils/typeid";
import {
  cloudTypeIdFromUUIDBytes,
  cloudTypeIdGenerator,
  cloudTypeIdToUUIDBytes,
} from "@1up/utils/typeid";
import { UserRoles } from "@1up/utils/types/auth";
import {
  MINERALS_ARRAY,
  MINERALS_ARRAY_AS_ENUM,
  VITAMINS_ARRAY_AS_ENUM,
} from "@1up/utils/types/consumption";
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

// Ingredient library
export const ingredientLibrary = mysqlTable("ingredientLibrary", {
  id: typeIdColumn("ingredientLibrary", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("ingredientLibrary")),
  ownerId: typeIdColumn("user", "user_id")
    .notNull()
    .references(() => users.id),
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

// Nutritional data for ingredients
export const ingredientNutrition = mysqlTable("ingredientNutrition", {
  id: typeIdColumn("ingredientNutrition", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("ingredientNutrition")),
  ownerId: typeIdColumn("user", "user_id")
    .notNull()
    .references(() => users.id),
  ingredientLibraryId: typeIdColumn("ingredientLibrary", "ingredientLibraryId")
    .notNull()
    .references(() => ingredientLibrary.id),
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

// Vitamins in ingredients
export const ingredientVitamins = mysqlTable("ingredientVitamins", {
  id: typeIdColumn("ingredientVitamin", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("ingredientVitamin")),
  ownerId: typeIdColumn("user", "user_id")
    .notNull()
    .references(() => users.id),
  ingredientLibraryId: typeIdColumn("ingredientLibrary", "ingredientLibraryId")
    .notNull()
    .references(() => ingredientLibrary.id),
  type: mysqlEnum("type", [...VITAMINS_ARRAY_AS_ENUM]).notNull(),
  amount: int("amount").notNull(),
  unit: varchar("unit", { length: 32 }).notNull(),
  per100g: boolean("per100g").default(false),
  perServing: boolean("perServing").default(false),
});

// Minerals in ingredients
export const ingredientMinerals = mysqlTable("ingredientMinerals", {
  id: typeIdColumn("ingredientMineral", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("ingredientMineral")),
  ownerId: typeIdColumn("user", "user_id")
    .notNull()
    .references(() => users.id),
  ingredientLibraryId: typeIdColumn("ingredientLibrary", "ingredientLibraryId")
    .notNull()
    .references(() => ingredientLibrary.id),
  type: mysqlEnum("type", [...MINERALS_ARRAY_AS_ENUM]).notNull(),
  amount: int("amount").notNull(),
  unit: varchar("unit", { length: 32 }).notNull(),
  per100g: boolean("per100g").default(false),
  perServing: boolean("perServing").default(false),
});

// Consumable items (foods, drinks, supplement stacks, etc.)
export const consumableItems = mysqlTable("consumableItems", {
  id: typeIdColumn("consumableItem", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("consumableItem")),
  ownerId: typeIdColumn("user", "user_id")
    .notNull()
    .references(() => users.id),
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

// Link between consumable items and their ingredients
export const consumableItemIngredients = mysqlTable(
  "consumableItemIngredients",
  {
    id: typeIdColumn("consumableItemIngredient", "id")
      .primaryKey()
      .$default(() => cloudTypeIdGenerator("consumableItemIngredient")),
    ownerId: typeIdColumn("user", "user_id")
      .notNull()
      .references(() => users.id),
    consumableItemId: typeIdColumn("consumableItem", "consumableItemId")
      .notNull()
      .references(() => consumableItems.id),
    ingredientLibraryId: typeIdColumn(
      "ingredientLibrary",
      "ingredientLibraryId",
    )
      .notNull()
      .references(() => ingredientLibrary.id),
    quantity: int("quantity").notNull(),
    unit: varchar("unit", { length: 32 }).notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at").notNull(),
  },
);

// Optional direct nutritional overrides for consumable items
export const consumableItemNutrition = mysqlTable("consumableItemNutrition", {
  id: typeIdColumn("consumableItemNutrition", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("consumableItemNutrition")),
  ownerId: typeIdColumn("user", "user_id")
    .notNull()
    .references(() => users.id),
  consumableItemId: typeIdColumn("consumableItem", "consumableItemId")
    .notNull()
    .references(() => consumableItems.id),
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

// Optional direct vitamin overrides for consumable items
export const consumableItemVitamins = mysqlTable("consumableItemVitamins", {
  id: typeIdColumn("consumableItemVitamin", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("consumableItemVitamin")),
  ownerId: typeIdColumn("user", "user_id")
    .notNull()
    .references(() => users.id),
  consumableItemId: typeIdColumn("consumableItem", "consumableItemId")
    .notNull()
    .references(() => consumableItems.id),
  type: mysqlEnum("type", [...VITAMINS_ARRAY_AS_ENUM]).notNull(),
  amount: int("amount").notNull(),
  unit: varchar("unit", { length: 32 }).notNull(),
  per100g: boolean("per100g").default(false),
  perServing: boolean("perServing").default(false),
});

// Optional direct mineral overrides for consumable items
export const consumableItemMinerals = mysqlTable("consumableItemMinerals", {
  id: typeIdColumn("consumableItemMineral", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("consumableItemMineral")),
  ownerId: typeIdColumn("user", "user_id")
    .notNull()
    .references(() => users.id),
  consumableItemId: typeIdColumn("consumableItem", "consumableItemId")
    .notNull()
    .references(() => consumableItems.id),
  type: mysqlEnum("type", [...MINERALS_ARRAY_AS_ENUM]).notNull(),
  amount: int("amount").notNull(),
  unit: varchar("unit", { length: 32 }).notNull(),
  per100g: boolean("per100g").default(false),
  perServing: boolean("perServing").default(false),
});

// Consumption logs
export const consumptionLogs = mysqlTable("consumptionLogs", {
  id: typeIdColumn("consumptionLog", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("consumptionLog")),
  ownerId: typeIdColumn("user", "user_id")
    .notNull()
    .references(() => users.id),
  consumableItemId: typeIdColumn("consumableItem", "consumableItemId")
    .notNull()
    .references(() => consumableItems.id),
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

// Derived ingredient consumption (calculated from consumption logs)
export const consumptionLogIngredients = mysqlTable(
  "consumptionLogIngredients",
  {
    id: typeIdColumn("consumptionLogIngredient", "id")
      .primaryKey()
      .$default(() => cloudTypeIdGenerator("consumptionLogIngredient")),
    ownerId: typeIdColumn("user", "user_id")
      .notNull()
      .references(() => users.id),
    consumptionLogId: typeIdColumn("consumptionLog", "consumptionLogId")
      .notNull()
      .references(() => consumptionLogs.id),
    ingredientLibraryId: typeIdColumn(
      "ingredientLibrary",
      "ingredientLibraryId",
    )
      .notNull()
      .references(() => ingredientLibrary.id),
    amount: int("amount").notNull(),
    unit: varchar("unit", { length: 32 }).notNull(),
    createdAt: timestamp("created_at").notNull(),
  },
);

// Derived nutritional breakdown for each consumption log
export const consumptionLogNutrition = mysqlTable("consumptionLogNutrition", {
  id: typeIdColumn("consumptionLogNutrition", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("consumptionLogNutrition")),
  ownerId: typeIdColumn("user", "user_id")
    .notNull()
    .references(() => users.id),
  consumptionLogId: typeIdColumn("consumptionLog", "consumptionLogId")
    .notNull()
    .references(() => consumptionLogs.id),
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

// Derived vitamin breakdown for each consumption log
export const consumptionLogVitamins = mysqlTable("consumptionLogVitamins", {
  id: typeIdColumn("consumptionLogVitamin", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("consumptionLogVitamin")),
  ownerId: typeIdColumn("user", "user_id")
    .notNull()
    .references(() => users.id),
  consumptionLogId: typeIdColumn("consumptionLog", "consumptionLogId")
    .notNull()
    .references(() => consumptionLogs.id),
  type: mysqlEnum("type", [...VITAMINS_ARRAY_AS_ENUM]).notNull(),
  amount: int("amount").notNull(),
  unit: varchar("unit", { length: 32 }).notNull(),
  createdAt: timestamp("created_at").notNull(),
});

// Derived mineral breakdown for each consumption log
export const consumptionLogMinerals = mysqlTable("consumptionLogMinerals", {
  id: typeIdColumn("consumptionLogMineral", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("consumptionLogMineral")),
  ownerId: typeIdColumn("user", "user_id")
    .notNull()
    .references(() => users.id),
  consumptionLogId: typeIdColumn("consumptionLog", "consumptionLogId")
    .notNull()
    .references(() => consumptionLogs.id),
  type: mysqlEnum("type", [...MINERALS_ARRAY_AS_ENUM]).notNull(),
  amount: int("amount").notNull(),
  unit: varchar("unit", { length: 32 }).notNull(),
  createdAt: timestamp("created_at").notNull(),
});
