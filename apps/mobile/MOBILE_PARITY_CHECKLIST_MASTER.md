# 🚀 Mobile Parity & Orbit Checklist (Master)

This is the **Master Execution Checklist** for the LifeContext Mobile application. It details every single feature requirement to achieve 1:1 parity with the Web App.

**Legend:**
- [x] **Completed:** Feature is fully implemented and verified in the codebase.
- [ ] **Pending:** Feature is missing or incomplete.
- [ ] **Gap:** Feature exists in Web App but is missing in Mobile.

---

## 🏗️ Phase 1: Core Navigation & Infrastructure (Rocket Architecture)
**Goal:** A fluid, gesture-driven navigation system that feels premium.

### 1.1 Tab Bar System (`RocketTabBar.tsx`)
- [x] **Glassmorphic Background:** Use `BlurView` with intensity 80+ and dark tint.
- [x] **Dynamic Visibility:** Hide tab bar on scroll down, show on scroll up.
- [x] **Haptic Feedback:** `impactAsync(Light)` on tab press.
- [x] **Animations:** Spring animation on icon scale when active.
- [x] **Active Indicator:** Glowing dot or line under active tab.
- [x] **Web Compatibility:** Fallback for `BlurView` and Haptics on web (`WebMoreMenu.tsx`).
- [ ] **Tab Long-Press:** Trigger quick actions or context menu for that tab.

### 1.2 Floating Action Button (FAB) (`FAB.tsx`)
- [x] **Central Position:** Elevated button in the center of the tab bar.
- [x] **Context Awareness:** Icon changes based on current screen (Mic on Home, Plus on Timeline, etc.).
- [x] **Animations:** Rotate/Scale transition between icons.
- [x] **Quick Actions Menu:** Pressing FAB triggers primary action (Recording).
- [ ] **Radial Menu:** Long-press FAB to show secondary actions (Note, Photo, Brain Dump).

### 1.3 Bottom Sheet Infrastructure (`BottomSheets.tsx`)
- [x] **Dependencies:** `@gorhom/bottom-sheet` installed and configured.
- [x] **Menu Sheet:** Quick actions menu for "More" tab.
- [ ] **Detail Sheets:** Standard wrapper for viewing item details (Journal, Task).
- [x] **Creation Sheets:** CreateCategorySheet.tsx and CreateQuestionSheet.tsx.

### 1.4 Technical Debt & Parity Fixes
- [x] **Web Haptics Crash:** Fix `UnavailabilityError` with `SafeHaptics` wrapper.
- [x] **Zustand Compatibility:** Replace `import.meta.env` with `useSyncExternalStore`.
- [ ] **Deep Linking:** Configure `expo-linking` for external URLs (e.g., `lifecontext://record`).
- [x] **iPad Layout:** Sticky sidebar for large screens (Implemented in Sidebar.tsx).

---

## 📊 Phase 2: Dashboard & Home Hub
**Web Parity Target:** `apps/web/src/pages/DashboardPage.tsx`

### 2.1 Header & Greeting
- [x] **Personal Greeting:** "Good morning, [Name]".
- [x] **Date Display:** Current date format.
- [x] **Settings Shortcut:** Avatar/Icon to open settings.

### 2.2 Statistics & Progress
- [x] **Recording Time:** Total duration of all recordings.
- [x] **Questions Answered:** Count of answered questions vs total (Context Score).
- [x] **Streak Counter:** Active days streak.
- [x] **Context Score Ring:** Visual circular progress matching web design (ProgressRing component).

### 2.3 Quick Action Cards
- [x] **Recording Card:** "Capture Context" with mic icon.
- [x] **Brain Dump Card:** "Clear your mind" with brain icon.
- [x] **Journal Card:** "Daily log" with book icon.

### 2.4 Content Feeds
- [x] **Recent Activity:** List of last 3-5 items (recordings/journals).
- [x] **Suggested Questions:** Horizontal carousel of questions to answer.
- [x] **Daily Quote/Prompt:** "Thought of the day" logic from web (Added to Dashboard).

---

