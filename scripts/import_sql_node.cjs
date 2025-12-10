#!/usr/bin/env node
// Import a SQL file into Postgres using node-postgres
// Usage: set DATABASE_URL env var and run `node import_sql_node.cjs ../jayt1017.sql`

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
    let sql = fs.readFileSync(fileArg, 'utf8');
    // Clean psql meta-commands that start with a backslash and REMOVE any database create/drop/connect statements
    const lines = sql.split(/\r?\n/).filter(l => !l.trim().startsWith('\\'));
    sql = lines.join('\n');
    // Remove top-level CREATE/DROP DATABASE statements (they can't be run when connected to the target DB)
    sql = sql.replace(/DROP DATABASE IF EXISTS[\s\S]*?;?/gi, '');
    sql = sql.replace(/CREATE DATABASE[\s\S]*?;?/gi, '');
    // Remove explicit psql \c or CONNECT statements if present
    sql = sql.replace(/\\c[\s\S]*?;?/gi, '');
    sql = sql.replace(/\\connect[\s\S]*?;?/gi, '');
    const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
    console.log('Connecting to', connectionString.split('@')[1]);
    const client = await pool.connect();
    try {
      console.log('Running SQL file (cleaned):', fileArg);
      await client.query('BEGIN');
      // execute statements; some files include many statements — run as a single multi-statement query
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
