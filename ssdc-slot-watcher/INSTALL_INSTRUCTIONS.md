# 🚗 SSDC Slot Watcher - Installation Instructions

## 📦 What You Got

This extension automatically monitors SSDC for available practical lesson slots and sends you Telegram notifications when slots are found!

## ⚡ Quick Install (5 minutes)

### Step 1: Extract the Extension
1. Extract the ZIP file to a folder (e.g., `C:\ssdc-slot-watcher\`)
2. Remember this location - you'll need it!

### Step 2: Get Your Telegram Chat ID
1. Open the Telegram bot: Search for the bot that was shared with you
2. Send any message to the bot (e.g., "hello")
3. Visit this URL (replace with the actual bot token):
   ```
   https://api.telegram.org/bot<BOT_TOKEN>/getUpdates
   ```
4. Find your chat ID in the response: `"chat":{"id": YOUR_NUMBER}`

### Step 3: Add Your Chat ID
1. Open the extension folder
2. Edit `config.js` file with Notepad
3. Find line 14: `TELEGRAM_CHAT_IDS: [`
4. Add your chat ID number inside the brackets:
   ```javascript
   TELEGRAM_CHAT_IDS: [
     741316379,  // @vekron
     YOUR_CHAT_ID_HERE  // Your username
   ],
   ```
5. Save the file

### Step 4: Install in Edge/Chrome

**For Microsoft Edge:**
1. Open Edge and go to: `edge://extensions/`
2. Turn ON **"Developer mode"** (toggle in left sidebar)
3. Click **"Load unpacked"**
4. Select the extracted folder
5. Extension installed! ✅

**For Google Chrome:**
1. Open Chrome and go to: `chrome://extensions/`
2. Turn ON **"Developer mode"** (toggle in top-right)
3. Click **"Load unpacked"**
4. Select the extracted folder
5. Extension installed! ✅

### Step 5: Start Using It!

1. Go to [SSDC Website](https://www.ssdcl.com.sg/)
2. Login to your account
3. Go to the booking page
4. **Important**: Make sure "Practical Lesson" is selected in the dropdown
5. Click the extension icon in your toolbar
6. Click **"▶ Start"** button
7. You'll get a Telegram message confirming it started!

## 🎮 How to Use

### Extension Popup Controls
- **▶ Start** - Start monitoring for slots (runs every 2 minutes)
- **⏹ Stop** - Stop monitoring
- **⚡ Run Check Now** - Manually trigger an immediate check (only when active)

### Telegram Bot Commands
You can also control the extension from Telegram:
- `/start` - Start monitoring
- `/stop` - Stop monitoring
- `/status` - Check current status
- `/help` - Show available commands

## 📱 When a Slot is Found

You'll receive a Telegram message like:
```
🎉 SLOT FOUND! 🎉

📅 Date: 15 Mar 2024
🕐 Time: 10:00 AM
🌏 Timezone: Asia/Singapore

The slot has been automatically selected.
Please complete the booking on the website!
```

**Important:** The extension will auto-select the slot, but you must manually complete the booking!

## ⚠️ Important Notes

1. **Keep browser open** - Extension only works when browser is running
2. **Stay logged in** - Keep your SSDC session active
3. **Practical Lesson selected** - Make sure dropdown is set correctly
4. **One slot at a time** - Extension stops after finding first slot
5. **Complete booking manually** - Extension only finds and selects, you must finish booking

## 🐛 Troubleshooting

### Extension not finding slots?
1. Make sure you're on the SSDC booking page
2. Check that "Practical Lesson" is selected
3. Try clicking "Run Check Now" to test
4. Press F12 and check console for errors

### Not receiving Telegram messages?
1. Verify your chat ID is correct in `config.js`
2. Make sure you messaged the bot first
3. Check that the extension is started (green status)

### Extension not working after reload?
1. Go to `edge://extensions/`
2. Click the **reload** button on the extension
3. Refresh the SSDC page (F5)
4. Try again

## 🔧 Advanced Settings

Edit `config.js` to customize:

| Setting | Default | What it does |
|---------|---------|--------------|
| `CHECK_INTERVAL_MINUTES` | 2 | How often to check |
| `DELAY_MIN_MS` | 500 | Minimum delay between actions |
| `DELAY_MAX_MS` | 1200 | Maximum delay between actions |

## 📞 Need Help?

Contact the person who shared this extension with you!

---

**Good luck getting your slot! 🚗💨**