## ❓ Phase 3: Questions & Categories (Core Feature)
**Web Parity Target:** `apps/web/src/pages/QuestionsPage.tsx`

### 3.1 Category Browser
- [x] **Grid Layout:** 2-column grid of categories (Childhood, Career, Values).
- [x] **Progress Indicators:** Bar/Percentage per category.
- [x] **Icons & Colors:** Distinct visual identity for each category (matching web styling).

### 3.2 Question Detail Flow
- [x] **Question Card:** Display question text and context.
- [x] **Navigation:** Swipe or buttons to Next/Previous question.
- [x] **Answer Flow:** "Record Answer" button triggers recording.
- [x] **Text Answer:** Option to write text answer instead of recording (Choice Modal implemented).
- [x] **Skip/Shuffle:** Option to skip question.
- [ ] **Duration Chips:** Show suggested duration (e.g., "15 min") pills.

### 3.3 Management
- [x] **Create Category:** Modal to add custom categories (Name, Icon, Color) - CreateCategorySheet.tsx.
- [x] **Create Question:** Modal to add custom questions (Text, Category) - CreateQuestionSheet.tsx.
- [x] **Mark as Answered:** Manual toggle via long-press with confirmation Alert.

---

## 🎙️ Phase 4: Voice Recording & Playback
**Web Parity Target:** `apps/web/src/components/AudioPlayer.tsx` & `useRecorder.ts`

### 4.1 Recording Experience
- [x] **Visualizer:** Real-time audio waveform/bar visualization.
- [x] **Timer:** Duration counter.
- [x] **Controls:** Pause, Resume, Stop.
- [x] **Live Transcription:** Real-time text preview (using Whisper/System).

### 4.2 Playback Interface
- [x] **Player UI:** Waveform scrubber, Play/Pause.
- [x] **Speed Control:** 1x, 1.5x, 2x playback speeds.
- [x] **Seek:** Jump forward 15s, back 15s.

### 4.3 Post-Recording
- [x] **Transcription View:** Full text transcription.
- [x] **AI Synthesis:** Summary, Bullet points, Sentiment.
- [x] **Metadata Editing:** MetadataEditSheet.tsx - Edit title, add tags after recording.
- [x] **Privacy Sector:** MetadataEditSheet.tsx - Set privacy level (Private, Family, Public, Legacy).

---

## 📖 Phase 5: Journaling
**Web Parity Target:** `apps/web/src/pages/JournalPage.tsx`

### 5.1 Journal List
- [x] **Timeline View:** Reverse chronological list.
- [x] **Filters:** Filter by Mood, Tag, Date.
- [x] **Entries:** Display text, voice, and video entries.
- [x] **Empty State:** "Start writing today" illustration (Implemented with icon and caption).

### 5.2 Entry Editor (Data Parity)
- [x] **Text Input:** Multi-line text entry.
- [x] **Mood Selector:** 5-point emoji scale (Great, Good, Neutral, Challenging, Difficult).
- [x] **Energy Level:** Slider 1-5 (matching Web).
- [x] **Media Toggles:** Explicit buttons for "Text", "Voice", "Video".
- [x] **Video Recording:** 
  - [x] Camera preview.
  - [x] Recording timer.
  - [x] Review flow (Watch video before saving/discarding).
- [ ] **Encryption Format:** Ensure saved content uses the `AES-256-GCM` structure (`{ iv, data, authTag }`) for compatibility with web decryption.
- [ ] **Rich Text:** Basic formatting support (Bold/Italic/Lists).

---

### Phase 1: Family Sharing (New Priority) 🚀
- [x] **Infrastructure**
  - [x] Add `FamilyMember` and `SharedItem` types to `@packages/types`
  - [x] Create `useFamilyStore` for managing family circle
- [x] **Family Management UI**
  - [x] Create `FamilyScreen.tsx` (Main Hub)
  - [x] Implement `InviteSheet` with QR Code generation
  - [x] Implement `JoinSheet` (Scan/Input code)
