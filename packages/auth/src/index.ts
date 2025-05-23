import type { ClientOptions } from "better-auth/types";
import { type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
  emailOTPClient,
  passkeyClient,
  usernameClient,
} from "better-auth/client/plugins";
import { emailOTP, username } from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";

import {
  accounts,
  db,
  sessions,
  users,
  verificationTokens,
} from "@potential/db";
import { sendEmail } from "@potential/email";
import { serverEnv } from "@potential/env";
import { usernameSchema } from "@potential/validators";

export type { Session, User } from "better-auth";

// This file was initially generated by The-Big-Username-Blocklist VERSION=v2.0.1 (at 2021-02-13 10:53:03.852225) - https://github.com/marteinn/The-Big-Username-Blocklist
export const blockedUsernames = [
  "!",
  "#",
  "$",
  "%",
  "&",
  "(",
  ")",
  "*",
  "+",
  "-",
  ".",
  ".git",
  ".htaccess",
  ".htpasswd",
  ".well-known",
  "/",
  "400",
  "401",
  "403",
  "404",
  "405",
  "406",
  "407",
  "408",
  "409",
  "410",
  "411",
  "412",
  "413",
  "414",
  "415",
  "416",
  "417",
  "421",
  "422",
  "423",
  "424",
  "426",
  "428",
  "429",
  "431",
  "500",
  "501",
  "502",
  "503",
  "504",
  "505",
  "506",
  "507",
  "508",
  "509",
  "510",
  "511",
  "<",
  "=",
  ">",
  "?",
  "@",
  "[",
  "]",
  "^",
  "_",
  "_domainkey",
  "`",
  "about",
  "about-us",
  "abuse",
  "access",
  "account",
  "accounting",
  "accounts",
  "ad",
  "add",
  "admin",
  "administration",
  "administrator",
  "administrators",
  "ads",
  "advertise",
  "advertising",
  "affiliate",
  "affiliates",
  "ajax",
  "alert",
  "alerts",
  "alpha",
  "amp",
  "analytics",
  "anonymous",
  "api",
  "app",
  "app-ads.txt",
  "apps",
  "asc",
  "assets",
  "atom",
  "auth",
  "authentication",
  "authorize",
  "autoconfig",
  "autodiscover",
  "avatar",
  "backup",
  "banner",
  "banners",
  "bbs",
  "beta",
  "billing",
  "billings",
  "blog",
  "blogs",
  "board",
  "bookmark",
  "bookmarks",
  "bot",
  "broadcasthost",
  "business",
  "buy",
  "cache",
  "calendar",
  "campaign",
  "captcha",
  "careers",
  "cart",
  "cas",
  "categories",
  "category",
  "cdn",
  "ceo",
  "cfo",
  "cgi",
  "cgi-bin",
  "change",
  "channel",
  "channels",
  "chart",
  "chat",
  "checkout",
  "clear",
  "client",
  "close",
  "cloud",
  "cmo",
  "cms",
  "com",
  "comment",
  "comments",
  "community",
  "company",
  "compare",
  "compose",
  "config",
  "connect",
  "contact",
  "contest",
  "coo",
  "cookies",
  "copy",
  "copyright",
  "corp",
  "corporation",
  "count",
  "cp",
  "cpanel",
  "create",
  "creator",
  "crossdomain.xml",
  "css",
  "cto",
  "customer",
  "customers",
  "customize",
  "dashboard",
  "db",
  "deals",
  "debug",
  "default",
  "delete",
  "department",
  "departments",
  "desc",
  "design",
  "designs",
  "destroy",
  "dev",
  "developer",
  "developers",
  "director",
  "disconnect",
  "discuss",
  "discord",
  "dns",
  "docs",
  "documentation",
  "domain",
  "domainname",
  "domains",
  "download",
  "downloads",
  "downvote",
  "draft",
  "edit",
  "editor",
  "email",
  "enterprise",
  "error",
  "errors",
  "event",
  "events",
  "example",
  "exception",
  "exit",
  "experience",
  "explore",
  "export",
  "extensions",
  "false",
  "family",
  "faq",
  "faqs",
  "features",
  "feed",
  "feedback",
  "feeds",
  "file",
  "files",
  "filter",
  "finance",
  "follow",
  "follower",
  "followers",
  "following",
  "fonts",
  "forgot",
  "forgot-password",
  "forgotpassword",
  "form",
  "forms",
  "forum",
  "forums",
  "founder",
  "founders",
  "friend",
  "friends",
  "ftp",
  "get",
  "git",
  "go",
  "graphql",
  "group",
  "groups",
  "guest",
  "guidelines",
  "guides",
  "head",
  "header",
  "help",
  "hide",
  "hmac-sha",
  "hmac-sha1",
  "hmac-sha1-etm",
  "hmac-sha2-256",
  "hmac-sha2-256-etm",
  "hmac-sha2-512",
  "hmac-sha2-512-etm",
  "home",
  "host",
  "hosting",
  "hostmaster",
  "hr",
  "htpasswd",
  "http",
  "httpd",
  "https",
  "human-resources",
  "human_resources",
  "humanresources",
  "humans.txt",
  "icons",
  "images",
  "imap",
  "img",
  "import",
  "index",
  "info",
  "insert",
  "internal",
  "investigation",
  "investigations",
  "investor",
  "investors",
  "invitations",
  "invite",
  "invites",
  "invoice",
  "is",
  "isatap",
  "issues",
  "it",
  "jobs",
  "join",
  "js",
  "json",
  "keybase.txt",
  "learn",
  "legal",
  "license",
  "licensing",
  "like",
  "limit",
  "live",
  "load",
  "local",
  "localdomain",
  "localhost",
  "lock",
  "login",
  "logout",
  "lost-password",
  "m",
  "mail",
  "mail0",
  "mail1",
  "mail2",
  "mail3",
  "mail4",
  "mail5",
  "mail6",
  "mail7",
  "mail8",
  "mail9",
  "mailer-daemon",
  "mailerdaemon",
  "manager",
  "map",
  "marketing",
  "marketplace",
  "master",
  "me",
  "media",
  "member",
  "members",
  "message",
  "messages",
  "metrics",
  "mis",
  "mobile",
  "moderator",
  "moderators",
  "modify",
  "more",
  "mx",
  "mx1",
  "my",
  "net",
  "network",
  "new",
  "news",
  "newsletter",
  "newsletters",
  "next",
  "nigga",
  "nigger",
  "nil",
  "no-reply",
  "nobody",
  "noc",
  "none",
  "noreply",
  "notification",
  "notifications",
  "ns",
  "ns0",
  "ns1",
  "ns2",
  "ns3",
  "ns4",
  "ns5",
  "ns6",
  "ns7",
  "ns8",
  "ns9",
  "null",
  "oauth",
  "oauth2",
  "offer",
  "offers",
  "official",
  "online",
  "open",
  "openid",
  "opensource",
  "open-source",
  "operation",
  "operations",
  "order",
  "orders",
  "overview",
  "owa",
  "owner",
  "owners",
  "page",
  "pages",
  "partners",
  "passkey",
  "passkeys",
  "passwd",
  "password",
  "pay",
  "payment",
  "payments",
  "paypal",
  "photo",
  "photos",
  "pixel",
  "plans",
  "plugins",
  "policies",
  "policy",
  "pop",
  "pop3",
  "popular",
  "portal",
  "portfolio",
  "post",
  "postfix",
  "postmaster",
  "poweruser",
  "pr",
  "preferences",
  "premium",
  "president",
  "press",
  "previous",
  "pricing",
  "print",
  "privacy",
  "privacy-policy",
  "private",
  "prod",
  "product",
  "production",
  "production",
  "profile",
  "profiles",
  "project",
  "projects",
  "promo",
  "public",
  "public-relations",
  "public_relations",
  "publicrelations",
  "purchase",
  "put",
  "quota",
  "rebortbot",
  "recovery",
  "redirect",
  "reduce",
  "refund",
  "refunds",
  "register",
  "registration",
  "remove",
  "replies",
  "reply",
  "report",
  "report-bot",
  "report_bot",
  "request",
  "request-password",
  "reset",
  "reset-password",
  "response",
  "retard",
  "return",
  "returns",
  "review",
  "reviews",
  "robots.txt",
  "root",
  "rootuser",
  "rsa-sha2-2",
  "rsa-sha2-512",
  "rss",
  "rules",
  "sales",
  "save",
  "script",
  "sdk",
  "search",
  "secure",
  "security",
  "select",
  "services",
  "session",
  "sessions",
  "settings",
  "setup",
  "sftp",
  "share",
  "shift",
  "shop",
  "signin",
  "signup",
  "site",
  "sitemap",
  "sites",
  "smtp",
  "sort",
  "source",
  "spam",
  "sql",
  "ssh",
  "ssh-rsa",
  "ssl",
  "ssladmin",
  "ssladministrator",
  "sslwebmaster",
  "staff",
  "stage",
  "staging",
  "stat",
  "static",
  "statistics",
  "stats",
  "status",
  "store",
  "style",
  "styles",
  "stylesheet",
  "stylesheets",
  "subdomain",
  "subscribe",
  "sudo",
  "super",
  "superuser",
  "supervisor",
  "support",
  "support-bot",
  "support_bot",
  "supportbot",
  "survey",
  "sync",
  "sysadmin",
  "system",
  "tablet",
  "tag",
  "tags",
  "team",
  "teams",
  "telnet",
  "terms",
  "terms-of-use",
  "test",
  "testimonials",
  "theme",
  "themes",
  "ticket",
  "ticket-bot",
  "ticket-support",
  "ticket_bot",
  "ticketbot",
  "today",
  "tools",
  "topic",
  "topics",
  "tour",
  "train",
  "training",
  "translate",
  "translations",
  "trending",
  "trial",
  "true",
  "u22n",
  "umac-128",
  "umac-128-etm",
  "umac-64",
  "umac-64-etm",
  "un",
  "unboarding",
  "undefined",
  "unfollow",
  "uninbox",
  "unlike",
  "unproprietary",
  "unproprietarycorporation",
  "unsubscribe",
  "update",
  "upgrade",
  "usenet",
  "user",
  "username",
  "users",
  "uucp",
  "var",
  "verify",
  "vice-president",
  "vice_president",
  "vicepresident",
  "video",
  "view",
  "visitor",
  "void",
  "vote",
  "vp",
  "vpn",
  "web-admin",
  "web-bot",
  "web_admin",
  "web_bot",
  "webadmin",
  "webbot",
  "webmail",
  "webmaster",
  "webserver",
  "website",
  "widget",
  "widgets",
  "wiki",
  "wpad",
  "write",
  "www",
  "www-data",
  "www1",
  "www2",
  "www3",
  "www4",
  "you",
  "yourname",
  "yourusername",
  "zlib",
  "|",
  "~",
  "about",
  "account",
  "admin",
  "api",
  "app",
  "apps",
  "assets",
  "auth",
  "beta",
  "billing",
  "blog",
  "business",
  "buy",
  "careers",
  "cart",
  "changelog",
  "checkout",
  "community",
  "company",
  "contact",
  "content",
  "dashboard",
  "demo",
  "dev",
  "developer",
  "developers",
  "discover",
  "docs",
  "documentation",
  "download",
  "downloads",
  "education",
  "enterprise",
  "events",
  "explore",
  "faq",
  "features",
  "feedback",
  "forum",
  "forums",
  "free",
  "get-started",
  "getting-started",
  "guide",
  "guides",
  "health",
  "help",
  "home",
  "index",
  "integrations",
  "internal",
  "investors",
  "jobs",
  "join",
  "learn",
  "legal",
  "library",
  "login",
  "logout",
  "main",
  "marketplace",
  "media",
  "members",
  "mobile",
  "news",
  "notifications",
  "onboarding",
  "orders",
  "partners",
  "plans",
  "policies",
  "portal",
  "press",
  "pricing",
  "privacy",
  "pro",
  "product",
  "products",
  "profile",
  "projects",
  "public",
  "register",
  "research",
  "resources",
  "roadmap",
  "search",
  "security",
  "services",
  "settings",
  "shop",
  "signin",
  "signup",
  "sitemap",
  "status",
  "store",
  "stories",
  "subscribe",
  "support",
  "team",
  "terms",
  "tour",
  "tutorials",
  "updates",
  "upgrade",
];

