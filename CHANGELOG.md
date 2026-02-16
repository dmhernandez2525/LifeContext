# Changelog

All notable changes to the Life Context Compiler project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

#### F5.1 Onboarding Refinement
- Refactored onboarding into modular components under `apps/web/src/components/onboarding/`
- Added skip confirmation dialog before onboarding can be bypassed
- Added intent-based personalized onboarding paths for journaling, therapy, and legacy use cases
- Added quick-start mode for minimal onboarding setup
- Added onboarding progress persistence and resume support via localStorage draft state
- Added onboarding analytics session tracking with completion, skip, drop-off, and per-step timing data
- Added contextual per-step help tooltip explaining why each setup choice matters
- Added onboarding summary step that reflects configured options before entering the app
- Added stronger onboarding E2E coverage for skip confirmation, progress persistence, personalized paths, and completion analytics

#### F5.2 Voice-Docs Backend
- Added Convex voice-docs backend data model for conversations, messages, cache, analytics, and rate limits
- Added backend action handlers for AI response generation and conversation summarization
- Added response caching and per-session rate limiting for voice-docs backend requests
- Added fallback-response behavior and webhook emission for backend quality monitoring events
- Added HTTP endpoints for voice-docs respond, summarize, and popular-question queries
- Wired web Ask Docs assistant to use the backend service layer with section-aware context payloads

#### F5.3 Voice-Docs Navigation
- Added command parsing and route targeting for natural language navigation in Ask Docs
- Added contextual help suggestions and breadcrumb-aware help context labels
- Added guided walkthrough overlays with spotlighted UI steps and quick-action triggers
- Added deep-link search command routing for settings, journal, and question jump targets
- Added command palette access for fast page navigation with fuzzy target filtering
- Added persistent help history panel with replay and clear actions
- Added section-based feature discovery prompts for first-time help interactions
- Added E2E coverage for navigation commands, contextual suggestions, walkthrough progression, deep-link routing, and keyboard shortcut opening

## [0.4.1] - 2026-01-12

### Added

#### Chrome Extension Store Preparation
- **STORE_LISTING.md**: Complete Chrome Web Store listing with description, keywords, permissions justification
- Extension ready for submission to Chrome Web Store

#### Infrastructure
- **docker-compose.yml**: Simplified orchestration for self-hosting
- Gap Analysis updated to reflect all completed infrastructure items

#### Life Planning Kanban
- **Native Drag & Drop**: HTML5 drag-and-drop for task reordering across columns
- **Journal Linking UI**: Tasks can now link to journal entries (UI complete, mock data)
- Fixed `@ts-ignore` to `@ts-expect-error` for better linting

#### Data Reclamation
- **Data Broker Buyback Section**: Full marketing section with animated mock scanner
- Broker list: Spokeo, Whitepages, Intelius, PeopleFinders, BeenVerified

### Fixed
- TypeScript unused variable errors in `App.tsx`, `JournalPage.tsx`
- Accidental break in `useEmotionalTrends.ts` reduce call
- Mobile `tsconfig.json` no longer references broken `expo/tsconfig.base`

### Documentation
- Updated `TODO_CHECKLIST.md` with accurate completion status
- Updated `DEVELOPMENT_TRACKER.md` Gap Analysis section
- Marked mobile app screens as complete (5 tabs exist)

---

## [0.4.0] - 2026-01-11

### Added

#### Mobile Application (`apps/mobile`)
- **Expo SDK 52**: React Native app with file-based routing via Expo Router v4
- **NativeWind v4**: Tailwind CSS-style styling for React Native components
- **Tab Navigation**: 5 tabs - Home, Record, Journal, Insights, Settings
- **Haptic Feedback**: Tactile feedback on all button presses using `expo-haptics`
- **Audio Recording**: Background-capable recording with `expo-av` and audio visualizer
- **Brain Dump Flow**: Full mobile implementation matching web functionality
- **Onboarding Flow**: Passcode setup with secure numeric PIN entry
- **Dark Theme**: Consistent slate color palette matching web design language
- **Shared Logic**: Uses `@lcc/core` for business logic (emotional trends, proactive prompts, life chapters)

#### Shared Core Package (`packages/core`)
- **Platform-Agnostic Stores**: `createAppStore()` factory for Zustand stores without platform-specific persistence
- **useEmotionalTrends**: Analyze mood patterns over configurable time windows with correlation detection
- **useProactivePrompts**: Anniversary reminders, gap detection, mood-based suggestions
- **useLifeChapters**: Automatic detection of major life transitions based on patterns
- **Shared Utilities**: `formatDuration`, `formatRelativeDate`, `debounce`, `throttle`, `generateId`

