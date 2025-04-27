"use client";

import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  createTRPCClient,
  loggerLink,
  unstable_httpBatchStreamLink,
} from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import { useState } from "react";
import SuperJSON from "superjson";

import type { AppRouter } from "@potential/trpc";

import { env } from "~/env";
import { createQueryClient } from "./query-client";

let clientQueryClientSingleton: QueryClient | undefined = undefined;
const getQueryClient = () => {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return createQueryClient();
  } else {
    // Browser: use singleton pattern to keep the same query client
    return (clientQueryClientSingleton ??= createQueryClient());
  }
};

export const { useTRPC, TRPCProvider } = createTRPCContext<AppRouter>();

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        loggerLink({
          enabled: (op) =>
            env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          transformer: SuperJSON,
          url: getBaseUrl() + "/trpc",
          headers() {
            const headers = new Headers();
            headers.set("x-trpc-source", "nextjs-react");
            return headers;
          },
          fetch: (url, options) => {
            return fetch(url, {
              ...options,
              credentials: "include", // This is important for cookies
            });
          },
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}

const getBaseUrl = () => {
  // For browser, use the backend URL directly to avoid CORS issues
  if (typeof window !== "undefined") {
    const backendUrl = env.NEXT_PUBLIC_BACKEND_URL as string | undefined;
    return backendUrl ?? "http://localhost:3100";
  }

  // SSR should use vercel url
  if (env.VERCEL_URL) return `https://${env.VERCEL_URL}`;

  // Fallback for development
  return "http://localhost:3100";
};
