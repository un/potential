import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { colorScheme } from "nativewind";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function iconColor({
  inverse,
  lightColor,
  darkColor,
}: { inverse?: boolean; lightColor?: boolean; darkColor?: boolean } = {}) {
  const lightColorValue = "#f9f9f8";
  const darkColorValue = "#191918";

  if (lightColor) return lightColorValue;
  if (darkColor) return darkColorValue;

  const theme = colorScheme.get();

  return !inverse
    ? theme === "dark"
      ? lightColorValue
      : darkColorValue
    : theme === "dark"
      ? darkColorValue
      : lightColorValue;
}