#### Storage Drivers (`packages/storage/drivers`)
- **StorageDriver Interface**: Pluggable backend abstraction for encrypted blob storage
- **S3Driver**: S3-compatible storage support (AWS S3, MinIO, Backblaze B2, Cloudflare R2)
  - Upload, download, delete, exists, list operations
  - Custom metadata support via `x-amz-meta-*` headers
- **FileSystemDriver**: Placeholder for Electron/Tauri desktop environments
- **InternalDriver**: IndexedDB-based blob storage for browser environments
- **SyncManager**: Local/remote synchronization with pending upload/download tracking

#### Brain Dump Workflow Enhancements
- **Screen Wake Lock**: `useWakeLock` hook prevents screen timeout during 20-30 minute sessions
  - Uses Screen Wake Lock API with automatic re-acquisition on visibility change
  - Graceful fallback for unsupported browsers
- **Live Transcription Preview**: Real-time transcription display during recording
- **AI Clarification Loop**: After synthesis, Claude asks follow-up questions
  - Users can answer questions or skip to complete
  - Iterative refinement for higher quality output
- **6-Step Flow**: bullets → recording → transcribing → synthesizing → clarification → complete

#### Marketing Components
- **SecurityAuditDemo**: Real-time encryption visualization component
  - Terminal-style log showing live encryption events
  - Animated event types: encrypt, hash, derive, store, sync, verify
  - Auto-scrolling with pause/resume functionality
  - Visual demonstration of client-side encryption for marketing/landing pages

### Changed
- **render.yaml**: Fixed pnpm installation for CI environments
  - Changed to use `corepack enable && pnpm install --no-frozen-lockfile`
  - Resolved "ERR_PNPM_NO_LOCKFILE" deployment failures on Render

### Security
- **Emergency Access Verification**: Confirmed Shamir's Secret Sharing implementation
  - 3-of-5 threshold scheme for master key recovery
  - Each shard independently useless without quorum
  - Enables dead man's switch / legacy access functionality

---

## [0.3.0] - 2026-01-11

### Added

#### Whisper API Integration
- **Dedicated Whisper API key**: Separate OpenAI API key for transcription
- **Settings UI**: New input field for Whisper API key in Settings page
- **Fallback logic**: Uses shared API key if dedicated key not provided

#### Video Recording
- **useVideoRecorder hook**: MediaRecorder API wrapper for video capture
- **VideoPlayer component**: Full-featured player with seek, speed, fullscreen
- **Journal video entries**: Video mode in JournalPage with live preview
- **Pause/resume support**: Control video recording mid-session

#### Onboarding Flow
- **OnboardingPage**: 4-step first-time user walkthrough
- **Privacy explanation**: Clear local-first architecture messaging
- **Voice-native design**: Introduction to voice recording features
- **AI insights overview**: Pattern recognition capabilities explained
- **Skip option**: Allow users to bypass onboarding

#### Full-Text Search
- **useSearch hook**: Fuse.js fuzzy search across all content
- **SearchBar component**: Global search with Cmd+K shortcut
- **Match highlighting**: Visual indication of search matches
- **Type-based results**: Icons for recordings, journals, brain dumps
- **Dashboard integration**: SearchBar in header for quick access

#### Timeline View
- **TimelinePage**: Visual timeline of all life events
- **Zoom levels**: Decade, year, month grouping options
- **Event stats**: Count of events by type
- **Category filtering**: Events grouped by time period
- **Navigation**: Click events to jump to source

#### AI Companion
- **AICompanionPage**: Conversational chat interface
- **Context-aware**: Pulls from recordings, patterns, and journal moods
- **Suggested prompts**: Pre-written questions for new users
- **Multi-turn conversation**: Full Claude conversation history
- **generateWithClaude**: New LLM function for conversations

#### Phase 1: Rich Media & Milestones
- **usePhotoCapture hook**: Camera capture and gallery selection
- **PhotoGallery component**: Grid display with lightbox preview
- **MediaAttachment type**: Support for photos in journal entries
- **MilestoneWizard**: 8 milestone types (birth, graduation, marriage, etc.)
- **Date precision**: Exact, month, year, or approximate date support
- **Location & people tagging**: Contextual metadata for milestones

#### Extended Questions (50+ new questions)
- **Immigration & Culture**: 6 questions for immigrant experiences
- **Adoption & Origins**: 5 questions for adoptees
- **Disability & Health**: 6 questions for chronic conditions
- **Identity & Expression**: 5 LGBTQ+ identity questions
- **Spirituality & Faith**: 5 religious transition questions
- **Healing & Recovery**: 5 trauma-informed questions
- **Parenting & Children**: 6 questions for parents
- **Aging & Legacy**: 6 questions about mortality and wisdom
- **Financial Journey**: 5 questions about money lessons

