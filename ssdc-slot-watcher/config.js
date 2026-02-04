// Configuration for SSDC Slot Watcher
const CONFIG = {
  // Telegram Bot Configuration
  // 1. Create bot via https://t.me/BotFather
  // 2. Get your bot token and paste it below
  TELEGRAM_BOT_TOKEN: "8391995222:AAF2dm28b3yY562OIdUsWeR0fkz0J4-n6sk",

  // Chat IDs to receive notifications
  // To get your chat ID:
  // 1. Message your bot
  // 2. Visit: https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
  // 3. Look for "chat":{"id": YOUR_CHAT_ID}
  TELEGRAM_CHAT_IDS: [
    741316379,   // @vekron (Varun Kashyap)
    1683862950   // @brrr192 (BR)
  ],

  // Check interval (in minutes)
  CHECK_INTERVAL_MINUTES: 2,

  // Random jitter range (in seconds) to add to interval
  JITTER_MIN_SECONDS: 0,
  JITTER_MAX_SECONDS: 30,

  // Human-like delays (in milliseconds)
  DELAY_MIN_MS: 500,
  DELAY_MAX_MS: 1200,

  // Wait times for page loads (in milliseconds)
  WAIT_AFTER_CLICK_MS: 2000,

  // Telegram bot polling interval (in seconds)
  BOT_POLLING_INTERVAL_SECONDS: 3
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