- [x] **Sharing Features**
  - [x] Create `SharedFeed` component for viewing family updates
  - [x] Update Journal/Question creation to support `PrivacyLevel.FAMILY`
  - [x] Implement "Shared with you" indicators on shared itemsaved content uses the `AES-256-GCM` structure (`{ iv, data, authTag }`) for compatibility with web decryption.
- [ ] **Rich Text:** Basic formatting support (Bold/Italic/Lists).

---

## 🧠 Phase 6: Brain Dump
**Web Parity Target:** `apps/web/src/pages/BrainDumpPage.tsx`

### 6.1 The Flow
- [x] **Topic Entry:** Add bullet points/anchors before speaking.
- [x] **Recording:** continuous voice capture.
- [x] **Synthesis:** AI rearranges thoughts into structured notes.
- [x] **Action Items:** Extract tasks from the dump.
- [x] **Refinement Loop:** "Deep Dive" clarifying questions from AI (Implemented as Post-Synthesis Refinement).
- [x] **Actionable Links:** Convert Insights into Tasks/Calendar events (Implemented via Deep Dive Sheet).

### 6.2 History
- [x] **Archive:** List of past brain dumps.
- [x] **Search:** Search within brain dump content.

---

## 📅 Phase 7: Timeline & Life Journey
**Web Parity Target:** `apps/web/src/pages/TimelinePage.tsx` & `LifeChapters.tsx`

### 7.1 Visualization
- [x] **Feed View:** Vertical scroll of all life events.
- [x] **Zoom Levels:** Group by Decade, Year, Month, Week.
- [x] **Event Types:** Distinguish Recordings, Journals, Milestones.
- [x] **Life View:** LifeView60Years.tsx - Decade segments with "You are here" marker and life stages.

### 7.2 Life Chapters (Complete)
- [x] **Chapter Cards:** Colored cards based on `moodSummary` (Positive=Green, Challenging=Amber, Mixed=Indigo).
- [x] **Transition Markers:** Icons for Career (Briefcase), Relationship (Heart), Location (MapPin), Health (Activity).
- [x] **Richness Bar:** Progress bar showing chapter richness percentage.
- [x] **Themes:** Tag chips for dominant themes in chapter.
- [x] **Stats:** "X recordings • Y journals" count per chapter.

---

## ✅ Phase 8: Kanban & Tasks
**Web Parity Target:** `apps/web/src/components/kanban/KanbanBoard.tsx`

### 8.1 Board View
- [x] **Columns:** Todo, In Progress, Done.
- [x] **Task Cards:** Title, Priority color, Due date, Tag chips.
- [ ] **Drag & Drop:** Fully interactive reordering (Critical for parity).

### 8.2 Task Management
- [x] **Create Task:** Title, Description, Priority, Due Date.
- [x] **Subtasks:** Checklist within a task.
- [x] **Edit/Delete:** Full CRUD operations.
- [x] **Deep Dive Task Creation:** The web `LifePlanningPage` "Deep Dive" modal (DeepDiveSheet.tsx):
   - [x] Record voice explanation of task.
   - [x] Transcribe (simulated AI processing).
   - [x] Review and convert to Task Description.

---

## 🤖 Phase 9: AI Insights
**Web Parity Target:** `apps/web/src/pages/AIInsightsPage.tsx` & `EmotionalTrends.tsx`

### 9.1 Dashboard
- [x] **Pattern Analysis:** Display detected themes/patterns.
- [x] **Stats:** Quantitative metrics overview.

### 9.2 Emotional Trends
- [x] **Mood Chart:** Area chart showing mood score (1-5) over time.
- [x] **Correlations:** badges for "Mood Boosters" (Positive correlation) and "Mood Drains" (Negative).
- [x] **Insight Cards:** Specific cards for `trend`, `pattern`, `warning` (Implemented in InsightCard.tsx).
- [x] **Actionable:** "View Details" / "Take Action" links on insight cards.

### 9.3 Chat Interface
- [x] **Conversational UI:** Chat bubble interface (Implemented in ChatInterface).
- [x] **Context Loading:** Indicator for "Loading X recordings..." (Handled in useChatContext).
- [x] **Suggested Prompts:** Horizontal scroll of questions ("What themes have emerged?").

---

