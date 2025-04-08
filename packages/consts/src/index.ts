import { UserRoles } from "./auth";
import {
  COLORS,
  ColorsKey,
  ColorsMap,
  ColorsSchema,
  colorsSchema,
  ColorsValues,
  getColorDisplayValue,
} from "./colors";
import {
  getIntegrationAccessModeDisplayValue,
  getIntegrationDisplayValue,
  INTEGRATION_ACCESS_MODE,
  IntegrationAccessModeKey,
  IntegrationAccessModeMap,
  IntegrationAccessModeSchema,
  IntegrationAccessModeValues,
  INTEGRATIONS,
  IntegrationsKey,
  IntegrationsMap,
  IntegrationsSchema,
  integrationsSchema,
  IntegrationsValues,
} from "./integrations";
import {
  getSubTypeDisplayValue,
  getTypeDisplayValue,
  TRACKABLE_SUB_TYPES,
  TRACKABLE_TYPES,
  TrackableSubTypesKey,
  TrackableSubTypesMap,
  trackableSubTypesSchema,
  TrackableSubTypesSchema,
  TrackableSubTypesValues,
  TrackableTypesKey,
  TrackableTypesMap,
  TrackableTypesSchema,
  trackableTypesSchema,
  TrackableTypesValues,
} from "./trackables";
import {
  GENDER_AT_BIRTH,
  GenderAtBirthKey,
  GenderAtBirthMap,
  GenderAtBirthSchema,
  genderAtBirthSchema,
  GenderAtBirthValues,
  getGenderAtBirthDisplayValue,
} from "./users";

export type { TrackableCustomConfig } from "./trackables";

export const CONSTS = {
  INTEGRATIONS: {
    TYPES: INTEGRATIONS,
    ACCESS_MODE: INTEGRATION_ACCESS_MODE,
    getDisplayValue: getIntegrationDisplayValue,
    getAccessModeDisplayValue: getIntegrationAccessModeDisplayValue,
    SCHEMA: integrationsSchema,
  },
  TRACKABLE: {
    TYPES: TRACKABLE_TYPES,
    SUB_TYPES: TRACKABLE_SUB_TYPES,
    getTypeDisplayValue,
    getSubTypeDisplayValue,
    TYPES_SCHEMA: trackableTypesSchema,
    SUB_TYPES_SCHEMA: trackableSubTypesSchema,
  },
  COLORS: {
    TYPES: COLORS,
    getDisplayValue: getColorDisplayValue,
    SCHEMA: colorsSchema,
  },
  USERS: {
    GENDER_AT_BIRTH: GENDER_AT_BIRTH,
    getGenderAtBirthDisplayValue: getGenderAtBirthDisplayValue,
    SCHEMA: genderAtBirthSchema,
  },
};

export type ConstsTypes = {
  AUTH: {
    ROLES: UserRoles;
  };
  INTEGRATIONS: {
    TYPES: {
      KEY: IntegrationsKey;
      VALUES: IntegrationsValues;
      MAP: IntegrationsMap;
      DISPLAY_VALUE: (key: IntegrationsKey) => string;
      SCHEMA: IntegrationsSchema;
    };
    ACCESS_MODE: {
      KEY: IntegrationAccessModeKey;
      VALUES: IntegrationAccessModeValues;
      MAP: IntegrationAccessModeMap;
      DISPLAY_VALUE: (key: IntegrationAccessModeKey) => string;
      SCHEMA: IntegrationAccessModeSchema;
    };
  };
  TRACKABLE: {
    TYPES: {
      KEY: TrackableTypesKey;
      VALUES: TrackableTypesValues;
      MAP: TrackableTypesMap;
      DISPLAY_VALUE: (key: TrackableTypesKey) => string;
      SCHEMA: TrackableTypesSchema;
    };
    SUB_TYPES: {
      KEY: TrackableSubTypesKey;
      VALUES: TrackableSubTypesValues;
      MAP: TrackableSubTypesMap;
      DISPLAY_VALUE: (key: TrackableSubTypesKey) => string;
      SCHEMA: TrackableSubTypesSchema;
    };
  };
  COLORS: {
    TYPES: {
      KEY: ColorsKey;
      VALUES: ColorsValues;
      MAP: ColorsMap;
      DISPLAY_VALUE: (key: ColorsKey) => string;
      SCHEMA: ColorsSchema;
    };
  };
  USERS: {
    GENDER_AT_BIRTH: {
      KEY: GenderAtBirthKey;
      VALUES: GenderAtBirthValues;
      MAP: GenderAtBirthMap;
      DISPLAY_VALUE: (key: GenderAtBirthKey) => string;
      SCHEMA: GenderAtBirthSchema;
    };
  };
};
