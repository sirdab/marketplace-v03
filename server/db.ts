import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

const { Pool } = pg;

const connectionString = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "Database connection string not found. Please set SUPABASE_DATABASE_URL or DATABASE_URL environment variable."
  );
}

export const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : (process.env.SUPABASE_DATABASE_URL ? { rejectUnauthorized: false } : false),
});

export const db = drizzle(pool, { schema });
