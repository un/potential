import type { ViewProps } from "react-native";
import React from "react";
import { View } from "react-native";

import { cn } from "~/utils/ui";

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <View
      className={cn(
        "bg-sand-1 border-sand-6 flex flex-col gap-0 rounded-lg border px-6 py-4 shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </View>
  );
}
