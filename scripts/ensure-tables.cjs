/**
 * Ensure all required tables exist in the database
 * Run this on server startup to create missing tables
 */

require('dotenv').config();
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL not set');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function ensureTables() {
  try {
    console.log('🔍 Checking database tables...');

    // Create admin_profile table if it doesn't exist
    const createAdminProfileTable = `
      CREATE TABLE IF NOT EXISTS admin_profile (
        id SERIAL PRIMARY KEY,
        artist_name VARCHAR(255),
        bio TEXT,
        profile_image TEXT,
        social_links JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await pool.query(createAdminProfileTable);
    console.log('✓ admin_profile table ready');

    // Create merch table if it doesn't exist
    const createMerchTable = `
      CREATE TABLE IF NOT EXISTS merch (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        original_price DECIMAL(10, 2),
        category VARCHAR(100),
        image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await pool.query(createMerchTable);
    console.log('✓ merch table ready');

    // Create orders table if it doesn't exist
    const createOrdersTable = `
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(20),
        items JSONB NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        notes TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await pool.query(createOrdersTable);
    console.log('✓ orders table ready');

    // Create page_visits table if it doesn't exist
    const createPageVisitsTable = `
      CREATE TABLE IF NOT EXISTS page_visits (
        id SERIAL PRIMARY KEY,
        page VARCHAR(255),
        user_agent TEXT,
        ip_address VARCHAR(45),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await pool.query(createPageVisitsTable);
    console.log('✓ page_visits table ready');

    console.log('✅ All tables are ready!');
    await pool.end();
  } catch (err) {
    console.error('❌ Error ensuring tables:', err.message);
    process.exit(1);
  }
}

ensureTables();
