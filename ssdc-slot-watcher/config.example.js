// Configuration Example for SSDC Slot Watcher
// Copy this to config.js and fill in your details

const CONFIG = {
  // =============================================================================
  // TELEGRAM BOT CONFIGURATION
  // =============================================================================

  // Your Telegram Bot Token
  // Get this from @BotFather on Telegram
  // Example: "123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
  TELEGRAM_BOT_TOKEN: "YOUR_BOT_TOKEN_HERE",

  // Chat IDs that can receive notifications and control the bot
  // Get your chat ID by:
  // 1. Message your bot
  // 2. Visit: https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates
  // 3. Find "chat":{"id": YOUR_CHAT_ID}
  // Example: [123456789, 987654321]
  TELEGRAM_CHAT_IDS: [
    // Add your chat IDs here
  ],

  // =============================================================================
  // CHECKING CONFIGURATION
  // =============================================================================

  // How often to check for slots (in minutes)
  // Recommended: 2 minutes (to avoid rate limiting)
  CHECK_INTERVAL_MINUTES: 2,

  // Random jitter to add to check interval (in seconds)
  // This helps avoid detection by making checks less predictable
  JITTER_MIN_SECONDS: 0,
  JITTER_MAX_SECONDS: 30,

  // =============================================================================
  // HUMAN-LIKE BEHAVIOR CONFIGURATION
  // =============================================================================

  // Delay between actions (in milliseconds)
  // Simulates human clicking speed
  DELAY_MIN_MS: 500,
  DELAY_MAX_MS: 1200,

  // Wait time after clicking buttons (in milliseconds)
  // Allows page to load/respond
  WAIT_AFTER_CLICK_MS: 2000,

  // =============================================================================
  // TELEGRAM BOT POLLING CONFIGURATION
  // =============================================================================

  // How often to check for Telegram commands (in seconds)
  BOT_POLLING_INTERVAL_SECONDS: 3
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
