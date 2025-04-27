import type { Config } from "drizzle-kit";
import { serverEnv } from "@potential/env";

if (!serverEnv.database.DB_MIGRATION_URL) {
  throw new Error("Missing DB_MIGRATION_URL");
}

export default {
  schema: "./src/schema/",
  dialect: "mysql",
  dbCredentials: { url: serverEnv.database.DB_MIGRATION_URL },
  casing: "snake_case",
} satisfies Config;
