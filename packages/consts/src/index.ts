import { UserRoles } from "./auth";
import { COLORS, ColorsKey, ColorsMap, getColorDisplayValue } from "./colors";
import {
  getIntegrationAccessModeDisplayValue,
  getIntegrationDisplayValue,
  INTEGRATION_ACCESS_MODE,
  IntegrationAccessModeKey,
  IntegrationAccessModeMap,
  INTEGRATIONS,
  IntegrationsKey,
  IntegrationsMap,
} from "./integrations";
import {
  getSubTypeDisplayValue,
  getTypeDisplayValue,
  TRACKABLE_SUB_TYPES,
  TRACKABLE_TYPES,
  TrackableSubTypesKey,
  TrackableSubTypesMap,
  TrackableTypesKey,
  TrackableTypesMap,
} from "./trackables";
import {
  GENDER_AT_BIRTH,
  GenderAtBirthKey,
  GenderAtBirthMap,
  getGenderAtBirthDisplayValue,
} from "./users";

export const CONSTS = {
  INTEGRATIONS: {
    TYPES: INTEGRATIONS,
    ACCESS_MODE: INTEGRATION_ACCESS_MODE,
    getDisplayValue: getIntegrationDisplayValue,
    getAccessModeDisplayValue: getIntegrationAccessModeDisplayValue,
  },
  TRACKABLE: {
    TYPES: TRACKABLE_TYPES,
    SUB_TYPES: TRACKABLE_SUB_TYPES,
    getTypeDisplayValue,
    getSubTypeDisplayValue,
  },
  COLORS: {
    TYPES: COLORS,
    getDisplayValue: getColorDisplayValue,
  },
  USERS: {
    GENDER_AT_BIRTH: GENDER_AT_BIRTH,
    getGenderAtBirthDisplayValue: getGenderAtBirthDisplayValue,
  },
} as const;

export type ConstsTypes = {
  AUTH: {
    ROLES: UserRoles;
  };
  INTEGRATIONS: {
    TYPES: {
      KEY: IntegrationsKey;
      VALUES: IntegrationsMap;
      DISPLAY_VALUE: (key: IntegrationsKey) => string;
    };
    ACCESS_MODE: {
      KEY: IntegrationAccessModeKey;
      VALUES: IntegrationAccessModeMap;
      DISPLAY_VALUE: (key: IntegrationAccessModeKey) => string;
    };
  };
  TRACKABLE: {
    TYPES: {
      KEY: TrackableTypesKey;
      VALUES: TrackableTypesMap;
      DISPLAY_VALUE: (key: TrackableTypesKey) => string;
    };
    SUB_TYPES: {
      KEY: TrackableSubTypesKey;
      VALUES: TrackableSubTypesMap;
      DISPLAY_VALUE: (key: TrackableSubTypesKey) => string;
    };
  };
  COLORS: {
    TYPES: {
      KEY: ColorsKey;
      VALUES: ColorsMap;
      DISPLAY_VALUE: (key: ColorsKey) => string;
    };
  };
  USERS: {
    GENDER_AT_BIRTH: {
      KEY: GenderAtBirthKey;
      VALUES: GenderAtBirthMap;
      DISPLAY_VALUE: (key: GenderAtBirthKey) => string;
    };
  };
};
