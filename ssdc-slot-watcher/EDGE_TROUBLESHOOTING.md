# 🔧 Edge Troubleshooting Guide

## Current Issues & Solutions

### Issue 1: Extension Not Doing Anything on SSDC Website

**Possible Causes:**
1. Content script not injecting properly
2. Extension needs reload after changes
3. SSDC page needs refresh after extension load

**Solutions:**

#### Solution A: Reload Everything (RECOMMENDED - Try This First!)
1. **Close the SSDC website tab completely**
2. Go to `edge://extensions/`
3. Find "SSDC Slot Watcher"
4. Click the **🔄 Reload** button
5. Open a **new tab** and go to SSDC website
6. Login to SSDC
7. Click extension icon → Click "▶ Start"
8. Immediately click "⚡ Run Check Now" to test

#### Solution B: Check Console for Errors
1. Open SSDC website
2. Press `F12` to open DevTools
3. Go to **Console** tab
4. Look for any red errors
5. Type this and press Enter:
   ```javascript
   console.log('Content script test')
   ```
6. If you see the message, content script might be working

#### Solution C: Check Background Script
1. Go to `edge://extensions/`
2. Find "SSDC Slot Watcher"
3. Click **"Service worker"** or **"background page"** link
4. Look for errors in the console
5. Check if you see: "SSDC Slot Watcher background script loaded"

#### Solution D: Manually Test Content Script
1. Go to SSDC booking page
2. Open DevTools (F12) → Console tab
3. Paste this and press Enter:
   ```javascript
   // Check if content script is loaded
   chrome.runtime.sendMessage({action: 'GET_STATUS'}, response => {
     console.log('Extension response:', response);
   });
   ```
4. If you get a response, the extension is working
5. If not, the content script isn't loading

### Issue 2: Missing Icons Warning

**Symptoms:** Extension loads but shows warning about missing icons

**Solution:**
The extension will work fine without icons. Edge will show a default icon. To fix the warning:

1. Create any 3 PNG images (can be blank)
2. Rename them to: `icon16.png`, `icon48.png`, `icon128.png`
3. Place them in the `ssdc-slot-watcher` folder
4. Reload extension

Or temporarily remove icon references from manifest.json (not recommended).

### Issue 3: "Run Check Now" Button Not Working

**Check these:**

1. **Are you logged into SSDC?**
   - You MUST be logged in for the extension to work
   - Go to https://www.ssdcl.com.sg/ and login

2. **Are you on the correct page?**
   - Go to the booking page
   - URL should be: `https://www.ssdcl.com.sg/User/Booking/...`

3. **Check the console:**
   - Press F12 on SSDC page
   - Click "Run Check Now"
   - Look for console messages

### Issue 4: Telegram Not Working

**Check:**
1. Bot token is correct in config.js
2. Chat ID is correct in config.js
3. You've messaged the bot first
4. Test the bot manually:
   ```
   https://api.telegram.org/bot<YOUR_TOKEN>/getMe
   ```
   Should return bot info

## Diagnostic Steps

### Step 1: Verify Extension is Loaded
```
✓ Go to edge://extensions/
✓ "SSDC Slot Watcher" is listed
✓ Toggle is ON (blue)
✓ No error messages shown
```

### Step 2: Verify Configuration
```
✓ config.js has your bot token
✓ config.js has your chat ID
✓ No syntax errors in config.js
```

### Step 3: Test Extension Popup
```
✓ Click extension icon
✓ Popup opens (doesn't crash)
✓ Can see status indicators
✓ Buttons are clickable
```

### Step 4: Test on SSDC Website
```
✓ Logged into SSDC website
✓ On booking page
✓ Extension icon shows (not grayed out)
✓ Click "Start" → Shows "Running..."
✓ Click "Run Check Now" → Changes to "Checking..."
```

### Step 5: Check DevTools
**Extension Background:**
1. `edge://extensions/` → "Service worker" link
2. Should see: "SSDC Slot Watcher background script loaded"

**SSDC Page:**
1. F12 on SSDC page
2. Console tab
3. Should see: "SSDC Slot Watcher content script loaded"

## Common Edge-Specific Issues

### Issue: Service Worker Goes Inactive
**Normal behavior!** Edge/Chrome put service workers to sleep.
They wake up when needed (alarm, message, etc.)

### Issue: Extension Doesn't Persist Settings
**Solution:**
- We use `chrome.storage.local` which persists
- Check if storage permission is granted

### Issue: Alarms Not Firing
**Check:**
1. Extension hasn't been disabled/reloaded during test
2. Computer hasn't gone to sleep
3. Browser is still open

## Testing Checklist

Follow this exact sequence:

1. ✅ **Stop any running watcher**
   - Open popup → Click "Stop"

2. ✅ **Reload extension**
   - `edge://extensions/` → Reload button

3. ✅ **Close all SSDC tabs**

4. ✅ **Open new SSDC tab**
   - Go to https://www.ssdcl.com.sg/
   - Login
   - Go to booking page

5. ✅ **Open extension popup**
   - All status should be "Inactive"
   - Last Check: "Never"

6. ✅ **Click "▶ Start"**
   - Should change to "⚡ Running..."
   - Status: Active
   - Telegram Bot: Active
   - Should receive Telegram message

7. ✅ **Click "⚡ Run Check Now"**
   - Button changes to "⏳ Checking..."
   - Watch SSDC page for activity
   - "Last Check" should update

8. ✅ **Check DevTools Console**
   - Look for: "Starting SSDC slot check..."
   - Should see automation steps

## Still Not Working?

### Get Detailed Logs

1. **Background Script Logs:**
   - `edge://extensions/` → Service worker
   - Copy all console output

2. **Content Script Logs:**
   - F12 on SSDC page → Console
   - Copy all output

3. **Extension Status:**
   - Open popup
   - Take screenshot

4. **Page State:**
   - What page are you on?
   - Are you logged in?
   - Screenshot

### Manual Test

Try running this in SSDC page console (F12):

```javascript
// Test 1: Check if extension is reachable
chrome.runtime.sendMessage({action: 'GET_STATUS'}, r => console.log('Status:', r));

// Test 2: Try to trigger check
chrome.runtime.sendMessage({action: 'RUN_NOW'}, r => console.log('Run result:', r));

// Test 3: Check if content script loaded
console.log('If you see this message, console is working!');
```

### Check SSDC Page Structure

The extension expects these elements on the page:
- `#BookingType` - Dropdown for booking type
- `#button-searchDate` - Get earliest date button
- `#modalMsgContent` - Modal message
- `#btn_checkforava` - Check availability button
- `a.slotBooking` - Slot links

**Verify they exist:**
```javascript
console.log('Dropdown:', document.querySelector('#BookingType'));
console.log('Button:', document.querySelector('#button-searchDate'));
console.log('Check Avail:', document.querySelector('#btn_checkforava'));
```

If any return `null`, the SSDC website structure has changed!

## Need More Help?

1. Capture all logs from above
2. Note exact steps you took
3. What error messages did you see?
4. Screenshot of the SSDC page you're on
5. Screenshot of extension popup
