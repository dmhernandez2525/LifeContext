/**
 * LifeContext Chrome Extension - Background Worker
 * Handles browser history, cookies, and bookmarks export
 */

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'exportHistory') {
    exportBrowserHistory(request.timeRange)
      .then((data) => sendResponse({ success: true, data }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true; // Keep message channel open for async response
  }
  
  if (request.action === 'exportCookies') {
    exportCookies()
      .then((data) => sendResponse({ success: true, data }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true;
  }
  
  if (request.action === 'exportBookmarks') {
    exportBookmarks()
      .then((data) => sendResponse({ success: true, data }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

/**
 * Export browser history for the specified time range
 */
async function exportBrowserHistory(days = 1825) { // Default: 5 years
  const endTime = Date.now();
  const startTime = endTime - (days * 24 * 60 * 60 * 1000);
  
  return new Promise((resolve, reject) => {
    chrome.history.search({
      text: '',
      startTime: startTime,
      endTime: endTime,
      maxResults: 100000 // Chrome's max
    }, (historyItems) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }
      
      // Transform to our format
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
      
      // Extract unique domains only (don't export values for privacy)
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
      
      // Flatten tree for easier parsing
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
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('LifeContext Extension installed');
    // Open welcome page
    chrome.tabs.create({
      url: 'https://lifecontext.yourapp.com/data-reclamation?extension=installed'
    });
  }
});
