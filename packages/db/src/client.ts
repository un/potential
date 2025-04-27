import { Client } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import { serverEnv } from "@potential/env";

import * as schema from "./schema";

const host = serverEnv.database.DB_HOST;
const username = serverEnv.database.DB_USERNAME;
const password = serverEnv.database.DB_PASSWORD;
const database = serverEnv.database.DB_DATABASE;

if (!host || !username || !password || !database) {
  throw new Error("Missing DB_HOST, DB_USERNAME, DB_PASSWORD, or DB_DATABASE");
}

const client = new Client({
  host,
  username,
  password,
  fetch: (url, init) => {
    if (init) {
      delete init.cache;
    }
    const u = new URL(url);
    // set protocol to http if localhost for CI testing
    if (u.host.includes("localhost") || u.host.includes("127.0.0.1")) {
      u.protocol = "http";
    }
    return fetch(u, init);
  },
});

export const db = drizzle({
  client,
  schema,
});
