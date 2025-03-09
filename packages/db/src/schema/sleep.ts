import { cloudTypeIdGenerator } from "@1up/utils/typeid";
import {
  INTEGRATION_ACCESS_MODE_ARRAY_AS_ENUM,
  IntegrationAccessData,
  INTEGRATIONS_ARRAY_AS_ENUM,
} from "@1up/utils/types/integrations";
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

export const sleepLogs = mysqlTable("sleepLogs", {
  id: typeIdColumn("sleepLog", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("sleepLog")),
  owner: typeIdColumn("user", "user_id")
    .notNull()
    .references(() => users.id),
  rawData: json("rawData"),
  source: mysqlEnum("type", [...INTEGRATIONS_ARRAY_AS_ENUM]).notNull(),
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
