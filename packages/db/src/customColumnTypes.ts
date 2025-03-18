import type { SQL } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { customType } from "drizzle-orm/mysql-core";

import type { CloudIdTypePrefixNames, CloudTypeId } from "@1up/utils/typeid";
import {
  cloudTypeIdFromUUIDBytes,
  cloudTypeIdToUUIDBytes,
} from "@1up/utils/typeid";

function bytesToHex(bytes: Uint8Array): string {
  let hex = "";
  for (const byte of bytes) {
    hex += ("0" + (byte & 0xff).toString(16)).slice(-2);
  }
  return hex;
}

export const typeIdColumn = <const T extends CloudIdTypePrefixNames>(
  typeName: T,
  columnName: string,
) =>
  customType<{ data: CloudTypeId<T>; driverData: string }>({
    dataType() {
      return "binary(16)";
    },
    fromDriver(input: string): CloudTypeId<T> {
      const typedId = cloudTypeIdFromUUIDBytes(
        typeName,
        new Uint8Array(input as unknown as ArrayBuffer),
      );
      return typedId as CloudTypeId<T>;
    },
    toDriver(input: CloudTypeId<T>): SQL<unknown> {
      const buffer = new Uint8Array(cloudTypeIdToUUIDBytes(input).uuid);
      const hex = bytesToHex(buffer);
      return sql.raw(`x'${hex}'`);
    },
  })(columnName);
