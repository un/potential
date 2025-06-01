import type { SQL } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { customType } from "drizzle-orm/mysql-core";

import type { ConstsTypes } from "@potential/consts";
import { CONSTS } from "@potential/consts";

// TrackerTypes
export const trackerTypeColumn = (columnName: string) =>
  customType<{
    data: ConstsTypes["TRACKER"]["TYPES"]["KEY"];
    driverData: string;
  }>({
    dataType() {
      return "varchar(64)";
    },
    fromDriver(value: string): ConstsTypes["TRACKER"]["TYPES"]["KEY"] {
      if (!(value in CONSTS.TRACKER.TYPES)) {
        throw new Error(`Invalid tracker type key: ${value}`);
      }
      return value as ConstsTypes["TRACKER"]["TYPES"]["KEY"];
    },
    toDriver(value: ConstsTypes["TRACKER"]["TYPES"]["KEY"]): SQL<unknown> {
      return sql.raw(`'${value}'`);
    },
  })(columnName);

export const trackerSubTypeColumn = (columnName: string) =>
  customType<{
    data: ConstsTypes["TRACKER"]["SUB_TYPES"]["KEY"];
    driverData: string;
  }>({
    dataType() {
      return "varchar(64)";
    },
    fromDriver(value: string): ConstsTypes["TRACKER"]["SUB_TYPES"]["KEY"] {
      if (!(value in CONSTS.TRACKER.SUB_TYPES)) {
        throw new Error(`Invalid tracker sub type key: ${value}`);
      }
      return value as ConstsTypes["TRACKER"]["SUB_TYPES"]["KEY"];
    },
    toDriver(value: ConstsTypes["TRACKER"]["SUB_TYPES"]["KEY"]): SQL<unknown> {
      return sql.raw(`'${value}'`);
    },
  })(columnName);

// Tracker Types
export const trackerTypeConfigColumn = (columnName: string) =>
  customType<{
    data: ConstsTypes["TRACKER"]["CONFIG"]["TYPES"]["KEY"];
    driverData: string;
  }>({
    dataType() {
      return "varchar(64)";
    },
    fromDriver(
      value: string,
    ): ConstsTypes["TRACKER"]["CONFIG"]["TYPES"]["KEY"] {
      if (!(value in CONSTS.TRACKER.CONFIG.TYPES)) {
        throw new Error(`Invalid tracker config type key: ${value}`);
      }
      return value as ConstsTypes["TRACKER"]["CONFIG"]["TYPES"]["KEY"];
    },
    toDriver(
      value: ConstsTypes["TRACKER"]["CONFIG"]["TYPES"]["KEY"],
    ): SQL<unknown> {
      return sql.raw(`'${value}'`);
    },
  })(columnName);
