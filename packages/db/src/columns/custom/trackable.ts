import type { ConstsTypes } from "@potential/consts";
import type { SQL } from "drizzle-orm";
import { CONSTS } from "@potential/consts";
import { sql } from "drizzle-orm";
import { customType } from "drizzle-orm/mysql-core";

// Trackable Types
export const trackableTypeColumn = (columnName: string) =>
  customType<{
    data: ConstsTypes["TRACKABLE"]["TYPES"]["KEY"];
    driverData: string;
  }>({
    dataType() {
      return "varchar(64)";
    },
    fromDriver(value: string): ConstsTypes["TRACKABLE"]["TYPES"]["KEY"] {
      if (!(value in CONSTS.TRACKABLE.TYPES)) {
        throw new Error(`Invalid trackable type key: ${value}`);
      }
      return value as ConstsTypes["TRACKABLE"]["TYPES"]["KEY"];
    },
    toDriver(value: ConstsTypes["TRACKABLE"]["TYPES"]["KEY"]): SQL<unknown> {
      return sql.raw(`'${value}'`);
    },
  })(columnName);

export const trackableSubTypeColumn = (columnName: string) =>
  customType<{
    data: ConstsTypes["TRACKABLE"]["SUB_TYPES"]["KEY"];
    driverData: string;
  }>({
    dataType() {
      return "varchar(64)";
    },
    fromDriver(value: string): ConstsTypes["TRACKABLE"]["SUB_TYPES"]["KEY"] {
      if (!(value in CONSTS.TRACKABLE.SUB_TYPES)) {
        throw new Error(`Invalid trackable sub type key: ${value}`);
      }
      return value as ConstsTypes["TRACKABLE"]["SUB_TYPES"]["KEY"];
    },
    toDriver(
      value: ConstsTypes["TRACKABLE"]["SUB_TYPES"]["KEY"],
    ): SQL<unknown> {
      return sql.raw(`'${value}'`);
    },
  })(columnName);

// Trackable Types
export const trackableTypeConfigColumn = (columnName: string) =>
  customType<{
    data: ConstsTypes["TRACKABLE"]["CONFIG"]["TYPES"]["KEY"];
    driverData: string;
  }>({
    dataType() {
      return "varchar(64)";
    },
    fromDriver(
      value: string,
    ): ConstsTypes["TRACKABLE"]["CONFIG"]["TYPES"]["KEY"] {
      if (!(value in CONSTS.TRACKABLE.CONFIG.TYPES)) {
        throw new Error(`Invalid trackable config type key: ${value}`);
      }
      return value as ConstsTypes["TRACKABLE"]["CONFIG"]["TYPES"]["KEY"];
    },
    toDriver(
      value: ConstsTypes["TRACKABLE"]["CONFIG"]["TYPES"]["KEY"],
    ): SQL<unknown> {
      return sql.raw(`'${value}'`);
    },
  })(columnName);
