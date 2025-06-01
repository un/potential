import { logRouter } from "./router/log";
import { storageRouter } from "./router/storage";
import { trackerRouter } from "./router/tracker";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  user: userRouter,
  log: logRouter,
  tracker: trackerRouter,
  storage: storageRouter,
});

export type AppRouter = typeof appRouter;
