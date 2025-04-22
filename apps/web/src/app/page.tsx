import { HydrateClient } from "~/trpc/server";
import { Logo } from "./_components/branding/logo";

export default function HomePage() {
  return (
    <HydrateClient>
      <main className="container h-screen py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="bg-blue-5 font-mono text-5xl">1up</h1>

          <Logo size="mega" />
        </div>
      </main>
    </HydrateClient>
  );
}
