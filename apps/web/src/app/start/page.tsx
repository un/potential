import Link from "next/link";
import { ArrowRight, Envelope } from "@phosphor-icons/react/dist/ssr";

import { Button } from "../components/button";
import { Divider } from "../components/divider";

interface Feature {
  title: string;
  date: string;
}

export default function StartPage() {
  const readyFeatures: Feature[] = [
    {
      title: "Early access pricing ($75 → $50/year lifetime)",
      date: "Now",
    },
    {
      title: "Get Your Plan",
      date: "May 19, 2025",
    },
    {
      title: "Track & Evolve",
      date: "May 26, 2025",
    },
  ];

  const comingSoonFeatures: Feature[] = [
    {
      title: "Chat with Your Model",
      date: "May 19, 2025",
    },
    {
      title: "📱 Android App",
      date: "August, 2025",
    },
  ];

  return (
    <main className="mx-auto flex max-w-screen-lg flex-col items-center justify-center gap-16 py-16">
      <section className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-8 text-center">
        <h1 className="text-balance font-serif text-3xl font-normal md:text-4xl">
          You’re in. Here’s what to expect.
        </h1>

        <p className="text-balance text-xl">You’re early — and that matters.</p>
        <p className="text-balance text-xl">
          Potential is in active development, and right now we’re opening it up
          to a small group of early users who want to shape what comes next.
        </p>
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:justify-center">
          <div className="flex w-fit flex-col items-start gap-2">
            <h1 className="text-xl">Where we’re at</h1>
          </div>
          <div className="flex flex-col items-start gap-2">
            <p className="text-balance">
              - The app is currently available via TestFlight (iOS only)
            </p>
            <p className="text-balance">
              - You’ll get direct access after signup
            </p>
            <p className="text-balance text-left">
              - We’ve limited early access to a small paid group so
              <br />
              we can build closely with you.
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-4 md:flex-row">
          <Button size={"lg"} asChild>
            <Link href="/start">Signup for Early Access</Link>
          </Button>
          <Button variant={"outline"} size={"lg"} asChild>
            <Link href="#how-it-works">
              <div className="flex flex-row items-center gap-2">
                Get updates
                <Envelope />
              </div>
            </Link>
          </Button>
        </div>
        <p className="text-sand-11 text-sm">
          Scroll down to see what's coming up soon.
        </p>
      </section>

      <Divider />

      <section className="mx-auto flex max-w-4xl flex-col items-center gap-12">
        <h2 className="font-serif text-2xl font-normal md:text-3xl">
          We're building fast with weekly updates.
        </h2>

        <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <div className="font-serif text-2xl">
              Here's whats ready for you now:
            </div>
            <div className="flex w-full flex-col items-center gap-2">
              <div className="border-sand-6 flex w-full flex-row items-center justify-between gap-4 border-b pb-2">
                <div className="">Feature</div>
                <div className="">Planned</div>
              </div>
              {readyFeatures.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>
          </div>
          <div className="flex w-full flex-col gap-4">
            <div className="font-serif text-2xl">
              Here's whats coming up soon:
            </div>
            <div className="flex w-full flex-col items-center gap-2">
              <div className="border-sand-6 flex w-full flex-row items-center justify-between gap-4 border-b pb-2">
                <div className="">Feature</div>
                <div className="">Planned</div>
              </div>
              {comingSoonFeatures.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
              <p className="text-sand-11 border-sand-6 border-t text-sm">
                All dates are estimates and subject to change. The priority of
                features may change based on user feedback.
              </p>
            </div>
          </div>
        </div>
      </section>
      <div className="flex flex-col justify-center gap-4 md:flex-row">
        <Button size={"lg"} asChild>
          <Link href="/start">Start My Health Loop</Link>
        </Button>
        <Button variant={"outline"} size={"lg"} asChild>
          <Link href="#how-it-works">
            <div className="flex flex-row items-center gap-2">
              How It Works
              <ArrowRight />
            </div>
          </Link>
        </Button>
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="text-balance text-center text-xl">
          We’re building in public, improving fast, and learning from every
          user.
        </p>
        <p className="text-balance text-center text-xl">
          If you’re in, we’re listening.
        </p>
      </div>
    </main>
  );
}

const FeatureCard = ({ title, date }: Feature) => {
  return (
    <div className="flex w-full flex-row items-center justify-between gap-4">
      <div className="font-normal">{title}</div>
      <div className="text-sand-11 text-sm">{date}</div>
    </div>
  );
};
