# Development Roadmap & Task Tracker

> Internal development tracking. Updated as we build.

---

## Confirmed Decisions

- **Passcode confirmation**: Users type "I understand I cannot get this back"
- **Data Reclamation**: Free during beta, tiered pricing later
- **voice-docs-app**: Clone as `apps/voice-docs` in TurboRepo
- **Database**: Convex for feature requests, tasks, etc.
- **Demo recordings**: Show all functionality including login flow
- **Language**: "Diary with insights" — no "companion" language, avoid emotional attachment

---

## Gap Analysis & Critical Missing Functionality


### 1. Infrastructure & Deployment (Missing)
- **CI/CD Pipeline**:
  - [ ] GitHub Actions for building Web + Mobile
  - [ ] Automated linting and E2E testing on PRs
  - [ ] Auto-deploy to Render on merge to `main`
- **Self-Hosting Support**:
  - [ ] `Dockerfile` for the web app (nginx serving static build)
  - [ ] `docker-compose.yml` for simplified orchestration
- **Monitoring**:
  - [ ] Sentry integration for frontend error tracking
  - [ ] Performance monitoring (Web Vitals)

### 2. Advanced Security (Missing)
- **Duress Password**:
  - [ ] A secondary password that unlocks a "dummy" vault or wipes data
- **Session Security**:
  - [ ] Auto-lock timeout settings (e.g., "Lock after 5 mins of inactivity")
  - [ ] WebAuthn/Biometric unlock support (FaceID/TouchID)
- **Encryption Updates**:
  - [ ] Key rotation strategy (changing passcode = re-encrypting DEK)

### 3. Data Retention & Sovereignty (Missing)
- **Automated Retention Policies**:
  - [ ] Implementation of "Delete audio older than X days" (UI exists, logic missing)
  - [ ] "Dead Man's Switch": Trigger email if inactive for Y days
- **Real S3 Integration**:
  - [ ] `packages/storage` currently uses local IndexedDB. Need actual S3 client.
- **Import/Migration**:
  - [ ] Import from DayOne, Journey, Apple Notes (JSON/ZIP parsers)

### 4. Competitive Features (Missing)
*vs. Day One, Stoic, Apple Journal*
- **Health Integration**:
  - [ ] Sync steps/sleep/heart rate (correlated with mood)
- **Rich Media**:
  - [ ] Photo gallery view (Calendar view with thumbnails)
  - [ ] Voice memos playing *inline* in the timeline
- **Context Awareness**:
  - [ ] Location tagging (auto-detect city/weather)
  - [ ] "On this day" flashbacks (with opt-out)

### 5. Mobile App (Greenfield)
*Project `apps/mobile` initialized*
- **Core Stack**: Expo 52, NativeWind, MMKV
- **Specific Needs**:
  - [ ] Share Extension (Send text/photos from other apps to LifeContext)
  - [ ] Background Audio Recording (for long brain dumps)
  - [ ] Widget support (Quick sentiment check-in)

---

## Done ✓

### Demo Data
- [x] Alex Chen persona (34yo software engineer, Austin TX)
- [x] 500+ journal entries spanning 10 years
- [x] Life chapters (college, first job, marriage, parenthood)
- [x] 20+ relationships with context
- [x] Task/goal data for Kanban demo

### Language & Positioning
- [x] Replaced "companion" with "insights" throughout codebase
- [x] Renamed AICompanionPage → AIInsightsPage
- [x] Updated navigation, routes, and all copy
- [x] Added "Philosophy" section to README

### Security UX
- [x] PasscodeConfirmation component requiring typed phrase
- [x] Zero-knowledge warning messaging
- [x] LockScreen component
- [x] Lock button wired in AppLayout

### Documentation
- [x] ROADMAP.md with all planned features
- [x] Life Planning Kanban specs
- [x] Premium tier definitions

### Onboarding ✓
- [x] OnboardingWizard component (6 steps)
- [x] Funny, skippable, privacy-focused
- [x] Wired to show on first login
- [x] localStorage completion tracking
- [x] PasscodeConfirmation integrated
- [x] Data Reclamation opt-in toggle

### Life Planning Kanban ✓
- [x] KanbanBoard component with 5 columns
- [x] Task cards with due dates, priorities, tags
- [x] Subtasks progress bar
- [x] Add/Edit modal for tasks
- [x] Category filter
- [x] Timeline views (week, month, year, life)
- [x] AI suggestions panel (mock)
- [x] 60-year life timeline visualization

### Feature Request System ✓
- [x] FeatureRequestPage with voting UI
- [x] PublicRoadmapPage with 3 columns
- [x] Convex schema prepared (schema.ts)
- [x] Convex functions prepared (features.ts)
- [x] Routes: /feature-request, /roadmap

### Philosophy & Content ✓
- [x] PhilosophyPage: "Why We Avoid Emotional Attachment"
- [x] Added to navigation (header + footer)

### voice-docs Integration ✓
- [x] Cloned as apps/voice-docs
- [x] Removed .git for monorepo
- [x] Renamed package to @lcc/voice-docs
- [x] "Ask the docs" floating button (AskDocsButton component)
- [x] Available on BOTH dashboard AND public website

### Navigation Updates ✓
- [x] Data Reclamation in Product dropdown (links to marketing page)
- [x] Philosophy link in header
- [x] Roadmap link (highlighted)
- [x] Philosophy in footer
- [x] Roadmap in footer

### Data Reclamation Marketing ✓
- [x] Dedicated marketing page at /features/data-reclamation
- [x] Chrome extension download with badges
- [x] GDPR automation showcase with 8 platforms
- [x] Hero with "Free During Beta" messaging
- [x] Three pillars: Browser Data, GDPR, Data Brokers
- [x] Data broker section (marked "Coming Soon")

### Help Center ✓
- [x] HelpPage at /help with documentation links
- [x] FAQ section (4 common questions)
- [x] Video tutorials placeholder
- [x] AskDocsButton floating on all pages

---

## In Progress / Known Issues

### Images - User Feedback (IMPORTANT)
- [x] **AI-generated images look untrustworthy** - user feedback
- [x] Consider replacing with GIFs or real screenshots (Replaced with CSS/SVG visuals)
- [x] Most pages already use icons/gradients (good)
- [x] Review LandingPage and feature pages for problematic images

### voice-docs Integration (Remaining)
- [ ] Add shared dependencies to packages/
- [ ] Connect AskDocsButton to actual voice-docs AI backend
- [ ] Navigate to relevant app sections from AI answers

---

## Up Next

### Chrome Extension
- [ ] Package for Chrome Web Store
- [ ] Create icons and promotional images
- [ ] Write store listing

### Mobile App
- [ ] Create apps/mobile with Expo
- [ ] Move shared stores to packages/core
- [ ] NativeWind setup
- [ ] Core screens: login, dashboard, quick record

### Convex Deployment
- [ ] Set up Convex account
- [ ] Deploy schema and functions
- [ ] Connect UI to live backend

### Recording Demos
- [ ] Full onboarding wizard
- [ ] Dashboard with demo data
- [ ] Kanban board usage
- [ ] Data Reclamation flow

---

## Notes

- Avoid emotional attachment language — we're a tool, not a friend
- Focus: data, insights, legacy, action
- Zero-knowledge is non-negotiable
- Commit early and often
- **Image quality matters** - AI images can hurt trust

---

*Last updated: 2026-01-12 10:06*
