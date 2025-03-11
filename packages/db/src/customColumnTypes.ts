import type { CloudIdTypePrefixNames, CloudTypeId } from "@1up/utils/typeid";
import {
  cloudTypeIdFromUUIDBytes,
  cloudTypeIdToUUIDBytes,
} from "@1up/utils/typeid";
import { customType } from "drizzle-orm/mysql-core";

export const typeIdColumn = <const T extends CloudIdTypePrefixNames>(
  prefix: T,
  columnName: string,
) =>
  customType<{ data: CloudTypeId<T>; driverData: string }>({
    dataType() {
      return "binary";
    },
    fromDriver(input: string): CloudTypeId<T> {
      return cloudTypeIdFromUUIDBytes(prefix, Buffer.from(input));
    },
    toDriver(input: CloudTypeId<T>): string {
      return cloudTypeIdToUUIDBytes(input).uuid.toString();
    },
  })(columnName);
