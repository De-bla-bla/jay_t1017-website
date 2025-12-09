# 🎯 COMPLETE POSTGRESQL INSTALLATION & DATABASE SETUP

## ⚠️ PostgreSQL is NOT Installed Yet

Your system doesn't have PostgreSQL installed. Here's how to install it:

---

## STEP 1: DOWNLOAD POSTGRESQL

1. **Go to:** https://www.postgresql.org/download/windows/
2. **Click:** "Download the installer"
3. **Choose:** PostgreSQL 16 or latest version
4. **Save** the installer to your Downloads folder

---

## STEP 2: INSTALL POSTGRESQL

1. **Run the installer** (double-click the `.exe` file)
2. **Follow the setup wizard:**
   - Click "Next" for most screens
   - **Installation directory:** Keep default (`C:\Program Files\PostgreSQL\16`)
   - **Port:** Keep **5432** (default)
   - **Username:** `postgres` (default)
   - **Password:** Choose a strong password (e.g., `MySecurePass123!`)
     - ⚠️ **IMPORTANT:** Remember this password!
   - **Locale:** Your country
   - Click "Next" until done

3. **Uncheck "Launch Stack Builder"** at the end
4. Click "Finish"

---

## STEP 3: VERIFY INSTALLATION

Open PowerShell and run:

```powershell
$env:Path -split ';' | Where-Object { $_ -like '*PostgreSQL*' }
```

If nothing shows, add PostgreSQL to PATH manually:

1. Right-click "This PC" → "Properties"
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Under "System variables", find and edit `Path`
5. Click "New" and add: `C:\Program Files\PostgreSQL\16\bin`
6. Click "OK" three times
7. **Restart PowerShell**

---

## STEP 4: OPEN POSTGRESQL COMMAND LINE

```powershell
psql -U postgres
```

**It will ask for your password.** Enter the password you set during installation.

You should see:
```
postgres=#
```

✅ If you see this, you're connected!

---

## STEP 5: IMPORT YOUR DATABASE

**While connected to PostgreSQL** (at the `postgres=#` prompt), run:

```sql
\i d:/JayT1017-Website/jayt1017.sql
```

**Expected output:**
```
DROP DATABASE
CREATE DATABASE
CREATE TABLE
INSERT 0 3
INSERT 0 1
INSERT 0 2
INSERT 0 1
```

✅ If you see this, your database is created!

---

## STEP 6: VERIFY DATABASE WAS CREATED

Still in PostgreSQL, run:

```sql
\l
```

You should see `jayt1017` in the list of databases.

Then run:

```sql
\c jayt1017
```

You should see:
```
You are now connected to database "jayt1017" as user "postgres".
```

---

## STEP 7: CHECK YOUR DATA

```sql
SELECT * FROM merch;
```

You should see your 3 merchandise items. Exit:

```sql
\q
```

---

## STEP 8: UPDATE YOUR `.env` FILE

Edit: `server/.env`

Change:
```
DB_PASSWORD=password
```

To:
```
DB_PASSWORD=MySecurePass123!
```

(Use the password you set during PostgreSQL installation)

---

## STEP 9: RESTART YOUR SERVER

```powershell
cd d:\JayT1017-Website
node server/index.js
```

Should show:
```
🚀 Server running on http://localhost:5000
```

---

## STEP 10: TEST IN BROWSER

1. Refresh `http://localhost:5173/admin`
2. Login: `JayT1017` / `Ametepe1920@`
3. Go to **Merch** tab
4. Try **Edit** and **Delete** buttons ✅

---

## ✅ FINAL CHECKLIST

- [ ] PostgreSQL installed
- [ ] Database `jayt1017` created
- [ ] Tables created (merch, admin_profile, orders, page_visits)
- [ ] Sample data inserted
- [ ] `.env` file updated with correct password
- [ ] Backend server running
- [ ] Frontend running at http://localhost:5173
- [ ] Edit/Delete buttons work in admin panel

---

## 🆘 NEED HELP?

**Error: `psql: command not found`**
- Add PostgreSQL to PATH and restart PowerShell

**Error: `password authentication failed`**
- Check your password in `.env` matches what you set during installation

**Error: `database "jayt1017" does not exist`**
- Run the SQL import again

**Error: `relation "merch" does not exist`**
- Run `\i d:/JayT1017-Website/jayt1017.sql` again

---

**Once you complete these steps, your website will be fully functional!** 🚀
