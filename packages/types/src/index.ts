// ============================================================
// USER & SETTINGS
// ============================================================

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  lastActive: Date;
}

export interface UserSettings {
  preferredInputMethod: 'voice' | 'voice-transcribed' | 'text';
  theme: 'light' | 'dark' | 'system';
  language: string;
  showLiveTranscription: boolean;
  aiProvider: AIProviderConfig;
  storage: StorageConfig;
  autoLockTimeout?: number; // Minutes, optional (default 5 if enabled)
}

export interface AIProviderConfig {
  mode: 'cloud' | 'local' | 'mixed';
  cloudProvider: 'anthropic' | 'openai';
  apiKey?: string; // User's own Anthropic key (encrypted)
  whisperApiKey?: string; // OpenAI API key for Whisper transcription
  useDefaultKey: boolean;
  ollamaEndpoint?: string;
  preferredModel?: string;
}

export interface StorageConfig {
  location: 'local' | 'onedrive';
  autoBackup: boolean;
  backupFrequency: 'hourly' | 'daily' | 'weekly';
}

// ============================================================
// ENCRYPTION
// ============================================================

export interface EncryptedData {
  version: number;
  algorithm: 'AES-256-GCM';
  iv: string; // Base64 encoded
  data: string; // Base64 encoded
  authTag: string; // Base64 encoded
}

export interface EncryptionMeta {
  salt: string; // Base64 encoded
  iterations: number;
  createdAt: Date;
}

// ============================================================
// PRIVACY LEVELS
// ============================================================

export enum PrivacyLevel {
  PRIVATE = 0,        // Only user can access
  TRUSTED = 1,        // Close family/spouse
  FAMILY = 2,         // Extended family
  FRIENDS = 3,        // Close friends
  PROFESSIONAL = 4,   // Therapists, doctors
  PUBLIC = 5          // Anyone with access link
}

export const PRIVACY_LEVEL_LABELS: Record<PrivacyLevel, string> = {
  [PrivacyLevel.PRIVATE]: 'Private',
  [PrivacyLevel.TRUSTED]: 'Trusted',
  [PrivacyLevel.FAMILY]: 'Family',
  [PrivacyLevel.FRIENDS]: 'Friends',
  [PrivacyLevel.PROFESSIONAL]: 'Professional',
  [PrivacyLevel.PUBLIC]: 'Public',
};

export const PRIVACY_LEVEL_COLORS: Record<PrivacyLevel, string> = {
  [PrivacyLevel.PRIVATE]: '#7c3aed',     // Purple
  [PrivacyLevel.TRUSTED]: '#2563eb',     // Blue
  [PrivacyLevel.FAMILY]: '#059669',      // Green
  [PrivacyLevel.FRIENDS]: '#d97706',     // Orange
  [PrivacyLevel.PROFESSIONAL]: '#dc2626', // Red
  [PrivacyLevel.PUBLIC]: '#6b7280',      // Gray
};

// ============================================================
// QUESTIONS
// ============================================================

export interface QuestionCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  order: number;
}

export interface Question {
  id: string;
  categoryId: string;
  text: string;
  context?: string; // Why we're asking
  suggestedDuration: number; // minutes
  defaultPrivacyLevel: PrivacyLevel;
  order: number;
  isFollowUp: boolean;
  parentQuestionId?: string;
}

export const DEFAULT_CATEGORIES: Omit<QuestionCategory, 'id'>[] = [
  { name: 'Early Life & Origins', slug: 'early-life', description: 'Where you came from and your earliest memories', icon: '👶', color: '#f59e0b', order: 1 },
  { name: 'Family & Relationships', slug: 'family', description: 'Your family dynamics and close relationships', icon: '👨‍👩‍👧‍👦', color: '#10b981', order: 2 },
  { name: 'Education & Learning', slug: 'education', description: 'Your formal and informal education journey', icon: '📚', color: '#3b82f6', order: 3 },
  { name: 'Career & Work', slug: 'career', description: 'Your professional path and work experiences', icon: '💼', color: '#6366f1', order: 4 },
  { name: 'Values & Beliefs', slug: 'values', description: 'What you stand for and believe in', icon: '⭐', color: '#8b5cf6', order: 5 },
  { name: 'Dreams & Aspirations', slug: 'dreams', description: 'Your hopes and goals for the future', icon: '🌟', color: '#ec4899', order: 6 },
  { name: 'Fears & Challenges', slug: 'fears', description: 'What holds you back and how you overcome it', icon: '🔥', color: '#ef4444', order: 7 },
  { name: 'Strengths & Skills', slug: 'strengths', description: 'Your superpowers and what you excel at', icon: '💪', color: '#14b8a6', order: 8 },
  { name: 'Weaknesses & Growth', slug: 'weaknesses', description: 'Areas you want to improve', icon: '🌱', color: '#84cc16', order: 9 },
  { name: 'Hobbies & Interests', slug: 'hobbies', description: 'What you love doing in your free time', icon: '🎨', color: '#f97316', order: 10 },
  { name: 'Health & Wellness', slug: 'health', description: 'Your physical and mental wellbeing', icon: '❤️', color: '#f43f5e', order: 11 },
  { name: 'Philosophy & Worldview', slug: 'philosophy', description: 'How you see and understand the world', icon: '🧠', color: '#a855f7', order: 12 },
  { name: 'Accomplishments', slug: 'accomplishments', description: 'What you are proud of achieving', icon: '🏆', color: '#fbbf24', order: 13 },
  { name: 'Regrets & Lessons', slug: 'regrets', description: 'What you would do differently and what you learned', icon: '📝', color: '#64748b', order: 14 },
  { name: 'Legacy & Impact', slug: 'legacy', description: 'What you want to leave behind', icon: '🌍', color: '#0ea5e9', order: 15 },
];

