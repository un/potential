declare module "phosphor-react-native" {
  // Re-export all named exports from the actual ESM module.
  // This should bring in types for icons like CaretLeft, X, etc.,
  // if "phosphor-react-native/lib/module" has its own type definitions.
  export * from "phosphor-react-native/lib/typescript/index";

  // Now, include your specific definitions for IconContext.
  // These will either add to or override what's exported from "phosphor-react-native/lib/module"
  // when you import from "phosphor-react-native".

  // export interface IconContextProps {
  //   color?: string;
  //   size?: string | number;
  //   weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
  //   mirrored?: boolean;
  // }

  // export interface IconContext {
  //   Provider: React.Provider<IconContextProps>;
  //   Consumer: React.Consumer<IconContextProps>;
  // }

  // export const IconContext: IconContext;
}
