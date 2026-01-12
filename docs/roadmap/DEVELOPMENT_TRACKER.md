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

### Documentation
- [x] ROADMAP.md with all planned features
- [x] Life Planning Kanban specs
- [x] Premium tier definitions

### Onboarding
- [x] OnboardingWizard component (6 steps)
- [x] Funny, skippable, privacy-focused

---

## In Progress

### Onboarding Integration
- [ ] Wire OnboardingWizard to show on first login
- [ ] Save wizard completion to localStorage
- [ ] Test full onboarding flow

---

## Done Recently ✓

### Lock Button (Just Completed)
- [x] LockScreen component created
- [x] Wired to show when isUnlocked=false
- [x] Lock/unlock flow works end-to-end

---

## Up Next

### Content & Marketing
- [ ] Blog post: "Why We Avoid Emotional Attachment by Design"
  - How ad-driven companies profit from keeping users engaged
  - How data powers the attention economy
  - Why LifeContext intentionally avoids this
  - Leveling the playing field for personal data ownership
- [ ] Add "No Emotional Attachment" section to website
- [ ] Explain the difference between a diary and a companion

### Data Reclamation on Website
- [ ] Add to main navigation
- [ ] Dedicated marketing page
- [ ] Chrome extension download section
- [ ] GDPR automation showcase

### Feature Request System
- [ ] Set up Convex project
- [ ] Create /roadmap page (public)
- [ ] Upvoting and comments
- [ ] /feature-request submission form

### voice-docs-app Integration
- [ ] Clone repo as apps/voice-docs
- [ ] Add to TurboRepo workspace
- [ ] "Ask the docs" floating button
- [ ] Navigate to relevant app sections

### Life Planning / Kanban
- [ ] KanbanBoard component with drag-and-drop
- [ ] Task cards with due dates, priorities, tags
- [ ] Link tasks to journal entries
- [ ] Google Calendar OAuth integration
- [ ] Life timeline views (day/week/year/life)

### Mobile App
- [ ] Create apps/mobile with Expo
- [ ] Move shared stores to packages/core
- [ ] NativeWind setup
- [ ] Core screens: login, dashboard, quick record

---

## Recording Demos (After Features Complete)

- [ ] Full onboarding wizard
- [ ] Dashboard with demo data loaded
- [ ] Creating journal entry
- [ ] Life Chapters timeline
- [ ] Kanban board usage
- [ ] Data Reclamation flow
- [ ] GDPR request process
- [ ] Emergency Access setup

---

## Notes

- Avoid emotional attachment language — we're a tool, not a friend
- Focus: data, insights, legacy, action
- Zero-knowledge is non-negotiable
- Commit early and often

---

*Last updated: 2026-01-12*
