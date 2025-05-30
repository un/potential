import { z } from "zod";

export const GENDER_AT_BIRTH = {
  male: "Male",
  female: "Female",
  other: "Other",
} as const;

export type GenderAtBirthMap = typeof GENDER_AT_BIRTH;
export type GenderAtBirthKey = keyof GenderAtBirthMap;
export type GenderAtBirthValues = GenderAtBirthMap[GenderAtBirthKey];

export const genderAtBirthSchema = z.enum(
  Object.keys(GENDER_AT_BIRTH) as [GenderAtBirthKey, ...GenderAtBirthKey[]],
);
export type GenderAtBirthSchema = z.infer<typeof genderAtBirthSchema>;

export function getGenderAtBirthDisplayValue(key: GenderAtBirthKey): string {
  return GENDER_AT_BIRTH[key];
}
