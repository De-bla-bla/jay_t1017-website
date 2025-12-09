import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

// Support DATABASE_URL (Railway, Heroku, etc.) or individual DB_* env vars
const connectionString = process.env.DATABASE_URL || null;

const poolConfig = connectionString
  ? { connectionString, ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false }
  : {
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "password",
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
      database: process.env.DB_NAME || "jayt1017",
    };

const pool = new Pool(poolConfig);

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

export default pool;
