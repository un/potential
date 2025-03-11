import { db } from "@1up/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { passkeyClient, usernameClient } from "better-auth/client/plugins";
import { username } from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";
import { createAuthClient } from "better-auth/react";


export const auth = betterAuth({
  baseURL: process.env.WEB_BASE_URL,
  database: drizzleAdapter(db, { provider: "pg" }),
  user: { modelName: "users" },
  session: { modelName: "sessions" },
  account: { modelName: "accounts" },
  verification: { modelName: "verificationTokens" },
  emailAndPassword: { enabled: true },
  plugins: [
    username(),
    // admin({
    //   defaultRole: UserRoles.USER,
    //   adminRole: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN],
    //   impersonationSessionDuration: 60 * 60, // 1 hour
    //   defaultBanExpiresIn: 60 * 60 * 24 * 7 // 7 days
    // }),
    passkey({
      rpID: process.env.WEB_BASE_URL,
      rpName: "flow",
      origin: process.env.WEB_BASE_URL,
    }),
  ],
  advanced: { generateId: false },
});

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  plugins: [usernameClient(), passkeyClient()],
});
