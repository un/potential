import { expoClient } from "@better-auth/expo/client";
import type { BetterAuthClientPlugin } from "better-auth";
import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";

import { getApiUrl } from "./base-url";

const authUrl = getApiUrl();

export const authClient = createAuthClient({
  baseURL: authUrl + "/auth",

  plugins: [
    emailOTPClient(),
    expoClient({
      scheme: "potential",
      storagePrefix: "potential",
      storage: SecureStore,
    }) as unknown as BetterAuthClientPlugin,
  ],
});

export const doAuthLogout = async () => {
  await authClient.signOut();
  await SecureStore.deleteItemAsync("potential_cookie");
  await SecureStore.deleteItemAsync("potential_session_data");
  return;
};
