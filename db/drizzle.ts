import { config } from "dotenv";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "@/db/schema";
config({ path: ".env" }); // or .env.local
export const db = drizzle(process.env.DATABASE_URL!, {
  schema,
  mode: "default",
});
