export const INTEGRATIONS = {
  "1up_AIR": "1upAir",
  oura: "Oura Ring",
  ultrahuman: "Ultrahuman Ring",
  whoop: "Whoop Band",
} as const;

export type IntegrationsMap = typeof INTEGRATIONS;
export type IntegrationsKey = keyof IntegrationsMap;
export function getIntegrationDisplayValue(key: IntegrationsKey): string {
  return INTEGRATIONS[key];
}

export const INTEGRATION_ACCESS_MODE = {
  local: "Local Device",
  api: "API",
  webhook: "Webhook",
  manual: "Manual",
} as const;

export type IntegrationAccessModeMap = typeof INTEGRATION_ACCESS_MODE;
export type IntegrationAccessModeKey = keyof IntegrationAccessModeMap;
export function getIntegrationAccessModeDisplayValue(
  key: IntegrationAccessModeKey,
): string {
  return INTEGRATION_ACCESS_MODE[key];
}
