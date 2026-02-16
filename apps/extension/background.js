/**
 * LifeContext Chrome Extension - Background Worker
 * Handles browser history, cookies, and bookmarks export
 * with settings persistence and scheduled auto-export.
 */

const DEFAULT_SETTINGS = {
  historyDays: 1825,
  autoExportEnabled: false,
  autoExportInterval: 'weekly',
  exportHistory: true,
  exportCookies: true,
  exportBookmarks: true,
  lastExportTime: null,
};

const ALARM_NAME = 'lifecontext-auto-export';

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const handlers = {
    exportHistory: () => exportBrowserHistory(request.timeRange),
    exportCookies: () => exportCookies(),
    exportBookmarks: () => exportBookmarks(),
    getSettings: () => getSettings(),
    saveSettings: () => saveSettings(request.settings),
    getLastExport: () => getLastExportInfo(),
  };

  const handler = handlers[request.action];
  if (handler) {
    handler()
      .then((data) => sendResponse({ success: true, data }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

/**
 * Settings management via chrome.storage.local
 */
async function getSettings() {
  return new Promise((resolve) => {
    chrome.storage.local.get('settings', (result) => {
      resolve(result.settings || DEFAULT_SETTINGS);
    });
  });
}

async function saveSettings(newSettings) {
  const settings = { ...DEFAULT_SETTINGS, ...newSettings };
  await new Promise((resolve) => {
    chrome.storage.local.set({ settings }, resolve);
  });

  // Update alarm based on auto-export setting
  if (settings.autoExportEnabled) {
    setupAutoExportAlarm(settings.autoExportInterval);
  } else {
    chrome.alarms.clear(ALARM_NAME);
  }

  return settings;
}

async function getLastExportInfo() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['lastExportTime', 'lastExportCounts'], (result) => {
      resolve({
        time: result.lastExportTime || null,
        counts: result.lastExportCounts || null,
      });
    });
  });
}

async function recordExport(counts) {
  return new Promise((resolve) => {
    chrome.storage.local.set({
      lastExportTime: Date.now(),
      lastExportCounts: counts,
    }, resolve);
  });
}

/**
 * Auto-export alarm management
 */
function setupAutoExportAlarm(interval) {
  const periodMinutes = {
    daily: 24 * 60,
    weekly: 7 * 24 * 60,
    monthly: 30 * 24 * 60,
  };

  chrome.alarms.create(ALARM_NAME, {
    periodInMinutes: periodMinutes[interval] || periodMinutes.weekly,
    delayInMinutes: 1,
  });
}

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== ALARM_NAME) return;

  const settings = await getSettings();
  if (!settings.autoExportEnabled) return;

  const exportData = {};
  const counts = {};

  if (settings.exportHistory) {
    const history = await exportBrowserHistory(settings.historyDays);
    exportData.history = history;
    counts.history = history.count;
  }
  if (settings.exportCookies) {
    const cookies = await exportCookies();
    exportData.cookies = cookies;
    counts.cookies = cookies.count;
  }
  if (settings.exportBookmarks) {
    const bookmarks = await exportBookmarks();
    exportData.bookmarks = bookmarks;
    counts.bookmarks = bookmarks.count;
  }

  exportData.exportedAt = Date.now();
  exportData.autoExport = true;

  // Store latest export in chrome.storage for the web app to pick up
  await new Promise((resolve) => {
    chrome.storage.local.set({ latestAutoExport: exportData }, resolve);
  });

  await recordExport(counts);
});

/**
 * Export browser history for the specified time range
 */
async function exportBrowserHistory(days = 1825) {
  const endTime = Date.now();
  const startTime = endTime - (days * 24 * 60 * 60 * 1000);

  return new Promise((resolve, reject) => {
    chrome.history.search({
      text: '',
      startTime: startTime,
      endTime: endTime,
      maxResults: 100000
    }, (historyItems) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }

      const processedHistory = historyItems.map(item => ({
        url: item.url,
        title: item.title,
        visitTime: item.lastVisitTime,
        visitCount: item.visitCount,
        typedCount: item.typedCount || 0
      }));

      resolve({
        count: processedHistory.length,
        items: processedHistory,
        timeRange: { start: startTime, end: endTime }
      });
    });
  });
}

/**
 * Export cookie domains (not values, for privacy)
 */
async function exportCookies() {
  return new Promise((resolve, reject) => {
    chrome.cookies.getAll({}, (cookies) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }

      const domains = [...new Set(cookies.map(c => c.domain))];

      resolve({
        count: domains.length,
        domains: domains.sort()
      });
    });
  });
}

/**
 * Export bookmarks tree
 */
async function exportBookmarks() {
  return new Promise((resolve, reject) => {
    chrome.bookmarks.getTree((bookmarkTree) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }

      const flattenBookmarks = (nodes, path = '') => {
        let bookmarks = [];
        nodes.forEach(node => {
          if (node.url) {
            bookmarks.push({
              title: node.title,
              url: node.url,
              dateAdded: node.dateAdded,
              folder: path
            });
          }
          if (node.children) {
            const newPath = path ? `${path}/${node.title}` : node.title;
            bookmarks = bookmarks.concat(flattenBookmarks(node.children, newPath));
          }
        });
        return bookmarks;
      };

      const allBookmarks = flattenBookmarks(bookmarkTree);

      resolve({
        count: allBookmarks.length,
        bookmarks: allBookmarks
      });
    });
  });
}

// Installation handler
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    // Set default settings on install
    await saveSettings(DEFAULT_SETTINGS);
  }

  if (details.reason === 'update') {
    // Restore alarm if auto-export was enabled
    const settings = await getSettings();
    if (settings.autoExportEnabled) {
      setupAutoExportAlarm(settings.autoExportInterval);
    }
  }
});
