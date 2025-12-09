# 📁 IMAGE UPLOAD LOCATIONS

## Where to Put Your Files

### 1. **Hero/Banner Image**
   - **Folder:** `d:\JayT1017-Website\assets\hero\`
   - **File:** `hero.jpg` or `banner.jpg`
   - **Size:** ~1920x1080px (full-width banner)
   - **Used in:** Home page hero section
   - **Update code:** `src/pages/Home.jsx` line ~120

### 2. **Profile Picture**
   - **Folder:** `d:\JayT1017-Website\assets\profile\`
   - **File:** `profile.jpg` or `avatar.jpg`
   - **Size:** ~600x600px (square)
   - **Used in:** Hero section right side
   - **Update code:** `src/pages/Home.jsx` line ~120

### 3. **Logo**
   - **Folder:** `d:\JayT1017-Website\assets\logo\`
   - **File:** `logo.png` (transparent background preferred)
   - **Size:** ~200x200px
   - **Used in:** Navigation bar
   - **Update code:** `src/components/Navbar.jsx` line ~15

### 4. **Merch/Product Images**
   - **Folder:** `d:\JayT1017-Website\assets\merch\`
   - **Files:** 
     - `hoodie.jpg`
     - `tshirt.jpg`
     - `cap.jpg`
     - `oversized-tee.jpg`
   - **Size:** ~400x500px (portrait orientation, like clothing)
   - **Used in:** Merch gallery cards
   - **Update code:** `src/pages/Home.jsx` lines 45-80 (merch array)

### 5. **Music Section Images** (Optional)
   - **Folder:** `d:\JayT1017-Website\assets\music\`
   - **Files:** Album covers, artist photos, playlist images
   - **Size:** ~500x500px (square)
   - **Used in:** Music section cards
   - **Update code:** `src/pages/Home.jsx` lines 165-190

### 6. **Gallery Images** (Optional)
   - **Folder:** `d:\JayT1017-Website\assets\gallery\`
   - **Files:** Any promotional photos, concert pics, lifestyle photos
   - **Size:** ~600x600px (square)
   - **Used in:** Future gallery component
   - **Update code:** When gallery feature is added

---

## How to Update Image Paths in Code

### Example: Update Hero Image

**Current code in `src/pages/Home.jsx`:**
```jsx
<img
  src="https://via.placeholder.com/600x600?text=JayT1017+Profile"
  alt="JayT1017"
  className="w-full h-full object-cover"
/>
```

**Replace with:**
```jsx
<img
  src="/assets/profile/profile.jpg"
  alt="JayT1017"
  className="w-full h-full object-cover"
/>
```

### Example: Update Merch Item Image

**Current code:**
```javascript
{
  id: 1,
  name: "Emo Hoodie - Black",
  price: 85.00,
  image: "https://via.placeholder.com/400x500?text=Emo+Hoodie",
  // ...
}
```

**Replace with:**
```javascript
{
  id: 1,
  name: "Emo Hoodie - Black",
  price: 85.00,
  image: "/assets/merch/hoodie.jpg",
  // ...
}
```

---

## Image Naming Convention

For easy management, name images clearly:

```
assets/
├── hero/
│   └── hero-banner.jpg
├── profile/
│   └── jayt1017-profile.jpg
├── logo/
│   └── jayt1017-logo.png
├── merch/
│   ├── hoodie-black.jpg
│   ├── hoodie-purple.jpg
│   ├── tshirt-purple.jpg
│   ├── tshirt-white.jpg
│   ├── cap-black.jpg
│   ├── cap-white.jpg
│   └── oversized-tee-black.jpg
└── music/
    ├── album-1.jpg
    ├── album-2.jpg
    └── artist-photo.jpg
```

---

## Image File Format Guide

| Image Type | Best Format | Quality Setting |
|-----------|-------------|-----------------|
| Photos | JPG | 80-85% quality |
| Logos | PNG | With transparency |
| Hero Banners | JPG | 85% quality |
| Product Photos | JPG | 85% quality |
| Graphics | PNG | Full quality |

---

## Total Files You Need to Upload

### Minimum (To Get Started):
- 1 Hero/banner image
- 1 Profile picture
- 4 Merch product images
- **Total: 6 files**

### Complete (Recommended):
- 1 Hero image
- 1 Profile picture
- 1 Logo
- 8 Merch product images
- 2 Music section images
- 4 Gallery images
- **Total: 17 files**

---

## Quick Setup Instructions

### Step 1: Prepare Your Images
- Resize images to recommended sizes above
- Convert to JPG or PNG format
- Keep file names simple (no spaces)

### Step 2: Upload to Folders
- Go to `d:\JayT1017-Website\assets\`
- Create subfolders if needed
- Copy your images into the right folders

### Step 3: Update Code References
- Open the file that needs updating
- Replace placeholder image URLs
- Test in browser (should see your images now!)

### Example File Structure After Upload:
```
d:\JayT1017-Website\assets\
├── hero\
│   └── hero-banner.jpg ← Your uploaded file
├── profile\
│   └── profile.jpg ← Your uploaded file
├── merch\
│   ├── hoodie.jpg ← Your uploaded file
│   ├── tshirt.jpg ← Your uploaded file
│   └── ...more product images
└── ...
```

---

## Public URL Path Format

Once uploaded, reference images using:

```
/assets/folder-name/filename.jpg
```

Examples:
- `/assets/hero/hero-banner.jpg`
- `/assets/profile/profile.jpg`
- `/assets/merch/hoodie-black.jpg`
- `/assets/logo/jayt1017-logo.png`

---

## Testing After Upload

1. Add your image file to the folder
2. Update the code with the new path
3. Save the file
4. Check browser at http://localhost:5173
5. Should see your image immediately (Vite hot reloads!)

---

## Common Issues

### Image Not Showing?
- ✅ Check file path is correct
- ✅ Confirm file exists in the folder
- ✅ Try refreshing browser (Ctrl+R)
- ✅ Check browser console (F12) for errors

### Image Looks Stretched?
- Add CSS: `object-fit: cover;` or `object-fit: contain;`
- Or resize image to exact dimensions first

### File Too Large?
- Compress using: https://tinypng.com/
- Or use image editor to reduce dimensions

---

## Once Backend is Built

Later, when the backend is complete, images will be uploaded through the **Admin Dashboard** instead of manually. You'll be able to:

- Click "Upload Image" button
- Select file from your computer
- Save to database
- See changes live on website

But for now, manually adding images to these folders works perfectly!

---

## Need Help?

If any image doesn't appear:
1. Check the file exists in the right folder
2. Check the file path in code is correct
3. Try a different image file
4. Check browser console for errors (F12 → Console)

---

**Ready to upload your images? Place them in the `assets/` folders and update the code paths!** 🎨