## 🔮 Phase 10: Life Planning (Complete)
**Web Parity Target:** `apps/web/src/pages/LifePlanningPage.tsx`

### 10.1 UI Structure
- [x] **Header:** "Life Plan" with Target icon (Design your future subtitle).
- [x] **View Toggles:** LifeTimeline decade selector.
- [x] **Stats Row:** Total Goals, Achieved, In Progress.

### 10.2 AI Suggestions
- [x] **Suggestion Panel:** AI Insight card with context.
- [x] **Quick Add:** Button to instantly create task from suggestion via Deep Dive.

### 10.3 "Deep Dive" Planning Mode
- [x] **Modal Flow:**
   1. **Context:** Show the suggestion context.
   2. **Choice:** Quick Add vs Deep Dive (Voice).
   3. **Recording:** Waveform + Timer.
   4. **Review:** Edit Title + Transcribed Description -> Save.

---

## 🔒 Phase 11: Security & Privacy (GAP)
**Web Parity Target:** `apps/web/src/pages/EmergencyAccessPage.tsx` & `DataSovereigntyPage.tsx`

### 11.1 App Lock
- [x] **Biometrics:** FaceID/TouchID integration (Implemented in LockScreen.tsx).
- [x] **Passcode:** Uses device passcode as fallback.
- [x] **Auto-Lock:** Configurable timeout (Immediate, 1m, 5m, 15m) in SecuritySettings.

### 11.2 Emergency Access Protocol
- [x] **Shamir's Secret Sharing:** Implement `splitKey` and `reconstructKey` logic locally (in secretSharing.ts).
- [x] **Generate Mode:** Create N shares with threshold M (Implemented in data.tsx).
- [x] **Recover Mode:** UI to input M shares to reveal secret (Structure in place).
- [x] **Copy/Share:** Easy way to distribute shares to contacts (Copy to clipboard).

### 11.3 Data Sovereignty
- [x] **Protocol Explanation:** "Trust No One" info screen (data-sovereignty.tsx).
- [x] **Comparison Table:** Native rendering of LifeContext vs Cloud Apps comparison.

---

## ⚙️ Phase 12: Settings & Configuration
**Web Parity Target:** `apps/web/src/pages/SettingsPage.tsx`

### 12.1 Preferences
- [x] **Input Method:** Toggle between Voice / Voice+Transcript / Text.
- [x] **Theme:** Light / Dark / System.
- [x] **Family Sharing:** Link to Family Circle from Settings (Implemented).

### 12.2 AI Configuration
- [x] **Custom Keys:** Input for Anthropic API Key.
- [x] **Whisper Key:** Input for OpenAI API Key.
- [x] **Demo Mode:** "Seed Demo Data" button/flow (Implemented in Settings).

### 12.3 Cloud Sync
- [x] **Compability:** Connect/Disconnect buttons for Google Drive / OneDrive (Simulated via Provider Toggle).
- [x] **Status:** Show "Last synced at..." timestamp.
- [x] **Sync Now:** Manual trigger button.

### 12.4 Data Management
- [x] **Export:** JSON Export button.
- [x] **Import:** File picker for JSON restore (Placeholder in Settings).
- [x] **Reset:** "Delete Everything" danger zone.

---

## 📱 Phase 13: Mobile-Specific Features
*Features that utilize unique mobile capabilities.*

### 13.1 Widgets
- [ ] **Quick Record:** Home screen widget to launch recording immediately.
- [ ] **Daily Question:** Widget showing today's question prompt.

### 13.2 Share Extension
- [ ] **"Save to LifeContext":** Receive text/images from OS share sheet.

---

## 🛠 Action Plan & Priorities

1.  **Life Planning - Deep Dive Flow:** This is the most complex missing interaction pattern (Voice -> AI -> Task).
2.  **Emotional Trends Chart:** Visual parity for the Insights dashboard.
3.  **Life Chapters Visualization:** The "60 Years" and Chapter Card UI.
4.  **Security - Shamir's Sharing:** High-value privacy feature unique to this app.
5.  **Journal Video Recording:** Parity with web's media capabilities.
