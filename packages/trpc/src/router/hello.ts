import type { TRPCRouterRecord } from "@trpc/server";

// import { invalidateSessionToken } from "@1up/auth";

import { protectedProcedure } from "~/trpc";

export const helloRouter = {
  hello: protectedProcedure.query(({ ctx }) => {
    console.log("router context", { auth: ctx.auth });
    console.log("🔥 hello from hello router");
    return ["hello"];
  }),
  // getSecretMessage: protectedProcedure.query(() => {
  //   return "you can see this secret message!";
  // }),
  // signOut: protectedProcedure.mutation(async (opts) => {
  //   if (!opts.ctx.token) {
  //     return { success: false };
  //   }
  //   // await invalidateSessionToken(opts.ctx.token);
  //   return { success: true };
  // }),
} satisfies TRPCRouterRecord;
