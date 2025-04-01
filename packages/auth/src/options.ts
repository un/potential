import type { ClientOptions } from "better-auth/types";
import { type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
  emailOTPClient,
  passkeyClient,
  usernameClient,
} from "better-auth/client/plugins";
import { emailOTP, username } from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";

import { accounts, db, sessions, users, verificationTokens } from "@1up/db";
import { sendEmail } from "@1up/email";
import { serverEnv } from "@1up/env";

import { validateUsername } from "./validator";

export const authOptions: BetterAuthOptions = {
  secret: serverEnv.auth.AUTH_SECRET,
  baseURL: serverEnv.shared.BASE_URL,
  database: drizzleAdapter(db, {
    provider: "mysql",
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verificationTokens,
    },
  }),
  plugins: [
    username({
      minUsernameLength: 5,
      maxUsernameLength: 32,
      usernameValidator: (username) => {
        return validateUsername(username);
      },
    }),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        void (await sendEmail({
          to: email,
          type: "auth-otp",

          otpCode: otp,
        }));
      },
    }),
    passkey({
      rpID: serverEnv.shared.BASE_URL,
      rpName: "flow",
      origin: serverEnv.shared.BASE_URL,
    }),
  ],
  advanced: {
    generateId: false,
    useSecureCookies: true,
    crossSubDomainCookies: {
      enabled: true,
      additionalCookies: ["1up_session"],
    },
    cookies: {
      session_token: {
        name: "1up_session",
        attributes: {
          httpOnly: true,
          secure: true,
        },
      },
    },
  },
};

export const authClientOptions: ClientOptions = {
  baseURL: serverEnv.shared.BASE_URL,
  plugins: [usernameClient(), passkeyClient(), emailOTPClient()],
};
