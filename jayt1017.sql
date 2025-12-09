-- ------------------------------------
-- JAYT1017 FULL DATABASE SETUP (POSTGRESQL)
-- Backend: Node.js + Express & pg
-- ------------------------------------

-- 1. CREATE DATABASE
DROP DATABASE IF EXISTS jayt1017;
CREATE DATABASE jayt1017;

-- 2. CONNECT TO DATABASE
\c jayt1017;

-- ========================
-- TABLE: merch
-- ========================
CREATE TABLE merch (
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

-- SAMPLE DATA FOR merch
INSERT INTO merch (name, description, price, original_price, category, image) VALUES
('JayT1017 T-Shirt', 'Classic black t-shirt with JayT1017 logo', 50, 75, 'Apparel', 'https://via.placeholder.com/300x300?text=T-Shirt'),
('Snapback Cap', 'Premium snapback with embroidered logo', 35, NULL, 'Accessories', 'https://via.placeholder.com/300x300?text=Cap'),
('Hoodie', 'Comfortable pullover hoodie', 80, 120, 'Apparel', 'https://via.placeholder.com/300x300?text=Hoodie');

-- ========================
-- TABLE: admin_profile
-- ========================
CREATE TABLE admin_profile (
  id SERIAL PRIMARY KEY,
  artist_name VARCHAR(255),
  bio TEXT,
  profile_image TEXT,
  social_links JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SAMPLE DATA FOR admin_profile
INSERT INTO admin_profile (artist_name, bio, profile_image, social_links) VALUES
('JayT1017', 'Hip-Hop/Trap Artist and Visionary.', 'https://via.placeholder.com/300x300?text=JayT1017', '{"instagram":"https://instagram.com/jayt1017", "tiktok":"https://tiktok.com/@jayt1017"}');

-- ========================
-- TABLE: orders
-- ========================
CREATE TABLE orders (
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

-- SAMPLE DATA FOR orders
INSERT INTO orders (customer_name, customer_phone, items, total, notes, status)
VALUES
('Mark Wilson', '0551234567', '[{"id":1,"quantity":1}]', 50, 'Black T-Shirt (L)', 'pending'),
('Sandra Ofori', '0249876543', '[{"id":3,"quantity":1}]', 80, 'Hoodie (XL)', 'processing');

-- ========================
-- TABLE: page_visits
-- ========================
CREATE TABLE page_visits (
  id SERIAL PRIMARY KEY,
  page VARCHAR(255),
  user_agent TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SAMPLE DATA (optional logs)
INSERT INTO page_visits (page, user_agent, ip_address)
VALUES ('/store', 'Mozilla/5.0', '102.88.25.10');
