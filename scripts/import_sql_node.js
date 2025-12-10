#!/usr/bin/env node
// Import a SQL file into Postgres using node-postgres
// Usage: set DATABASE_URL env var and run `node import_sql_node.js ../jayt1017.sql`

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const fileArg = process.argv[2] || path.join(__dirname, '..', 'jayt1017.sql');
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('ERROR: DATABASE_URL env var not set');
  process.exit(1);
}

async function run() {
  try {
    const sql = fs.readFileSync(fileArg, 'utf8');
    const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
    console.log('Connecting to', connectionString.split('@')[1]);
    const client = await pool.connect();
    try {
      console.log('Running SQL file:', fileArg);
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('COMMIT');
      console.log('SQL import completed');
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Import failed:', err.message);
      process.exitCode = 2;
    } finally {
      client.release();
    }
    // show tables
    const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name");
    console.log('Tables in public schema:');
    res.rows.forEach(r => console.log(' -', r.table_name));
    await pool.end();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

run();
