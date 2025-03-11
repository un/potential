import { trpcServer } from "@hono/trpc-server";
import { betterAuth } from "better-auth";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { authOptions } from "@1up/auth/";
import { appRouter } from "@1up/trpc/";

export const auth = betterAuth({
  ...authOptions,
});

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});
app.use(
  "/api/auth/*",
  cors({
    origin: process.env.BASE_URL ?? "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

// TRPC Handler

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: (_opts, c) => ({
      user: c.get("user"),
      session: c.get("session"),
    }),
  }),
);

// Health Check

app.get("/", (c) => {
  return c.json({ message: "im alive!" });
});
export default app;
