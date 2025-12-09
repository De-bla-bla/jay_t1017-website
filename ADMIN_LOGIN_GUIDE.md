# 🔓 Admin Login Guide

## Issue: 404 Error at `/admin/dashboard`

The dashboard is **protected** - you must log in first!

---

## ✅ Correct Steps

### Step 1: Go to Login Page
```
URL: http://localhost:5174/admin
(NOT /admin/dashboard yet)
```

### Step 2: Enter Credentials
```
Username: JayT1017
Password: Ametepe1920@
```

### Step 3: Click "Login"
```
System processes login
Redirects to /admin/dashboard automatically
```

### Step 4: See Admin Dashboard
```
✅ Dashboard loads
✅ You're in!
```

---

## What Routes Exist

| URL | Purpose | Access |
|-----|---------|--------|
| `/` | Home page | Public ✅ |
| `/cart` | Shopping cart | Public ✅ |
| `/admin` | Login page | Public ✅ |
| `/admin/dashboard` | Admin panel | Protected 🔐 |

---

## Protected Route Explained

The admin dashboard is **protected** because:
- ✅ Uses sessionStorage authentication
- ✅ Checks for `admin_authenticated` flag
- ✅ Redirects to login if not authenticated
- ✅ Can't access directly without logging in

---

## Try This Now

### Step 1: Visit Login
```
http://localhost:5174/admin
```
Should see: **JayT1017 Admin Panel login form**

### Step 2: Enter Credentials
```
Username: JayT1017
Password: Ametepe1920@
```

### Step 3: Click Login Button
```
Page redirects automatically
```

### Step 4: Dashboard Appears
```
Should see:
- 📊 Dashboard Overview
- 🎵 Music tab
- 🛍️ Merchandise tab
- 👤 Profile tab
- ⚙️ Settings tab
```

---

## If Still Getting 404

**Check:**
1. Dev server running? (See http://localhost:5174 loads)
2. Browser cache cleared? (Ctrl+Shift+Del)
3. Tried login page first? (http://localhost:5174/admin)

---

## Admin Credentials Reference

```
Username: JayT1017
Password: Ametepe1920@
```

**Important:** These are hardcoded in AdminLogin.jsx for development.

---

## Session Storage

When you log in:
1. Credentials validated
2. `sessionStorage.setItem("admin_authenticated", "true")`
3. Login time stored
4. Redirected to dashboard
5. AdminDashboard checks sessionStorage on mount
6. If not authenticated → redirected back to login

---

## Correct URL Order

```
1st Time:  http://localhost:5174/admin          (Login)
   ↓
   Enter: JayT1017 / Ametepe1920@
   ↓
2nd Visit: http://localhost:5174/admin/dashboard (Dashboard)
```

---

## Quick Checklist

- [ ] Dev server running on 5174
- [ ] Go to http://localhost:5174/admin
- [ ] See login form
- [ ] Enter JayT1017 / Ametepe1920@
- [ ] Click Login
- [ ] Redirected to dashboard
- [ ] See admin features ✅

---

## Upload Features (After Login)

Once logged in, you can:
- 📸 Upload profile photo
- 🖼️ Upload product images
- 🎵 Add music tracks
- 🛍️ Manage merchandise
- 👤 Edit profile
- ⚙️ Adjust settings

---

## If Credentials Wrong

**Error shows:** "Invalid username or password"
**Solution:** 
1. Check spelling of username
2. Check password exactly: `Ametepe1920@` (with @ symbol)
3. Try again

---

## Bookmark These URLs

| Page | URL | Use |
|------|-----|-----|
| Home | http://localhost:5174/ | View site |
| Login | http://localhost:5174/admin | Log in |
| Dashboard | http://localhost:5174/admin/dashboard | Manage content |
| Cart | http://localhost:5174/cart | Shopping cart |

---

## You're Ready!

1. Visit: **http://localhost:5174/admin**
2. Login with provided credentials
3. Access dashboard
4. Try uploading files! 📸

---

## Status

```
✅ Routes configured correctly
✅ Login page working
✅ Authentication active
✅ Dashboard protected
✅ Ready to use!
```

**Go to login page now!** →  http://localhost:5174/admin
