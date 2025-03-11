export enum Integrations {
  "1up_AIR" = "1upAir",
  APPLE_HEALTH = "appleHealth",
  OURA = "oura",
  ULTRAHUMAN = "ultrahuman",
  WHOOP = "whoop",
}

export enum IntegrationAccessMode {
  LOCAL = "local",
  API = "api",
  WEBHOOK = "webhook",
  MANUAL = "manual",
}

export type IntegrationAccessData =
  | { token: string; refreshToken: string | null; expiry: Date }
  | Record<string, never>;

// Get values as array
//! NEVER DELETE FROM THIS ARRAY, ONLY ADD
export const INTEGRATIONS_ARRAY = [
  Integrations.OURA,
  Integrations.APPLE_HEALTH,
  Integrations["1up_AIR"],
  Integrations.ULTRAHUMAN,
  Integrations.WHOOP,
] as const;

export const INTEGRATIONS_ARRAY_FOR_MYSQL = Object.values(
  Integrations,
) as unknown as readonly [string, ...string[]];

export const INTEGRATION_ACCESS_MODE_ARRAY = [
  IntegrationAccessMode.LOCAL,
  IntegrationAccessMode.API,
  IntegrationAccessMode.WEBHOOK,
  IntegrationAccessMode.MANUAL,
] as const;

export const INTEGRATION_ACCESS_MODE_FOR_MYSQL = Object.values(
  IntegrationAccessMode,
) as unknown as readonly [string, ...string[]];
