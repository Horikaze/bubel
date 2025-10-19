import { db } from "@/db/drizzle";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import * as schema from "@/db/schema";
export const auth = betterAuth({
  user: {
    additionalFields: {
      role: {
        type: "string",
        default: "user",
        required: true,
        defaultValue: "user",
      },
    },
  },
  database: drizzleAdapter(db, {
    provider: "mysql",
    schema: schema,
  }),
  plugins: [nextCookies()],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
});
