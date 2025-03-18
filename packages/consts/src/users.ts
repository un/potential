export const genderAtBirth = {
  male: "Male",
  female: "Female",
} as const;

export const genderAtBirthValues = Object.keys(genderAtBirth);

export type GenderAtBirth = keyof typeof genderAtBirth;
