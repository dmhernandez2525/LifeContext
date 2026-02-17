/**
 * LifeContext Extension - Popup UI Logic
 * Handles data counts, export, settings panel, and last-export display.
 */

let exportedData = null;
let currentSettings = null;

document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  loadCounts();
  loadLastExport();

  document.getElementById('exportBtn').addEventListener('click', handleExport);
  document.getElementById('settingsBtn').addEventListener('click', showSettings);
  document.getElementById('backBtn').addEventListener('click', hideSettings);

  // Toggle buttons
  document.querySelectorAll('.toggle').forEach(btn => {
    btn.addEventListener('click', () => handleToggle(btn));
  });

  // Select changes
  document.getElementById('historyDays').addEventListener('change', (e) => {
    updateSetting('historyDays', parseInt(e.target.value, 10));
  });
  document.getElementById('autoExportInterval').addEventListener('change', (e) => {
    updateSetting('autoExportInterval', e.target.value);
  });
});

async function loadSettings() {
  const response = await sendMessage({ action: 'getSettings' });
  if (response.success) {
    currentSettings = response.data;
    applySettingsToUI(currentSettings);
  }
}

function applySettingsToUI(settings) {
  document.getElementById('historyDays').value = String(settings.historyDays);
  setToggle('toggleHistory', settings.exportHistory);
  setToggle('toggleCookies', settings.exportCookies);
  setToggle('toggleBookmarks', settings.exportBookmarks);
  setToggle('toggleAutoExport', settings.autoExportEnabled);

  const intervalRow = document.getElementById('intervalRow');
  intervalRow.style.display = settings.autoExportEnabled ? 'flex' : 'none';
  document.getElementById('autoExportInterval').value = settings.autoExportInterval;
}

function setToggle(id, value) {
  const el = document.getElementById(id);
  if (value) { el.classList.add('on'); } else { el.classList.remove('on'); }
}

function handleToggle(btn) {
  const isOn = btn.classList.toggle('on');
  const key = btn.dataset.key;
  updateSetting(key, isOn);

  if (key === 'autoExportEnabled') {
    document.getElementById('intervalRow').style.display = isOn ? 'flex' : 'none';
  }
}

async function updateSetting(key, value) {
  if (!currentSettings) return;
  currentSettings[key] = value;
  await sendMessage({ action: 'saveSettings', settings: currentSettings });
}

async function loadCounts() {
  try {
    const days = currentSettings ? currentSettings.historyDays : 1825;

    const historyResponse = await sendMessage({ action: 'exportHistory', timeRange: days });
    if (historyResponse.success) {
      document.getElementById('historyCount').textContent = historyResponse.data.count.toLocaleString();
    }

    const cookieResponse = await sendMessage({ action: 'exportCookies' });
    if (cookieResponse.success) {
      document.getElementById('cookieCount').textContent = cookieResponse.data.count.toLocaleString();
    }

    const bookmarkResponse = await sendMessage({ action: 'exportBookmarks' });
    if (bookmarkResponse.success) {
      document.getElementById('bookmarkCount').textContent = bookmarkResponse.data.count.toLocaleString();

      exportedData = {
        history: historyResponse.data,
        cookies: cookieResponse.data,
        bookmarks: bookmarkResponse.data,
        exportedAt: Date.now()
      };
    }
  } catch (error) {
    showStatus('Failed to load data: ' + error.message, 'error');
  }
}

async function loadLastExport() {
  const response = await sendMessage({ action: 'getLastExport' });
  if (response.success && response.data.time) {
    const el = document.getElementById('lastExport');
    const date = new Date(response.data.time);
    el.textContent = 'Last export: ' + date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    el.style.display = 'block';
  }
}

async function handleExport() {
  const btn = document.getElementById('exportBtn');
  btn.disabled = true;
  btn.innerHTML = 'Exporting<span class="loading"></span>';

  try {
    if (!exportedData) {
      throw new Error('No data loaded');
    }

    // Filter based on settings
    const filteredData = { exportedAt: Date.now() };
    if (!currentSettings || currentSettings.exportHistory) {
      filteredData.history = exportedData.history;
    }
    if (!currentSettings || currentSettings.exportCookies) {
      filteredData.cookies = exportedData.cookies;
    }
    if (!currentSettings || currentSettings.exportBookmarks) {
      filteredData.bookmarks = exportedData.bookmarks;
    }

    const dataBlob = new Blob([JSON.stringify(filteredData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(dataBlob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'lifecontext-export-' + Date.now() + '.json';
    a.click();
    URL.revokeObjectURL(url);

    showStatus('Export complete! Import this file in LifeContext.', 'success');

    // Record the export
    await sendMessage({
      action: 'saveSettings',
      settings: { ...currentSettings, lastExportTime: Date.now() }
    });

  } catch (error) {
    showStatus('Export failed: ' + error.message, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = 'Export to LifeContext';
  }
}

function showSettings() {
  document.getElementById('mainPanel').classList.add('hidden');
  document.getElementById('settingsPanel').classList.add('active');
}

function hideSettings() {
  document.getElementById('settingsPanel').classList.remove('active');
  document.getElementById('mainPanel').classList.remove('hidden');
  // Refresh counts with new settings
  loadCounts();
}

function sendMessage(message) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, resolve);
  });
}

function showStatus(message, type) {
  const statusEl = document.getElementById('status');
  statusEl.textContent = message;
  statusEl.className = 'status ' + type;
  statusEl.style.display = 'block';
}
