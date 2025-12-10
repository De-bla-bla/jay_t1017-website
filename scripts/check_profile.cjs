#!/usr/bin/env node
const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL not set'); process.exit(1);
}
(async ()=>{
  const pool = new Pool({ connectionString, ssl:{ rejectUnauthorized:false } });
  try{
    const res = await pool.query('SELECT id, artist_name, bio, profile_image FROM admin_profile LIMIT 10');
    console.log('admin_profile rows:', res.rows.length);
    res.rows.forEach(r=>console.log(r));
  }catch(err){
    console.error('Query error:', err.message);
    process.exitCode=2;
  } finally{ await pool.end(); }
})();
