# 🚗 SSDC Slot Watcher

Automated Chrome/Edge extension that monitors SSDC (Singapore Safety Driving Centre) for available practical lesson slots and sends instant Telegram notifications.

## ✨ Features

- 📚 **Theory & Practical Support** - Monitor slots for both Theory Tests and Practical Lessons
- 🔄 **Automatic Monitoring** - Checks for slots at customizable intervals (10 seconds - 15 minutes)
- 📱 **Telegram Integration** - Instant notifications with date, time, and timezone
- 🎮 **Dual Control** - Control via browser extension popup OR Telegram bot commands
- ⚡ **Manual Testing** - "Run Check Now" button for immediate testing
- 🤖 **Smart Automation** - Handles page navigation, modals, and auto-selects available slots
- 🌏 **Timezone Aware** - All times shown in Singapore timezone (Asia/Singapore)

## 🚀 Installation

### Step 1: Get Telegram Bot Token & Chat ID

1. **Create Telegram Bot:**
   - Open Telegram and search for [@BotFather](https://t.me/BotFather)
   - Send `/newbot` and follow the prompts
   - **Save your bot token** (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

2. **Get Your Chat ID:**
   - Send any message to your bot
   - Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Find your chat ID: `"chat":{"id": YOUR_NUMBER}`

### Step 2: Configure Extension

1. Open `config.js` in a text editor
2. Add your bot token (line 6):
   ```javascript
   TELEGRAM_BOT_TOKEN: "YOUR_BOT_TOKEN_HERE",
   ```
3. Add your chat ID (line 14):
   ```javascript
   TELEGRAM_CHAT_IDS: [
     YOUR_CHAT_ID_HERE
   ],
   ```

### Step 3: Install in Browser

**For Microsoft Edge:**
1. Go to `edge://extensions/`
2. Enable **"Developer mode"** (left sidebar)
3. Click **"Load unpacked"**
4. Select the extension folder
5. Done! ✅

**For Google Chrome:**
1. Go to `chrome://extensions/`
2. Enable **"Developer mode"** (top-right toggle)
3. Click **"Load unpacked"**
4. Select the extension folder
5. Done! ✅

## 🎮 How to Use

### Extension Popup Controls

1. Go to [SSDC Booking Page](https://www.ssdcl.com.sg/)
2. **Login** to your account
3. **Select "Practical Lesson"** from the dropdown
4. Click the extension icon
5. **Set check interval** (1-15 minutes, default: 2 minutes)
6. Click **"▶ Start"** - Button changes to **"⚡ Running..."**
7. Click **"⚡ Run Check Now"** to test immediately

### Telegram Bot Commands

- `/start` - Start monitoring for slots
- `/stop` - Stop monitoring
- `/status` - Check current status and last check time
- `/help` - Show available commands

## 📱 Notifications

When a slot is found, you'll receive:

```
🎉 SLOT FOUND! 🎉

📅 Date: 15 Mar 2024
🕐 Time: 10:00 AM
🌏 Timezone: Asia/Singapore

Full details: 15 Mar 2024 10:00 AM (Asia/Singapore)

The slot has been automatically selected.
Please complete the booking on the website!
```

**Important:** The extension auto-selects the slot, but you must manually complete the booking!

## ⚙️ Settings

### Check Interval

Choose how often to check for slots (in the extension popup):
- **1 minute** - Most frequent (may trigger rate limits)
- **2 minutes** - Recommended (good balance)
- **3-5 minutes** - Less frequent
- **10-15 minutes** - Least frequent

**Note:** Changing the interval while running will restart the watcher automatically.

### Advanced Configuration

Edit `config.js` for advanced settings:

```javascript
// Check interval (default from popup or 2 minutes)
CHECK_INTERVAL_MINUTES: 2,

// Random jitter to avoid detection (seconds)
JITTER_MIN_SECONDS: 0,
JITTER_MAX_SECONDS: 30,

// Human-like delays between actions (milliseconds)
DELAY_MIN_MS: 500,
DELAY_MAX_MS: 1200,

// Telegram bot polling interval (seconds)
BOT_POLLING_INTERVAL_SECONDS: 3
```

## 🔧 Troubleshooting

### Extension Not Working?

1. **Refresh everything:**
   - Go to `edge://extensions/` or `chrome://extensions/`
   - Click **Reload** button on the extension
   - Refresh the SSDC page (F5)
   - Try again

2. **Check console logs:**
   - Press **F12** on SSDC page
   - Look for: `"SSDC Slot Watcher content script loaded"`
   - Click "Run Check Now" and watch for step-by-step logs

3. **Verify setup:**
   - Make sure you're **logged into SSDC**
   - **"Practical Lesson"** must be selected
   - Extension must show **"⚡ Running..."** status

### Not Receiving Telegram Notifications?

1. **Test bot token:**
   - Visit: `https://api.telegram.org/bot<YOUR_TOKEN>/getMe`
   - Should return bot information

2. **Check chat ID:**
   - Make sure you messaged the bot first
   - Verify chat ID in `config.js` is correct
   - Chat IDs are numbers, not usernames

3. **Test manually:**
   - Send `/status` to your bot
   - Should receive a response

### Page Keeps Reloading?

- Make sure **"Practical Lesson" is already selected** before starting
- The extension will skip changing it if already set correctly
- This prevents unwanted page reloads

## 📂 File Structure

```
ssdc-slot-watcher/
├── manifest.json          # Extension configuration
├── config.js             # Settings (bot token, chat IDs, intervals)
├── background.js         # Background service worker
├── content.js            # Page automation script
├── popup.html            # Extension popup UI
├── popup.js              # Popup controls logic
├── icon16.png            # Extension icon (16x16)
├── icon48.png            # Extension icon (48x48)
├── icon128.png           # Extension icon (128x128)
└── README.md            # This file
```

## ⚠️ Important Notes

1. **Keep browser open** - Extension only works when browser is running
2. **Stay logged in** - Keep your SSDC session active
3. **"Practical Lesson" selected** - Must be set before starting
4. **One slot at a time** - Extension stops after finding first slot
5. **Complete booking manually** - Extension only finds and selects slots
6. **Multiple users** - Add multiple chat IDs to share the same bot

## 🔐 Privacy & Security

- Your bot token and chat IDs are stored locally in `config.js`
- No data is sent to third-party servers except Telegram
- Extension only runs on SSDC website
- All Telegram communication is encrypted (HTTPS)

## 📦 Sharing with Others

To share this extension:

1. **Zip the entire folder**
2. Share the ZIP file
3. Recipients need to:
   - Extract the folder
   - Add their own chat ID to `config.js`
   - Install as unpacked extension

**Option 1:** Share the same bot (everyone adds their chat ID)
**Option 2:** Each user creates their own bot (replace token in config.js)

## 🛡️ Anti-Detection Features

- ✅ Customizable check intervals (avoid rate limits)
- ✅ Random delays between actions (500-1200ms)
- ✅ Human-like behavior simulation
- ✅ Respects SSDC's rate limits
- ✅ Automatic stop after finding slot
- ✅ No rapid-fire requests

## 📝 Version

**v1.0** - Initial release

---

**Good luck getting your slot! 🚗💨**

Made for @vekron and @brrr192
