import { relations } from "drizzle-orm";
import { json, mysqlEnum, mysqlTable, timestamp } from "drizzle-orm/mysql-core";

import type { IntegrationAccessData } from "@1up/consts/integrations";
import {
  INTEGRATION_ACCESS_MODE_FOR_MYSQL,
  INTEGRATIONS_ARRAY_FOR_MYSQL,
} from "@1up/consts/integrations";
import { cloudTypeIdGenerator } from "@1up/utils/typeid";

import { typeIdColumn } from "../customColumnTypes";
import { users } from "./auth";

import "./user";

export const integrations = mysqlTable("integrations", {
  id: typeIdColumn("integration", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("integration")),
  ownerId: typeIdColumn("user", "user_id").notNull(),
  type: mysqlEnum("type", INTEGRATIONS_ARRAY_FOR_MYSQL).notNull(),
  accessMode: mysqlEnum(
    "accessMode",
    INTEGRATION_ACCESS_MODE_FOR_MYSQL,
  ).notNull(),
  accessData: json("accessData").$type<IntegrationAccessData>().default({}),
  createdAt: timestamp("created_at").notNull(),
  lastSync: timestamp("last_sync"),
});

export const integrationsRelations = relations(integrations, ({ one }) => ({
  owner: one(users, {
    fields: [integrations.ownerId],
    references: [users.id],
  }),
}));
