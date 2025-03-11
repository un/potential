import {
  boolean,
  json,
  mysqlEnum,
  mysqlTable,
  timestamp,
  tinyint,
  varchar,
} from "drizzle-orm/mysql-core";

import { INTEGRATIONS_ARRAY } from "@1up/consts/integrations";
import { cloudTypeIdGenerator } from "@1up/utils/typeid";

import { typeIdColumn } from "../customColumnTypes";
import { users } from "./auth";

export const sleepLogs = mysqlTable("sleepLogs", {
  id: typeIdColumn("sleepLog", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("sleepLog")),
  ownerId: typeIdColumn("user", "user_id")
    .notNull()
    .references(() => users.id),
  rawData: json("rawData"),
  source: mysqlEnum("type", [...INTEGRATIONS_ARRAY]).notNull(),
  sourceSessionId: varchar("sourceSessionId", { length: 128 }),
  totalDuration: tinyint("totalDuration"),
  timeBed: tinyint("timeBed"),
  timeAwake: tinyint("timeAwake"),
  timeLight: tinyint("timeLight"),
  timeRem: tinyint("timeRem"),
  timeDeep: tinyint("timeDeep"),
  disturbances: tinyint("disturbances"),
  quality: tinyint("quality"),
  score: tinyint("score"),
  isNap: boolean("isNap"),
  start: timestamp("start"),
  end: timestamp("end"),
  timezoneOffset: tinyint("timezoneOffset"),
  createdAt: timestamp("created_at").notNull(),
});
