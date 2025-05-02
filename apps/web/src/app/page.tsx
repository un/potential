import { HydrateClient } from "~/trpc/server";
import { Button } from "./components/button";
import { Divider } from "./components/divider";

export default function HomePage() {
  return (
    <HydrateClient>
      <main className="mx-auto flex max-w-screen-lg flex-col items-center justify-center gap-32 py-32">
        {/* Hero Section */}
        <section className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-8">
          <h1 className="font-serif text-6xl italic">Potential Health</h1>
          <h2 className="font-serif text-3xl font-normal italic">
            The best way to reach your{" "}
            <span className="decoration-blue-9 underline">
              health potential
            </span>
          </h2>
          <p className="text-lg">
            Your personal{" "}
            <span className="decoration-blue-9 underline">AI health coach</span>{" "}
            for <span className="decoration-blue-9 underline">longevity</span>,{" "}
            <span className="decoration-blue-9 underline">vitality</span>, and
            sustainable results.
          </p>
          <div className="flex flex-row justify-center gap-4">
            <Button>Get Started Free</Button>
            <Button className="">Watch How It Works</Button>
          </div>
        </section>

        <Divider />

        {/* How It Works */}
        <section className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-8">
          <h2 className="mb-8 text-center font-serif text-3xl font-normal italic">
            <span className="decoration-blue-9 underline">Simple steps</span>.
            Personalized results.
          </h2>
          <div className="grid grid-cols-1 place-items-start gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-sand-1 border-sand-6 flex flex-col items-center justify-center gap-2 rounded-lg border p-4">
              <h3 className="text-xl font-semibold">Step 1</h3>
              <p className="text-center">
                Tell us what you want to{" "}
                <span className="decoration-blue-9 underline">solve</span> or{" "}
                <span className="decoration-blue-9 underline">improve</span>.
              </p>
            </div>
            <div className="bg-sand-1 border-sand-6 flex flex-col items-center justify-center gap-2 rounded-lg border p-4">
              <h3 className="text-xl font-semibold">Step 2</h3>
              <p className="text-center">
                Run{" "}
                <span className="decoration-blue-9 underline">
                  3 short experiments
                </span>{" "}
                guided by AI.
              </p>
            </div>
            <div className="bg-sand-1 border-sand-6 flex flex-col items-center justify-center gap-2 rounded-lg border p-4">
              <h3 className="text-xl font-semibold">Step 3</h3>
              <p className="text-center">
                Get a{" "}
                <span className="decoration-blue-9 underline">
                  sustainable, long-term plan
                </span>
                .
              </p>
            </div>
            <div className="bg-sand-1 border-sand-6 flex h-full flex-col items-center justify-start gap-2 rounded-lg border p-4">
              <h3 className="text-xl font-semibold">∞</h3>
              <p className="text-center">
                The system{" "}
                <span className="decoration-blue-9 underline">
                  keeps learning
                </span>
                .
              </p>
            </div>
          </div>
        </section>

        <Divider />

        {/* Why Potential */}
        <section className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-8">
          <h2 className="mb-8 text-center font-serif text-3xl font-normal italic">
            Built <span className="decoration-blue-9 underline">different</span>
            . On purpose.
          </h2>
          <div className="mx-auto grid max-w-3xl gap-12">
            <div className="bg-sand-1 border-sand-6 flex flex-col items-center justify-center gap-2 rounded-lg border p-4">
              <h3 className="text-xl font-semibold">
                Human-First, Science-Backed
              </h3>
              <p>
                We value{" "}
                <span className="decoration-blue-9 underline">
                  real-world results
                </span>{" "}
                over blanket science. We combine{" "}
                <span className="decoration-blue-9 underline">
                  peer-reviewed research
                </span>{" "}
                with{" "}
                <span className="decoration-blue-9 underline">your data</span>{" "}
                to discover what actually works for{" "}
                <span className="decoration-blue-9 underline">you</span>.
              </p>
            </div>
            <div className="bg-sand-1 border-sand-6 flex flex-col items-center justify-center gap-2 rounded-lg border p-4">
              <h3 className="text-xl font-semibold">
                Open Health, Open Source
              </h3>
              <p>
                We’re building the world’s first{" "}
                <span className="decoration-blue-9 underline">
                  open health ecosystem
                </span>
                . Open source tools, transparent methods, and a belief in{" "}
                <span className="decoration-blue-9 underline">
                  health equity
                </span>
                .
              </p>
            </div>
            <div className="bg-sand-1 border-sand-6 flex flex-col items-center justify-center gap-2 rounded-lg border p-4">
              <h3 className="text-xl font-semibold">Privacy by Design</h3>
              <p>
                <span className="decoration-blue-9 underline">
                  You own your data
                </span>
                . Encrypted, private, and under your control—always.
              </p>
            </div>
          </div>
        </section>

        <Divider />

        {/* Who It's For */}
        <section className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-8">
          <h2 className="mb-8 text-center font-serif text-3xl font-normal italic">
            Made for people who…
          </h2>
          <ul className="mx-auto max-w-3xl list-inside list-disc space-y-4 text-lg">
            <li>
              Want a{" "}
              <span className="decoration-blue-9 underline">
                smarter, personalized path
              </span>{" "}
              to better health
            </li>
            <li>
              Are done{" "}
              <span className="decoration-blue-9 underline">guessing</span> with
              supplements, routines, or diets
            </li>
            <li>
              Believe in{" "}
              <span className="decoration-blue-9 underline">
                testing, learning
              </span>
              , and real outcomes
            </li>
            <li>
              Want to{" "}
              <span className="decoration-blue-9 underline">
                own their health data
              </span>
              , not give it away
            </li>
          </ul>
        </section>

        <Divider />

        {/* The Potential Loop */}
        <section className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-8">
          <h2 className="mb-8 text-center font-serif text-3xl font-normal italic">
            The more you use it, the{" "}
            <span className="decoration-blue-9 underline">better it gets</span>.
          </h2>
          <p className="mx-auto max-w-2xl text-center text-lg">
            Our AI learns from your unique{" "}
            <span className="decoration-blue-9 underline">
              bio-psychological makeup
            </span>
            . Every experiment you run, every insight you share—feeds the loop
            and makes your{" "}
            <span className="decoration-blue-9 underline">
              personal health model
            </span>{" "}
            more powerful.
          </p>
        </section>

        <Divider />

        {/* Join Us Early */}
        <section className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-8">
          <h2 className="mb-4 font-serif text-3xl font-bold italic">
            Get{" "}
            <span className="decoration-blue-9 underline">early access</span>.
            Be part of the{" "}
            <span className="decoration-blue-9 underline">
              future of health
            </span>
            .
          </h2>
          <Button className="mt-6 rounded-xl bg-black px-8 py-4 font-semibold text-white">
            Join the Beta
          </Button>
        </section>
      </main>
      {/* 
      <main className="container flex h-svh max-w-screen-lg flex-col">
        <div className="flex flex-col items-start justify-start gap-12">
          <div className="flex flex-col gap-4">
            <div className="border-orange-9 -ml-4 flex flex-row border-l-2 pl-4">
              <span className="font-serif text-lg italic">
                The best way to reach{" "}
                <span className="decoration-blue-9 underline decoration-2 underline-offset-2">
                  your
                </span>{" "}
                health potential
              </span>
            </div>

            <span className="">
              Potential Health is your personal Ai coach.
            </span>
            <span className="">
              It learns everything about you, from biological to psychological,
              working out the best way to maximize your health.
            </span>
            <span className="">
              The longer you use the system the more it learns about you and
              what methods and approaches would work for your unique genetic
              makeup.
            </span>
          </div>
          <Divider />
          <div className="flex flex-col gap-4">
            <div className="border-orange-9 -ml-4 flex flex-row border-l-2 pl-4">
              <span className="font-serif text-lg italic">
                Backed by real people first, traditional science second
              </span>
            </div>
            <span className="">
              Science says were all made up of the same cells,
            </span>
            <span className="">
              and modern medicine says one pill should work for everyone.
            </span>

            <span className="decoration-blue-9 font-bold underline decoration-2 underline-offset-2">
              We say that's bullshit!
            </span>

            <span className="">
              We take outcomes from medical journals and studies, and give our
              users a chance to test things for themselves - feeding their
              results back into the loop.
            </span>
            <span className="">
              The more data you share with our privacy focused Ai, and the
              longer you use it, the better and faster it can help you make the
              changes you want.
            </span>
          </div>
          <Divider />
          <div className="flex flex-col gap-4">
            <div className="border-orange-9 -ml-4 flex flex-row border-l-2 pl-4">
              <span className="font-serif text-lg italic">How it works</span>
            </div>
            <div className="flex flex-row gap-2">
              <span className="">1</span>
              <span className="border-blue-9 -ml-2 border-b-2 pl-4"> </span>
              <span className="">
                Tell us what you want to improve or solve
              </span>
            </div>
            <div className="flex flex-row gap-2">
              <span className="">2</span>
              <span className="border-blue-9 -ml-2 border-b-2 pl-4"> </span>
              <span className="">
                The Ai will guide you through 3 short experiments and monitor
                their success for you
              </span>
            </div>
            <div className="flex flex-row gap-2">
              <span className="">3</span>
              <span className="border-blue-9 -ml-2 border-b-2 pl-4"> </span>
              <span className="">
                Ai analyzes the results to create a long term sustainable plan
                for your health
              </span>
            </div>
            <div className="flex flex-row items-start gap-2">
              <span className="-mr-1">∞</span>
              <span className="border-blue-9 -ml-2 h-5 border-b-2 pl-4"> </span>
              <span className="">
                The system keeps learning about your unique biological and
                psychological make-up over time, fine tuning it's future
                responses and suggestions for you
              </span>
            </div>
          </div>
          <Divider />
          <div className="flex flex-col gap-4">
            <div className="border-orange-9 -ml-4 flex flex-row border-l-2 pl-4">
              <span className="font-serif text-lg italic">
                Open Health, Open Life, Open Source
              </span>
            </div>
            <span className="">
              We're building an open eco-system that lets anyone benefit from
              the code, research and work we do at Potential - while we keep
              your data secure.
            </span>
            <span className="">
              From partner apps and platforms, to individuals who want more
              control over their data.
            </span>

            <span className="decoration-blue-9 font-bold underline decoration-2 underline-offset-2">
              We're Open Source and Proud!
            </span>

            <span className="">
              <span className="italic">"Health Equity"</span>: the idea that
              everyone has a fair and just opportunity to attain their highest
              level of health
            </span>
            <span className="">
              The only way to really give full equity, is to be open and share
              everything we do so it can benefit more people and live on
              forever.
            </span>
          </div>
          <Divider />
        </div>
      </main> */}
    </HydrateClient>
  );
}
