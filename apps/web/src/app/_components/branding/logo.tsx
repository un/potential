import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import Image from "next/image";
import { cva } from "class-variance-authority";

import { cn } from "~/lib/utils";

const logoVariants = cva("relative flex flex-col items-center justify-center", {
  variants: {
    size: {
      tiny: "size-3 max-h-3 min-h-3 min-w-3 max-w-3",
      sm: "size-4 max-h-4 min-h-4 min-w-4 max-w-4",
      md: "size-6 max-h-6 min-h-6 min-w-6 max-w-6",
      lg: "size-9 max-h-9 min-h-9 min-w-9 max-w-9",
      xl: "size-12 max-h-12 min-h-12 min-w-12 max-w-12",
      "2xl": "size-16 max-h-16 min-h-16 min-w-16 max-w-16",
      "3xl": "size-32 max-h-32 min-h-32 min-w-32 max-w-32",
      mega: "size-64 max-h-64 min-h-64 min-w-64 max-w-64",
    },
  },
  defaultVariants: {
    size: "3xl",
  },
});

export const Logo: React.FC<VariantProps<typeof logoVariants>> = ({ size }) => (
  <div className={cn(logoVariants({ size }))}>
    <Image src="/images/branding/logo-ph-dark.svg" alt="1up" fill />
  </div>
);
