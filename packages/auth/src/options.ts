import type { BetterAuthOptions } from "better-auth";
import type { ClientOptions } from "better-auth/types";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { passkeyClient, usernameClient } from "better-auth/client/plugins";
import { username } from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";

import { db } from "@1up/db";

export const authOptions: BetterAuthOptions = {
  baseURL: process.env.BASE_URL,
  database: drizzleAdapter(db, { provider: "mysql" }),
  user: { modelName: "users" },
  session: { modelName: "sessions" },
  account: { modelName: "accounts" },
  verification: { modelName: "verificationTokens" },
  emailAndPassword: { enabled: true },
  plugins: [
    username(),
    passkey({
      rpID: process.env.BASE_URL,
      rpName: "flow",
      origin: process.env.BASE_URL,
    }),
  ],
  advanced: { generateId: false },
};

export const authClientOptions: ClientOptions = {
  baseURL: process.env.BASE_URL,
  plugins: [usernameClient(), passkeyClient()],
};
