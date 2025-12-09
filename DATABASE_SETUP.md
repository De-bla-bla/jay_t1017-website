# Database Setup Guide for JayT1017 Website

## Overview
Your project uses **PostgreSQL** as the database. You need to:
1. Install PostgreSQL
2. Create a database
3. Create tables
4. Configure your project to connect

---

## Step 1: Install PostgreSQL on Windows

### Option A: Easy Installation (Recommended)
1. Go to: https://www.postgresql.org/download/windows/
2. Download the **Windows installer** (latest version, e.g., PostgreSQL 16 or 17)
3. Run the installer
4. **Important settings during installation:**
   - Installation directory: Keep default (usually `C:\Program Files\PostgreSQL\16`)
   - Port: Keep **5432** (default)
   - Superuser username: `postgres`
   - Password: **Remember this password!** (e.g., `postgres123` or something secure)
   - Launch Stack Builder: Can skip

### Option B: Using Chocolatey (If you have it installed)
```powershell
choco install postgresql -y
```

---

## Step 2: Verify PostgreSQL Installation

1. Open PowerShell as Administrator
2. Run:
```powershell
psql --version
```
Should show something like: `psql (PostgreSQL) 16.1`

If not found, add PostgreSQL to your PATH:
- Go to System Properties → Environment Variables
- Add `C:\Program Files\PostgreSQL\16\bin` to your PATH
- Restart PowerShell

---

## Step 3: Connect to PostgreSQL

Open PowerShell and run:
```powershell
psql -U postgres
```

It will ask for the password you set during installation.

You should see:
```
postgres=#
```

This means you're connected! ✓

---

## Step 4: Create Your Database

Once connected to PostgreSQL (at the `postgres=#` prompt), run these commands:

### 1. Create the database:
```sql
CREATE DATABASE jayt1017;
```

### 2. Connect to your new database:
```sql
\c jayt1017
```

You should see: `You are now connected to database "jayt1017" as user "postgres".`

---

## Step 5: Create Tables

Now run these SQL commands to create the tables your project needs:

```sql
-- Merchandise table
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

-- Admin profile table
CREATE TABLE admin_profile (
  id SERIAL PRIMARY KEY,
  artist_name VARCHAR(255),
  bio TEXT,
  profile_image TEXT,
  social_links JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
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

-- Page visits tracking (optional)
CREATE TABLE page_visits (
  id SERIAL PRIMARY KEY,
  page VARCHAR(255),
  user_agent TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

After each command, you should see: `CREATE TABLE` ✓

---

## Step 6: Add Sample Data (Optional but Recommended)

Add some test merchandise items:

```sql
INSERT INTO merch (name, description, price, original_price, category, image) VALUES
('JayT1017 T-Shirt', 'Classic black t-shirt with JayT1017 logo', 50, 75, 'Apparel', 'https://via.placeholder.com/300x300?text=T-Shirt'),
('Snapback Cap', 'Premium snapback with embroidered logo', 35, NULL, 'Accessories', 'https://via.placeholder.com/300x300?text=Cap'),
('Hoodie', 'Comfortable pullover hoodie', 80, 120, 'Apparel', 'https://via.placeholder.com/300x300?text=Hoodie');
```

Should show: `INSERT 0 3`

Verify data was inserted:
```sql
SELECT * FROM merch;
```

---

## Step 7: Configure Your Project

Edit the `.env` file in your `server` folder:

**File: `server/.env`**
```
# Database Configuration
DB_USER=postgres
DB_PASSWORD=postgres123
DB_HOST=localhost
DB_PORT=5432
DB_NAME=jayt1017

# Admin Credentials
ADMIN_USERNAME=JayT1017
ADMIN_PASSWORD=Ametepe1920@

# Server
PORT=5000
```

**Replace:**
- `DB_PASSWORD=postgres123` → Your actual PostgreSQL password
- Other values only if you changed defaults during installation

---

## Step 8: Test the Connection

1. Exit PostgreSQL:
```sql
\q
```

2. Start your Node.js server:
```powershell
cd d:\JayT1017-Website
node server/index.js
```

Should show:
```
🚀 Server running on http://localhost:5000
```

3. Test the API:
```powershell
Invoke-WebRequest -Uri http://localhost:5000/api/merch -UseBasicParsing -Method GET
```

Should return your merchandise in JSON format! ✓

---

## Troubleshooting

### Error: `connect ECONNREFUSED 127.0.0.1:5432`
- PostgreSQL is not running
- Solution: Start PostgreSQL service
  ```powershell
  # Check if running
  Get-Service -Name postgresql-*
  
  # Start it
  Start-Service -Name postgresql-x64-16  # (version may differ)
  ```

### Error: `password authentication failed`
- Wrong password in `.env`
- Solution: Update `.env` with correct password

### Error: `database "jayt1017" does not exist`
- Database wasn't created
- Solution: Follow Step 4 again

### Error: `relation "merch" does not exist`
- Tables weren't created
- Solution: Follow Step 5 again

---

## Useful PostgreSQL Commands

Once connected (`psql -U postgres`):

```sql
-- List all databases
\l

-- Connect to a database
\c jayt1017

-- List all tables
\dt

-- Show table structure
\d merch

-- View all data in a table
SELECT * FROM merch;

-- Count records
SELECT COUNT(*) FROM merch;

-- Exit PostgreSQL
\q
```

---

## Next Steps

Once set up:
1. ✅ Start PostgreSQL service
2. ✅ Ensure `.env` is configured
3. ✅ Start your Node.js server
4. ✅ Visit `http://localhost:5173/admin` to test CRUD operations

Your Edit and Delete buttons should now work with real database data! 🎉

---

## Need Help?

If you get stuck:
1. Check your `.env` file in `server/` folder
2. Verify PostgreSQL service is running
3. Test connection with: `psql -U postgres -h localhost -d jayt1017`
4. Check server logs for error messages
