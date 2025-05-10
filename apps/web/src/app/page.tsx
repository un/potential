import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

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
              <br /> — and the more clearly you’ll know what works.
            </span>
          </div>
          <div className="flex flex-row justify-center gap-4">
            <Button size={"lg"}>Start My Health Loop</Button>
          </div>
        </section>

        <Divider />

        {/* Proof */}

        <section className="bg-tomato-5 mx-auto flex max-w-4xl flex-col items-center justify-center gap-12 md:flex-row">
          <div className="bg-blue-5 flex flex-col items-start justify-center gap-12">
            <div className="flex flex-col items-start justify-center gap-6">
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
            </div>

            <div className="flex flex-col items-center justify-center gap-2">
              <p className="text-2xl">
                The longer you use <span>Potential</span>, the smarter it
              </p>
              <p className="text-2xl">
                gets — the faster your results come to life.
              </p>
            </div>
          </div>
          <div className="bg-blue-5 relative flex h-full min-h-96 w-full flex-col gap-2 self-stretch">
            <div className="bg-blue-5 relative flex h-full min-h-96 w-full flex-col gap-2 self-stretch">
              <Image
                src="/images/home/omar.jpg"
                className="object-cover"
                fill
                alt="Picture of Omar McAdam, Potential Health Founder"
              />
            </div>
          </div>

          {/* <div className="flex flex-col items-center gap-12">
            <span className="text-2xl italic">
              <span className="decoration-blue-9 underline">
                The longer you use Potential, the smarter it gets
              </span>{" "}
              <br /> — and the more clearly you’ll know what works.
            </span>
          </div>
          <div className="flex flex-row justify-center gap-4">
            <Button size={"lg"}>Start My Health Loop</Button>
          </div> */}
        </section>
      </main>
    </HydrateClient>
  );
}
