import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import merchRoutes from "./routes/merch.js";
import adminRoutes from "./routes/admin.js";
import musicRoutes from "./routes/music.js";
import newsletterRoutes from "./routes/newsletter.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import pool from "./config/database.js";

dotenv.config();

// Ensure database tables exist on startup
async function ensureTables() {
  try {
    console.log('🔍 Ensuring database tables exist...');
    console.log(`DATABASE_URL set: ${process.env.DATABASE_URL ? 'Yes' : 'No'}`);
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
    
    // Test connection first
    const testResult = await pool.query('SELECT NOW()');
    console.log(`database connected`);

    // Create admin_profile table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_profile (
        id SERIAL PRIMARY KEY,
        artist_name VARCHAR(255),
        bio TEXT,
        profile_image TEXT,
        hero_image TEXT,
        social_links JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Add hero_image column if it doesn't exist (migration)
    await pool.query(`
      ALTER TABLE admin_profile
      ADD COLUMN IF NOT EXISTS hero_image TEXT;
    `);

    // Create merch table if it doesn't exist
    await pool.query(`
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
    `);

    // Create orders table if it doesn't exist
    await pool.query(`
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
    `);

    // Create page_visits table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS page_visits (
        id SERIAL PRIMARY KEY,
        page VARCHAR(255),
        user_agent TEXT,
        ip_address VARCHAR(45),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create newsletter_subscribers table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create music table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS music (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        artist VARCHAR(255),
        url TEXT NOT NULL,
        platform VARCHAR(50),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('all tables ready');
  } catch (err) {
    console.error('⚠ Error ensuring tables:', err.message);
    console.error('  Stack:', err.stack);
    console.error('  Server will continue, but database operations may fail');
  }
}

// Run table initialization
ensureTables();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/merch", merchRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/music", musicRoutes);
app.use("/api/newsletter", newsletterRoutes);

// Serve client static files when in production or when build exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDist = path.join(__dirname, "..", "client", "dist");

// Serve client if built (client/dist) or when explicitly requested
if (process.env.NODE_ENV === "production" || process.env.SERVE_CLIENT === "true" || fs.existsSync(clientDist)) {
  // Intercept index.html requests to inject runtime config BEFORE express.static serves it
  app.get('/', (req, res) => {
    const indexPath = path.join(clientDist, 'index.html');
    if (fs.existsSync(indexPath)) {
      try {
        let indexHtml = fs.readFileSync(indexPath, 'utf8');
        const runtimeConfig = {
          VITE_FILESTACK_API_KEY: process.env.VITE_FILESTACK_API_KEY || '',
          VITE_API_URL: process.env.VITE_API_URL || '',
        };
        const injectScript = `<script>window.__RUNTIME__=${JSON.stringify(runtimeConfig)};</script>`;
        indexHtml = indexHtml.replace('</head>', injectScript + '</head>');
        res.set('Content-Type', 'text/html; charset=utf-8');
        return res.send(indexHtml);
      } catch (err) {
        console.error('Error injecting runtime config:', err);
        res.set('Content-Type', 'text/html; charset=utf-8');
        return res.sendFile(indexPath);
      }
    }
    res.status(404).send('Not found');
  });

  // Serve other static files
  app.use(express.static(clientDist));

  // SPA fallback for non-API requests (handle client-side routes)
  app.use((req, res, next) => {
    if (req.method !== 'GET') return next();
    if (req.path.startsWith('/api')) return next();
    const indexPath = path.join(clientDist, 'index.html');
    if (fs.existsSync(indexPath)) {
      try {
        let indexHtml = fs.readFileSync(indexPath, 'utf8');
        const runtimeConfig = {
          VITE_FILESTACK_API_KEY: process.env.VITE_FILESTACK_API_KEY || '',
          VITE_API_URL: process.env.VITE_API_URL || '',
        };
        const injectScript = `<script>window.__RUNTIME__=${JSON.stringify(runtimeConfig)};</script>`;
        indexHtml = indexHtml.replace('</head>', injectScript + '</head>');
        res.set('Content-Type', 'text/html; charset=utf-8');
        return res.send(indexHtml);
      } catch (err) {
        console.error('Error injecting runtime config:', err);
        res.set('Content-Type', 'text/html; charset=utf-8');
        return res.sendFile(indexPath);
      }
    }
    return next();
  });
}

// basic status
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "Server is running",
    runtimeConfig: {
      hasFilestackKey: !!process.env.VITE_FILESTACK_API_KEY,
      hasApiUrl: !!process.env.VITE_API_URL,
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`status endpoint: http://localhost:${PORT}/api/health`);
});
