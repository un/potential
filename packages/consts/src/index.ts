import { UserRoles } from "./auth";
import {
  COLORS,
  ColorsKey,
  ColorsMap,
  ColorsSchema,
  colorsSchema,
  getColorDisplayValue,
} from "./colors";
import {
  getIntegrationAccessModeDisplayValue,
  getIntegrationDisplayValue,
  INTEGRATION_ACCESS_MODE,
  IntegrationAccessModeKey,
  IntegrationAccessModeMap,
  IntegrationAccessModeSchema,
  INTEGRATIONS,
  IntegrationsKey,
  IntegrationsMap,
  IntegrationsSchema,
  integrationsSchema,
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
  TrackableTypesKey,
  TrackableTypesMap,
  TrackableTypesSchema,
  trackableTypesSchema,
} from "./trackables";
import {
  GENDER_AT_BIRTH,
  GenderAtBirthKey,
  GenderAtBirthMap,
  GenderAtBirthSchema,
  genderAtBirthSchema,
  getGenderAtBirthDisplayValue,
} from "./users";

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
      VALUES: IntegrationsMap;
      DISPLAY_VALUE: (key: IntegrationsKey) => string;
      SCHEMA: IntegrationsSchema;
    };
    ACCESS_MODE: {
      KEY: IntegrationAccessModeKey;
      VALUES: IntegrationAccessModeMap;
      DISPLAY_VALUE: (key: IntegrationAccessModeKey) => string;
      SCHEMA: IntegrationAccessModeSchema;
    };
  };
  TRACKABLE: {
    TYPES: {
      KEY: TrackableTypesKey;
      VALUES: TrackableTypesMap;
      DISPLAY_VALUE: (key: TrackableTypesKey) => string;
      SCHEMA: TrackableTypesSchema;
    };
    SUB_TYPES: {
      KEY: TrackableSubTypesKey;
      VALUES: TrackableSubTypesMap;
      DISPLAY_VALUE: (key: TrackableSubTypesKey) => string;
      SCHEMA: TrackableSubTypesSchema;
    };
  };
  COLORS: {
    TYPES: {
      KEY: ColorsKey;
      VALUES: ColorsMap;
      DISPLAY_VALUE: (key: ColorsKey) => string;
      SCHEMA: ColorsSchema;
    };
  };
  USERS: {
    GENDER_AT_BIRTH: {
      KEY: GenderAtBirthKey;
      VALUES: GenderAtBirthMap;
      DISPLAY_VALUE: (key: GenderAtBirthKey) => string;
      SCHEMA: GenderAtBirthSchema;
    };
  };
};
