import { relations } from "drizzle-orm";
import { json, mysqlTable, timestamp } from "drizzle-orm/mysql-core";

import { cloudTypeIdGenerator } from "@1up/utils/typeid";

import {
  integrationAccessModeColumn,
  integrationColumn,
} from "../columns/custom/integration";
import { typeIdColumn } from "../columns/custom/typeId";
import { timestamps } from "../columns/timestamps";
import { users } from "./auth";

// No need to import "./user" as we already have users imported from "./auth"

type IntegrationAccessData = Record<string, string>[];

export const integrations = mysqlTable("integrations", {
  id: typeIdColumn("integration", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("integration")),
  ownerId: typeIdColumn("user", "user_id").notNull(),
  type: integrationColumn("type"),
  accessMode: integrationAccessModeColumn("accessMode"),
  accessData: json("accessData")
    .$type<IntegrationAccessData>()
    .default([
      {
        accessToken: "",
        refreshToken: "",
        expiresAt: "",
        url: "",
      },
    ]),
  lastSync: timestamp("last_sync"),
  ...timestamps.createUpdate,
});

export const integrationsRelations = relations(integrations, ({ one }) => ({
  owner: one(users, {
    fields: [integrations.ownerId],
    references: [users.id],
  }),
}));