#### Phase 2: Intelligent Understanding
- **useEmotionalTrends hook**: Mood analysis with correlations and insights
- **EmotionalTrends component**: Visual mood chart and trend indicators
- **useLifeChapters hook**: Automatic life chapter detection
- **LifeChaptersView component**: Timeline of life periods with themes
- **InsightsPage**: Unified dashboard for all intelligence features
- **useProactivePrompts hook**: AI-generated contextual prompts
- **ProactivePrompts component**: Anniversary, gap, and mood-based reminders

---

## [0.2.0] - 2026-01-11

### Added

#### Daily Journal
- **JournalPage**: Full-featured daily diary with date navigation
- **Multi-modal input**: Voice recording, video, or text entry
- **Mood tracking**: 5-level emoji scale (great → bad)
- **Energy tracking**: 1-5 slider for daily energy levels
- **JournalEntry type**: New database schema with migration to v2

#### Dynamic AI Questions
- **useDynamicQuestions hook**: Context-aware question suggestions
- **SuggestedQuestions component**: Dashboard section for AI suggestions
- **Gap analysis**: Identifies underexplored life categories
- **Follow-up questions**: Generated based on previous answers
- **Pattern-based suggestions**: Cross-references discovered patterns

#### Cloud Sync
- **useCloudSync hook**: Google Drive and OneDrive OAuth integration
- **Google Drive backup**: OAuth with Google Identity Services
- **OneDrive backup**: OAuth with MSAL.js
- **Settings integration**: Functional connect/sync/disconnect UI
- **Encrypted uploads**: All data encrypted before transmission

#### Privacy & Demo Mode
- **PrivacyLevelSelector component**: Granular per-recording privacy
- **Demo data seeding**: 16 pre-answered questions, 6 patterns, 4 insights
- **Demo journal entries**: 7 days of sample diary entries
- **Seed Demo Data button**: One-click demo activation in Settings

#### Enhanced Insights
- **Life Theme Summary**: AI-generated life essence section
- **Action Items**: Personalized recommendations from patterns
- **InsightsPage updates**: New sections for theme and actions

#### UI/UX Improvements
- **CreateCategoryModal**: Custom category creation with icons/colors
- **CreateQuestionModal**: Custom question creation with AI suggestions
- **Navigation update**: Journal link added to sidebar
- **Dashboard integration**: Suggested Questions section added

### Changed
- Database migrated to v2 for journalEntries table
- Navigation sidebar expanded with Journal option
- Dashboard now shows AI-suggested questions

---


## [0.1.0] - 2026-01-10

### Added

#### Core Packages
- **@lcc/types**: TypeScript interfaces for User, Questions, Context, Recording, Brain Dump, Patterns, and Privacy levels
- **@lcc/encryption**: Client-side AES-256-GCM encryption with PBKDF2 key derivation (100k iterations) and per-privacy-level keys via HKDF
- **@lcc/storage**: IndexedDB storage layer using Dexie.js with encrypted data tables and export/import functionality
- **@lcc/audio**: MediaRecorder API wrapper with real-time waveform analysis and audio quality detection
- **@lcc/llm**: Anthropic Claude and Ollama integration for question generation, transcription, and pattern recognition

#### Web Application
- **Landing Page**: Hero section with gradient branding, feature cards, passcode setup modal
- **Dashboard**: Progress statistics, category grid with completion tracking, quick actions
- **Questions Page**: 50+ starter questions across 12 life categories, real audio recording with pause/resume, waveform visualization
- **Brain Dump Page**: 4-step flow (bullet points → recording → AI synthesis → results with insights)
- **Insights Page**: Pattern visualization with 5 pattern types (themes, contradictions, strengths, growth areas, blind spots), filtering, expandable cards
- **Settings Page**: Input method selection, theme toggle (light/dark/system), BYOK API key, export/import encrypted backups

#### React Hooks
- **useRecorder**: Audio recording integration with permissions, waveform updates, and lifecycle management
- **useStorage**: IndexedDB operations (init, unlock, recordings, patterns, export/import)
- **useTranscription**: Live and post-recording transcription with Whisper/Web Speech
- **useSynthesis**: AI-powered brain dump synthesis with Claude integration
- **useAnalysis**: Pattern discovery for life context insights

#### Infrastructure
- Turborepo monorepo structure
- React 18 + Vite + TypeScript
- Tailwind CSS v4 with custom theme
- Zustand state management with persistence
- React Router v6 navigation

### Security
- Zero-knowledge architecture (all encryption client-side)
- Passcode never transmitted over network
- Web Crypto API for native encryption
- Privacy-level specific encryption keys

---

## Version History

| Version | Date       | Description |
|---------|------------|-------------|
| 0.4.0   | 2026-01-11 | Mobile app, storage drivers, enhanced brain dump |
| 0.3.0   | 2026-01-11 | Whisper API, video recording, full-text search, AI companion |
| 0.2.0   | 2026-01-11 | Daily journal, cloud sync, dynamic AI questions |
| 0.1.0   | 2026-01-10 | Initial MVP release |
