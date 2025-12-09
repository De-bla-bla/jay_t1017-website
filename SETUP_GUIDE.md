# 🎵 JayT1017 Website - Setup & Usage Guide

## 📋 Project Status: FRONTEND COMPLETE ✅

Your website is now live in development! Here's everything you need to know.

---

## 🚀 Quick Start

### 1. **Start Development Server**
```bash
cd d:\JayT1017-Website\client
npm run dev
```
The site will be available at: **http://localhost:5173**

---

## 📁 Asset Upload Locations

Upload your files to these folders in `d:\JayT1017-Website\assets\`:

```
assets/
├── hero/               ← Hero section banner image
├── profile/            ← Profile picture for hero section
├── logo/               ← Your logo (use in navbar)
├── merch/              ← Clothing item images
├── music/              ← Music-related assets
└── gallery/            ← Photo gallery (optional)
```

**Currently using placeholder images.** Once you upload your actual images, update the image paths in Home.jsx

---

## 🎨 Website Features (COMPLETED)

### 1. **Public Homepage** ✅
- Hero section with your profile image, name, and bio
- Social media links (Instagram, TikTok, X, Facebook, Snapchat, Apple Music)
- WhatsApp contact button (floating & in hero)
- Music section placeholder (for admin to manage)
- Merch gallery with product cards
- Newsletter subscription section

### 2. **Merch Shopping** ✅
- Browse clothing items with images, names, prices
- Select size (XS, S, M, L, XL, XXL)
- Adjust quantity
- Add to shopping cart (persistent in session)
- View cart with detailed order summary
- **Checkout via WhatsApp** - sends formatted order message with items, sizes, quantities, total price

### 3. **Shopping Cart** ✅
- Add/remove items
- Update quantities
- Add special notes/preferences
- Calculate total price in GHS
- Direct WhatsApp checkout button

### 4. **Admin Panel** ✅
- **Login credentials:**
  - Username: `JayT1017`
  - Password: `Ametepe1920@`
- Access at: `/admin` or `/admin/dashboard`

#### Admin Features:
- **Overview Dashboard** - stats, quick actions
- **Merch Management** - add/edit/delete clothing items (UI ready, backend needed)
- **Music Section** - manage music links and embeds
- **Profile & Links** - update social media URLs
- **Settings** - site-wide configuration

### 5. **Design** ✅
- **Dark Theme** - Dark background (dark-950), purple & pink gradient accents
- **Responsive** - Works on mobile, tablet, desktop
- **Modern UI** - Smooth animations, hover effects, gradient text
- **WhatsApp Integration** - One-click ordering via WhatsApp with pre-filled messages

---

## 🔧 Technology Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling (dark theme)
- **React Router v7** - Page navigation
- **Lucide React** - Icons
- **Context API** - Shopping cart state

### Backend (Ready to Build)
- **Node.js** - Runtime
- **Express.js** - Server framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Multer** - File uploads
- **Dotenv** - Environment variables

---

## 🛍️ Merch System

### Current Placeholder Items:
1. Emo Hoodie - Black (GHS 85.00)
2. Vintage T-Shirt - Purple (GHS 35.00)
3. Cap - Black (GHS 25.00)
4. Oversized Tee - White (GHS 40.00)

**To update items:**
Edit `Home.jsx` lines 11-44 to modify merch data, or (better) connect to backend API.

---

## 📝 How WhatsApp Checkout Works

1. User adds items to cart
2. Clicks "Proceed to WhatsApp Checkout"
3. WhatsApp opens with pre-filled message:
   ```
   Hi JayT1017! 🎵
   
   I want to order:
   
   1. Item Name
      Size: M
      Quantity: 2
      Price: GHS XX.XX
   
   Total: GHS XXX.XX
   
   Please confirm availability and delivery details.
   ```
4. User sends message
5. You respond with confirmation, pricing, delivery info

---

## 👤 Admin Login

**URL:** `http://localhost:5173/admin`

**Credentials:**
- Username: `JayT1017`
- Password: `Ametepe1920@`

**Security Note:** These credentials are currently hardcoded for development. For production, use:
- Hash passwords with bcryptjs
- Store in database
- Use JWT tokens
- Implement session management

---

## 🎨 Customization Guide

### 1. **Change Colors**
Edit `tailwind.config.js`:
```javascript
colors: {
  dark: { ... },
  accent: {
    purple: "#c084fc",   // Change these
    pink: "#ec4899",
    blue: "#0ea5e9",
    green: "#10b981"
  }
}
```

### 2. **Update Social Links**
Edit `utils/constants.js`:
```javascript
export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/your-profile",
  // ... update all links
};
```

### 3. **Change WhatsApp Number**
Edit `utils/constants.js`:
```javascript
export const WHATSAPP_NUMBER = "+233509749892";  // Update this
```

### 4. **Add More Merch Items**
Edit `Home.jsx` state or connect to API:
```javascript
const [merch, setMerch] = useState([
  {
    id: 5,
    name: "Sweatpants - Black",
    price: 50.00,
    category: "Pants",
    image: "url-to-image",
    description: "Comfortable sweatpants..."
  }
  // ... add more
]);
```

