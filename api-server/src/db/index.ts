import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";
import { logger } from "../lib/logger";

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  logger.warn(
    "DATABASE_URL not set. Database operations will fail. Set DATABASE_URL environment variable to enable database features."
  );
}

export const pool = new Pool({
  connectionString: databaseUrl || "postgresql://localhost:5432/greece_db",
  // Don't fail on connection error during initialization
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Handle pool errors gracefully
pool.on("error", (err) => {
  logger.error({ err }, "Unexpected error on idle client");
});

export const db = drizzle(pool, { schema });

export * from "./schema";
