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

---

## v1.0.0 - Conversational Brain Dump (PersonaPlex Integration) 🎤

### Overview

Integrate NVIDIA's PersonaPlex full duplex AI to enable natural, conversational brain dumps. Instead of speaking into a void and waiting for AI synthesis later, users will have a real-time conversation that guides, prompts, and acknowledges them as they speak.

### What is PersonaPlex?

PersonaPlex is NVIDIA's open-source **full duplex** conversational AI:
- **Full Duplex**: Listens and speaks simultaneously
- **Back-channeling**: Says "uh-huh", "got it", "that sounds tough" while you speak
- **Near-zero latency**: <500ms response time
- **Open source**: Apache 2.0 license

### Current Brain Dump Experience
```
User speaks → [silence] → Transcription → [wait] → AI synthesis later
```

### With PersonaPlex
```
User: "I've been feeling really stressed about work lately..."
PersonaPlex: "Uh-huh..." [continues listening]
User: "...and I don't know if I should talk to my manager about it"
PersonaPlex: "That sounds frustrating. What specifically about work is stressing you out?"
User: "Mostly the deadlines, they keep moving them up"
PersonaPlex: "Unrealistic deadlines can be really challenging. Have you experienced this before?"
User: "Yeah, actually, now that you mention it..."
[continues conversation, eventually synthesizes into journal entry]
```

### Features

| Feature | Description |
|---------|-------------|
| **Active Listening** | Back-channeling ("uh-huh", "right", "that's interesting") |
| **Guided Prompts** | Asks follow-up questions to draw out details |
| **Mood Detection** | Recognizes emotional tone and responds empathetically |
| **Natural Interruption** | User can change topic mid-thought |
| **Smart Categorization** | Suggests categories as you speak ("This sounds like it could go under Career...") |
| **Memory Prompts** | "You mentioned something similar last week..." |

### Implementation Milestones

| Milestone | Description | Effort |
|-----------|-------------|--------|
| M1 | PersonaPlex server deployment | 1 week |
| M2 | Audio stream integration with web app | 1 week |
| M3 | Conversational agent prompt engineering | 1 week |
| M4 | Integration with existing transcription pipeline | 1 week |
| M5 | Mobile app support | 2 weeks |
| M6 | Testing and refinement | 1 week |

### Privacy Considerations

- PersonaPlex runs 100% locally on user's machine
- No cloud processing - maintains LifeContext's privacy-first architecture
- Compatible with existing AES-256-GCM encryption
- Audio never leaves the device

### Hardware Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| VRAM | 24GB | 32GB+ |
| RAM | 32GB | 64GB |
| GPU | Apple M2 Pro | M2 Max |

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
