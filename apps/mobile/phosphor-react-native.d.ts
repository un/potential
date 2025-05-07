declare module "phosphor-react-native/lib/module" {
  import type * as React from "react";

  export interface IconContextProps {
    color?: string;
    size?: string | number;
    weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
    mirrored?: boolean;
  }

  export interface IconContext {
    Provider: React.Provider<IconContextProps>;
    Consumer: React.Consumer<IconContextProps>;
  }

  export const IconContext: IconContext;
}
