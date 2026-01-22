import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "@shared/schema";

// Configure WebSocket for different environments
// In Vercel Edge/Serverless, we might not need ws package
if (typeof globalThis.WebSocket === "undefined") {
  // Node.js environment - use ws package
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ws = require("ws");
  neonConfig.webSocketConstructor = ws;
} else {
  // Browser/Edge environment - use native WebSocket
  neonConfig.webSocketConstructor = globalThis.WebSocket;
}

// In local development we still want the app to run even if DATABASE_URL is missing.
// So we only create a real Pool/drizzle client when DATABASE_URL is provided.

if (process.env.NODE_ENV !== "production") {
  console.log(
    "DATABASE_URL loaded:",
    process.env.DATABASE_URL ? "✓ (Neon/Postgres enabled)" : "✗ (running without real DB)",
  );
}

export let pool: Pool | null = null;
export let db: ReturnType<typeof drizzle> | null = null;

if (process.env.DATABASE_URL) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
}
