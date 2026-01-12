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

### Security UX
- [x] PasscodeConfirmation component requiring typed phrase
- [x] Zero-knowledge warning messaging
- [x] LockScreen component
- [x] Lock button wired in AppLayout

### Documentation
- [x] ROADMAP.md with all planned features
- [x] Life Planning Kanban specs
- [x] Premium tier definitions

### Onboarding
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

### Navigation Updates ✓
- [x] Data Reclamation in Product dropdown
- [x] Philosophy link in header
- [x] Roadmap link (highlighted)
- [x] Philosophy in footer

---

## In Progress

### Data Reclamation Marketing
- [ ] Create dedicated marketing page (/features/data-reclamation)
- [ ] Chrome extension download with badges
- [ ] GDPR automation showcase

### voice-docs Integration (Remaining)
- [ ] Add shared dependencies to packages/
- [ ] Create /help route in main app
- [ ] "Ask the docs" floating button

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

---

*Last updated: 2026-01-12 09:51*
