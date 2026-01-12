# LifeContext Chrome Extension

**Export your browser data (history, cookies, bookmarks) for use in LifeContext.**

## Installation

### For Development
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select this `apps/extension` directory

### For Users (Chrome Web Store)
🚧 Coming soon - awaiting Chrome Web Store review

## Features

- **Browser History Export**: Last 5 years of browsing history
- **Cookie Domain Analysis**: See which sites track you
- **Bookmarks Backup**: Complete bookmark tree with folders
- **Privacy-First**: No data sent to servers, only local export

## Usage

1. Click the extension icon in your toolbar
2. Review the data counts
3. Click "Export to LifeContext"
4. Import the downloaded JSON file at `lifecontext.com/data-reclamation`

## Permissions

This extension requires the following permissions:

- `history`: To export your browsing history
- `bookmarks`: To export your saved bookmarks
- `cookies`: To analyze cookie domains (not values)
- `storage`: To cache export data temporarily

**Privacy Guarantee**: All data stays local. Nothing is uploaded without your explicit action.

## Development

### Build
```bash
# No build step needed - plain JavaScript
# Just load unpacked in Chrome
```

### Test
1. Load extension in Chrome
2. Click icon
3. Verify counts appear
4. Test export downloads JSON file

## Technical Details

- **Manifest Version**: 3 (latest)
- **Service Worker**: `background.js` handles data export
- **Popup**: `popup.html` + `popup.js` for UI
- **Max History**: 100,000 items (Chrome's limit)

## Security

- Client-side only (no API calls)
- Downloads JSON to user's device
- User manually imports to LifeContext
- No tracking, no analytics

## Future Enhancements

- [ ] Firefox support (WebExtensions API)
- [ ] Safari support
- [ ] Direct sync to LifeContext (encrypted)
- [ ] Incremental exports (delta updates)
