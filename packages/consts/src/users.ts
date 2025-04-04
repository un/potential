export const GENDER_AT_BIRTH = {
  male: "Male",
  female: "Female",
  other: "Other",
} as const;

export type GenderAtBirthMap = typeof GENDER_AT_BIRTH;
export type GenderAtBirthKey = keyof GenderAtBirthMap;
export function getGenderAtBirthDisplayValue(key: GenderAtBirthKey): string {
  return GENDER_AT_BIRTH[key];
}
