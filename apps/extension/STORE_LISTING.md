# LifeContext - Data Reclamation Chrome Extension

## Store Listing Information

### Extension Name
**LifeContext - Data Reclamation**

### Short Description (132 chars max)
Export your browsing history, cookies, and bookmarks to understand your digital footprint. Private, secure, and zero-knowledge.

### Detailed Description

**Take Back Your Digital Life**

LifeContext Data Reclamation helps you understand and control your digital footprint by exporting your browser data for analysis within the LifeContext privacy platform.

**What It Does:**
• 📜 Export your complete browsing history (up to 5 years)
• 🍪 Identify all cookie domains tracking you
• 📚 Backup your bookmarks with folder structure
• 🔒 Everything stays local - we never see your data

**Why Use This:**
Every website you visit, every link you click - it's all stored by Google, Facebook, and hundreds of data brokers. They know more about you than you know about yourself.

This changes that.

LifeContext gives YOU the same power. Export your data to:
- See patterns in your browsing behavior
- Understand which companies track you most
- Build your own "digital twin" for personal insights
- Prepare for GDPR/CCPA data requests

**Privacy First:**
• Zero-knowledge architecture - we physically cannot access your data
• All processing happens locally on your device
• No cloud uploads required (optional sync available)
• Open source and auditable

**Part of LifeContext:**
This extension works with LifeContext, the privacy-first life documentation platform. Visit lifecontext.com to learn more.

**Free During Beta:**
All features are completely free while we're in beta. Help us build the future of personal data sovereignty.

---

### Category
**Productivity**

### Tags/Keywords
- privacy
- data export
- browsing history
- GDPR
- data reclamation
- personal data
- cookies
- bookmarks
- digital footprint

### Screenshots Needed
1. Popup UI showing history/cookie/bookmark counts
2. Export in progress with loading animation
3. Completed export with success message
4. Integration with LifeContext web app

### Promotional Images
- Small tile (440x280): Purple gradient with LifeContext logo
- Large tile (920x680): Full feature breakdown visual
- Marquee (1400x560): "Take Back Your Digital Life" hero banner

### Privacy Policy URL
https://lifecontext.com/privacy

### Support URL  
https://lifecontext.com/help

### Developer Information
- Publisher: LifeContext
- Website: https://lifecontext.com
- Email: support@lifecontext.com

---

## Manifest V3 Permissions Justification

| Permission | Justification |
|------------|---------------|
| `history` | Required to read browsing history for export |
| `bookmarks` | Required to read bookmarks for backup |
| `cookies` | Required to list cookie domains (not values) |
| `storage` | Required to store export preferences locally |
| `<all_urls>` (host) | Required for cookie access across all domains |

---

## Version History

### v1.0.0 (Initial Release)
- Export browsing history (up to 100,000 URLs)
- Export cookie domains (privacy-preserving - no values)
- Export bookmarks with folder structure
- Modern popup UI with real-time counts
- Download as JSON for LifeContext import