// ============================================================
// CONTEXT & SEGMENTS
// ============================================================

export interface ContextSegment {
  id: string;
  questionId: string;
  categoryId: string;
  content: EncryptedData;
  privacyLevel: PrivacyLevel;
  recordingId?: string;
  wordCount: number;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

// ============================================================
// AUDIO RECORDING
// ============================================================

export type RecordingStatus = 
  | 'idle'
  | 'recording' 
  | 'paused' 
  | 'processing' 
  | 'transcribing' 
  | 'completed' 
  | 'failed';

export interface RecordingSession {
  id: string;
  questionId: string;
  status: RecordingStatus;
  startTime: Date;
  endTime?: Date;
  duration: number; // seconds
  audioBlob?: Blob;
  audioUrl?: string;
  waveformData: number[];
  transcription?: Transcription;
}

export interface Transcription {
  id: string;
  sessionId: string;
  text: string;
  confidence: number;
  language: string;
  service: 'whisper' | 'anthropic' | 'local';
  createdAt: Date;
}

// ============================================================
// BRAIN DUMP
// ============================================================

export type BrainDumpStatus = 
  | 'preparing' 
  | 'recording' 
  | 'reviewing' 
  | 'refining' 
  | 'completed';

export interface BrainDumpSession {
  id: string;
  title: string;
  description?: string;
  bulletPoints: BulletPoint[];
  recordings: RecordingSession[];
  status: BrainDumpStatus;
  synthesis?: AISynthesis;
  createdAt: Date;
  completedAt?: Date;
}

export interface BulletPoint {
  id: string;
  text: string;
  order: number;
  covered: boolean;
}

export interface AISynthesis {
  id: string;
  organizedContent: string;
  contradictions: Contradiction[];
  qualifyingQuestions: string[];
  insights: string[];
  createdAt: Date;
}

export interface Contradiction {
  id: string;
  statement1: string;
  statement2: string;
  context: string;
  resolutionQuestion: string;
}

// ============================================================
// INSIGHTS & PATTERNS
// ============================================================

export type PatternType = 
  | 'recurring-theme' 
  | 'contradiction' 
  | 'growth-area' 
  | 'strength' 
  | 'blind-spot';

export interface Pattern {
  id: string;
  type: PatternType;
  title: string;
  description: string;
  evidence: PatternEvidence[];
  significance: number; // 0-1
  recommendation?: string;
  createdAt: Date;
}

export interface PatternEvidence {
  segmentId: string;
  quote: string;
  relevanceScore: number;
}

export interface Insight {
  id: string;
  title: string;
  content: string;
  category: 'life-theme' | 'superpower' | 'growth-opportunity' | 'contradiction';
  actionable: boolean;
  actions?: string[];
  relatedPatterns: string[];
  createdAt: Date;
}

// ============================================================
// PROGRESS TRACKING
// ============================================================

export interface CategoryProgress {
  categoryId: string;
  totalQuestions: number;
  answeredQuestions: number;
  completionPercentage: number;
  totalRecordingTime: number; // seconds
  totalWordCount: number;
}

export interface OverallProgress {
  categories: CategoryProgress[];
  totalCompletionPercentage: number;
  totalRecordingTime: number;
  totalWordCount: number;
  lastActivityAt: Date;
}

// ============================================================
// JOURNAL / DAILY DIARY
// ============================================================

export type JournalMood = 'great' | 'good' | 'okay' | 'low' | 'bad';
export type JournalMediaType = 'voice' | 'video' | 'text';

export interface MediaAttachment {
  id: string;
  type: 'photo' | 'document' | 'audio' | 'video';
  filename?: string;
  mimeType: string;
  size: number; // bytes
  width?: number; // for images/videos
  height?: number; // for images/videos
  duration?: number; // for audio/video
  blob?: Blob;
  url?: string;
  thumbnailUrl?: string;
  caption?: string;
  createdAt: Date;
}

export interface JournalEntry {
  id: string;
  date: Date;
  content: string; // Encrypted in storage
  mood?: JournalMood;
  energyLevel?: number; // 1-5
  mediaType: JournalMediaType;
  audioBlob?: Blob;
  videoBlob?: Blob;
  photos?: MediaAttachment[];
  duration?: number; // seconds for audio/video
  tags: string[];
  privacyLevel: PrivacyLevel;
  createdAt: Date;
  updatedAt: Date;
}

export const MOOD_EMOJIS: Record<JournalMood, string> = {
  great: '😄',
  good: '🙂',
  okay: '😐',
  low: '😔',
  bad: '😢',
};

export const MOOD_LABELS: Record<JournalMood, string> = {
  great: 'Great',
  good: 'Good',
  okay: 'Okay',
  low: 'Low',
  bad: 'Bad',
};


// ============================================================
// FAMILY SHARING
// ============================================================

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string; // e.g. "Partner", "Mother"
  avatar?: string;
  status: 'pending' | 'active';
  joinedAt: Date;
  isAdmin?: boolean;
}

export interface FamilyInvitation {
  id: string;
  code: string; 
  createdBy: string;
  expiresAt: Date;
  status: 'active' | 'used' | 'expired';
}

export interface SharedItemWrapper {
  id: string; // references local ID
  type: 'journal' | 'question_answer' | 'life_chapter';
  authorId: string;
  authorName: string;
  content: string; // Can be encrypted string or JSON string depending on implementation
  timestamp: Date;
  privacyLevel: PrivacyLevel;
  reactions?: {
    userId: string;
    emoji: string;
  }[];
}
