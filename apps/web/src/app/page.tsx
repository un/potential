import Image from "next/image";
import {
  ArrowRight,
  Code,
  GithubLogo,
  ToggleRight,
} from "@phosphor-icons/react/dist/ssr";

import { HydrateClient } from "~/trpc/server";
import { Button } from "./components/button";
import { Divider } from "./components/divider";
import PulsingUnderline from "./components/pulsingUnderline";

export default function HomePage() {
  return (
    <HydrateClient>
      <main className="mx-auto flex max-w-screen-lg flex-col items-center justify-center gap-32 py-32">
        {/* Hero Section */}
        <section className="mx-auto flex max-w-4xl flex-col items-start justify-center gap-12">
          <h2 className="font-serif text-5xl font-normal">
            Most health advice was made for the average person.
          </h2>

          <h2 className="font-serif text-6xl font-normal italic">
            This was made for <PulsingUnderline>you. </PulsingUnderline>
          </h2>
          <div className="flex flex-col gap-6">
            <p className="text-2xl">
              We build a <span className="italic">live, personal model</span>
              <br />
              of your <span className="italic">biology and psychology</span>.
            </p>
            <p className="text-2xl">
              So you can{" "}
              <span className="italic">
                stop guessing,
                <br />
                start evolving,
              </span>{" "}
              and <br />
              actually <span className="italic">feel better.</span>{" "}
            </p>
          </div>
          <div className="flex flex-row justify-center gap-4">
            <Button size={"lg"}>Start My Health Loop</Button>
            <Button variant={"outline"} size={"lg"}>
              <div className="flex flex-row items-center gap-2">
                How It Works
                <ArrowRight />
              </div>
            </Button>
          </div>
        </section>

        <Divider />

        {/* How It Works */}

        <section className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-12">
          <div className="flex flex-col items-center justify-center gap-6">
            <h2 className="font-serif text-5xl font-normal">
              Built around you.
            </h2>
            <h2 className="font-serif text-5xl font-normal">Guided by AI.</h2>
            <h2 className="font-serif text-5xl font-normal">
              Smarter every day.
            </h2>
          </div>

          <div className="flex flex-col items-center justify-center gap-2">
            <p className="text-2xl">
              The longer you use <span>Potential</span>, the smarter it
            </p>
            <p className="text-2xl">
              gets — the faster your results come to life.
            </p>
          </div>

          <div className="flex flex-col items-center gap-12">
            <div className="flex flex-row items-center gap-6">
              <Image
                src="/images/home/flag_icon.png"
                width={100}
                height={100}
                alt="Set your focus"
                className="rounded-full"
              />
              <div className="flex max-w-80 flex-col gap-2">
                <span className="text-2xl font-semibold">Set your focus</span>
                <span>
                  <span className="decoration-blue-9 underline">
                    Pick a goal
                  </span>{" "}
                  — more energy, less anxiety, better sleep, stronger digestion,
                  etc.
                </span>
                <span className="decoration-blue-9 underline">
                  This is where your personal model begins.
                </span>
              </div>
            </div>
            <div className="flex flex-row items-center gap-6">
              <Image
                src="/images/home/flask_icon.png"
                width={100}
                height={100}
                alt="Picture of the author"
                className="rounded-full"
              />
              <div className="flex max-w-80 flex-col gap-2">
                <span className="text-2xl font-semibold">
                  Run guided experiments
                </span>
                <span>
                  <span className="decoration-blue-9 underline">
                    The AI picks small, safe experiments
                  </span>{" "}
                  designed around your biology and psychology.
                </span>
                <span>
                  You test, it watches — and{" "}
                  <span className="decoration-blue-9 underline">
                    learns what actually works for you.
                  </span>
                </span>
              </div>
            </div>
            <div className="flex flex-row items-center gap-6">
              <Image
                src="/images/home/pulse_icon.png"
                width={100}
                height={100}
                alt="Picture of the author"
                className="rounded-full"
              />
              <div className="flex max-w-80 flex-col gap-2">
                <span className="text-2xl font-semibold">
                  Track your signals
                </span>
                <span>
                  Log what the AI asks for, use simple daily check-ins or
                  connect wearables.
                </span>
                <span>
                  This{" "}
                  <span className="decoration-blue-9 underline">
                    feeds the loop
                  </span>{" "}
                  and{" "}
                  <span className="decoration-blue-9 underline">
                    sharpens your personal health model.
                  </span>
                </span>
              </div>
            </div>
            <div className="flex flex-row items-center gap-6">
              <Image
                src="/images/home/growth_icon.png"
                width={100}
                height={100}
                alt="Picture of the author"
                className="rounded-full"
              />
              <div className="flex max-w-80 flex-col gap-2">
                <span className="text-2xl font-semibold">Evolve your plan</span>
                <span>
                  The system builds an{" "}
                  <span className="decoration-blue-9 underline">
                    adaptive plan
                  </span>{" "}
                  based on{" "}
                  <span className="decoration-blue-9 underline">
                    real outcomes
                  </span>
                  — not averages.
                </span>

                <span>It gets smarter the more you use it.</span>
              </div>
            </div>
            <span className="text-2xl italic">
              <span className="decoration-blue-9 underline">
                The longer you use Potential, the smarter it gets
              </span>{" "}
              <br /> — and the more clearly you'll know what works.
            </span>
          </div>
          <div className="flex flex-row justify-center gap-4">
            <Button size={"lg"}>Start My Health Loop</Button>
          </div>
        </section>

        <Divider />

        {/* Proof */}

        <section className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-12 md:grid md:h-[600px] md:grid-cols-5 md:items-stretch">
          <div className="flex h-full flex-1 flex-col items-start justify-center gap-12 md:col-span-3">
            <div className="flex w-full flex-col items-start justify-center gap-6">
              <h2 className="font-serif text-5xl font-normal">
                Nothing was personalized.
              </h2>
              <h2 className="font-serif text-5xl font-normal">
                {" "}
                Nothing adapted.
              </h2>
              <h2 className="font-serif text-5xl font-normal">
                Nothing worked.
              </h2>
              {/* Mobile-only image below H2s */}
              <div className="relative block aspect-square w-full md:hidden">
                <Image
                  src="/images/home/omar.jpg"
                  className="rounded-lg object-cover"
                  fill
                  sizes="100vw"
                  alt="Picture of Omar McAdam, Potential Health Founder"
                />
              </div>
            </div>

            <div className="flex flex-col items-start justify-start gap-2">
              <p className="text-lg">
                I’ve been diagnosed with{" "}
                <span className="decoration-tomato-9 underline">
                  bipolar, ADHD, ASD, IBS, and autoimmune{" "}
                </span>
                issues.
              </p>
              <p className="text-lg">
                Doctors gave me pills and said, “Try this. Come back in 6
                weeks.”
              </p>
              <p className="text-lg">
                That’s when I decided to take things into my own hands.
              </p>
              <p className="text-lg">
                So I started{" "}
                <span className="decoration-tomato-9 underline">
                  reading every medical journal
                </span>{" "}
                I could find.
              </p>
              <p className="text-lg">
                I spent months{" "}
                <span className="decoration-tomato-9 underline">
                  researching, testing, and building my own tools
                </span>{" "}
                — combining data, feedback, and micro-experiments.
              </p>
              <p className="text-lg">
                Potential is the system{" "}
                <span className="decoration-tomato-9 underline">
                  I had to create for myself.
                </span>
              </p>
              <p className="text-lg">
                <span className="decoration-tomato-9 underline">
                  And now, it’s here for you.
                </span>
              </p>
            </div>
          </div>
          {/* Desktop-only image in grid */}
          <div className="hidden h-full min-h-96 w-full flex-1 flex-col items-center gap-12 md:col-span-2 md:flex">
            <div className="relative hidden h-full min-h-96 w-full flex-1 md:block">
              <Image
                src="/images/home/omar.jpg"
                className="rounded-lg object-cover"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                alt="Picture of Omar McAdam, Potential Health Founder"
              />
              {/* Gradient overlay */}
              <div className="to-sand-3 pointer-events-none absolute inset-x-0 bottom-0 h-1/4 rounded-b-lg bg-gradient-to-b from-transparent" />
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <p className="font-ephesis text-5xl">Omar McAdam</p>
              <p className="text-lg">Founder, Potential Health</p>
            </div>
          </div>
        </section>

        <Divider />
        {/* data & Privacy */}

        <section className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-12">
          <div className="flex w-full flex-col items-center justify-center gap-6">
            <h2 className="font-serif text-5xl font-normal">
              You’re in control. Not the algorithm.
            </h2>

            <p className="text-center text-2xl">
              Most health apps track you in the background.
              <br />
              We built Potential to work only when you want it to
              <br /> — and only for you.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="bg-sand-1 flex flex-col items-start justify-start gap-6 rounded-sm px-8 py-6">
              <span className="text-tomato-9">
                <ToggleRight className="h-20 w-20" weight="fill" />
              </span>
              <p className="text-3xl font-semibold">
                You decide what to track.
              </p>
              <p className="text-lg">
                Want to keep things private? Done.
                <br />
                Want to connect wearables? That’s your call.
                <br />
                Only want to track one thing? No problem.
              </p>
            </div>

            <div className="bg-sand-1 flex flex-col items-start justify-start gap-6 rounded-sm px-8 py-6">
              <span className="text-tomato-9">
                <Code className="h-20 w-20" />
              </span>
              <p className="text-3xl font-semibold">All our code is public.</p>
              <p className="text-lg">
                We’re 100% open source.
                <br />
                You don’t have to guess what’s happening — you can see for
                yourself.
              </p>
            </div>
          </div>

          <p className="mt-6 text-3xl">This isn’t our system. It’s yours.</p>
          <div className="flex flex-row justify-center gap-4">
            <Button size={"lg"}>Start My Health Loop</Button>
            <Button variant={"outline"} size={"lg"}>
              <div className="flex flex-row items-center gap-2">
                <GithubLogo className="h-10 w-10" weight="fill" />
                View Our Code
              </div>
            </Button>
          </div>
        </section>
      </main>
    </HydrateClient>
  );
}
