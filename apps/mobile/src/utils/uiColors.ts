export const uiColors = [
  "tomato",
  "red",
  "ruby",
  "crimson",
  "pink",
  "plum",
  "purple",
  "violet",
  "iris",
  "indigo",
  "blue",
  "cyan",
  "teal",
  "jade",
  "green",
  "grass",
  "bronze",
  "gold",
  "brown",
  "orange",
] as const;
export type UiColor = (typeof uiColors)[number];

export const uiColorsBright = [
  "sky",
  "mint",
  "lime",
  "yellow",
  "amber",
] as const;

export type UiColorBright = (typeof uiColorsBright)[number];
