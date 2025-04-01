import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const shared = createEnv({
  clientPrefix: "PUBLIC_",
  client: {
    PUBLIC_BACKEND_URL: z.string().min(1),
  },
  runtimeEnv: process.env,
});

export const expo = createEnv({
  clientPrefix: "EXPO_PUBLIC_",
  client: {
    EXPO_PUBLIC_BACKEND_URL: z.string().min(1),
  },
  runtimeEnv: process.env,
});

export const web = createEnv({
  clientPrefix: "NEXT_PUBLIC_",
  client: {
    NEXT_PUBLIC_URL: z.string().min(1),
  },
  runtimeEnv: process.env,
});

export const clientEnv = {
  expo,
  shared,
  web,
};
