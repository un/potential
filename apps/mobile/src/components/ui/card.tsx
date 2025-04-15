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
        "bg-sand-1 border-sand-6 flex flex-col gap-4 rounded-lg border p-6 shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </View>
  );
}
