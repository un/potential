"use client";

import * as React from "react";
import Image from "next/image";

const Frame1 = () => (
  <Image
    src="/images/branding/heart/sprite/1-1.svg"
    alt="Heart"
    unoptimized
    width={528}
    height={432}
  />
);

const Frame2 = () => (
  <Image
    src="/images/branding/heart/sprite/1-2.svg"
    alt="Heart"
    unoptimized
    width={528}
    height={432}
  />
);

const Frame3 = () => (
  <Image
    src="/images/branding/heart/sprite/1-3.svg"
    alt="Heart"
    unoptimized
    width={528}
    height={432}
  />
);

const Frame4 = () => (
  <Image
    src="/images/branding/heart/sprite/1-4.svg"
    alt="Heart"
    unoptimized
    width={528}
    height={432}
  />
);

const Frame5 = () => (
  <Image
    src="/images/branding/heart/sprite/1-5.svg"
    alt="Heart"
    unoptimized
    width={528}
    height={432}
  />
);

const Frame6 = () => (
  <Image
    src="/images/branding/heart/sprite/1-6.svg"
    alt="Heart"
    unoptimized
    width={528}
    height={432}
  />
);

const Frame7 = () => (
  <Image
    src="/images/branding/heart/sprite/1-7.svg"
    alt="Heart"
    unoptimized
    width={528}
    height={432}
  />
);

const Frame8 = () => (
  <Image
    src="/images/branding/heart/sprite/1-8.svg"
    alt="Heart"
    unoptimized
    width={528}
    height={432}
  />
);

const Frame9 = () => (
  <Image
    src="/images/branding/heart/sprite/1-9.svg"
    alt="Heart"
    unoptimized
    width={528}
    height={432}
  />
);

const Frame10 = () => (
  <Image
    src="/images/branding/heart/sprite/1-10.svg"
    alt="Heart"
    unoptimized
    width={528}
    height={432}
  />
);

const Frame11 = () => (
  <Image
    src="/images/branding/heart/sprite/1-11.svg"
    alt="Heart"
    unoptimized
    width={528}
    height={432}
  />
);

const Frame12 = () => (
  <Image
    src="/images/branding/heart/sprite/1-12.svg"
    alt="Heart"
    unoptimized
    width={528}
    height={432}
  />
);

const Frame13 = () => (
  <Image
    src="/images/branding/heart/sprite/1-13.svg"
    alt="Heart"
    unoptimized
    width={528}
    height={432}
  />
);

const Frame14 = () => (
  <Image
    src="/images/branding/heart/sprite/1-14.svg"
    alt="Heart"
    unoptimized
    width={528}
    height={432}
  />
);

const Frame15 = () => (
  <Image
    src="/images/branding/heart/sprite/1-15.svg"
    alt="Heart"
    unoptimized
    width={528}
    height={432}
  />
);

const Frame16 = () => (
  <Image
    src="/images/branding/heart/sprite/1-16.svg"
    alt="Heart"
    unoptimized
    width={528}
    height={432}
  />
);

const Frame17 = () => (
  <Image
    src="/images/branding/heart/sprite/1-17.svg"
    alt="Heart"
    unoptimized
    width={528}
    height={432}
  />
);

const Frame18 = () => (
  <Image
    src="/images/branding/heart/sprite/1-18.svg"
    alt="Heart"
    unoptimized
    width={528}
    height={432}
  />
);

const AnimatedHeart: React.FC<{ bpm?: number }> = ({ bpm = 42 }) => {
  const [currentFrame, setCurrentFrame] = React.useState(0);
  const frames = [
    Frame1,
    Frame2,
    Frame3,
    Frame4,
    Frame5,
    Frame6,
    Frame7,
    Frame8,
    Frame9,
    Frame10,
    Frame11,
    Frame12,
    Frame13,
    Frame14,
    Frame15,
    Frame16,
    Frame17,
    Frame18,
  ];

  React.useEffect(() => {
    // Promise-based timeout function
    const sleep = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    let isAnimating = true;

    // Add a debug delay factor
    const debugDelayFactor = 1;

    // Calculate milliseconds per beat (60,000ms / bpm)
    const msPerBeat = ((60 * 1000) / bpm) * debugDelayFactor;

    // A full heartbeat consists of all frames
    // Each frame should take an equal portion of one beat
    const msPerFrame = msPerBeat / frames.length;

    // Async animation function
    const animate = async () => {
      let frameIndex = 0;

      while (isAnimating) {
        // Render the current frame
        setCurrentFrame(frameIndex);
        console.log(`Showing frame ${frameIndex}, delay: ${msPerFrame}ms`);

        // Wait for the frame duration
        await sleep(msPerFrame);

        // Move to next frame
        frameIndex = (frameIndex + 1) % frames.length;

        // If we completed a full cycle, add an extra pause before starting again
        if (frameIndex === 0) {
          console.log(`End of cycle pause: ${msPerBeat}ms`);
          await sleep(msPerBeat);
        }
      }
    };

    // Start the animation
    console.log(`Starting animation with ${msPerFrame}ms per frame`);
    animate().catch((err) => console.error("Animation error:", err));

    // Cleanup
    return () => {
      isAnimating = false;
    };
  }, [frames.length, bpm]);

  const FrameComponent = frames[currentFrame];

  return FrameComponent ? (
    <div className="w-100 aspect-square overflow-hidden">
      <FrameComponent />
    </div>
  ) : null;
};

export { AnimatedHeart };
