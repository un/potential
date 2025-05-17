import type { ServerType } from "@hono/node-server";
import { serve } from "@hono/node-server";
import { trpcServer } from "@hono/trpc-server";
import { zValidator } from "@hono/zod-validator";
import { betterAuth } from "better-auth";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { handle } from "hono/vercel";
import { customAlphabet } from "nanoid";
import { z } from "zod";

import { authOptions } from "@potential/auth";
import { db } from "@potential/db";
import { clientEnv, serverEnv } from "@potential/env";
import { GetObjectCommand, getSignedUrl, s3Client } from "@potential/storage";
import { appRouter } from "@potential/trpc";
import { CloudTypeId, cloudTypeIdValidator } from "@potential/utils";

// Initialize auth with error handling
const auth = betterAuth({
  ...authOptions,
  trustedOrigins: ["potential://"],
});
if (!auth) {
  console.error("❌ Failed to initialize auth");
  process.exit(1);
}
console.log("✅ Auth initialized successfully");

// auth types SYNC WITH CHANGES in packages/trpc/src/trpc.ts
type InferredAuthUser = Omit<typeof auth.$Infer.Session.user, "id"> & {
  id: CloudTypeId<"user">;
};
type InferredAuthSession = Omit<
  typeof auth.$Infer.Session.session,
  "id" | "userId"
> & {
  id: CloudTypeId<"session">;
  userId: CloudTypeId<"user">;
};

// Hono App
const app = new Hono<{
  Variables: {
    reqId: string;
    db: typeof db;
    auth: {
      user: InferredAuthUser | null;
      session: InferredAuthSession | null;
    };
  };
}>();

if (serverEnv.shared.NODE_ENV === "development") {
  app.use(logger());
}

// Add error handling middleware
app.onError((err, c) => {
  console.error("❌ Server error:", err);
  return c.json({ error: "Internal Server Error" }, 500);
});

app.use("*", async (c, next) => {
  try {
    c.set("db", db);
    const reqId = customAlphabet("0123456789abcdefghjkmnpqrstvwxyz", 12)();
    c.set("reqId", reqId);

    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      c.set("auth", { user: null, session: null });
      return next();
    }

    c.set("auth", {
      user: session.user as InferredAuthUser,
      session: session.session as InferredAuthSession,
    });
    return next();
  } catch (error) {
    console.error("❌ Middleware error:", error);
    throw error;
  }
});

app.use("/auth/*", async (c) => {
  const authResult = await auth.handler(c.req.raw);
  return authResult;
});

app.use(
  "/auth/*",
  cors({
    origin: [clientEnv.web.NEXT_PUBLIC_URL ?? "http://localhost:3000"],
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "x-trpc-source",
      "trpc-batch",
      "trpc-accept",
    ],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

// TRPC Handler
app.use(
  "/trpc/*",
  cors({
    origin: ["http://localhost:3000", "https://your-production-domain.com"],
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "x-trpc-source",
      "trpc-batch",
      "trpc-accept",
    ],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
  trpcServer({
    router: appRouter,
    createContext: (_opts, c) => ({
      db: c.get("db"),
      auth: c.get("auth"),
    }),
  }),
);

// Redirect to image uploads
app.get(
  "/uploads",
  zValidator(
    "param",
    z.object({
      userId: cloudTypeIdValidator("user"),
      uploadId: cloudTypeIdValidator("userUpload"),
    }),
  ),
  async (c) => {
    const { user } = c.get("auth");
    const userIdParam = c.req.param("userId");
    const uploadIdParam = c.req.param("uploadId");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    if (user.id !== userIdParam) {
      return c.json({ error: "Forbidden" }, 403);
    }

    const command = new GetObjectCommand({
      Bucket: serverEnv.storage.STORAGE_S3_BUCKET_UPLOADS,
      Key: `${userIdParam}/${uploadIdParam}`,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    if (!signedUrl || !signedUrl.startsWith("http")) {
      return c.json({ error: "Upload not found" }, 404);
    }

    return c.redirect(signedUrl);
  },
);

// Health Check
app.get("/", async (c) => {
  return c.json({ message: "im alive!" });
});

// Server initialization with error handling
let server: ServerType | undefined;
let isShuttingDown = false;

const startServer = async () => {
  try {
    // Test database connection first
    await db.execute("SELECT 1");
    console.log("✅ Database connection successful");

    server = serve(
      {
        fetch: app.fetch,
        port: 3100,
      },
      (info) => {
        console.log("✅ Server is running on http://localhost:" + info.port);
      },
    );

    return true;
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    return false;
  }
};

const shutdownServer = async (signal: string) => {
  if (isShuttingDown) {
    console.log("Shutdown already in progress...");
    return;
  }

  isShuttingDown = true;
  console.log(`Received ${signal} signal, shutting down gracefully...`);

  if (server) {
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });

    // Force close after 5 seconds if server doesn't close gracefully
    setTimeout(() => {
      console.log("Forcing server shutdown after timeout");
      process.exit(1);
    }, 5000);
  } else {
    process.exit(0);
  }
};

// Start the server
void startServer();

// Handle graceful shutdown
process.once("SIGINT", () => void shutdownServer("SIGINT"));
process.once("SIGTERM", () => void shutdownServer("SIGTERM"));

// Handle uncaught exceptions to prevent crashes
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  // Don't exit the process, just log the error
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  // Don't exit the process, just log the error
});

export default app;

const handler = handle(app);
export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const OPTIONS = handler;
