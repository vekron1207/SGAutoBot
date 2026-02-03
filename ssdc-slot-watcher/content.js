// Content Script - Runs on SSDC website
console.log('SSDC Slot Watcher content script loaded');

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Content script received message:', message);

  if (message.action === 'PING') {
    console.log('Responding to ping');
    sendResponse({ success: true, message: 'pong' });
    return true;
  }

  if (message.action === 'RUN_CHECK') {
    console.log('Received RUN_CHECK command - starting check...');
    runSlotCheck()
      .then(result => {
        console.log('Check complete, sending response:', result);
        sendResponse({ success: true, result });
      })
      .catch(error => {
        console.error('Check failed:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep message channel open for async response
  }

  return false;
});

// Human-like delay function
async function humanDelay(min = 500, max = 1200) {
  const ms = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Wait function
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Extract date and time information from slot
function extractSlotDateTime(slotElement) {
  try {
    // Try to get the full text content
    const fullText = slotElement.innerText || slotElement.textContent;

    // Try to find date patterns (e.g., "15 Mar 2024", "15/03/2024", etc.)
    const datePatterns = [
      /(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})/i,
      /(\d{1,2})\/(\d{1,2})\/(\d{4})/,
      /(\d{4})-(\d{2})-(\d{2})/
    ];

    // Try to find time patterns (e.g., "10:00 AM", "14:30", "2:30 PM")
    const timePatterns = [
      /(\d{1,2}):(\d{2})\s*(AM|PM)/i,
      /(\d{1,2}):(\d{2})/
    ];

    let dateInfo = null;
    let timeInfo = null;

    // Extract date
    for (const pattern of datePatterns) {
      const match = fullText.match(pattern);
      if (match) {
        dateInfo = match[0];
        break;
      }
    }

    // Extract time
    for (const pattern of timePatterns) {
      const match = fullText.match(pattern);
      if (match) {
        timeInfo = match[0];
        break;
      }
    }

    // Get Singapore timezone
    const timezone = 'Asia/Singapore';

    return {
      fullText: fullText.trim(),
      date: dateInfo,
      time: timeInfo,
      timezone: timezone,
      formattedDateTime: dateInfo && timeInfo
        ? `${dateInfo} ${timeInfo} (${timezone})`
        : fullText.trim()
    };
  } catch (error) {
    console.error('Error extracting slot date/time:', error);
    return {
      fullText: slotElement?.innerText?.trim() || 'Unknown',
      date: null,
      time: null,
      timezone: 'Asia/Singapore',
      formattedDateTime: slotElement?.innerText?.trim() || 'Unknown'
    };
  }
}

// Main slot checking function
async function runSlotCheck() {
  console.log('✓ Starting SSDC slot check...');

  try {
    // Step 1: Select "Practical Lesson" from dropdown
    console.log('Step 1: Checking booking type dropdown...');
    const bookingTypeSelect = document.querySelector('#BookingType');
    if (bookingTypeSelect) {
      console.log('✓ Found dropdown, current value:', bookingTypeSelect.value);

      // IMPORTANT: Only change if not already set to PL (changing triggers page reload!)
      if (bookingTypeSelect.value !== 'PL') {
        console.log('⚠ Not set to PL, changing... (this will reload the page)');
        bookingTypeSelect.value = 'PL';
        bookingTypeSelect.dispatchEvent(new Event('change', { bubbles: true }));
        console.log('✓ Dropdown changed, page will reload. Extension will auto-retry after reload.');
        return { found: false, message: 'Dropdown changed, waiting for page reload' };
      } else {
        console.log('✓ Already set to PL, no change needed!');
      }
    } else {
      console.error('✗ Booking type dropdown NOT found!');
      return { found: false, error: 'Dropdown not found' };
    }

    // Step 2: Click "Get Earliest Date" button
    console.log('Step 2: Looking for earliest date button...');
    const earliestDateBtn = document.querySelector('#button-searchDate');
    if (earliestDateBtn) {
      console.log('✓ Found button:', earliestDateBtn);
      console.log('Clicking earliest date button...');
      earliestDateBtn.click();
      console.log('✓ Button clicked, waiting 2 seconds...');
      await wait(2000); // Wait for modal or response
      console.log('✓ Wait complete');
    } else {
      console.error('✗ Earliest date button NOT found!');
      console.log('Searching for alternative button selectors...');
      // Try alternative selectors
      const altBtn = document.querySelector('button:contains("Earliest")') ||
                     document.querySelector('[onclick*="earliest"]') ||
                     document.querySelector('.btn:contains("Earliest")');
      if (altBtn) {
        console.log('Found alternative button:', altBtn);
        altBtn.click();
        await wait(2000);
      } else {
        console.error('No earliest date button found with any selector!');
        return { found: false, error: 'Earliest date button not found' };
      }
    }

    // Step 3: Check for "Fully Booked" modal
    await wait(1000);
    const modal = document.querySelector('#modalMsgContent');
    if (modal && modal.innerText.includes('Fully Booked')) {
      console.log('No slots available - fully booked');

      // Close the modal
      const closeBtn = document.querySelector('button[data-dismiss="modal"]');
      if (closeBtn) {
        closeBtn.click();
      }

      return {
        found: false,
        message: 'No slots available - fully booked'
      };
    }

    await humanDelay();

    // Step 4: Click "Check Availability" button
    const checkAvailabilityBtn = document.querySelector('#btn_checkforava');
    if (checkAvailabilityBtn) {
      console.log('Clicking check availability button...');
      checkAvailabilityBtn.click();
      await wait(2000); // Wait for slot matrix to load
    } else {
      console.warn('Check availability button not found');
    }

    // Step 5: Look for available slots
    await wait(1000);
    const slots = document.querySelectorAll('a.slotBooking');

    if (slots && slots.length > 0) {
      console.log(`Found ${slots.length} available slot(s)!`);

      // Get the first available slot
      const firstSlot = slots[0];
      const slotDateTime = extractSlotDateTime(firstSlot);

      console.log('Slot details:', slotDateTime);

      // Click the slot to select it
      firstSlot.click();

      // Send message to background script
      chrome.runtime.sendMessage({
        action: 'SLOT_FOUND',
        slotData: slotDateTime
      });

      return {
        found: true,
        message: 'Slot found and selected!',
        slotData: slotDateTime
      };
    } else {
      console.log('No available slots found in matrix');
      return {
        found: false,
        message: 'No available slots in the current view'
      };
    }

  } catch (error) {
    console.error('Error during slot check:', error);
    return {
      found: false,
      error: error.message
    };
  }
}

// Auto-check on page load if watcher is active
chrome.storage.local.get(['isWatcherActive'], (result) => {
  if (result.isWatcherActive) {
    console.log('Watcher is active, page loaded');
  }
});
