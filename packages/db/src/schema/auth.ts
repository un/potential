import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import { UserRoles } from "@1up/consts/auth";
import { cloudTypeIdGenerator } from "@1up/utils/typeid";

import { typeIdColumn } from "../customColumnTypes";

// Auth related tables
export const users = mysqlTable("users", {
  id: typeIdColumn("user", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("user")),
  username: varchar("username", { length: 32 }).notNull().unique(),
  displayUsername: varchar("display_username", { length: 32 }).notNull(),
  name: varchar("name", { length: 32 }).notNull(),
  email: varchar("email", { length: 32 }).notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  // role: text("role").notNull().default(UserRoles.USER),
  //! TODO: convert type enum to array as string
  role: mysqlEnum("role", [UserRoles.USER]).notNull().default(UserRoles.USER),
  banned: boolean("banned").notNull().default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires_at"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

// eslint-disable-next-line @1up/every-db-table-needs-ownerid-column
export const sessions = mysqlTable("sessions", {
  id: typeIdColumn("session", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("session")),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: varchar("ipAddress", { length: 255 }),
  userAgent: varchar("userAgent", { length: 255 }),
  token: varchar("token", { length: 255 }).notNull(),
  userId: typeIdColumn("user", "user_id")
    .notNull()
    .references(() => users.id),
  impersonatedBy: typeIdColumn("user", "impersonated_by").references(
    () => users.id,
  ),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

//! TODO: check betterauth docs for correct column lengths
export const accounts = mysqlTable("accounts", {
  id: typeIdColumn("account", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("account")),
  accountId: varchar("accountId", { length: 255 }).notNull(),
  providerId: varchar("providerId", { length: 255 }).notNull(),
  userId: typeIdColumn("user", "user_id")
    .notNull()
    .references(() => users.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

// eslint-disable-next-line @1up/every-db-table-needs-ownerid-column
export const verificationTokens = mysqlTable("verification_tokens", {
  id: typeIdColumn("verification", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("verification")),
  identifier: varchar("identifier", { length: 255 }).notNull(),
  value: varchar("value", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

// eslint-disable-next-line @1up/every-db-table-needs-ownerid-column
export const passkeys = mysqlTable("passkeys", {
  id: typeIdColumn("passkey", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("passkey")),
  name: text("name"),
  publicKey: text("public_key"),
  userId: typeIdColumn("user", "user_id")
    .notNull()
    .references(() => users.id),
  credentialID: text("credential_id"),
  counter: int("counter", { unsigned: true }),
  deviceType: text("device_type"),
  backedUp: boolean("backed_up"),
  transports: text("transports"),
  createdAt: timestamp("created_at"),
});
