import * as airSchema from "./schema/air";
import * as authSchema from "./schema/auth";
import * as consumptionSchema from "./schema/consumption";
import * as integrationSchema from "./schema/integration";
import * as sleepSchema from "./schema/sleep";
import * as userSchema from "./schema/user";

export const schema = {
  ...airSchema,
  ...authSchema,
  ...consumptionSchema,
  ...integrationSchema,
  ...sleepSchema,
  ...userSchema,
};
