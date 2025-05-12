import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

import { Button } from "../components/button";
import { Divider } from "../components/divider";

export default function StartPage() {
  return (
    <main className="mx-auto flex max-w-screen-lg flex-col items-center justify-center gap-16 py-24">
      <section className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-8 text-center">
        <h1 className="font-serif text-5xl font-normal md:text-6xl">
          Start Your Health Loop
        </h1>

        <p className="text-balance text-xl md:text-2xl">
          Let's build your personal health model together. We'll guide you
          through a simple process to understand your unique needs.
        </p>

        <Button size="lg" asChild>
          <Link href="/start/assessment">
            <div className="flex flex-row items-center gap-2">
              Begin Assessment
              <ArrowRight />
            </div>
          </Link>
        </Button>
      </section>

      <Divider />

      <section className="mx-auto flex max-w-4xl flex-col items-center gap-12">
        <h2 className="font-serif text-3xl font-normal md:text-4xl">
          How It Works
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="bg-sand-1 flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold">
              1
            </div>
            <h3 className="text-xl font-semibold">Tell Us About You</h3>
            <p>
              Answer a few questions about your health goals and current
              situation
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 text-center">
            <div className="bg-sand-1 flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold">
              2
            </div>
            <h3 className="text-xl font-semibold">Get Your Plan</h3>
            <p>Receive a personalized health plan based on your unique needs</p>
          </div>

          <div className="flex flex-col items-center gap-4 text-center">
            <div className="bg-sand-1 flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold">
              3
            </div>
            <h3 className="text-xl font-semibold">Track & Evolve</h3>
            <p>As you track your progress, your plan adapts and gets smarter</p>
          </div>
        </div>
      </section>
    </main>
  );
}
