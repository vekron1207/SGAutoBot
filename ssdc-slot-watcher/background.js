// Background Service Worker
importScripts('config.js');

// State management
let isWatcherRunning = false;
let isBotPolling = false;
let lastUpdateId = 0;
let lastCheckTime = null;

console.log('SSDC Slot Watcher background script loaded');

// Initialize on extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
  chrome.storage.local.set({
    isWatcherActive: false,
    lastCheck: null,
    botRunning: false
  });
});

// Listen for messages from popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message:', message);

  switch (message.action) {
    case 'START_WATCHER':
      startWatcher()
        .then(() => sendResponse({ success: true }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;

    case 'STOP_WATCHER':
      stopWatcher()
        .then(() => sendResponse({ success: true }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;

    case 'GET_STATUS':
      getStatus()
        .then(status => sendResponse(status))
        .catch(error => sendResponse({ error: error.message }));
      return true;

    case 'RUN_NOW':
      performSlotCheck()
        .then(() => sendResponse({ success: true, message: 'Check triggered' }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;

    case 'SLOT_FOUND':
      handleSlotFound(message.slotData)
        .then(() => sendResponse({ success: true }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
  }
});

// Start the watcher
async function startWatcher() {
  console.log('Starting watcher...');

  // Check if config is valid
  if (!CONFIG.TELEGRAM_BOT_TOKEN || CONFIG.TELEGRAM_BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') {
    throw new Error('Please configure your Telegram bot token in config.js');
  }

  if (!CONFIG.TELEGRAM_CHAT_IDS || CONFIG.TELEGRAM_CHAT_IDS.length === 0) {
    throw new Error('Please add at least one chat ID in config.js');
  }

  // Set up the alarm for periodic checking
  await chrome.alarms.create('checkSlots', {
    delayInMinutes: CONFIG.CHECK_INTERVAL_MINUTES,
    periodInMinutes: CONFIG.CHECK_INTERVAL_MINUTES
  });

  // Start Telegram bot polling
  startTelegramBotPolling();

  // Update state
  isWatcherRunning = true;
  await chrome.storage.local.set({ isWatcherActive: true, botRunning: true });

  // Send notification to Telegram
  await sendTelegramMessage('🟢 SSDC Slot Watcher started!\nI will check for slots every 2 minutes.');

  // Trigger immediate first check after a short delay
  console.log('Scheduling immediate first check in 2 seconds...');
  setTimeout(async () => {
    console.log('Triggering immediate first check now...');
    await performSlotCheck();
  }, 2000);

  console.log('Watcher started successfully');
}

// Stop the watcher
async function stopWatcher() {
  console.log('Stopping watcher...');

  // Clear the alarm
  await chrome.alarms.clear('checkSlots');

  // Stop bot polling
  stopTelegramBotPolling();

  // Update state
  isWatcherRunning = false;
  await chrome.storage.local.set({ isWatcherActive: false, botRunning: false });

  // Send notification to Telegram
  await sendTelegramMessage('🔴 SSDC Slot Watcher stopped.');

  console.log('Watcher stopped successfully');
}

// Get current status
async function getStatus() {
  const storage = await chrome.storage.local.get(['isWatcherActive', 'lastCheck', 'botRunning']);
  return {
    isRunning: storage.isWatcherActive || false,
    lastCheck: storage.lastCheck || null,
    botRunning: storage.botRunning || false
  };
}

// Handle alarm events
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'checkSlots') {
    console.log('Alarm triggered: checking slots...');
    await performSlotCheck();
  }
});

// Perform the actual slot check
async function performSlotCheck() {
  try {
    // Find SSDC tab
    const tabs = await chrome.tabs.query({ url: '*://www.ssdcl.com.sg/*' });

    if (tabs.length === 0) {
      console.log('No SSDC tab found. Please open SSDC website first.');
      await sendTelegramMessage('⚠️ No SSDC tab found. Please open https://www.ssdcl.com.sg/booking in your browser.');
      return;
    }

    const tab = tabs[0];

    // Make sure the tab is loaded
    if (tab.status !== 'complete') {
      console.log('Tab is still loading, waiting...');
      return;
    }

    console.log(`Sending check command to tab ${tab.id}...`);

    // First, ping the content script to see if it's alive
    console.log('Pinging content script...');
    try {
      const pingResponse = await chrome.tabs.sendMessage(tab.id, { action: 'PING' });
      console.log('Ping successful:', pingResponse);
    } catch (pingError) {
      console.error('Ping failed, content script not responding:', pingError);
      await sendTelegramMessage('⚠️ Content script not loaded. Please refresh the SSDC page (F5) and try again.');
      return;
    }

    // Update last check time
    lastCheckTime = new Date().toISOString();
    await chrome.storage.local.set({ lastCheck: lastCheckTime });

    // Now send the actual check command
    try {
      console.log('Sending RUN_CHECK command...');
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'RUN_CHECK' });
      console.log('Check completed successfully:', response);
    } catch (error) {
      console.error('Check command failed:', error);
      await sendTelegramMessage('⚠️ Failed to run check. Error: ' + error.message);
    }

  } catch (error) {
    console.error('Error performing slot check:', error);
  }
}

// Handle when a slot is found
async function handleSlotFound(slotData) {
  console.log('Slot found! Sending notifications...', slotData);

  // Format the message with date, time, and timezone
  const message = `🎉 SLOT FOUND! 🎉\n\n` +
    `📅 Date: ${slotData.date || 'Check website'}\n` +
    `🕐 Time: ${slotData.time || 'Check website'}\n` +
    `🌏 Timezone: ${slotData.timezone}\n\n` +
    `Full details: ${slotData.formattedDateTime}\n\n` +
    `The slot has been automatically selected. Please complete the booking on the website!`;

  // Send to all configured chat IDs
  await sendTelegramMessage(message);

  // Stop the watcher after finding a slot
  await stopWatcher();
}

// Send message to Telegram
async function sendTelegramMessage(message) {
  if (!CONFIG.TELEGRAM_BOT_TOKEN || CONFIG.TELEGRAM_BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') {
    console.warn('Telegram bot token not configured');
    return;
  }

  const url = `https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`;

  for (const chatId of CONFIG.TELEGRAM_CHAT_IDS) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        })
      });

      const result = await response.json();

      if (!result.ok) {
        console.error('Failed to send Telegram message:', result);
      } else {
        console.log('Telegram message sent successfully to', chatId);
      }
    } catch (error) {
      console.error('Error sending Telegram message:', error);
    }
  }
}

