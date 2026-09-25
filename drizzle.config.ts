import { Config } from "drizzle-kit";

const defineConfig = {
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  schema: "./src/server/db/schema.ts",
} as Config;

export default defineConfig;