---

## 📱 Mobile Responsiveness

All components are mobile-first:
- **Mobile (<640px)** - Single column, stacked navigation
- **Tablet (640px-1024px)** - 2 columns
- **Desktop (>1024px)** - Full grid layout

Test with DevTools: `F12` → Toggle device toolbar

---

## 🔗 Page Routes

| Route | Page | Status |
|-------|------|--------|
| `/` | Home (Public) | ✅ Ready |
| `/cart` | Shopping Cart | ✅ Ready |
| `/admin` | Admin Login | ✅ Ready |
| `/admin/dashboard` | Admin Dashboard | ✅ Ready |

---

## ⚙️ Backend Setup (Next Steps)

The backend is NOT set up yet. Here's what needs to be done:

### Files to create:
```
server/
├── server.js          ← Main entry point
├── config/
│   └── db.js         ← Database connection
├── routes/
│   ├── merch.js      ← Merch CRUD operations
│   ├── admin.js      ← Admin auth & profile
│   └── whatsapp.js   ← WhatsApp notifications
├── controllers/
│   ├── merchController.js
│   └── adminController.js
├── middleware/
│   ├── auth.js       ← JWT authentication
│   └── upload.js     ← File upload handling
├── models/
│   ├── Merch.js      ← Database schema
│   └── Admin.js
└── .env              ← Environment variables
```

### Required packages:
Already installed globally. Create `server/package.json` and add:
- express, cors, dotenv, multer, bcryptjs, jsonwebtoken, pg, axios

---

## 🎯 Next Development Steps

### Phase 1: Backend API
- [ ] Set up Express server
- [ ] Create PostgreSQL database
- [ ] Implement authentication (JWT)
- [ ] Create merch CRUD endpoints
- [ ] Set up file upload system

### Phase 2: Admin Features
- [ ] Upload profile image
- [ ] Upload hero images
- [ ] Manage merch items (add/edit/delete)
- [ ] Update social links dynamically
- [ ] Manage music section

### Phase 3: Production
- [ ] Deploy frontend to Netlify
- [ ] Deploy backend to Railway.app
- [ ] Set up database on Railway
- [ ] Configure environment variables
- [ ] Enable WhatsApp business API
- [ ] Set up email notifications

---

## 📞 Contact Information

**WhatsApp:** +233 50 974 9892

**Artist Social Links:**
- Instagram: @jay_t1017
- TikTok: @jay_t1017
- X (Twitter): @jayt1017x
- Facebook: JayT1017
- Snapchat: jay_t2021395

---

## 🐛 Troubleshooting

### Dev server not starting?
```bash
cd client
rm -r node_modules
npm install
npm run dev
```

### Styles not loading?
Make sure `src/index.css` is imported in `main.jsx`

### Admin login not working?
Check credentials: `JayT1017` / `Ametepe1920@`

### WhatsApp links not opening?
Ensure phone number format is correct: `+233509749892`

---

## 📚 File Structure

```
d:\JayT1017-Website\
├── assets/                 ← Your images (upload here)
│   ├── hero/
│   ├── profile/
│   ├── logo/
│   ├── merch/
│   ├── music/
│   └── gallery/
│
├── client/                 ← React frontend
│   ├── src/
│   │   ├── pages/         ← Home.jsx, Cart.jsx
│   │   ├── components/    ← Navbar, Footer, MerchCard, etc.
│   │   ├── admin/         ← AdminLogin, AdminDashboard
│   │   ├── context/       ← CartContext
│   │   ├── hooks/         ← useCart
│   │   ├── utils/         ← constants, whatsapp functions
│   │   ├── App.jsx        ← Router setup
│   │   ├── main.jsx       ← Entry point
│   │   └── index.css      ← Tailwind styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── server/                 ← Node.js backend (to build)
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   └── server.js
│
└── package.json           ← Root dependencies
```

---

## 🎓 Learning Resources

- **React Hooks:** https://react.dev/reference/react
- **Tailwind CSS:** https://tailwindcss.com/docs
- **React Router:** https://reactrouter.com
- **Express.js:** https://expressjs.com
- **Vite:** https://vitejs.dev

---

## 📝 Notes

- Session storage is used for admin login (clears when browser closes)
- Shopping cart uses React Context (resets on page refresh)
- WhatsApp integration sends pre-formatted messages directly
- All placeholder images use https://via.placeholder.com
- Dark theme follows Tailwind's dark mode conventions

---

## ✨ What's Working Right Now

✅ Beautiful responsive homepage
✅ Merch gallery with cart system
✅ Admin login and dashboard UI
✅ Shopping cart functionality
✅ WhatsApp order integration
✅ Dark theme with animations
✅ Mobile-responsive design
✅ Social media links
✅ Floating WhatsApp button

---

## 🚧 What Still Needs Building

🔨 Backend API server
🔨 Database setup & models
🔨 Admin file upload system
🔨 Authentication with JWT
🔨 Production deployment
🔨 Email notifications
🔨 Order tracking system

---

## 📞 Questions?

Contact the developer or check the code comments for detailed explanations.

**Happy coding! 🎉**
