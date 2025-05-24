import { QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { toast } from "sonner-native";
import superjson from "superjson";

import type { AppRouter } from "@potential/trpc";

import { authClient } from "./auth-client";
import { getApiUrl } from "./base-url";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: true,
    },
    mutations: {
      onError: (err) => toast.error(err.message),
    },
  },
});

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === "development" ||
        (opts.direction === "down" && opts.result instanceof Error),
      colorMode: "ansi",
    }),
    httpBatchLink({
      transformer: superjson,
      url: `${getApiUrl()}/trpc`,
      headers() {
        const headers = new Map<string, string>();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        const cookies = authClient.getCookie();
        if (cookies) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          headers.set("Cookie", cookies);
        }
        return Object.fromEntries(headers);
      },
    }),
  ],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});

export { type RouterInputs, type RouterOutputs } from "@potential/trpc";
