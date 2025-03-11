export enum Minerals {
  SODIUM = "Sodium",
  MAGNESIUM = "Magnesium",
  CALCIUM = "Calcium",
  IRON = "Iron",
  ZINC = "Zinc",
  POTASSIUM = "Potassium",
  COPPER = "Copper",
  MANGANESE = "Manganese",
  SELENIUM = "Selenium",
  PHOSPHORUS = "Phosphorus",
  CHROMIUM = "Chromium",
  IODINE = "Iodine",
  MOLYBDENUM = "Molybdenum",
  CHLORIDE = "Chloride",
  FLUORIDE = "Fluoride",
  BORON = "Boron",
  SULFUR = "Sulfur",
}

export const MINERALS_ARRAY = Object.values(Minerals);
export const MINERALS_ARRAY_AS_ENUM = [
  ...(MINERALS_ARRAY as [string, ...string[]]),
] as const;

export enum Vitamins {
  A = "A",
  C = "C",
  D = "D",
  E = "E",
  K = "K",
  B1 = "B1",
  B2 = "B2",
  B3 = "B3",
  B5 = "B5",
  B6 = "B6",
  B7 = "B7",
  B9 = "B9",
  B12 = "B12",
  CHOLINE = "Choline",
  FOLATE = "Folate",
  NIACIN = "Niacin",
  PANTOTHENIC_ACID = "Pantothenic Acid",
  RIBOFLAVIN = "Riboflavin",
  THIAMIN = "Thiamin",
  BIOTIN = "Biotin",
  COBALAMIN = "Cobalamin",
  PYRIDOXINE = "Pyridoxine",
  RETINOL = "Retinol",
  BETA_CAROTENE = "Beta Carotene",
  ALPHA_TOCOPHEROL = "Alpha Tocopherol",
  PHYLLOQUINONE = "Phylloquinone",
  MENAQUINONE = "Menaquinone",
  ASCORBIC_ACID = "Ascorbic Acid",
}
export const VITAMINS_ARRAY = Object.values(Vitamins);
export const VITAMINS_ARRAY_AS_ENUM = [
  ...(VITAMINS_ARRAY as [string, ...string[]]),
] as const;
