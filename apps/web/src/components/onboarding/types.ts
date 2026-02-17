export type OnboardingIntent = 'journaling' | 'therapy' | 'legacy';

export type OnboardingMode = 'full' | 'quick';

export type OnboardingVariant = 'control' | 'streamlined';

export type OnboardingStepId =
  | 'welcome'
  | 'intent'
  | 'privacy'
  | 'passcode'
  | 'dataReclamation'
  | 'extension'
  | 'summary';

export type OnboardingIconName =
  | 'brain'
  | 'target'
  | 'shield'
  | 'lock'
  | 'database'
  | 'chrome'
  | 'rocket';

export interface OnboardingStepDefinition {
  id: OnboardingStepId;
  title: string;
  subtitle: string;
  helpTitle: string;
  helpText: string;
  gradient: string;
  icon: OnboardingIconName;
}

export interface OnboardingDraft {
  sessionId: string;
  variant: OnboardingVariant;
  intent: OnboardingIntent;
  intentChosen: boolean;
  mode: OnboardingMode;
  currentStepIndex: number;
  passcodeConfirmed: boolean;
  dataReclamationEnabled: boolean;
  startedAt: string;
  updatedAt: string;
}

export interface OnboardingSessionRecord {
  sessionId: string;
  variant: OnboardingVariant;
  intent: OnboardingIntent;
  mode: OnboardingMode;
  status: 'in_progress' | 'completed' | 'skipped';
  startedAt: string;
  completedAt?: string;
  skippedAt?: string;
  dropOffStep?: OnboardingStepId;
  stepsViewed: OnboardingStepId[];
  stepDurationsMs: Partial<Record<OnboardingStepId, number>>;
}

export interface OnboardingAnalyticsStore {
  sessions: OnboardingSessionRecord[];
  updatedAt: string;
}

export interface OnboardingAnalyticsSummary {
  totalSessions: number;
  completedSessions: number;
  skippedSessions: number;
  completionRate: number;
  avgStepDurationMs: Partial<Record<OnboardingStepId, number>>;
  dropOffCounts: Partial<Record<OnboardingStepId, number>>;
}
