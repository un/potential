// packages/templates/src/upgrades.ts
import type { TrackerConfigWithMeta } from "./types";

// Define upgrade paths for templates
export const templateUpgradePaths: Record<
  string,
  Record<
    number,
    {
      toVersion: number;
      upgradeFn: (config: TrackerConfigWithMeta) => TrackerConfigWithMeta;
    }
  >
> = {
  "body-fat-percentage": {
    1: {
      toVersion: 2,
      upgradeFn: (config) => ({
        ...config,
        measureMin: 2,
        measureMax: 50,
        _meta: {
          ...config._meta,
          templateVersion: 2,
        },
      }),
    },
  },
  // Add other template upgrade paths here
};
