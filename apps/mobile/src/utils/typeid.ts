import { customType } from "drizzle-orm/sqlite-core";
import { fromString, getType, toUUID, TypeID, typeid } from "typeid-js";
import { z } from "zod";

export const TYPE_ID_LENGTH = 26;

export const localIdTypesMapNameToPrefix = {
  // all keys below are prefixed with `l` to signify local data
  dataGroup: "l_dg",
  dataGroupUnit: "l_dgu",
  dataGroupMeasurement: "l_dgm",
  dataGroupTarget: "l_dgt",
} as const;

type LocalIdTypesMapNameToPrefix = typeof localIdTypesMapNameToPrefix;
type LocalIdTypesMapPrefixToName = {
  [K in keyof LocalIdTypesMapNameToPrefix as LocalIdTypesMapNameToPrefix[K]]: K;
};

const localIdTypesMapPrefixToName = Object.fromEntries(
  Object.entries(localIdTypesMapNameToPrefix).map(([x, y]) => [y, x]),
) as LocalIdTypesMapPrefixToName;

export type LocalIdTypePrefixNames = keyof typeof localIdTypesMapNameToPrefix;
export type LocalTypeId<T extends LocalIdTypePrefixNames> =
  `${LocalIdTypesMapNameToPrefix[T]}_${string}`;

export const LocalTypeIdValidator = <const T extends LocalIdTypePrefixNames>(
  prefix: T,
) =>
  z
    .string()
    .startsWith(`${localIdTypesMapNameToPrefix[prefix]}_`)
    .length(TYPE_ID_LENGTH + localIdTypesMapNameToPrefix[prefix].length + 1) // suffix length + prefix length + underscore
    .transform(
      (input) =>
        TypeID.fromString(input)
          .asType(localIdTypesMapNameToPrefix[prefix])
          .toString() as LocalTypeId<T>,
    );

export const localTypeIdGenerator = <const T extends LocalIdTypePrefixNames>(
  prefix: T,
) => typeid(localIdTypesMapNameToPrefix[prefix]).toString() as LocalTypeId<T>;

export const localTypeIdFromUUID = <const T extends LocalIdTypePrefixNames>(
  prefix: T,
  uuid: string,
) => TypeID.fromUUID(prefix, uuid).toString() as LocalTypeId<T>;

export const localTypeIdToUUID = <const T extends LocalIdTypePrefixNames>(
  input: LocalTypeId<T>,
) => {
  const id = fromString(input);
  return {
    uuid: toUUID(id).toString(),
    prefix: getType(id),
  };
};

export const validateLocalTypeId = <const T extends LocalIdTypePrefixNames>(
  prefix: T,
  data: unknown,
): data is LocalTypeId<T> =>
  LocalTypeIdValidator(prefix).safeParse(data).success;

export const inferLocalTypeId = <T extends keyof LocalIdTypesMapPrefixToName>(
  input: `${T}_${string}`,
) => localIdTypesMapPrefixToName[TypeID.fromString(input).getType() as T];

// Drizzle Data Type for SQLlite
export const localTypeIdDrizzleDataType = <
  const T extends LocalIdTypePrefixNames,
>(
  prefix: T,
  column: string,
) =>
  customType<{
    data: LocalTypeId<T>;
    notNull: true;
    driverData: string;
  }>({
    dataType: () => `text`,
    fromDriver: (input) =>
      TypeID.fromString(input).toString() as LocalTypeId<T>,
    toDriver: (input) => input.toString(),
  })(column);
