import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

// Support DATABASE_URL (Railway, Heroku, etc.) or individual DB_* env vars
const connectionString = process.env.DATABASE_URL || null;

const poolConfig = connectionString
  ? {
      connectionString,
      // Railway requires SSL for Postgres connections
      ssl: process.env.NODE_ENV === "production" || process.env.DB_SSL !== "false"
        ? { rejectUnauthorized: false }
        : false,
      // Add timeout and other Railway-friendly settings
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
      max: 20,
    }
  : {
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "password",
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
      database: process.env.DB_NAME || "jayt1017",
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    };

console.log(`Database config: ${connectionString ? 'Using DATABASE_URL (SSL enabled)' : 'Using individual DB_* env vars'}`);
if (!connectionString && process.env.NODE_ENV === "production") {
  console.warn('DATABASE_URL not set — check Railway environment variables');
}

const pool = new Pool(poolConfig);

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

export default pool;
