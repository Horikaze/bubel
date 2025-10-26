import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import db from "./prisma";
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
    fields: {
      name: "imie",
      image: "zdjecie",
    },
    modelName: "klient",
  },
  database: prismaAdapter(db, {
    provider: "mysql",
  }),
  plugins: [nextCookies()],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
});
