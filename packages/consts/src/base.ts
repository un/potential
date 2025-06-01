import { UserRoles } from "./auth";
import {
  COLORS,
  colorsArray,
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
  getCustomConfigTypeDisplayValue,
  getSubTypeDisplayValue,
  getTypeDisplayValue,
  TRACKER_CUSTOM_CONFIG_TYPES,
  TRACKER_SUB_TYPES,
  TRACKER_TYPES,
  TrackerCustomConfigMeasureAggregationKey,
  TrackerCustomConfigMeasureAggregationMap,
  TrackerCustomConfigMeasureAggregationValues,
  TrackerCustomConfigMeasureCumulationKey,
  TrackerCustomConfigMeasureCumulationMap,
  TrackerCustomConfigMeasureCumulationValues,
  TrackerCustomConfigMeasureUnitsKey,
  TrackerCustomConfigMeasureUnitsMap,
  TrackerCustomConfigMeasureUnitsValues,
  trackerCustomConfigSchema,
  TrackerCustomConfigTypesKey,
  TrackerCustomConfigTypesMap,
  trackerCustomConfigTypesSchema,
  TrackerCustomConfigTypesSchema,
  TrackerCustomConfigTypesValues,
  TrackerSubTypesKey,
  TrackerSubTypesMap,
  trackerSubTypesSchema,
  TrackerSubTypesSchema,
  TrackerSubTypesValues,
  TrackerTypesKey,
  TrackerTypesMap,
  trackerTypesSchema,
  TrackerTypesSchema,
  TrackerTypesValues,
} from "./trackers";
import {
  GENDER_AT_BIRTH,
  GenderAtBirthKey,
  GenderAtBirthMap,
  GenderAtBirthSchema,
  genderAtBirthSchema,
  GenderAtBirthValues,
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
  TRACKER: {
    TYPES: TRACKER_TYPES,
    SUB_TYPES: TRACKER_SUB_TYPES,
    getTypeDisplayValue,
    getSubTypeDisplayValue,
    TYPES_SCHEMA: trackerTypesSchema,
    SUB_TYPES_SCHEMA: trackerSubTypesSchema,
    CONFIG: {
      TYPES: TRACKER_CUSTOM_CONFIG_TYPES,
      getCustomConfigTypeDisplayValue,
      TYPES_SCHEMA: trackerCustomConfigTypesSchema,
      CONFIG_SCHEMA: trackerCustomConfigSchema,
    },
  },
  COLORS: {
    TYPES: COLORS,
    getDisplayValue: getColorDisplayValue,
    SCHEMA: colorsSchema,
    ARRAY: colorsArray,
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
  TRACKER: {
    TYPES: {
      KEY: TrackerTypesKey;
      VALUES: TrackerTypesValues;
      MAP: TrackerTypesMap;
      DISPLAY_VALUE: (key: TrackerTypesKey) => string;
      SCHEMA: TrackerTypesSchema;
    };
    SUB_TYPES: {
      KEY: TrackerSubTypesKey;
      VALUES: TrackerSubTypesValues;
      MAP: TrackerSubTypesMap;
      DISPLAY_VALUE: (key: TrackerSubTypesKey) => string;
      SCHEMA: TrackerSubTypesSchema;
    };
    CONFIG: {
      TYPES: {
        KEY: TrackerCustomConfigTypesKey;
        VALUES: TrackerCustomConfigTypesValues;
        MAP: TrackerCustomConfigTypesMap;
        DISPLAY_VALUE: (key: TrackerCustomConfigTypesKey) => string;
        SCHEMA: TrackerCustomConfigTypesSchema;
      };

      UNITS: {
        MEASURE: {
          KEY: TrackerCustomConfigMeasureUnitsKey;
          VALUES: TrackerCustomConfigMeasureUnitsValues;
          MAP: TrackerCustomConfigMeasureUnitsMap;
          DISPLAY_VALUE: (key: TrackerCustomConfigMeasureUnitsKey) => string;
        };
        CUMULATION: {
          KEY: TrackerCustomConfigMeasureCumulationKey;
          VALUES: TrackerCustomConfigMeasureCumulationValues;
          MAP: TrackerCustomConfigMeasureCumulationMap;
          DISPLAY_VALUE: (
            key: TrackerCustomConfigMeasureCumulationKey,
          ) => string;
        };
        AGGREGATION: {
          KEY: TrackerCustomConfigMeasureAggregationKey;
          VALUES: TrackerCustomConfigMeasureAggregationValues;
          MAP: TrackerCustomConfigMeasureAggregationMap;
          DISPLAY_VALUE: (
            key: TrackerCustomConfigMeasureAggregationKey,
          ) => string;
        };
      };
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
