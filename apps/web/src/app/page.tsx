import { HydrateClient } from "~/trpc/server";

export default function HomePage() {
  return (
    <HydrateClient>
      <main className="container flex h-svh max-w-screen-lg flex-col">
        <div className="flex flex-col items-start justify-start gap-6">
          <div className="flex flex-col gap-4">
            <div className="border-orange-9 -ml-4 flex flex-row border-l-2 pl-4">
              <span className="font-semibold">
                The best way to reach your health potential
              </span>
            </div>
            <span className="">
              The 1up App and Potential Platform solves ongoing health issues
              and guides you to reach your maximum health potential. The Ai will
              learn about you over time and work out the best way to solve your
              health biologically and psychologically.
            </span>
            <span className="">
              From a simple health improvement like weight management to
              increasing your VO2max - all the way to solving ongoing chronic
              illnesses and helping you live a long and strong life.
            </span>
            <span className="">
              The longer you use the system the more it learns about you and
              what methods and approaches would work for your unique genetic
              makeup.
            </span>
            <span className="">
              You simply ask it what you want and it will make you reach your
              goals.
            </span>
          </div>
          <div className="flex flex-col gap-4">
            <div className="border-orange-9 -ml-4 flex flex-row border-l-2 pl-4">
              <span className="font-semibold">
                Our approach is backed by real people
              </span>
            </div>
            <span className="">
              Science says were all made up of the same cells, and modern
              medicine says one pill should work for everyone.
            </span>
            <span className="">We think thats bullshit</span>
            <span className="">
              So we use actual results from medical journals and tests of our
              users to create a unique treatment path for you.
            </span>
            <span className="">
              The more data you share with our privacy focused Ai, the better
              and faster it can help you change.
            </span>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
