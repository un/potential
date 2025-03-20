import { timestamp } from "drizzle-orm/mysql-core";

export const timestamps = {
  create: {
    createdAt: timestamp("createdAt").notNull().defaultNow(),
  },
  createUpdate: {
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow().onUpdateNow(),
  },
  createUpdateLogged: {
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow().onUpdateNow(),
    loggedAt: timestamp("loggedAt").notNull().defaultNow(),
  },
};
