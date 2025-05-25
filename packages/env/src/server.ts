import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const shared = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production"]),
    VERCEL: z.string().optional(),
    BASE_URL: z.string().min(1),
    BACKEND_URL: z.string().min(1),
  },
  runtimeEnv: process.env,
});

const ai = createEnv({
  server: {
    OPENAI_API_KEY: z.string().min(1),
  },
  runtimeEnv: process.env,
});
const auth = createEnv({
  server: {
    AUTH_SECRET: z.string().min(1),
  },
  runtimeEnv: process.env,
});

const database = createEnv({
  server: {
    DB_HOST: z.string().min(1),
    DB_USERNAME: z.string().min(1),
    DB_PASSWORD: z.string().min(1),
    DB_DATABASE: z.string().min(1),
    DB_MIGRATION_URL: z.string().min(1),
  },
  runtimeEnv: process.env,
});

const email = createEnv({
  server: {
    RESEND_API_KEY: z.string().optional(),
  },
  runtimeEnv: process.env,
});

const storage = createEnv({
  server: {
    STORAGE_S3_BUCKET_UPLOADS: z.string().min(1),
    STORAGE_S3_BUCKET_AVATARS: z.string().min(1),
    STORAGE_S3_REGION: z.string().min(1),
    STORAGE_S3_ENDPOINT: z.string().optional(),
    STORAGE_S3_ACCESS_KEY_ID: z.string().min(1),
    STORAGE_S3_SECRET_ACCESS_KEY: z.string().min(1),
  },
  runtimeEnv: process.env,
});

export const serverEnv = {
  auth,
  ai,
  database,
  email,
  shared,
  storage,
};
