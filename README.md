# 🚗 SSDC Slot Watcher

Automated Chrome/Edge extension that monitors SSDC (Singapore Safety Driving Centre) for available practical lesson slots and sends instant Telegram notifications when slots become available.

## ✨ Features

- 🔄 **Automatic Monitoring**: Checks for slots every 2 minutes
- 📱 **Telegram Integration**: Receive instant notifications with slot date, time, and timezone
- 🎮 **Dual Control**: Control via browser extension popup OR Telegram bot commands
- 🤖 **Human-like Behavior**: Randomized delays to avoid detection
- ⏰ **Timezone Aware**: All times shown in Singapore timezone (Asia/Singapore)
- 🎯 **Auto-selection**: Automatically clicks available slots
- 🛑 **Auto-stop**: Stops monitoring after finding a slot

## 📋 Prerequisites

1. **Google Chrome** or **Microsoft Edge** browser
2. **Telegram Account**
3. **SSDC Account** (logged in on browser)

## 🚀 Installation

### Step 1: Create Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/BotFather)
2. Send `/newbot` command
3. Follow the prompts to create your bot
4. **Save the bot token** (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### Step 2: Get Your Chat ID

1. Start a conversation with your newly created bot
2. Send any message to it (e.g., "Hello")
3. Visit this URL in your browser (replace `YOUR_BOT_TOKEN` with your actual token):
   ```
   https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
   ```
4. Look for `"chat":{"id":` in the response
5. **Save the chat ID** (it's a number, e.g., `123456789`)

### Step 3: Configure the Extension

1. Navigate to the extension folder: `ssdc-slot-watcher`
2. Open [config.js](config.js) in a text editor
3. Replace `YOUR_BOT_TOKEN_HERE` with your bot token from Step 1
4. Add your chat ID(s) to the `TELEGRAM_CHAT_IDS` array:
   ```javascript
   TELEGRAM_BOT_TOKEN: "123456789:ABCdefGHIjklMNOpqrsTUVwxyz",

   TELEGRAM_CHAT_IDS: [
     123456789,    // Your chat ID
     987654321     // Second person's chat ID (optional)
   ],
   ```

### Step 4: Load Extension in Browser

#### For Chrome:
1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **Load unpacked**
4. Select the `ssdc-slot-watcher` folder
5. The extension icon should appear in your toolbar

#### For Edge:
1. Open Edge and go to `edge://extensions/`
2. Enable **Developer mode** (toggle in left sidebar)
3. Click **Load unpacked**
4. Select the `ssdc-slot-watcher` folder
5. The extension icon should appear in your toolbar

### Step 5: Login to SSDC

1. Go to [SSDC Booking Page](https://www.ssdcl.com.sg/)
2. **Login to your SSDC account**
3. Navigate to the booking section

## 🎮 Usage

### Method 1: Browser Extension Popup

1. Click the extension icon in your browser toolbar
2. Click **▶ Start** button to begin monitoring
3. Click **⏹ Stop** button to stop monitoring
4. View status and last check time in the popup

### Method 2: Telegram Bot Commands

Send these commands to your Telegram bot:

- `/start` - Start monitoring for slots
- `/stop` - Stop monitoring
- `/status` - Check current status and last check time
- `/help` - Show available commands

## 📱 Notification Example

When a slot is found, you'll receive a Telegram message like:

```
🎉 SLOT FOUND! 🎉

📅 Date: 15 Mar 2024
🕐 Time: 10:00 AM
🌏 Timezone: Asia/Singapore

Full details: 15 Mar 2024 10:00 AM (Asia/Singapore)

The slot has been automatically selected. Please complete the booking on the website!
```

## ⚙️ Configuration Options

Edit [config.js](config.js) to customize:

| Option | Default | Description |
|--------|---------|-------------|
| `CHECK_INTERVAL_MINUTES` | 2 | How often to check (in minutes) |
| `JITTER_MIN_SECONDS` | 0 | Minimum random delay |
| `JITTER_MAX_SECONDS` | 30 | Maximum random delay |
| `DELAY_MIN_MS` | 500 | Minimum click delay |
| `DELAY_MAX_MS` | 1200 | Maximum click delay |
| `BOT_POLLING_INTERVAL_SECONDS` | 3 | Telegram polling frequency |

## 🔒 Safety Features

- ✅ Randomized delays between actions
- ✅ Human-like click intervals (500-1200ms)
- ✅ 2-minute minimum check intervals
- ✅ Automatic stop after finding slot
- ✅ Respects SSDC's rate limits
- ✅ No rapid-fire requests

## 🐛 Troubleshooting

### Extension not working?

1. **Check console logs**: Right-click extension icon → Inspect popup → Console tab
2. **Verify configuration**: Make sure bot token and chat IDs are correct in [config.js](config.js)
3. **Check SSDC login**: Ensure you're logged into SSDC website
4. **Reload extension**: Go to extensions page → Click reload icon

### Not receiving Telegram notifications?

1. **Test bot token**: Visit `https://api.telegram.org/bot<YOUR_TOKEN>/getMe`
   - Should return bot information if token is valid
2. **Verify chat ID**: Make sure you've messaged the bot first
3. **Check permissions**: Bot needs permission to send messages
4. **Test manually**: Send `/status` command to bot

### Bot commands not working?

1. **Check chat ID**: Only authorized chat IDs can control the bot
2. **Bot polling**: Make sure watcher is started (bot polling starts with watcher)
3. **Internet connection**: Bot requires internet to receive commands

## 📁 File Structure

```
ssdc-slot-watcher/
├── manifest.json          # Extension manifest
├── config.js             # Configuration file (EDIT THIS)
├── popup.html            # Extension popup UI
├── popup.js              # Popup logic
├── content.js            # SSDC page automation
├── background.js         # Background service worker
└── README.md            # This file
```

## ⚠️ Important Notes

1. **Keep browser open**: Extension needs browser to be running
2. **Stay logged in**: Keep your SSDC session active
3. **Authorize chat IDs**: Only configured chat IDs can control the bot
4. **One slot at a time**: Extension stops after finding first available slot
5. **Manual completion**: You must manually complete the booking after slot is found

## 🔐 Privacy & Security

- Your bot token and chat IDs are stored locally in [config.js](config.js)
- No data is sent to any third-party servers except Telegram
- Extension only runs on SSDC website
- All communication with Telegram is encrypted (HTTPS)

## 📄 License

This project is for educational purposes. Use responsibly and in accordance with SSDC's terms of service.

## 🤝 Contributing
If you find bugs or want to add features, modify the code and share!

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review browser console logs
3. Verify all configuration settings
4. Ensure SSDC website structure hasn't changed

---

**Good luck with your slot booking! 🚗💨**
