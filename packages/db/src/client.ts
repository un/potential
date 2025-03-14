import { Client } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import * as schema from "./schema";

const host = process.env.DB_HOST;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_DATABASE;

if (!host || !username || !password || !database) {
  throw new Error("Missing DB_HOST, DB_USERNAME, DB_PASSWORD, or DB_DATABASE");
}

const client = new Client({
  host,
  username,
  password,
});

export const db = drizzle({
  client,
  schema,
});
