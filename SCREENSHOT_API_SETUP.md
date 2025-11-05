# Screenshot Setup with UploadThing Storage ✅

## ✅ Everything is Configured!

Your screenshot system is ready to use with UploadThing storage:

### Current Setup:
- ✅ **Screenshot API:** Thum.io (free, no signup needed)
- ✅ **Storage:** UploadThing (your credentials configured)
- ✅ **Admin Panel:** Buttons ready
- ✅ **Cron Job:** Monthly auto-refresh enabled

---

## 🎯 **Test It Right Now!**

1. **Go to:** Admin Dashboard → Links Manager
2. **Click:** 📷 Camera icon on any link
3. **Wait:** ~10-15 seconds (generating + uploading to UploadThing)
4. **Refresh** the page
5. **See:** Screenshot preview appears!

### Or generate all at once:
- Click **"Refresh All Screenshots"** button in header
- Wait ~5-10 minutes for all links
- Check UploadThing dashboard: https://uploadthing.com/dashboard

---

## 🔧 **How It Works:**

```
Thum.io → Generates Screenshot → UploadThing → Stores File → Your Site
 (Free)      (PNG, 1280x800)      (utfs.io)       (Shows in UI)
```

### Flow:
1. You click Camera icon
2. Convex calls Thum.io API (free screenshot generator)
3. Image is uploaded to UploadThing
4. URL saved to database: `https://utfs.io/f/{fileKey}`
5. Preview appears on your site

---

## 📋 **Features:**

### Admin Panel (Links Manager):
- 📷 **Camera icon** - Generate screenshot for single link
- 🔄 **Refresh All** - Bulk regenerate all screenshots
- 🗑️ **Delete All** - Remove screenshot URLs from database (files stay in UploadThing)
- 👁️ **Hover tooltip** - See larger preview

### Public Page (Browser Tabs):
- Category tooltips show first screenshot in each category
- Automatic display when screenshots exist

### Cron Job:
- Runs automatically: **02:00 UTC on 1st of every month**
- Refreshes all screenshots to keep them current

---

## 🗄️ **Storage:**

Screenshots are stored in **UploadThing**:
- **Dashboard:** https://uploadthing.com/dashboard/chrislanejones-personal-team/nwjl277km1
- **File URLs:** `https://utfs.io/f/{fileKey}`
- **Free tier:** 2GB storage + 1GB bandwidth/month

---

## ⚙️ **Current Configuration:**

### Convex Environment Variables (already set):
```bash
SCREENSHOT_API_URL=https://image.thum.io/get/width/1280/crop/800/
UPLOADTHING_SECRET=sk_live_***
UPLOADTHING_APP_ID=nwjl277km1
```

### To check your config:
```bash
npx convex env list
```

---

## 🆓 **Free Tier Details:**

### Thum.io (Screenshot Generation):
- **Cost:** FREE (no signup required)
- **Limits:** ~100 requests/day per IP
- **Quality:** Good for most use cases
- **Note:** May show small watermark (can upgrade to remove)

### UploadThing (Storage):
- **Free tier:** 2GB storage, 1GB bandwidth/month
- **Your usage:** ~30 links × ~200KB each = ~6MB total ✅
- **Plenty of room!**

---

## ⏱️ **Performance:**

- **Per screenshot:** ~10-15 seconds (generation + upload to UploadThing)
- **All screenshots:** ~5-10 minutes for 30 links (sequential with 1-second delay)
- **Cron job:** Runs once per month automatically

---

## 🚀 **Optional: Upgrade to Premium Service**

If you want:
- ✅ No watermarks
- ✅ Faster generation
- ✅ Higher quality
- ✅ More monthly quota

### Upgrade to ScreenshotOne:
1. Sign up: https://screenshotone.com/
2. Get API key (100 free/month, then $9/mo for 1000)
3. Run:
```bash
npx convex env set SCREENSHOT_API_URL "https://api.screenshotone.com/take"
npx convex env set SCREENSHOT_API_URL_PARAM "url"
npx convex env set SCREENSHOT_WIDTH "1280"
npx convex env set SCREENSHOT_API_KEY "YOUR_KEY"
```

---

## 🐛 **Troubleshooting:**

### Watch generation in real-time:
```bash
npx convex logs --success
```

### Check if screenshots were uploaded:
Go to: https://uploadthing.com/dashboard/chrislanejones-personal-team/nwjl277km1

### Check database:
```bash
npx convex data
```
Select: `browserLinks` → Look for `screenshotUrl` containing `utfs.io` URLs

### Common issues:
- **"No preview yet"** → Click Camera icon to generate
- **400 Bad Request** → URL validation issue, check the link
- **"UPLOADTHING_SECRET not configured"** → Fixed! Already set
- **Slow generation** → Normal, takes 10-15 seconds per screenshot

---

## ✅ **You're All Set!**

Everything is configured and ready. Just:
1. Open your Admin Dashboard
2. Click the Camera icon on any link
3. Wait and refresh
4. Check UploadThing dashboard to see uploaded files! 🎉

**UploadThing Dashboard:** https://uploadthing.com/dashboard
