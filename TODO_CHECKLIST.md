# Master TODO Checklist - LifeContext Session Work

> Internal development tracking. Keep this updated as work progresses.

---

## Confirmed Decisions

- **Passcode confirmation**: Users type "I understand I cannot get this back"
- **Data Reclamation**: Free during beta, tiered pricing later
- **voice-docs-app**: Clone as `apps/voice-docs` in TurboRepo
- **Database**: Convex for feature requests, tasks, etc.
- **Demo recordings**: Show all functionality including login flow
- **Demo data**: Extensive human backstory (60+ years of life, many categories)
- **Language**: "Diary with insights" NOT "companion" (avoid emotional attachment)

---

## Done ✓

### Demo Data (Alex Chen Persona)
- [x] Create Alex Chen profile (34yo software engineer, Austin TX)
- [x] 500+ journal entries spanning 10 years
- [x] Life chapters: college, first job, marriage, parenthood, career pivot
- [x] 8 relationships with context (Maya, Lily, Sam, parents, therapist, etc.)
- [x] Emotional trends data across years
- [x] Task/goal data for Kanban demo (20+ tasks)

### Language & Positioning
- [x] Search codebase for "companion" usage
- [x] Replace with "diary" or "journal" or "insights engine"
- [x] Rename AICompanionPage → AIInsightsPage
- [x] Update navigation, routes, imports
- [x] Update LandingPage copy
- [x] Update OnboardingPage copy

### Security UX
- [x] PasscodeConfirmation component
- [x] Require typing "I understand I cannot get this back"
- [x] Visual feedback for phrase matching
- [x] LockScreen component for locked state

### Onboarding
- [x] OnboardingWizard component with 6 steps
- [x] Funny, skippable introduction
- [x] Privacy/zero-knowledge explanation
- [x] Passcode confirmation integration
- [x] Data Reclamation opt-in toggle
- [x] Browser extension prompt

### Documentation
- [x] ROADMAP.md with all planned features
- [x] Life Planning Kanban specs
- [x] Premium tier definitions
- [x] docs/roadmap/DEVELOPMENT_TRACKER.md

---

## In Progress

### Lock Button
- [x] LockScreen component created
- [x] Wired to show when isUnlocked=false in AppLayout
- [x] Test lock/unlock flow end-to-end
- [x] Lock button in sidebar triggers lock state

### Onboarding Integration
- [x] Wire OnboardingWizard to show on first login
- [x] Check localStorage for 'lcc-onboarding-complete'
- [x] Test full onboarding flow
- [x] PasscodeConfirmation integrated
- [x] Data Reclamation opt-in toggle

### voice-docs-app Integration
- [x] Clone repo as apps/voice-docs
- [x] Remove .git for monorepo integration
- [x] Rename package to @lcc/voice-docs
- [x] "Ask the docs" floating button
- [ ] Add shared dependencies to packages/
- [ ] Create /help route in main app (connect to voice-docs)
- [ ] Navigate to relevant app sections

---

## Up Next

### Content & Marketing
- [x] PhilosophyPage: "Why We Avoid Emotional Attachment"
  - How ad-driven companies profit from keeping users engaged
  - How data powers the attention economy
  - Why LifeContext intentionally avoids this
  - Leveling the playing field for personal data ownership
- [x] Add "Philosophy" link to website navigation
- [ ] Add more content to README with this philosophy

### Data Reclamation on Website
- [x] Add Data Reclamation to main navigation
- [x] Create dedicated marketing page (/features/data-reclamation)
- [x] Chrome extension download section with badges
- [x] GDPR automation showcase with platform logos
- [ ] Data broker section (mark "Coming Soon")

### Help Center
- [x] Create /help route
- [x] HelpPage with documentation links
- [x] FAQ section
- [x] "Ask the Docs" floating button
- [ ] Connect to voice-docs AI (requires backend)

### Feature Request System (Like Canny)
- [x] FeatureRequestPage UI complete
- [x] PublicRoadmapPage with 3 columns
- [x] Convex schema prepared (schema.ts)
- [x] Convex functions prepared (features.ts)
- [x] /feature-request route
- [x] /roadmap route
- [ ] Deploy Convex when account ready
- [ ] Admin dashboard for management

### voice-docs-app Integration
- [ ] Clone repo as apps/voice-docs
- [ ] Add to TurboRepo workspace
- [ ] Review structure and dependencies
- [ ] Create /help route
- [ ] "Ask the docs" floating button
- [ ] Navigate to relevant app sections from answers

### Life Planning / Kanban Board
- [x] KanbanBoard component with 5 columns
- [x] Task cards: title, description, due date, priority, tags
- [x] Subtasks progress bar
- [x] Add/Edit modal for tasks
- [x] Category filter (Career, Health, Family, etc.)
- [x] Timeline views: week, month, year, life
- [x] AI suggestions panel (mock)
- [x] 60-year life timeline visualization
- [ ] Drag-and-drop reordering (planned for v2)
- [ ] Link tasks to journal entries for context
- [ ] Google Calendar OAuth integration

### Mobile App (Expo)
- [ ] Create apps/mobile with create-expo-app
- [ ] Add to TurboRepo workspace
- [ ] Move shared stores to packages/core
- [ ] NativeWind for Tailwind on mobile
- [ ] Core screens: login, dashboard, quick record
- [ ] expo-av for voice recording
- [ ] Push notifications

### Premium Tier Definitions
- **Free**: Basic journaling (50 entries/month), 3 GDPR templates, local storage
- **Pro** ($9.99/mo): Unlimited entries, 50+ GDPR templates, Calendar sync, 10 AI suggestions/month
- **Unlimited** ($19.99/mo): Everything in Pro + unlimited AI + all integrations + priority support

---

## Recording Demos (After Features Complete)

### What to Record
- [ ] Full onboarding wizard flow
- [ ] Login with passcode
- [ ] Dashboard with rich demo data
- [ ] Creating a journal entry
- [ ] Life Chapters timeline view
- [ ] Kanban board usage
- [ ] Data Reclamation consent & collection
- [ ] GDPR request workflow
- [ ] Emergency Access setup
- [ ] Storage Settings

### Where to Embed
- [ ] README.md hero section
- [ ] LandingPage VideoShowcase component
- [ ] Individual feature pages
- [ ] /help documentation

---

## Code Quality

- [x] Fix unused Download import in GDPRRequestPage.tsx
- [x] Fix unused categories variable in demo-tasks.ts
- [x] Build passes successfully
- [ ] Run full lint check
- [ ] E2E tests for critical flows

---

## Notes

- Avoid emotional attachment language — we're a tool, not a friend
- Focus: data, insights, legacy, action
- Zero-knowledge is non-negotiable
- Commit early and often
- Keep this checklist updated as work progresses

---

## Known Issues / User Feedback

### Images (Priority: High)
- [ ] AI-generated images look untrustworthy (user feedback)
- [ ] Consider replacing with GIFs or real screenshots
- [ ] Most pages use icons/gradients which is good
- [ ] Review LandingPage for problematic images

---

*Last updated: 2026-01-12 09:18*
