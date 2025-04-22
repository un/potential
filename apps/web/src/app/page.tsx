import { Suspense } from "react";

import { HydrateClient } from "~/trpc/server";
import { AnimatedHeart } from "./_components/branding/heart-sprite";

// import { PostCardSkeleton } from "./_components/posts";

export default function HomePage() {
  return (
    <HydrateClient>
      <main className="container h-screen py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Create <span className="text-primary">T3</span> Turbo
          </h1>
          {/* <AuthShowcase /> */}

          {/* <CreatePostForm /> */}
          <div className="w-full max-w-2xl overflow-y-scroll">
            <Suspense
              fallback={
                <div className="flex w-full flex-col gap-4">
                  {/* <PostCardSkeleton />
                  <PostCardSkeleton />
                  <PostCardSkeleton /> */}
                </div>
              }
            >
              {/* <PostList /> */}
            </Suspense>

            <AnimatedHeart />
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
