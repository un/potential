import { z } from "zod";

export const unused = z.string().describe(
  `This lib is currently not used as we use drizzle-zod for simple schemas
   But as your application grows and you need other validators to share
   with back and frontend, you can put them in here
  `,
);

export const usernameSchema = z
  .string()
  .min(2, {
    message: `Must be at least 2 characters long`,
  })
  .max(32, {
    message: "Must be less than 32 characters",
  })
  .regex(/^[a-zA-Z0-9]*$/, {
    message: "Only letters and numbers",
  });
