import { defineConfig } from "drizzle-kit";

if (!process.env.DB_MIGRATION_URL) {
  throw new Error("Missing DB_MIGRATION_URL");
}

const url = new URL(
  `https://${process.env.DB_HOST}/${process.env.DB_DATABASE}`,
);
if (url.host.includes("localhost") || url.host.includes("127.0.0.1")) {
  url.protocol = "http";
}
url.password = process.env.DB_PASSWORD ?? "";
url.username = process.env.DB_USERNAME ?? "";
url.searchParams.set("rejectUnathorized", "true");

export default defineConfig({
  schema: "./src/schema/",
  dialect: "mysql",
  dbCredentials: {
    url: url.toString(),
  },
  casing: "snake_case",
});
