import type { SQL } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { customType } from "drizzle-orm/mysql-core";

import type { ConstsTypes } from "@1up/consts";
import { CONSTS } from "@1up/consts";

// Integrations

export const integrationColumn = (columnName: string) =>
  customType<{
    data: ConstsTypes["INTEGRATIONS"]["TYPES"]["KEY"];
    driverData: string;
  }>({
    dataType() {
      return "varchar(64)";
    },
    fromDriver(value: string): ConstsTypes["INTEGRATIONS"]["TYPES"]["KEY"] {
      if (!(value in CONSTS.INTEGRATIONS.TYPES)) {
        throw new Error(`Invalid integration type key: ${value}`);
      }
      return value as ConstsTypes["INTEGRATIONS"]["TYPES"]["KEY"];
    },
    toDriver(value: ConstsTypes["INTEGRATIONS"]["TYPES"]["KEY"]): SQL<unknown> {
      return sql.raw(`'${value}'`);
    },
  })(columnName);

// Integration Access Mode
export const integrationAccessModeColumn = (columnName: string) =>
  customType<{
    data: ConstsTypes["INTEGRATIONS"]["ACCESS_MODE"]["KEY"];
    driverData: string;
  }>({
    dataType() {
      return "varchar(64)";
    },
    fromDriver(
      value: string,
    ): ConstsTypes["INTEGRATIONS"]["ACCESS_MODE"]["KEY"] {
      if (!(value in CONSTS.INTEGRATIONS.ACCESS_MODE)) {
        throw new Error(`Invalid integration access mode key: ${value}`);
      }
      return value as ConstsTypes["INTEGRATIONS"]["ACCESS_MODE"]["KEY"];
    },
    toDriver(
      value: ConstsTypes["INTEGRATIONS"]["ACCESS_MODE"]["KEY"],
    ): SQL<unknown> {
      return sql.raw(`'${value}'`);
    },
  })(columnName);
