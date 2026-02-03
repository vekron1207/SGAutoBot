# 🚀 Quick Start Guide

Follow these steps to get your SSDC Slot Watcher running in 5 minutes!

## ✅ Checklist

### 1. Create Telegram Bot (2 minutes)
- [ ] Open Telegram, search for `@BotFather`
- [ ] Send `/newbot` and follow prompts
- [ ] Copy and save your **bot token**

### 2. Get Your Chat ID (1 minute)
- [ ] Send a message to your new bot
- [ ] Open: `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates`
- [ ] Find and copy your **chat ID** (it's a number)

### 3. Configure Extension (1 minute)
- [ ] Open `config.js`
- [ ] Paste your bot token in line 7
- [ ] Add your chat ID(s) in line 15
- [ ] Save the file

### 4. Load Extension (1 minute)
- [ ] Open Chrome: `chrome://extensions/` (or Edge: `edge://extensions/`)
- [ ] Enable "Developer mode"
- [ ] Click "Load unpacked"
- [ ] Select the `ssdc-slot-watcher` folder

### 5. Start Watching! (30 seconds)
- [ ] Go to SSDC website and login
- [ ] Click extension icon
- [ ] Click "▶ Start" button
- [ ] Or send `/start` to your Telegram bot

## 🎯 Test Your Setup

### Test 1: Extension Popup
1. Click extension icon
2. You should see the popup with Start/Stop buttons
3. Status should show "Inactive"

### Test 2: Telegram Bot
1. Open your bot in Telegram
2. Send `/help` - Bot should respond with commands
3. Send `/status` - Should show current status

### Test 3: Start Watcher
1. Click "▶ Start" in popup
2. Status should change to "Active"
3. You should receive a Telegram message confirming it started

### Test 4: Telegram Control
1. Send `/stop` to bot - Should stop watcher
2. Send `/start` to bot - Should start watcher
3. Send `/status` to check current state

## ⚠️ Before First Use

1. **Login to SSDC**: Make sure you're logged into https://www.ssdcl.com.sg/
2. **Keep browser open**: Extension works only when browser is running
3. **Check internet**: Both browser and Telegram need internet connection

## 🔥 Common Issues

| Problem | Solution |
|---------|----------|
| "Bot token not configured" | Edit `config.js` and add your token |
| "No chat IDs" | Add your chat ID to `TELEGRAM_CHAT_IDS` array |
| Bot not responding | Make sure you messaged the bot first |
| No notifications | Check if watcher is active (send `/status`) |

## 📱 Using Both Controls

You can use BOTH the popup buttons AND Telegram commands simultaneously:

- **At home**: Use browser extension popup
- **On the go**: Use Telegram bot commands from your phone
- **With friend**: Share bot access by adding their chat ID to config

## 🎉 Success!

When everything is working:
- ✅ Extension icon shows in toolbar
- ✅ Popup opens and shows status
- ✅ Bot responds to `/help` command
- ✅ Starting watcher sends Telegram notification
- ✅ Status updates in real-time

You're all set! The extension will now monitor for available slots and notify you instantly when one appears! 🚗💨
