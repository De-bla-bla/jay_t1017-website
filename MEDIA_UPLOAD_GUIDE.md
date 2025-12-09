# Media Upload & Management Guide

## Overview

Your JayT1017 admin panel now supports managing:
- ✅ **Profile Photos** - Upload from phone
- ✅ **Merchandise Images** - Add product images with URLs
- ✅ **Music Tracks** - Link Spotify, Apple Music, YouTube, SoundCloud

---

## Option 1: Simple URL-Based Upload (Current)

### Best For: Quick setup, no backend changes needed

**Currently Implemented:**
- Profile photo upload (stores in browser)
- Merchandise images (paste image URL)
- Music links (paste platform URLs)

**How It Works:**
1. Upload images to free hosting (Imgur, Cloudinary, etc.)
2. Copy the image URL
3. Paste URL in admin panel
4. Changes save immediately

**Free Hosting Services:**
- **Imgur**: `imgur.com` - Instant upload
- **Cloudinary**: `cloudinary.com` - 25GB free storage
- **ImgBB**: `imgbb.com` - Simple & fast
- **Pixeldrain**: `pixeldrain.com` - File hosting

---

## Option 2: Filestack Integration (Recommended)

### Best For: Professional media management with better storage

**Filestack Credentials Needed:**
- API Key (from filestack.com)
- Account with storage plan

### Setup Steps:

1. **Create Filestack Account:**
   - Go to `https://www.filestack.com`
   - Sign up for free account
   - Get your **API Key**

2. **Install Filestack SDK:**
   ```bash
   cd d:\JayT1017-Website\client
   npm install filestack-js
   ```

3. **Add to AdminDashboard.jsx:**
   ```jsx
   import * as filestack from 'filestack-js';
   
   const FILESTACK_API_KEY = "YOUR_API_KEY_HERE"; // Add to .env.local
   const client = filestack.init(FILESTACK_API_KEY);
   ```

4. **Create File Picker Function:**
   ```jsx
   const handleFilestackUpload = async (type) => {
     try {
       const result = await client.pick({
         accept: type === 'image' ? ['image/*'] : ['audio/*', 'video/*'],
         maxFiles: 1,
         uploadInBackground: false,
       });
       
       if (result.filesUploaded.length > 0) {
         const url = result.filesUploaded[0].url;
         if (type === 'profile') {
           setProfileImage(url);
         } else if (type === 'merch') {
           setFormData({ ...formData, image: url });
         }
       }
     } catch (err) {
       alert('Upload failed: ' + err.message);
     }
   };
   ```

5. **Replace File Input:**
   ```jsx
   // Replace this:
   <input type="file" accept="image/*" onChange={...} />
   
   // With this:
   <button onClick={() => handleFilestackUpload('image')} className="btn-primary">
     Upload to Filestack
   </button>
   ```

---

## Option 3: Backend File Upload (Advanced)

### Best For: Complete control, persistent storage

**Implementation:**
1. Install backend packages:
   ```bash
   npm install multer sharp
   ```

2. Add upload endpoint to `server/routes/uploads.js`

3. Store files in `server/public/uploads/`

4. Update admin panel to use FormData

**Example:**
```jsx
const handleFileUpload = async (file, type) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  
  try {
    const response = await axios.post(`${API_URL}/api/uploads`, formData);
    return response.data.url;
  } catch (err) {
    alert('Upload failed');
  }
};
```

---

## Media Management Summary

| Method | Storage | Cost | Setup | Best For |
|--------|---------|------|-------|----------|
| **URL-Based** | External | Free | 2 min | Quick testing |
| **Filestack** | Cloud | $0-99/mo | 15 min | Production + CDN |
| **Backend** | Server | Your hosting | 30 min | Full control |

---

## Filestack Pricing (2024)

| Plan | Price | Features |
|------|-------|----------|
| **Free** | $0 | 5GB storage, basic features |
| **Professional** | $99/mo | 500GB, advanced features |
| **Enterprise** | Custom | Custom features |

---

## Quick Filestack Setup (5 Minutes)

1. Sign up: `filestack.com/register`
2. Get API Key from dashboard
3. Add to `.env.local`:
   ```
   VITE_FILESTACK_API_KEY=YOUR_KEY_HERE
   ```
4. Test with upload button in admin panel

---

## Current Admin Panel Features

### Music Management ✅
- Add/Edit/Delete tracks
- Support: Spotify, Apple Music, YouTube, SoundCloud
- Direct links to streaming platforms

### Merchandise Management ✅
- Full CRUD operations
- Image URLs
- Price tracking
- Category organization

### Profile Management ✅
- Photo upload (browser storage)
- Artist name & bio
- Ready for Filestack integration

---

## Recommended Setup Path

### Phase 1: Quick Start (Now)
- Use image URLs from Imgur/Cloudinary
- Test all admin features
- Verify music links work

### Phase 2: Production
- Set up Filestack account
- Add your API key
- Update upload handlers
- Deploy to production

### Phase 3: Scale
- Consider backend upload if Filestack limits reached
- Add image optimization (sharp)
- Implement CDN caching

---

## Troubleshooting

**Profile photo not saving after refresh?**
- Currently stores in browser memory only
- Use Filestack or backend for persistence
- Or store in localStorage

**Image URL not working?**
- Check CORS settings on image host
- Try Imgur/Cloudinary instead
- Use Filestack for guaranteed compatibility

**Music links not playing?**
- Ensure URL is embeddable (most platforms are)
- Test link in browser first
- Check if track is public on platform

---

## Support

For media upload help:
- Filestack Docs: `https://www.filestack.com/docs`
- Cloudinary Docs: `https://cloudinary.com/documentation`
- Backend Upload: See DEPLOYMENT.md

**Ready to add Filestack?** Provide your API key and I'll integrate it! 🚀
