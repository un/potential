import type { Metadata, Viewport } from "next";
import { Martian_Mono } from "next/font/google";
import localFont from "next/font/local";

import { cn } from "@1up/ui";
import { ThemeProvider, ThemeToggle } from "@1up/ui/theme";
import { Toaster } from "@1up/ui/toast";

import { TRPCReactProvider } from "~/trpc/react";

import "~/app/globals.css";

import { env } from "~/env";
import { NavMenu } from "./ui/NavMenu";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://turbo.t3.gg"
      : "http://localhost:3000",
  ),
  title: "Create T3 Turbo",
  description: "Simple monorepo with shared backend for web & mobile apps",
  openGraph: {
    title: "Create T3 Turbo",
    description: "Simple monorepo with shared backend for web & mobile apps",
    url: "https://create-t3-turbo.vercel.app",
    siteName: "Create T3 Turbo",
  },
  twitter: {
    card: "summary_large_image",
    site: "@jullerino",
    creator: "@jullerino",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

const monocraftFont = localFont({
  src: "../../public/fonts/Monocraft.otf",
  display: "swap",
  variable: "--font-monocraft",
});

const martianMonoFont = Martian_Mono({
  display: "swap",
  variable: "--font-martian-mono",
});

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "text-sand-12 bg-sand-3 min-h-screen font-sans text-sm font-light antialiased",
          monocraftFont.variable,
          martianMonoFont.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NavMenu />
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
