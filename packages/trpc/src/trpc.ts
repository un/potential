import { initTRPC, TRPCError } from "@trpc/server";
import { betterAuth } from "better-auth";
import superjson from "superjson";
import { ZodError } from "zod";

import { authOptions } from "@potential/auth";
import type { db } from "@potential/db";
import type { CloudTypeId } from "@potential/utils";

export const auth: ReturnType<typeof betterAuth> = betterAuth({
  ...authOptions,
});

// SYNC WITH CHANGES in apps/backend/api/index.ts
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

interface AuthContext {
  user: InferredAuthUser | null;
  session: InferredAuthSession | null;
}

export interface TrpcContext {
  auth: AuthContext;
  db: typeof db;
}

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) => ({
    ...shape,
    data: {
      ...shape.data,
      zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
    },
  }),
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

/**
 * Middleware for timing procedure execution and adding an articifial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */
// const timingMiddleware = t.middleware(async ({ next, path }) => {
//   const start = Date.now();

//   if (t._config.isDev) {
//     // artificial delay in dev 100-500ms
//     const waitMs = Math.floor(Math.random() * 400) + 100;
//     await new Promise((resolve) => setTimeout(resolve, waitMs));
//   }

//   const result = await next();

//   const end = Date.now();
//   console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

//   return result;
// });

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.auth.session || !ctx.auth.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      auth: {
        user: ctx.auth.user,
        session: ctx.auth.session,
      },
    },
  });
});