// Always enter bannedWords as lowercase
export const bannedWords = [];

const validateUsername = (username: string) => {
  const schemaValidation = usernameSchema.safeParse(username);
  if (!schemaValidation.success) {
    return false;
  }
  const lowerName = username.toLowerCase();
  if (blockedUsernames.includes(lowerName)) {
    return false;
  }
  if (bannedWords.some((word) => lowerName.includes(word))) {
    return false;
  }
  return true;
};

export const authOptions: BetterAuthOptions = {
  secret: serverEnv.auth.AUTH_SECRET,
  baseURL: serverEnv.shared.BASE_URL + "/auth",
  database: drizzleAdapter(db, {
    provider: "mysql",
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verificationTokens,
    },
  }),
  plugins: [
    username({
      minUsernameLength: 5,
      maxUsernameLength: 32,
      usernameValidator: (username) => {
        return validateUsername(username);
      },
    }),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        void (await sendEmail({
          to: email,
          type: "auth-otp",

          otpCode: otp,
        }));
      },
    }),
    passkey({
      rpID: serverEnv.shared.BASE_URL,
      rpName: "flow",
      origin: serverEnv.shared.BASE_URL,
    }),
  ],
  advanced: {
    generateId: false,
    useSecureCookies: true,
    crossSubDomainCookies: {
      enabled: true,
      additionalCookies: ["1up_session"],
    },
    cookies: {
      session_token: {
        name: "1up_session",
        attributes: {
          httpOnly: true,
          secure: true,
        },
      },
    },
  },
};

export const authClientOptions: ClientOptions = {
  baseURL: serverEnv.shared.BASE_URL,
  plugins: [usernameClient(), passkeyClient(), emailOTPClient()],
};
