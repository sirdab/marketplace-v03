import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

const { Pool } = pg;

const connectionString = process.env.VITE_DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "Database connection string not found. Please set VITE_DATABASE_URL environment variable."
  );
}

export const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

export const db = drizzle(pool, { schema });
