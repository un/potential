import { Platform } from "react-native";
import structuredCloneImpl from "@ungap/structured-clone";

if (Platform.OS !== "web") {
  const setupPolyfills = async (): Promise<void> => {
    // @ts-expect-error - Dynamic import types are hard to manage
    const polyfillFunctions = await import(
      "react-native/Libraries/Utilities/PolyfillFunctions"
    );
    // @ts-expect-error - Dynamic import types are hard to manage
    const streamsTextEncoding = await import(
      "@stardazed/streams-text-encoding"
    );

    const polyfillGlobal = polyfillFunctions.polyfillGlobal as (
      name: string,
      getValue: () => unknown,
    ) => void;
    const TextEncoderStream =
      streamsTextEncoding.TextEncoderStream as typeof globalThis.TextEncoderStream;
    const TextDecoderStream =
      streamsTextEncoding.TextDecoderStream as typeof globalThis.TextDecoderStream;

    if (!("structuredClone" in global)) {
      polyfillGlobal("structuredClone", () => structuredCloneImpl);
    }

    polyfillGlobal("TextEncoderStream", () => TextEncoderStream);
    polyfillGlobal("TextDecoderStream", () => TextDecoderStream);
  };

  void setupPolyfills();
}

export {};
