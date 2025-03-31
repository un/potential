import { logRouter } from "./router/log";
import { storageRouter } from "./router/storage";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  user: userRouter,
  log: logRouter,
  storage: storageRouter,
});

export type AppRouter = typeof appRouter;
