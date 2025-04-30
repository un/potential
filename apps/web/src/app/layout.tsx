import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, IBM_Plex_Serif } from "next/font/google";

import { cn } from "@potential/ui";
import { ThemeProvider, ThemeToggle } from "@potential/ui/theme";
import { Toaster } from "@potential/ui/toast";

import { TRPCReactProvider } from "~/trpc/react";

import "~/app/globals.css";

import { env } from "~/env";
import { NavMenu } from "./ui/NavMenu";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://potential.health"
      : "http://localhost:3000",
  ),
  title: "Potential Health",
  description: "The open source alternative to Death",
  openGraph: {
    title: "Potential Health",
    description: "The open source alternative to Death",
    url: "https://potential.health",
    siteName: "Potential Health",
  },
  twitter: {
    card: "summary_large_image",
    site: "@OmarMcAdam",
    creator: "@OmarMcAdam",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

const ibmPlexSans = IBM_Plex_Sans({
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
});
const ibmPlexSerif = IBM_Plex_Serif({
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-serif",
  subsets: ["latin"],
});

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "text-sand-12 bg-sand-2 h-full font-sans text-sm font-light antialiased",
          ibmPlexSans.variable,
          ibmPlexSerif.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NavMenu className="mb-16" />
          <TRPCReactProvider>{props.children}</TRPCReactProvider>
          <div className="absolute bottom-4 right-4">
            <ThemeToggle />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
