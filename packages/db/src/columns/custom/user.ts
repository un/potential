import type { SQL } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { customType } from "drizzle-orm/mysql-core";

import type { ConstsTypes } from "@1up/consts";
import { CONSTS } from "@1up/consts";

// Colors
export const genderAtBirthColumn = (columnName: string) =>
  customType<{
    data: ConstsTypes["USERS"]["GENDER_AT_BIRTH"]["KEY"];
    driverData: string;
  }>({
    dataType() {
      return "varchar(64)";
    },
    fromDriver(value: string): ConstsTypes["USERS"]["GENDER_AT_BIRTH"]["KEY"] {
      if (!(value in CONSTS.USERS.GENDER_AT_BIRTH)) {
        throw new Error(`Invalid gender at birth key: ${value}`);
      }
      return value as ConstsTypes["USERS"]["GENDER_AT_BIRTH"]["KEY"];
    },
    toDriver(
      value: ConstsTypes["USERS"]["GENDER_AT_BIRTH"]["KEY"],
    ): SQL<unknown> {
      return sql.raw(`'${value}'`);
    },
  })(columnName);
