import type { SQL } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { customType } from "drizzle-orm/mysql-core";

import type { ConstsTypes } from "@potential/consts";
import { CONSTS } from "@potential/consts";

// Colors
export const colorsColumn = (columnName: string) =>
  customType<{
    data: ConstsTypes["COLORS"]["TYPES"]["KEY"];
    driverData: string;
  }>({
    dataType() {
      return "varchar(64)";
    },
    fromDriver(value: string): ConstsTypes["COLORS"]["TYPES"]["KEY"] {
      if (!(value in CONSTS.COLORS.TYPES)) {
        throw new Error(`Invalid color key: ${value}`);
      }
      return value as ConstsTypes["COLORS"]["TYPES"]["KEY"];
    },
    toDriver(value: ConstsTypes["COLORS"]["TYPES"]["KEY"]): SQL<unknown> {
      return sql.raw(`'${value}'`);
    },
  })(columnName);
