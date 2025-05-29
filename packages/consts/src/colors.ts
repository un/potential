import { z } from "zod";

export const COLORS = {
  bronze: "Bronze",
  gold: "Gold",
  brown: "Brown",
  orange: "Orange",
  tomato: "Tomato",
  red: "Red",
  ruby: "Ruby",
  crimson: "Crimson",
  pink: "Pink",
  plum: "Plum",
  purple: "Purple",
  violet: "Violet",
  iris: "Iris",
  indigo: "Indigo",
  blue: "Blue",
  cyan: "Cyan",
  teal: "Teal",
  jade: "Jade",
  green: "Green",
  grass: "Grass",
} as const;

export type ColorsMap = typeof COLORS;
export type ColorsKey = keyof ColorsMap;
export type ColorsValues = ColorsMap[ColorsKey];

export const colorsArray = Object.values(COLORS);

export const colorsSchema = z
  .enum(Object.keys(COLORS) as [ColorsKey, ...ColorsKey[]])
  .describe(
    "The color of the trackable item. This might change the color of the trackable item in the UI. Possible values are: " +
      Object.values(colorsArray).join(", "),
  );
export type ColorsSchema = z.infer<typeof colorsSchema>;

export function getColorDisplayValue(key: ColorsKey): string {
  return COLORS[key];
}

export function getRandomColor(): ColorsKey {
  const keys = Object.keys(COLORS) as ColorsKey[];
  return keys[Math.floor(Math.random() * keys.length)] ?? "red";
}
