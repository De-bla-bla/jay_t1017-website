import pool from "./config/database.js";

const initDatabase = async () => {
  try {
    // Create merch table
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
      )
    `);

    // Create orders table
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
      )
    `);

    // Create admin_profile table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_profile (
        id SERIAL PRIMARY KEY,
        artist_name VARCHAR(255),
        bio TEXT,
        profile_image TEXT,
        social_links JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create page_visits table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS page_visits (
        id SERIAL PRIMARY KEY,
        page VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert sample merch data
    await pool.query(`
      INSERT INTO merch (name, description, price, original_price, category, image)
      SELECT 'Emo Hoodie - Black', 'Classic black hoodie with JayT1017 branding', 85.00, 100.00, 'Hoodie', 'https://via.placeholder.com/400x500?text=Emo+Hoodie'
      WHERE NOT EXISTS (SELECT 1 FROM merch WHERE name = 'Emo Hoodie - Black')
    `);

    await pool.query(`
      INSERT INTO merch (name, description, price, original_price, category, image)
      SELECT 'Vintage T-Shirt - Purple', 'Premium cotton tee with gradient logo', 35.00, 45.00, 'T-Shirt', 'https://via.placeholder.com/400x500?text=Vintage+Tee'
      WHERE NOT EXISTS (SELECT 1 FROM merch WHERE name = 'Vintage T-Shirt - Purple')
    `);

    await pool.query(`
      INSERT INTO merch (name, description, price, original_price, category, image)
      SELECT 'Cap - Black', 'Adjustable cap with embroidered logo', 25.00, 30.00, 'Cap', 'https://via.placeholder.com/400x500?text=Black+Cap'
      WHERE NOT EXISTS (SELECT 1 FROM merch WHERE name = 'Cap - Black')
    `);

    await pool.query(`
      INSERT INTO merch (name, description, price, original_price, category, image)
      SELECT 'Oversized Tee - White', 'Oversized fit with artistic print', 40.00, 50.00, 'T-Shirt', 'https://via.placeholder.com/400x500?text=Oversized+Tee'
      WHERE NOT EXISTS (SELECT 1 FROM merch WHERE name = 'Oversized Tee - White')
    `);

    console.log("✅ Database tables created successfully");
  } catch (err) {
    console.error("❌ Database initialization error:", err);
  }
};

export default initDatabase;
