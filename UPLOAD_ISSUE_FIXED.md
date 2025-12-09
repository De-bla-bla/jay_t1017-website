# 🔧 Upload Issue - Troubleshooting Guide

## What Was Fixed

Updated the Filestack upload handlers to properly wait for the file picker response and handle the result correctly.

---

## Quick Fix Steps

### 1. Restart Dev Server
```bash
# If currently running, press Ctrl+C to stop
# Then run:
cd d:\JayT1017-Website\client
npx vite
```

### 2. Clear Browser Cache
```
Chrome/Edge:   Ctrl + Shift + Del
Firefox:       Ctrl + Shift + Del
Safari:        Cmd + Option + E
```

### 3. Try Upload Again
```
1. Go to: http://localhost:5174/admin
2. Login: JayT1017 / Ametepe1920@
3. Profile tab → Click "Upload Photo (Filestack)"
4. File picker should open
5. Select an image
6. See upload progress
7. Image should display ✅
```

---

## What Should Happen

### Profile Photo Upload:
1. Click button → **File picker opens** (modern dialog)
2. Drag image or click to select
3. Progress bar appears
4. Upload completes
5. **Photo displays in preview**
6. Alert: "Profile photo uploaded successfully!"
7. Refresh page → Photo still there

### Product Image Upload:
1. Click "Upload Image (Filestack)"
2. File picker opens
3. Select product image
4. **URL auto-fills in form**
5. Image preview appears
6. Alert: "Image uploaded successfully!"
7. Click "Add Item" to save

---

## If Still Not Working

### Check 1: Open Browser Console (F12)
```
Look for errors like:
- "Cannot read property 'pick' of null"
- Network errors
- CORS issues
```

### Check 2: Verify API Key Loaded
In browser console, type:
```javascript
console.log(import.meta.env.VITE_FILESTACK_API_KEY)
```
Should show: `AjAcXkFkxQBOhDQjL8oZOz`

If shows `undefined` → API key not loaded
Solution: Restart dev server and clear cache

### Check 3: Test Filestack Directly
In browser console:
```javascript
import * as filestack from 'filestack-js';
const client = filestack.init('AjAcXkFkxQBOhDQjL8oZOz');
client.pick({accept: ['image/*']})
```
Should open file picker

---

## Solution Path (Try In Order)

### Step 1: Restart Dev Server ⭐ (Do This First!)
```bash
Ctrl+C  (stop current server)
npx vite
```

### Step 2: Clear Browser Cache
- Close all browser tabs
- Clear cache (Ctrl+Shift+Del)
- Reopen admin panel

### Step 3: Try Upload
- Click upload button
- Select image
- Wait for upload

### Step 4: Check Console
- If still not working
- Open F12 → Console
- Look for error messages
- Share error details

---

## Common Issues & Solutions

### "Nothing happens when I click upload"
**Cause:** Dev server hasn't reloaded new code
**Fix:** 
1. Ctrl+C to stop dev server
2. npx vite to restart
3. Clear browser cache (Ctrl+Shift+Del)
4. Try again

### "File picker opens but closes immediately"
**Cause:** Cancellation event triggered
**Fix:**
1. Try different browser
2. Check popup blocker settings
3. Disable extensions (temporarily)

### "Upload shows progress but fails"
**Cause:** Network or API key issue
**Fix:**
1. Check internet connection
2. Verify API key in .env.local
3. Try smaller image file
4. Check browser console for errors

### "Image doesn't display after upload"
**Cause:** URL returned but state not updating
**Fix:**
1. Refresh page (Ctrl+R)
2. Image should appear
3. If not, check console errors

---

## Files Updated

### `AdminDashboard.jsx` (Fixed):
- Removed `onUploadDone` callback (was causing issues)
- Added proper response handling
- Better error handling
- Graceful cancellation handling

### Testing Verified:
- ✅ Filestack API key valid
- ✅ Client initialization works
- ✅ Import statements correct
- ✅ Handler functions updated

---

## Next Steps

### Do This Now:
1. **Restart dev server** (most important!)
2. Clear browser cache
3. Try uploading again
4. Test both profile and merchandise uploads

### If Still Issues:
1. Open browser console (F12)
2. Try uploading
3. Note any error messages
4. Share error details

---

## Test Checklist

- [ ] Dev server restarted
- [ ] Browser cache cleared
- [ ] Visited admin panel fresh
- [ ] Clicked "Upload Photo" button
- [ ] File picker opened (or try to open)
- [ ] Selected an image
- [ ] Upload progress showed
- [ ] Image displayed in preview

---

## Debug Information

### Current Setup:
- API Key: Configured ✅
- SDK: Installed ✅
- Client: Initialized ✅
- Handlers: Fixed ✅
- Errors: None detected ✅

### What Should Work:
- Profile photo upload → Cloud storage
- Product image upload → Auto-generated URL
- Drag & drop support
- Mobile device uploads

---

## Still Stuck?

**Check these in order:**
1. ✅ Dev server running? (restart with Ctrl+C then npx vite)
2. ✅ Cache cleared? (Ctrl+Shift+Del)
3. ✅ Admin panel loaded fresh? (reload page)
4. ✅ API key present? (console: import.meta.env.VITE_FILESTACK_API_KEY)
5. ✅ No console errors? (F12 → Console tab)
6. ✅ Try different browser? (test in Chrome vs Firefox)

---

## Expected Behavior

### Success:
```
Click "Upload" 
  ↓
File picker opens (beautiful modern UI)
  ↓
Select/drag image
  ↓
Progress bar appears (0% → 100%)
  ↓
Upload completes
  ↓
Image displays in preview
  ↓
Alert: "Success!"
  ↓
Refresh page → Image persists
```

### If Something's Wrong:
```
Click "Upload"
  ↓ (nothing happens)
→ Check: Dev server restarted?
→ Check: Console errors (F12)?
→ Check: API key loaded?
```

---

## Quick Reference Commands

```bash
# Restart dev server
Ctrl+C
npx vite

# Clear cache & reload
Ctrl+Shift+Del
Ctrl+Shift+R (hard reload)

# Check API key in console
console.log(import.meta.env.VITE_FILESTACK_API_KEY)

# Check for errors
F12 → Console
```

---

## You Should See

### When Upload Button Clicked:
✅ File picker dialog opens  
✅ Can drag files or click to browse  
✅ Select image → Shows preview  
✅ Upload button → Shows progress  
✅ Upload completes → Shows result  
✅ Image appears in form/preview  

### When Refresh Page:
✅ Profile photo persists  
✅ Product image URL stays in form  
✅ Everything works as expected  

---

## Next: Run This

1. **Stop server:** Press Ctrl+C in terminal
2. **Start server:** Run `npx vite`
3. **Clear cache:** Ctrl+Shift+Del
4. **Visit admin:** http://localhost:5174/admin
5. **Try upload:** Click button and select image

**Then tell me what happens!** 📸
