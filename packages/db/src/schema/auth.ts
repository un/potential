import { relations } from "drizzle-orm";
import {
  boolean,
  int,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import { cloudTypeIdGenerator } from "@potential/utils";

import { typeIdColumn } from "../columns/custom/typeId";

// Auth related tables
export const users = mysqlTable("users", {
  id: typeIdColumn("user", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("user")),
  username: varchar("username", { length: 32 }).unique(),
  displayUsername: varchar("display_username", { length: 32 }),
  name: varchar("name", { length: 32 }),
  email: varchar("email", { length: 32 }).notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  banned: boolean("banned").notNull().default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires_at"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

// eslint-disable-next-line @potential/every-db-table-needs-ownerid-column
export const sessions = mysqlTable("sessions", {
  id: typeIdColumn("session", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("session")),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: varchar("ipAddress", { length: 255 }),
  userAgent: varchar("userAgent", { length: 255 }),
  token: varchar("token", { length: 255 }).notNull(),
  userId: typeIdColumn("user", "user_id").notNull(),
  impersonatedBy: typeIdColumn("user", "impersonated_by"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
  impersonator: one(users, {
    fields: [sessions.impersonatedBy],
    references: [users.id],
  }),
}));

//! TODO: check betterauth docs for correct column lengths
export const accounts = mysqlTable("accounts", {
  id: typeIdColumn("account", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("account")),
  accountId: varchar("accountId", { length: 255 }).notNull(),
  providerId: varchar("providerId", { length: 255 }).notNull(),
  userId: typeIdColumn("user", "user_id").notNull(),
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

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

// eslint-disable-next-line @potential/every-db-table-needs-ownerid-column
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

// eslint-disable-next-line @potential/every-db-table-needs-ownerid-column
export const passkeys = mysqlTable("passkeys", {
  id: typeIdColumn("passkey", "id")
    .primaryKey()
    .$default(() => cloudTypeIdGenerator("passkey")),
  name: text("name"),
  publicKey: text("public_key"),
  userId: typeIdColumn("user", "user_id").notNull(),
  credentialID: text("credential_id"),
  counter: int("counter", { unsigned: true }),
  deviceType: text("device_type"),
  backedUp: boolean("backed_up"),
  transports: text("transports"),
  createdAt: timestamp("created_at"),
});

export const passkeysRelations = relations(passkeys, ({ one }) => ({
  user: one(users, {
    fields: [passkeys.userId],
    references: [users.id],
  }),
}));
