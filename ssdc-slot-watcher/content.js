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
    // Get selected lesson type from storage (default: PL for Practical Lesson)
    const storage = await chrome.storage.local.get(['lessonType']);
    const desiredLessonType = storage.lessonType || 'PL';
    const lessonTypeName = desiredLessonType === 'PL' ? 'Practical Lesson' : 'Theory Test';

    console.log(`Checking for: ${lessonTypeName} (${desiredLessonType})`);

    // Step 1: Select desired lesson type from dropdown
    console.log('Step 1: Checking booking type dropdown...');
    const bookingTypeSelect = document.querySelector('#BookingType');
    if (bookingTypeSelect) {
      console.log('✓ Found dropdown, current value:', bookingTypeSelect.value);
      console.log('Available options:', Array.from(bookingTypeSelect.options).map(opt => `${opt.value} = ${opt.text}`));

      // Map lesson type codes to possible dropdown values
      // SSDC might use full text or codes
      const possibleValues = {
        'PL': ['PL', 'Practical Lesson', 'practical', 'PRACTICAL LESSON'],
        'TT': ['TT', 'Theory Test', 'theory', 'THEORY TEST', 'Theory']
      };

      const valuesToTry = possibleValues[desiredLessonType] || [desiredLessonType];
      console.log(`Looking for values:`, valuesToTry);

      // Check if current value matches any of our desired values
      const currentValueMatches = valuesToTry.some(val =>
        bookingTypeSelect.value === val ||
        bookingTypeSelect.value.toLowerCase().includes(val.toLowerCase())
      );

      if (!currentValueMatches) {
        console.log(`⚠ Current value "${bookingTypeSelect.value}" doesn't match ${desiredLessonType}, trying to change...`);

        // Try to find the right option
        let optionSet = false;
        for (const tryValue of valuesToTry) {
          // Try exact match first
          const option = Array.from(bookingTypeSelect.options).find(opt =>
            opt.value === tryValue || opt.text === tryValue ||
            opt.value.toLowerCase() === tryValue.toLowerCase() ||
            opt.text.toLowerCase() === tryValue.toLowerCase()
          );

          if (option) {
            console.log(`✓ Found matching option: ${option.value} (${option.text})`);
            bookingTypeSelect.value = option.value;
            bookingTypeSelect.dispatchEvent(new Event('change', { bubbles: true }));
            optionSet = true;
            console.log('✓ Dropdown changed, page will reload. Extension will auto-retry after reload.');
            return { found: false, message: 'Dropdown changed, waiting for page reload' };
          }
        }

        if (!optionSet) {
          console.error(`✗ Could not find option for ${desiredLessonType}`);
          return { found: false, error: `Could not find ${lessonTypeName} option in dropdown` };
        }
      } else {
        console.log(`✓ Already set to ${lessonTypeName}, no change needed!`);
      }
    } else {
      console.error('✗ Booking type dropdown NOT found!');
      return { found: false, error: 'Dropdown not found' };
    }

    // Step 2: Click "Get Earliest Date" button
    console.log('Step 2: Looking for earliest date button...');

    // Try multiple possible selectors
    const buttonSelectors = [
      '#button-searchDate',
      'button[onclick*="earliest"]',
      'button[onclick*="Earliest"]',
      'input[type="button"][onclick*="earliest"]',
      'input[type="button"][onclick*="Earliest"]',
      'a[onclick*="earliest"]',
      'a[onclick*="Earliest"]'
    ];

    let earliestDateBtn = null;
    for (const selector of buttonSelectors) {
      try {
        earliestDateBtn = document.querySelector(selector);
        if (earliestDateBtn) {
          console.log(`✓ Found button with selector: ${selector}`, earliestDateBtn);
          break;
        }
      } catch (e) {
        console.warn(`Invalid selector: ${selector}`);
      }
    }

    // If still not found, search by button text content
    if (!earliestDateBtn) {
      console.log('Trying to find button by text content...');
      const allButtons = Array.from(document.querySelectorAll('button, input[type="button"], a.btn'));
      earliestDateBtn = allButtons.find(btn => {
        const text = btn.textContent || btn.value || '';
        return text.toLowerCase().includes('earliest') ||
               text.toLowerCase().includes('get') && text.toLowerCase().includes('date');
      });
      if (earliestDateBtn) {
        console.log('✓ Found button by text content:', earliestDateBtn);
      }
    }

    if (earliestDateBtn) {
      console.log('Clicking earliest date button...');
      earliestDateBtn.click();
      console.log('✓ Button clicked, waiting 2 seconds...');
      await wait(2000); // Wait for modal or response
      console.log('✓ Wait complete');
    } else {
      console.error('✗ Earliest date button NOT found with any method!');
      console.log('Available buttons on page:', Array.from(document.querySelectorAll('button, input[type="button"]')).map(b => b.textContent || b.value));
      return { found: false, error: 'Earliest date button not found' };
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
