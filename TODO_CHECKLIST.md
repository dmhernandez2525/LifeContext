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

### Lock Button Fix
- [x] LockScreen component created
- [ ] Wire LockScreen to show when isUnlocked=false in AppLayout
- [ ] Test lock/unlock flow end-to-end
- [ ] Add visual feedback when clicking lock button

### Onboarding Integration
- [ ] Wire OnboardingWizard to show on first login
- [ ] Check localStorage for 'lcc-onboarding-complete'
- [ ] Test full onboarding flow

---

## Up Next

### Content & Marketing
- [ ] Blog post: "Why We Avoid Emotional Attachment by Design"
  - How ad-driven companies profit from keeping users engaged
  - How data powers the attention economy
  - Why LifeContext intentionally avoids this
  - Leveling the playing field for personal data ownership
- [ ] Add "No Emotional Attachment" section to website
- [ ] Explain difference between a diary and a companion
- [ ] Update README with this philosophy

### Data Reclamation on Website
- [ ] Add Data Reclamation to main navigation
- [ ] Create dedicated marketing page (/features/data-reclamation)
- [ ] Chrome extension download section with badges
- [ ] GDPR automation showcase with platform logos
- [ ] Data broker section (mark "Coming Soon")

### Feature Request System (Like Strapi)
- [ ] Set up Convex project
- [ ] Schema: FeatureRequest, Comment, Vote
- [ ] Create /roadmap public page
- [ ] Upvoting (anonymous, rate-limited)
- [ ] Comment sections per feature
- [ ] /feature-request submission form
- [ ] Admin dashboard for management

### voice-docs-app Integration
- [ ] Clone repo as apps/voice-docs
- [ ] Add to TurboRepo workspace
- [ ] Review structure and dependencies
- [ ] Create /help route
- [ ] "Ask the docs" floating button
- [ ] Navigate to relevant app sections from answers

### Life Planning / Kanban Board
- [ ] KanbanBoard component with drag-and-drop
- [ ] Default columns: Backlog, To Do, In Progress, Blocked, Done
- [ ] Custom columns support
- [ ] Task cards: title, description, due date, priority, tags
- [ ] Link tasks to journal entries for context
- [ ] Subtasks / checklist items
- [ ] AI task suggestions ("You mentioned X 5 times")
- [ ] Google Calendar OAuth integration
- [ ] Timeline views: day, week, month, year, life (60+ years)

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

*Last updated: 2026-01-12 09:18*
