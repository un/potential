import type { BetterAuthClientPlugin } from "better-auth";
import * as SecureStore from "expo-secure-store";
import { expoClient } from "@better-auth/expo/client";
import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { getApiUrl } from "./base-url";

const authUrl = getApiUrl();

export const authClient = createAuthClient({
  baseURL: authUrl,
  plugins: [
    emailOTPClient(),
    expoClient({
      scheme: "1up",
      storagePrefix: "1up",
      storage: SecureStore,
    }) as unknown as BetterAuthClientPlugin,
  ],
});
