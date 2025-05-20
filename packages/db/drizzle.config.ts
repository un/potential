import type { Config } from "drizzle-kit";

if (!process.env.DB_MIGRATION_URL) {
  throw new Error("Missing DB_MIGRATION_URL");
}

export default {
  schema: "./src/schema/",
  dialect: "mysql",
  dbCredentials: { url: process.env.DB_MIGRATION_URL },
  casing: "snake_case",
} satisfies Config;
