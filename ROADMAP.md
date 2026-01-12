# Life Context Compiler - Roadmap

## Vision

Create the world's most comprehensive, private, and intelligent life documentation platform that helps people understand themselves deeply and preserve their wisdom for future generations. **LifeContext is a diary with insights, not a companion** — we focus on data, patterns, and legacy, not emotional attachment.

---

## Completed Features ✅

### v0.1.0 (2026-01-10)
- Core encryption with AES-256-GCM
- Voice recording with waveform visualization
- 50+ questions across 15 life categories
- Pattern recognition (themes, contradictions, strengths, blind spots)
- Brain Dump mode with AI synthesis
- Export/Import encrypted backups

### v0.2.0 (2026-01-11)
- **Daily Journal** - Voice, video, or text diary entries
- **Mood & Energy Tracking** - 5-level emoji scale and 1-5 energy slider
- **Dynamic AI Questions** - Context-aware suggestions based on answers
- **Gap Analysis** - Surfaces underexplored life categories
- **Cloud Sync** - Google Drive and OneDrive backup
- **Granular Privacy Levels** - Per-recording privacy settings
- **Demo Mode** - Pre-seeded demo account for demonstrations
- **Enhanced Insights** - Life Theme Summary and Action Items

### v0.3.0 (2026-01-12)
- **Data Reclamation** - Browser data collection UI
- **GDPR Request Automation** - 8 platform templates (Google, Meta, Amazon, etc.)
- **Chrome Extension** - Export browsing history, cookies, bookmarks
- **Emergency Access** - Shamir's Secret Sharing for dead man's switch
- **Storage Settings** - S3/Local storage configuration
- **AI Insights** - Renamed from AI Companion (data-driven, not emotional)
- **Passcode Confirmation** - Require typing "I understand I cannot get this back"

---

## In Development 🚧

### v0.4.0 - Life Project Management
- [ ] **Kanban Board** - Drag-and-drop task management
  - [ ] Default columns: Backlog, To Do, In Progress, Blocked, Done
  - [ ] Custom columns support
  - [ ] Task cards with due dates, priorities, tags
  - [ ] Link tasks to journal entries for context
- [ ] **Life Timeline Views**
  - [ ] Day/Week/Month/Year views
  - [ ] Life view (60+ years planning)
  - [ ] "Where do you see yourself in 10 years?" visualization
- [ ] **AI Task Suggestions**
  - [ ] Analyze journals → suggest tasks
  - [ ] Detect patterns: "You mentioned X 5 times"
  - [ ] Weekly review: "What you said vs what you did"
- [ ] **Google Calendar Integration**
  - [ ] OAuth flow for Calendar API
  - [ ] Sync tasks with due dates
  - [ ] Show Google events in LifeContext timeline

---

## Planned Features 📋

### v0.5.0 - Onboarding & Documentation
- [ ] **Onboarding Wizard**
  - [ ] Funny, skippable introduction
  - [ ] Passcode setup with typing confirmation
  - [ ] Data Reclamation opt-in
  - [ ] Browser extension prompt
  - [ ] Quick feature tour
- [ ] **Voice Docs Integration**
  - [ ] Embed voice-docs-app for "Ask the docs"
  - [ ] Navigate to relevant sections from questions
  - [ ] Floating help button

### v0.6.0 - Mobile Experience
- [ ] **React Native App** (via Expo)
  - [ ] iOS and Android
  - [ ] Offline-first with sync
  - [ ] Biometric authentication
- [ ] **Shared Codebase**
  - [ ] Move stores to `packages/core`
  - [ ] NativeWind for Tailwind on mobile
- [ ] **Mobile-First Features**
  - [ ] Quick Record widget
  - [ ] Background audio recording
  - [ ] Push notifications

### v0.7.0 - Feature Request System
- [ ] **Public Roadmap Page** (`/roadmap`)
  - [ ] Planned / In Progress / Done columns
  - [ ] Upvoting (like Canny/ProductBoard)
  - [x] Feature: Legacy Building
- [x] Feature: Relationship Intelligence
- [ ] Feature: Life Planning AI (Deep Dive Creation)
  - [ ] Contextual "Create" validation
  - [ ] Voice-based "Deep Dive" session for detailed goal setting
  - [ ] Auto-transcription to structured plan
- [ ] **Feature Request Form**
  - [ ] Submit title, description, category
  - [ ] Store in Convex database
  - [ ] Admin dashboard for management

### v0.8.0 - Data Broker Buyback
- [ ] **Opt-Out Automation**
  - [ ] 50+ broker removal templates
  - [ ] Deletion tracking dashboard
  - [ ] Verify deletion after 45 days
- [ ] **Whitepages API Integration**
  - [ ] User enters their API key
  - [ ] Auto-query their own data
- [ ] **Digital Twin Report**
  - [ ] "What companies know about you"
  - [ ] Unified visualization of all sources

---

## Premium Tiers 💎

### Free Tier
- Basic journaling (50 entries/month)
- 3 GDPR request templates
- Local-only storage

### Pro Tier ($9.99/mo)
- Unlimited entries
- 50+ GDPR templates
- Google Calendar sync
- 10 AI task suggestions/month

### Unlimited Tier ($19.99/mo)
- Everything in Pro
- Unlimited AI suggestions
- All calendar integrations
- Data Reclamation features
- Priority support

---

## Long-term Vision 🔮

### AI Insights Engine
- Pattern detection across 10+ years of data
- Proactive questions based on life events
- "Digital Twin" analysis of your complete context

### Platform Expansion
- API for third-party integrations
- Therapist/coach portal for shared context export
- Educational institutions support
- Corporate wellness programs

### Data & Privacy
- Blockchain-based data verification
- Zero-knowledge proof for data attestation
- Decentralized storage options (IPFS)
- Hardware security module (HSM) support

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

Priority areas:
1. **Life Planning Kanban** - React DnD implementation
2. **Mobile App** - Expo setup and core screens
3. **Calendar Integrations** - Google OAuth flow
4. **Accessibility** - Screen readers, keyboard navigation
5. **Performance** - Large dataset optimization

---

## Feedback

Have ideas for the roadmap? 
- Open an issue on GitHub
- Use `/feature-request` in the app (coming soon)
- Vote on existing features at `/roadmap` (coming soon)
