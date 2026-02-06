// Popup UI Controller
document.addEventListener('DOMContentLoaded', async () => {
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const runNowBtn = document.getElementById('runNowBtn');
  const configBtn = document.getElementById('configBtn');
  const intervalValue = document.getElementById('intervalValue');
  const intervalUnit = document.getElementById('intervalUnit');
  const lessonType = document.getElementById('lessonType');
  const watcherStatus = document.getElementById('watcherStatus');
  const lastCheck = document.getElementById('lastCheck');
  const botStatus = document.getElementById('botStatus');
  const notification = document.getElementById('notification');

  // Load saved settings
  chrome.storage.local.get(['checkIntervalSeconds', 'lessonType'], (result) => {
    if (result.checkIntervalSeconds) {
      setIntervalFromSeconds(result.checkIntervalSeconds);
    }
    if (result.lessonType) {
      lessonType.value = result.lessonType;
    }
  });

  // Load and display current status
  await updateStatus();

  // Start button click
  startBtn.addEventListener('click', async () => {
    try {
      // Send message to background script to start watcher
      chrome.runtime.sendMessage({ action: 'START_WATCHER' }, (response) => {
        if (response && response.success) {
          showNotification('Watcher started successfully!');
          updateStatus();
        } else {
          showNotification('Failed to start watcher. Check configuration.', true);
        }
      });
    } catch (error) {
      showNotification('Error: ' + error.message, true);
    }
  });

  // Stop button click
  stopBtn.addEventListener('click', async () => {
    try {
      chrome.runtime.sendMessage({ action: 'STOP_WATCHER' }, (response) => {
        if (response && response.success) {
          showNotification('Watcher stopped.');
          updateStatus();
        }
      });
    } catch (error) {
      showNotification('Error: ' + error.message, true);
    }
  });

  // Run Now button click
  runNowBtn.addEventListener('click', async () => {
    try {
      runNowBtn.disabled = true;
      runNowBtn.textContent = '⏳ Checking...';

      chrome.runtime.sendMessage({ action: 'RUN_NOW' }, (response) => {
        runNowBtn.disabled = false;
        runNowBtn.textContent = '⚡ Run Check Now';

        if (response && response.success) {
          showNotification('Check triggered! Watch the SSDC page.');
          setTimeout(updateStatus, 1000);
        } else {
          showNotification('Failed to run check: ' + (response?.error || 'Unknown error'), true);
        }
      });
    } catch (error) {
      runNowBtn.disabled = false;
      runNowBtn.textContent = '⚡ Run Check Now';
      showNotification('Error: ' + error.message, true);
    }
  });

  // Helper function to convert value + unit to seconds
  function getIntervalInSeconds() {
    const value = parseInt(intervalValue.value) || 120;
    const unit = intervalUnit.value;

    let seconds = value;
    if (unit === 'minutes') {
      seconds = value * 60;
    } else if (unit === 'hours') {
      seconds = value * 3600;
    }

    // Minimum 10 seconds, maximum 1 hour
    return Math.max(10, Math.min(3600, seconds));
  }

  // Helper function to set interval from seconds
  function setIntervalFromSeconds(seconds) {
    if (seconds < 60) {
      intervalValue.value = seconds;
      intervalUnit.value = 'seconds';
    } else if (seconds < 3600) {
      intervalValue.value = Math.floor(seconds / 60);
      intervalUnit.value = 'minutes';
    } else {
      intervalValue.value = Math.floor(seconds / 3600);
      intervalUnit.value = 'hours';
    }
  }

  // Helper function to format interval for display
  function formatInterval(seconds) {
    if (seconds < 60) {
      return `${seconds} second${seconds > 1 ? 's' : ''}`;
    } else if (seconds < 3600) {
      const mins = Math.floor(seconds / 60);
      return `${mins} minute${mins > 1 ? 's' : ''}`;
    } else {
      const hours = Math.floor(seconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    }
  }

  // Save interval when value or unit changes
  async function saveInterval() {
    const seconds = getIntervalInSeconds();
    await chrome.storage.local.set({ checkIntervalSeconds: seconds });
    showNotification(`Check interval updated to ${formatInterval(seconds)}`);

    // If watcher is running, restart it with new interval
    chrome.runtime.sendMessage({ action: 'GET_STATUS' }, (response) => {
      if (response && response.isRunning) {
        showNotification('Restarting watcher with new interval...');
        chrome.runtime.sendMessage({ action: 'STOP_WATCHER' }, () => {
          setTimeout(() => {
            chrome.runtime.sendMessage({ action: 'START_WATCHER' });
          }, 500);
        });
      }
    });
  }

  // Interval value change
  intervalValue.addEventListener('change', saveInterval);
  intervalValue.addEventListener('blur', saveInterval);

  // Interval unit change
  intervalUnit.addEventListener('change', saveInterval);

  // Quick interval buttons
  document.querySelectorAll('.quick-interval-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const seconds = parseInt(btn.getAttribute('data-seconds'));
      setIntervalFromSeconds(seconds);
      await saveInterval();
    });
  });

  // Lesson type change
  lessonType.addEventListener('change', async () => {
    const selectedType = lessonType.value;
    await chrome.storage.local.set({ lessonType: selectedType });

    const typeName = selectedType === 'PL' ? 'Practical Lesson' : 'Theory Test';
    showNotification(`Lesson type changed to ${typeName}`);

    // If watcher is running, restart it with new lesson type
    chrome.runtime.sendMessage({ action: 'GET_STATUS' }, (response) => {
      if (response && response.isRunning) {
        showNotification('Restarting watcher with new lesson type...');
        chrome.runtime.sendMessage({ action: 'STOP_WATCHER' }, () => {
          setTimeout(() => {
            chrome.runtime.sendMessage({ action: 'START_WATCHER' });
          }, 500);
        });
      }
    });
  });

  // Config button click
  configBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  // Update status display
  async function updateStatus() {
    try {
      chrome.runtime.sendMessage({ action: 'GET_STATUS' }, (response) => {
        if (response) {
          // Update watcher status and Start button
          if (response.isRunning) {
            watcherStatus.textContent = 'Active';
            watcherStatus.className = 'status-value active';
            startBtn.textContent = '⚡ Running...';
            startBtn.className = 'running';
            startBtn.disabled = true;
            runNowBtn.disabled = false;
          } else {
            watcherStatus.textContent = 'Inactive';
            watcherStatus.className = 'status-value inactive';
            startBtn.textContent = '▶ Start';
            startBtn.className = '';
            startBtn.disabled = false;
            runNowBtn.disabled = true;
          }

          // Update last check time
          if (response.lastCheck) {
            const date = new Date(response.lastCheck);
            lastCheck.textContent = date.toLocaleTimeString();
          } else {
            lastCheck.textContent = 'Never';
          }

          // Update bot status
          if (response.botRunning) {
            botStatus.textContent = 'Active';
            botStatus.className = 'status-value active';
          } else {
            botStatus.textContent = 'Inactive';
            botStatus.className = 'status-value inactive';
          }
        }
      });
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  }

  // Show notification
  function showNotification(message, isError = false) {
    notification.textContent = message;
    notification.style.background = isError
      ? 'rgba(239, 68, 68, 0.3)'
      : 'rgba(16, 185, 129, 0.3)';
    notification.classList.add('show');

    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  }

  // Auto-refresh status every 5 seconds
  setInterval(updateStatus, 5000);
});
