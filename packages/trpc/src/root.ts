import { authRouter } from "./router/auth";
import { helloRouter } from "./router/hello";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  hello: helloRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
