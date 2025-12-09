# ⚡ QUICK REFERENCE CARD

## 🚀 START HERE

### 1. Start Dev Server
```bash
cd d:\JayT1017-Website\client
npm run dev
```
✅ Go to: http://localhost:5173

### 2. View Admin Panel
✅ Go to: http://localhost:5173/admin
✅ Login: `JayT1017` / `Ametepe1920@`

### 3. Test WhatsApp
✅ Add items to cart
✅ Go to cart page
✅ Click "Proceed to WhatsApp Checkout"
✅ Should open WhatsApp with your order

---

## 📁 KEY FOLDERS

| Folder | Purpose |
|--------|---------|
| `assets/hero/` | Upload banner image here |
| `assets/profile/` | Upload profile picture here |
| `assets/merch/` | Upload product images here |
| `assets/logo/` | Upload logo here |
| `client/src/` | All React code |
| `client/src/pages/` | Homepage & Cart pages |
| `client/src/admin/` | Admin login & dashboard |
| `client/src/components/` | Reusable components |

---

## 🔧 FILES TO EDIT

| File | Purpose | Line |
|------|---------|------|
| `src/pages/Home.jsx` | Update merch items & hero image | 45-80, 120 |
| `src/utils/constants.js` | Update social links & WhatsApp | All |
| `tailwind.config.js` | Change colors | 5-15 |
| `src/components/Navbar.jsx` | Update logo | 15 |

---

## 🎨 CUSTOMIZATION QUICK COMMANDS

### Update Hero Image
Edit `src/pages/Home.jsx` line ~120:
```jsx
src="https://via.placeholder.com/600x600?text=JayT1017+Profile"
→
src="/assets/profile/profile.jpg"
```

### Update WhatsApp Number
Edit `src/utils/constants.js`:
```js
export const WHATSAPP_NUMBER = "+233509749892";
```

### Update Instagram Link
Edit `src/utils/constants.js`:
```js
instagram: "https://www.instagram.com/your-profile"
```

### Add New Merch Item
Edit `src/pages/Home.jsx` (add to merch array):
```js
{
  id: 5,
  name: "Item Name",
  price: 50.00,
  category: "Category",
  image: "/assets/merch/image.jpg"
}
```

---

## 🎯 URLS & ROUTES

| URL | Page |
|-----|------|
| http://localhost:5173 | Homepage |
| http://localhost:5173/cart | Shopping Cart |
| http://localhost:5173/admin | Admin Login |
| http://localhost:5173/admin/dashboard | Admin Dashboard |

---

## 🔐 CREDENTIALS

| Item | Value |
|------|-------|
| Admin Username | JayT1017 |
| Admin Password | Ametepe1920@ |
| WhatsApp Number | +233 50 974 9892 |

---

## 📦 DEPENDENCIES

```bash
# Already installed! Just run:
npm run dev

# If something breaks:
npm install
npm run dev
```

---

## 🐛 QUICK FIXES

### Dev server won't start?
```bash
rm -r node_modules
npm install
npm run dev
```

### Images not showing?
- Check file path is correct
- Confirm file exists in folder
- Try F5 refresh
- Check browser console (F12)

### WhatsApp button not working?
- Check phone number format
- Check internet connection
- Try different browser

### Admin login not working?
- Username: `JayT1017` (case-sensitive)
- Password: `Ametepe1920@` (exact match)

---

## 📱 RESPONSIVE TEST

Test on different devices:
1. Press `F12` (DevTools)
2. Press `Ctrl+Shift+M` (Device Toolbar)
3. Select different devices
4. Verify layout looks good

---

## ✅ TESTING CHECKLIST

- [ ] Dev server running
- [ ] Homepage loads
- [ ] Can add items to cart
- [ ] Can select sizes
- [ ] Cart counter updates
- [ ] WhatsApp button opens
- [ ] Admin login works
- [ ] Mobile view looks good
- [ ] Social icons clickable
- [ ] Newsletter input works

---

## 🎁 BONUS COMMANDS

### Build for Production
```bash
cd client
npm run build
# Creates: dist/ folder (upload to Netlify)
```

### Check Code Quality
```bash
cd client
npm run lint
```

### Preview Production Build
```bash
cd client
npm run preview
```

---

## 📚 DOCUMENTATION

Read these for detailed info:
1. **FINAL_SUMMARY.md** ← What's done
2. **SETUP_GUIDE.md** ← How to customize
3. **IMAGE_UPLOAD_GUIDE.md** ← Where to upload images
4. **BACKEND_ROADMAP.md** ← Next phase

---

## 🎯 3-STEP SETUP

### Step 1: Start Server (Now!)
```bash
cd d:\JayT1017-Website\client
npm run dev
```

### Step 2: View Website (Now!)
Go to: http://localhost:5173

### Step 3: Add Your Content (This Week)
- Upload images to `assets/` folders
- Update social links
- Update merch prices
- Update colors if desired

---

## 💡 PRO TIPS

1. **Dev server auto-reloads** - Save a file, browser updates automatically
2. **Mobile view** - Use DevTools toggle for testing
3. **Social links** - All 6 platforms already integrated
4. **Admin panel** - Just a UI, backend needed to save changes
5. **WhatsApp messages** - Pre-formatted automatically with totals
6. **Dark theme** - Already applied, just update colors if wanted
7. **Colors** - Edit `tailwind.config.js` to change globally

---

## 📞 CONTACT INFO

**Your WhatsApp:** +233 50 974 9892

**Social Platforms:**
- Instagram: @jay_t1017
- TikTok: @jay_t1017
- Twitter: @jayt1017x
- Facebook: JayT1017
- Snapchat: jay_t2021395

---

## 🚀 NEXT PHASE

When ready, message:
**"Build the backend!"**

Then I can create:
- ✅ Express API server
- ✅ PostgreSQL database
- ✅ Admin authentication
- ✅ File upload system
- ✅ WhatsApp notifications
- ✅ Complete admin functionality

---

## 📊 PROJECT STATUS

```
Frontend:     ✅ 100% COMPLETE
Admin UI:     ✅ 100% COMPLETE
Shopping Cart:✅ 100% COMPLETE
Design:       ✅ 100% COMPLETE
Dark Theme:   ✅ 100% COMPLETE

Backend:      🔨 NOT STARTED
Database:     🔨 NOT STARTED
File Upload:  🔨 NOT STARTED
Authentication:🔨 NOT STARTED
Deployment:   🔨 NOT STARTED
```

---

## 🎉 YOU'RE READY!

1. ✅ Dev server is running
2. ✅ Website is functional
3. ✅ Admin panel is ready
4. ✅ Shopping cart works
5. ✅ WhatsApp integrated
6. ✅ Everything documented

**Now just test it out and add your content!** 🎵🚀

---

## 📝 COMMON EDITS

### To add a new merch item:
1. Open `src/pages/Home.jsx`
2. Find the `merch` array (line ~45)
3. Add new object with id, name, price, image
4. Save - browser updates automatically!

### To change primary color:
1. Open `tailwind.config.js`
2. Find `accent-purple: "#c084fc"`
3. Change hex color
4. Save - browser updates automatically!

### To update phone number:
1. Open `src/utils/constants.js`
2. Find `WHATSAPP_NUMBER`
3. Change the number
4. Save - browser updates automatically!

---

**Good luck! Your website is ready! 🎵✨**
