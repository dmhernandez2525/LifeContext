/**
 * LifeContext Extension - Popup UI Logic
 */

let exportedData = null;

// Load counts on popup open
document.addEventListener('DOMContentLoaded', async () => {
  loadCounts();
  
  document.getElementById('exportBtn').addEventListener('click', handleExport);
});

async function loadCounts() {
  try {
    // Get history count
    const historyResponse = await sendMessage({ action: 'exportHistory', timeRange: 1825 });
    if (historyResponse.success) {
      document.getElementById('historyCount').textContent = historyResponse.data.count.toLocaleString();
    }
    
    // Get cookie count
    const cookieResponse = await sendMessage({ action: 'exportCookies' });
    if (cookieResponse.success) {
      document.getElementById('cookieCount').textContent = cookieResponse.data.count.toLocaleString();
    }
    
    // Get bookmark count
    const bookmarkResponse = await sendMessage({ action: 'exportBookmarks' });
    if (bookmarkResponse.success) {
      document.getElementById('bookmarkCount').textContent = bookmarkResponse.data.count.toLocaleString();
      
      // Store for export
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

async function handleExport() {
  const btn = document.getElementById('exportBtn');
  btn.disabled = true;
  btn.innerHTML = 'Exporting<span class="loading"></span>';
  
  try {
    if (!exportedData) {
      throw new Error('No data loaded');
    }
    
    // Create downloadable JSON file
    const dataBlob = new Blob([JSON.stringify(exportedData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(dataBlob);
    
    // Download the file
    const a = document.createElement('a');
    a.href = url;
    a.download = `lifecontext-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showStatus('✅ Export complete! Import this file on lifecontext.com/data-reclamation', 'success');
    
    // Open LifeContext in new tab
    setTimeout(() => {
      chrome.tabs.create({
        url: 'https://lifecontext.com/data-reclamation?import=true'
      });
    }, 1000);
    
  } catch (error) {
    showStatus('❌ Export failed: ' + error.message, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = 'Export to LifeContext';
  }
}

function sendMessage(message) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, resolve);
  });
}

function showStatus(message, type) {
  const statusEl = document.getElementById('status');
  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
  statusEl.style.display = 'block';
}
