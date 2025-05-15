import { accountRouter } from "./account";
import { profileRouter } from "./profile";

export const userRouter = {
  profile: profileRouter,
  account: accountRouter,
};