// Start polling Telegram bot for commands
function startTelegramBotPolling() {
  if (isBotPolling) return;

  console.log('Starting Telegram bot polling...');
  isBotPolling = true;
  pollTelegramUpdates();
}

// Stop polling Telegram bot
function stopTelegramBotPolling() {
  console.log('Stopping Telegram bot polling...');
  isBotPolling = false;
}

// Poll for Telegram updates
async function pollTelegramUpdates() {
  if (!isBotPolling) return;

  try {
    const url = `https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/getUpdates?offset=${lastUpdateId + 1}&timeout=30`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.ok && data.result.length > 0) {
      for (const update of data.result) {
        lastUpdateId = update.update_id;
        await handleTelegramUpdate(update);
      }
    }
  } catch (error) {
    console.error('Error polling Telegram updates:', error);
  }

  // Continue polling if still active
  if (isBotPolling) {
    setTimeout(pollTelegramUpdates, CONFIG.BOT_POLLING_INTERVAL_SECONDS * 1000);
  }
}

// Handle Telegram bot commands
async function handleTelegramUpdate(update) {
  if (!update.message || !update.message.text) return;

  const chatId = update.message.chat.id;
  const text = update.message.text.trim();
  const command = text.split(' ')[0].toLowerCase();

  console.log(`Received Telegram command: ${command} from ${chatId}`);

  // Check if this chat ID is authorized
  if (!CONFIG.TELEGRAM_CHAT_IDS.includes(chatId)) {
    await sendTelegramReply(chatId, '❌ Unauthorized. Please add your chat ID to the configuration.');
    return;
  }

  switch (command) {
    case '/start':
      try {
        await startWatcher();
        await sendTelegramReply(chatId, '✅ Watcher started! I will monitor for available slots.');
      } catch (error) {
        await sendTelegramReply(chatId, `❌ Failed to start: ${error.message}`);
      }
      break;

    case '/stop':
      try {
        await stopWatcher();
        await sendTelegramReply(chatId, '✅ Watcher stopped.');
      } catch (error) {
        await sendTelegramReply(chatId, `❌ Failed to stop: ${error.message}`);
      }
      break;

    case '/status':
      const status = await getStatus();
      const statusMessage = `📊 Status Report\n\n` +
        `Watcher: ${status.isRunning ? '🟢 Active' : '🔴 Inactive'}\n` +
        `Bot: ${status.botRunning ? '🟢 Active' : '🔴 Inactive'}\n` +
        `Last Check: ${status.lastCheck ? new Date(status.lastCheck).toLocaleString('en-SG', { timeZone: 'Asia/Singapore' }) : 'Never'}\n` +
        `Timezone: Asia/Singapore`;
      await sendTelegramReply(chatId, statusMessage);
      break;

    case '/help':
      const helpMessage = `🤖 SSDC Slot Watcher Bot\n\n` +
        `Available Commands:\n` +
        `/start - Start watching for slots\n` +
        `/stop - Stop watching\n` +
        `/status - Check current status\n` +
        `/help - Show this message`;
      await sendTelegramReply(chatId, helpMessage);
      break;

    default:
      await sendTelegramReply(chatId, '❓ Unknown command. Use /help for available commands.');
  }
}

// Send reply to specific Telegram chat
async function sendTelegramReply(chatId, message) {
  const url = `https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message
      })
    });
  } catch (error) {
    console.error('Error sending Telegram reply:', error);
  }
}
