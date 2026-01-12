import { defineConfig } from "drizzle-kit";

if (!process.env.VITE_DATABASE_URL) {
  throw new Error("VITE_DATABASE_URL not set, ensure the database is provisioned");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.VITE_DATABASE_URL,
  },
});
