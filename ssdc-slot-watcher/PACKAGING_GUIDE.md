# 📦 How to Package & Share the Extension

## Option 1: Simple ZIP File (Recommended)

This is the easiest way to share with friends/clients who will install it as an unpacked extension.

### Using Windows Explorer:
1. Go to `f:\Work\SGAUTO\`
2. Right-click on the `ssdc-slot-watcher` folder
3. Choose **"Send to" → "Compressed (zipped) folder"**
4. Name it: `SSDC-Slot-Watcher-v1.0.zip`
5. Share this ZIP file!

### What to Include:
✅ All `.js` files (background.js, content.js, popup.js, config.js)
✅ All `.html` files (popup.html)
✅ manifest.json
✅ All `.md` documentation files (README.md, INSTALL_INSTRUCTIONS.md, QUICK_START.md)
✅ Icons (if you created them)

### What to EXCLUDE:
❌ `manifest-alternative.json` (not needed)
❌ `.git` folder (if present)
❌ `node_modules` (if present)
❌ Any personal test files

## Option 2: PowerShell Script (Automated)

Run this in PowerShell from the SGAUTO directory:

```powershell
# Navigate to the directory
cd "f:\Work\SGAUTO"

# Create a zip file
Compress-Archive -Path "ssdc-slot-watcher\*" -DestinationPath "SSDC-Slot-Watcher-v1.0.zip" -Force

Write-Host "✅ Package created: SSDC-Slot-Watcher-v1.0.zip"
```

## Option 3: Chrome Web Store (For Public Distribution)

If you want to publish it publicly (not recommended for personal use):

1. **Create a developer account**: https://chrome.google.com/webstore/devconsole/
2. **Pay $5 one-time fee**
3. **Zip the extension** (as above)
4. **Upload to Chrome Web Store**
5. **Submit for review**

⚠️ **Note**: Publishing requires:
- Privacy policy
- Detailed description
- Screenshots
- May take days for approval
- Your Telegram bot token would be public (security risk!)

## 📋 Pre-Packaging Checklist

Before sharing, make sure:

- [ ] Extension works on your machine
- [ ] You've tested Start/Stop buttons
- [ ] You've tested "Run Check Now"
- [ ] Telegram notifications work
- [ ] Bot commands work (/start, /stop, /status)
- [ ] README.md is complete
- [ ] INSTALL_INSTRUCTIONS.md is included
- [ ] config.js has the correct bot token
- [ ] Icons are included (or icon references removed from manifest.json)

## 🔒 Security Notes

**Important**: The ZIP will contain your Telegram bot token!

### Options:
1. **Share with trusted people only** (friends, family)
2. **Create a new bot** specifically for sharing (recommended)
3. **Remove token from config.js** and have each user add their own bot

### To use a shared bot:
- Keep the same bot token in config.js
- Each user adds their own chat ID
- Everyone receives notifications from the same bot

### To use individual bots:
- Replace token in config.js with: `"YOUR_BOT_TOKEN_HERE"`
- Each user creates their own bot
- Each user gets their own notifications

## 📤 How to Share

### Via Email:
1. Create the ZIP file
2. Attach to email
3. Include INSTALL_INSTRUCTIONS.md content in email body

### Via Cloud Storage:
1. Upload ZIP to Google Drive / OneDrive / Dropbox
2. Get shareable link
3. Send link + instructions

### Via USB:
1. Copy ZIP to USB drive
2. Include a printed copy of INSTALL_INSTRUCTIONS.md

## 📝 Message Template for Recipients

```
Hi! I'm sharing the SSDC Slot Watcher extension with you.

What it does:
- Automatically checks SSDC for available practical lesson slots
- Sends you Telegram notifications when slots are found
- Works in Chrome/Edge browser

To install:
1. Extract the ZIP file
2. Follow the instructions in INSTALL_INSTRUCTIONS.md
3. You'll need to add your Telegram chat ID (instructions included)

Let me know if you need help!
```

## 🎉 You're Ready!

Your extension is ready to share. Just zip it up and send it to your client! 🚀
