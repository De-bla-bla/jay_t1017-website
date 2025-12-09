# 🚀 QUICK DATABASE SETUP GUIDE

## Step 1: Make Sure PostgreSQL is Installed & Running

**Check if PostgreSQL is running:**
```powershell
Get-Service -Name postgresql-*
```

**If not running, start it:**
```powershell
Start-Service -Name postgresql-x64-16  # (adjust version number if needed)
```

---

## Step 2: Import the SQL File

The SQL file `jayt1017.sql` is ready in your project root folder.

**Option A: Import via Command Line (RECOMMENDED)**

Open PowerShell and run:

```powershell
cd d:\JayT1017-Website
psql -U postgres -f jayt1017.sql
```

When prompted, enter your PostgreSQL password (the one you set during installation).

**Expected output:**
```
DROP DATABASE
CREATE DATABASE
CREATE TABLE
INSERT 0 3
CREATE TABLE
INSERT 0 1
CREATE TABLE
INSERT 0 2
CREATE TABLE
INSERT 0 1
```

✅ If you see this, the database was created successfully!

---

**Option B: Import via pgAdmin (GUI)**

1. Open pgAdmin (search for it in Windows)
2. Right-click on "Databases" → "Create" → "Database"
3. Name it: `jayt1017`
4. Right-click the new database → "Query Tool"
5. Open `jayt1017.sql` and paste the content
6. Click "Execute"

---

## Step 3: Update Your `.env` File

Edit `server/.env` and make sure it has:

```
DB_USER=postgres
DB_PASSWORD=YOUR_POSTGRES_PASSWORD_HERE
DB_HOST=localhost
DB_PORT=5432
DB_NAME=jayt1017
```

**Replace `YOUR_POSTGRES_PASSWORD_HERE` with the password you set during PostgreSQL installation.**

---

## Step 4: Restart Your Backend Server

```powershell
cd d:\JayT1017-Website
node server/index.js
```

You should see:
```
🚀 Server running on http://localhost:5000
```

---

## Step 5: Test the Connection

Open PowerShell and run:

```powershell
Invoke-WebRequest -Uri http://localhost:5000/api/merch -UseBasicParsing -Method GET | ConvertFrom-Json
```

**You should see your 3 merch items:**
```
id name                    price original_price category
-- ----                    ----- -------------- --------
 1 JayT1017 T-Shirt          50             75 Apparel
 2 Snapback Cap              35                Accessories
 3 Hoodie                    80            120 Apparel
```

✅ **If you see this, your database is working!**

---

## Step 6: Test Edit & Delete in Browser

1. Open `http://localhost:5173/admin`
2. Login: `JayT1017` / `Ametepe1920@`
3. Go to **Merch** tab
4. Try:
   - ✅ **Edit** an item (change price, click Update)
   - ✅ **Delete** an item (click Delete, confirm)
   - ✅ **Add** a new item (fill form, click Add Item)

All changes should now save to the real database! 🎉

---

## Troubleshooting

### Error: `psql: command not found`
- PostgreSQL is not in your PATH
- Solution: Add `C:\Program Files\PostgreSQL\16\bin` to your System Environment Variables

### Error: `password authentication failed`
- Wrong password in `.env`
- Solution: Update with your actual PostgreSQL password

### Error: `database "jayt1017" already exists`
- Database already created
- Solution: Either drop it first or skip to Step 3

### Error: `relation "merch" does not exist`
- SQL file wasn't imported
- Solution: Run the import command again

---

## Useful Commands

**Verify database exists:**
```powershell
psql -U postgres -l
```

**Connect directly to database:**
```powershell
psql -U postgres -d jayt1017
```

**Inside PostgreSQL, check tables:**
```sql
\dt
SELECT * FROM merch;
\q
```

---

**You're all set! Your database is now ready.** 🎊
