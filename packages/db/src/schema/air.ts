import {
  json,
  mysqlEnum,
  mysqlTable,
  timestamp,
  tinyint,
  varchar,
} from "drizzle-orm/mysql-core";

import { INTEGRATIONS_ARRAY_FOR_MYSQL } from "@1up/consts/integrations";
import { cloudTypeIdGenerator } from "@1up/utils/typeid";

import { typeIdColumn } from "../customColumnTypes";
import { users } from "./auth";

export const airReadings = mysqlTable("airReadings", {
  id: typeIdColumn("airReading", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("airReading")),
  ownerId: typeIdColumn("user", "user_id")
    .notNull()
    .references(() => users.id),
  rawData: json("rawData"),
  source: mysqlEnum("type", INTEGRATIONS_ARRAY_FOR_MYSQL).notNull(),
  sourceSessionId: varchar("sourceSessionId", { length: 128 }),
  readingTime: timestamp("created_at").notNull(),
  co2: tinyint("co2"),
  temperature: tinyint("temperature"),
  humidity: tinyint("humidity"),
  timezoneOffset: tinyint("timezoneOffset"),
  createdAt: timestamp("created_at").notNull(),
});
