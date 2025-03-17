/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1)
 * 2. You want to create a new middleware or type of procedure (see Part 3)
 *
 * tl;dr - this is where all the tRPC server stuff is created and plugged in.
 * The pieces you will need to use are documented accordingly near the end
 */
import { initTRPC, TRPCError } from "@trpc/server";
import { betterAuth } from "better-auth";
import superjson from "superjson";
import { ZodError } from "zod";

import type { db } from "@1up/db";
import { authOptions } from "@1up/auth";

// import { auth, validateToken } from "@1up/auth";

/**
 * Isomorphic Session getter for API requests
 * - Expo requests will have a session token in the Authorization header
 * - Next.js requests will have a session token in cookies
 */
// const isomorphicGetSession = async (headers: Headers) => {
//   const authToken = headers.get("Authorization") ?? null;
//   if (authToken) return validateToken(authToken);
//   return auth();
// };

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */

export const auth: ReturnType<typeof betterAuth> = betterAuth({
  ...authOptions,
});
interface AuthContext {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
}

export interface TrpcContext {
  auth: AuthContext;
  db: typeof db;
}

/**
 * 2. INITIALIZATION
 *
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */
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

/**
 * Create a server-side caller
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the /src/server/api/routers folder
 */

/**
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */
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
  if (!ctx.auth.session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next();
});
