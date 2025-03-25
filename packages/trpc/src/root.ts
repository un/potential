import { logRouter } from "./router/log";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  user: userRouter,
  log: logRouter,
});

export type AppRouter = typeof appRouter;
