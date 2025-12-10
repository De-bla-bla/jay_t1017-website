const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

(async function main() {
  const conn = process.argv[2] || process.env.DATABASE_URL;
  if (!conn) {
    console.error('Usage: node import_sql.cjs <DATABASE_URL>');
    process.exit(1);
  }

  const sqlPath = path.resolve(__dirname, '..', 'jayt1017.sql');
  if (!fs.existsSync(sqlPath)) {
    console.error('Cannot find', sqlPath);
    process.exit(1);
  }

  let sql = fs.readFileSync(sqlPath, 'utf8');

  // Remove psql meta-commands (lines starting with backslash) which cause syntax errors
  sql = sql.split(/\r?\n/).filter(l => !l.trim().startsWith('\\')).join('\n');

  // Remove CREATE/DROP DATABASE statements since we are connected to the target DB
  sql = sql.replace(/\bCREATE\s+DATABASE[\s\S]*?;/gi, '');
  sql = sql.replace(/\bDROP\s+DATABASE[\s\S]*?;/gi, '');

  const useSsl = process.env.DB_SSL === 'true' || (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgresqls://'));
  const client = new Client({
    connectionString: conn,
    ssl: useSsl ? { rejectUnauthorized: false } : false,
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Running SQL import (this may take a moment)...');
    await client.query(sql);
    console.log('SQL import completed. Verifying merch rows...');
    const res = await client.query("SELECT count(*) AS merch_count FROM merch;");
    console.log('merch_count =', res.rows[0].merch_count);
    const sample = await client.query('SELECT id, name, price FROM merch ORDER BY id LIMIT 5;');
    console.log('Sample rows:', sample.rows);
  } catch (err) {
    console.error('Import failed:');
    console.error(err && err.stack ? err.stack : err);
    process.exitCode = 2;
  } finally {
    await client.end();
  }
})();
