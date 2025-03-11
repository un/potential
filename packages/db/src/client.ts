import { drizzle } from "drizzle-orm/planetscale-serverless";

import { schema } from "./schema";

export const db = drizzle({
  connection: {
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  },
  schema,
});
