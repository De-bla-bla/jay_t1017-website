# Quick Admin Reference - Music & Merchandise Control

## Access Admin Panel
```
URL: http://localhost:5174/admin
Username: JayT1017
Password: Ametepe1920@
```

---

## Music Tab (🎵)

### Add New Track
1. Enter **Track Title** (required)
2. Enter **Artist Name** (optional)
3. Select **Platform**: Spotify / Apple Music / YouTube / SoundCloud
4. Paste **URL/Link** (required)
5. Add **Description** (optional)
6. Click **"Add Track"**

### Edit Track
1. Click **"Edit"** on any track
2. Form auto-fills with current data
3. Update any field
4. Click **"Update Track"**
5. Click **"Cancel"** to abandon

### Delete Track
1. Click **"Delete"** on track
2. Confirm deletion
3. Track removed instantly

---

## Merchandise Tab (🛍️)

### Add New Product
1. Enter **Item Name** (required)
2. Enter **Price in GHS** (required)
3. Enter **Original Price** (for showing discounts)
4. Enter **Category** (e.g., "Hoodies", "Tees")
5. Add **Description**
6. Paste **Image URL**
7. Click **"Add Item"**

### Edit Product
1. Click **"Edit"** on any product
2. Form auto-fills with current data
3. Update any field
4. Click **"Update Item"**
5. Click **"Cancel"** to abandon

### Delete Product
1. Click **"Delete"** on product
2. Confirm deletion
3. Product removed instantly

---

## Profile Tab (👤)

### Upload Profile Photo
1. Click **"Upload Photo"** button
2. Select image from phone/computer
3. Preview appears instantly
4. Click **"Remove"** to reset to "JT"

### Edit Profile
1. Update **Artist Name**
2. Update **Bio**
3. Click **"Save Profile"**

---

## Image URLs for Merchandise

### Get Free Image URL:

**Method 1: Imgur (Fastest)**
1. Go to `imgur.com`
2. Click "New Post"
3. Upload image
4. Copy image URL (right-click image → Copy Link)
5. Paste in admin panel

**Method 2: Cloudinary**
1. Go to `cloudinary.com`
2. Create free account
3. Upload image
4. Copy URL
5. Paste in admin panel

**Method 3: ImgBB**
1. Go to `imgbb.com`
2. Click "Start Uploading"
3. Select image
4. Copy "Direct Link"
5. Paste in admin panel

---

## Music Platform Links

### Get Music Links:

**Spotify**
- Go to track → Click "Share" → Copy link
- Format: `https://open.spotify.com/track/...`

**Apple Music**
- Go to track → Click "..." → "Share Song"
- Copy link

**YouTube**
- Go to video → Copy URL
- Format: `https://www.youtube.com/watch?v=...`

**SoundCloud**
- Go to track → Click "Share" → Copy link
- Format: `https://soundcloud.com/...`

---

## Filestack Integration (Optional)

### To Add Professional Upload:

1. Create Filestack account: `filestack.com`
2. Get API Key from dashboard
3. Send me your API Key
4. I'll integrate file upload in 15 minutes
5. Then use drag-drop upload in admin

**Benefits of Filestack:**
- Uploads persist after refresh
- Automatic image optimization
- 5GB free storage
- CDN delivery
- Works globally

---

## Price Format

### For Price Fields:
- Enter just the **number**: `50`
- Not: `₵50` or `GHS 50`
- System adds currency symbol
- Display: `₵50`

### Example:
- Current Price: `85`
- Original Price: `100`
- Display: `₵85` ~~₵100~~ (shows discount)

---

## Category Examples

| Category | Examples |
|----------|----------|
| **Apparel** | Hoodies, Tees, Caps, Jackets |
| **Accessories** | Chains, Rings, Bracelets |
| **Digital** | Beats, Albums, Merch Bundles |
| **Special** | Limited Edition, Collaborations |

---

## Common Tasks

### Upload Product with Image (5 min)
1. Go to Imgur → Upload image
2. Copy image URL
3. Admin → Merchandise tab
4. Fill in: Name, Price, Category, Description, Image URL
5. Click "Add Item"
✅ Done! Product live

### Add Spotify Track (2 min)
1. Go to Spotify → Find track
2. Click Share → Copy link
3. Admin → Music tab
4. Fill in: Title, Artist, Platform (Spotify), Paste URL
5. Click "Add Track"
✅ Done! Track visible

### Change Profile Photo (1 min)
1. Admin → Profile tab
2. Click "Upload Photo"
3. Select image
4. Preview shows
5. Click "Save Profile"
✅ Done! Photo updated

---

## Troubleshooting

**Image URL not showing?**
- Ensure URL ends with `.jpg`, `.png`, etc.
- Try different image hosting (Imgur/Cloudinary)
- Check CORS (most hosts are compatible)

**Music link not working?**
- Verify URL is correct
- Test link in browser first
- Ensure track is public

**Can't save profile photo?**
- Currently stores in browser memory
- Refresh page = photo resets
- Use Filestack for permanent storage

**Track not deleting?**
- Confirm deletion dialog
- Refresh page to verify

---

## Profile Photo Solutions

### Temporary (Current)
- Upload photo from phone
- Works until page refresh
- Free, no setup needed

### Permanent (Option 1: Filestack)
- Photo saved in cloud
- Survives refresh/restart
- Need Filestack API key
- 5GB free tier

### Permanent (Option 2: Backend)
- Photo saved on your server
- Complete control
- Takes 30 min to set up
- Best for scaling

---

## Admin Statistics Dashboard

### What's Tracked:
- **Total Orders** - From customer orders
- **Revenue (GHS)** - Total sales amount
- **Merch Items** - Number of products
- **Visitors** - Page views

Real-time updates when products/orders change.

---

## Important Notes

✅ All changes save immediately  
✅ No need to click extra "Save" buttons  
✅ Edit & Delete buttons on each item  
✅ Music platform links open in new tab  
✅ Image previews show before adding  

⚠️ Deleting items is permanent  
⚠️ Profile photo resets on page refresh (for now)  
⚠️ Image URLs must be publicly accessible  

---

## Next Steps

1. **Test Now** → Try adding a track or product
2. **Upload Images** → Use Imgur for URLs
3. **Get Filestack** (Optional) → For professional storage
4. **Go Live** → Deploy when ready

**Questions?** See `MEDIA_UPLOAD_GUIDE.md` for detailed options! 📚
