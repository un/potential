import { HydrateClient } from "~/trpc/server";
import { Divider } from "./components/divider";

export default function HomePage() {
  return (
    <HydrateClient>
      <main className="container flex h-svh max-w-screen-lg flex-col">
        <div className="flex flex-col items-start justify-start gap-12">
          <div className="flex flex-col gap-4">
            <div className="border-orange-9 -ml-4 flex flex-row border-l-2 pl-4">
              <span className="font-semibold">
                The best way to reach{" "}
                <span className="decoration-blue-9 underline decoration-2 underline-offset-2">
                  your
                </span>{" "}
                health potential
              </span>
            </div>
            <span className="">
              The Potential Platform guides you to reach your unique maximum
              possible health.
            </span>
            <span className="">
              Our Ai coach learns everything about you, from biological to
              psychological, working out the best way to maximize your health.
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
              <span className="font-semibold">
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
              <span className="font-semibold">How it works</span>
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
              <span className="font-semibold">
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
      </main>
    </HydrateClient>
  );
}
