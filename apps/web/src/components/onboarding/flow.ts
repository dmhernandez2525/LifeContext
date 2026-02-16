import type {
  OnboardingIntent,
  OnboardingMode,
  OnboardingStepDefinition,
  OnboardingStepId,
  OnboardingVariant,
} from './types';

const STEP_DETAILS: Record<OnboardingStepId, Omit<OnboardingStepDefinition, 'id'>> = {
  welcome: {
    title: 'Your Brain Is a Terrible Hard Drive',
    subtitle: 'Let\'s preserve what matters while you still remember it.',
    helpTitle: 'Why this matters',
    helpText:
      'The first step helps us adapt setup to your goals and avoid collecting unnecessary data.',
    gradient: 'from-purple-500 to-pink-500',
    icon: 'brain',
  },
  intent: {
    title: 'What Are You Here For?',
    subtitle: 'Choose the path that best matches your main reason for using LifeContext.',
    helpTitle: 'Why this matters',
    helpText:
      'Intent selection personalizes your onboarding flow so setup focuses on your highest value use case.',
    gradient: 'from-indigo-500 to-sky-500',
    icon: 'target',
  },
  privacy: {
    title: 'Zero-Knowledge by Default',
    subtitle: 'You own the key, and your data is unreadable without it.',
    helpTitle: 'Why this matters',
    helpText:
      'This protects your entries from server-side access and keeps control on your device.',
    gradient: 'from-blue-500 to-cyan-500',
    icon: 'shield',
  },
  passcode: {
    title: 'Confirm Passcode Responsibility',
    subtitle: 'No resets, no backdoors. Losing your passcode means losing data access.',
    helpTitle: 'Why this matters',
    helpText:
      'Acknowledging this now reduces accidental lockouts and makes recovery planning explicit.',
    gradient: 'from-red-500 to-orange-500',
    icon: 'lock',
  },
  dataReclamation: {
    title: 'Data Reclamation Setup',
    subtitle: 'Choose whether to enable browser and platform data reclamation workflows.',
    helpTitle: 'Why this matters',
    helpText:
      'This controls whether external digital traces are included in your personal life context analysis.',
    gradient: 'from-green-500 to-emerald-500',
    icon: 'database',
  },
  extension: {
    title: 'Browser Extension',
    subtitle: 'Connect browsing context import when you are ready.',
    helpTitle: 'Why this matters',
    helpText:
      'Extension import can fill timeline gaps and improve pattern detection without compromising local encryption.',
    gradient: 'from-amber-500 to-yellow-500',
    icon: 'chrome',
  },
  summary: {
    title: 'Setup Summary',
    subtitle: 'Review what was configured before you start documenting.',
    helpTitle: 'Why this matters',
    helpText:
      'A final summary confirms your choices and makes it clear what is active from day one.',
    gradient: 'from-violet-500 to-fuchsia-500',
    icon: 'rocket',
  },
};

const FULL_PATHS_BY_INTENT: Record<OnboardingIntent, OnboardingStepId[]> = {
  journaling: ['privacy', 'passcode', 'dataReclamation'],
  therapy: ['privacy', 'dataReclamation', 'passcode'],
  legacy: ['privacy', 'passcode', 'extension'],
};

const QUICK_PATHS_BY_INTENT: Record<OnboardingIntent, OnboardingStepId[]> = {
  journaling: ['passcode'],
  therapy: ['passcode'],
  legacy: ['passcode'],
};

export const buildOnboardingSteps = (
  intent: OnboardingIntent,
  mode: OnboardingMode,
  variant: OnboardingVariant
): OnboardingStepDefinition[] => {
  const intro: OnboardingStepId[] = ['welcome', 'intent'];

  const middle =
    mode === 'quick' ? QUICK_PATHS_BY_INTENT[intent] : FULL_PATHS_BY_INTENT[intent];

  const ids: OnboardingStepId[] = [...intro, ...middle, 'summary'];

  const normalizedIds: OnboardingStepId[] =
    variant === 'streamlined' && mode === 'full' && !ids.includes('extension')
      ? [...ids.slice(0, -1), 'extension' as const, 'summary' as const]
      : ids;

  return normalizedIds.map((id) => ({
    id,
    ...STEP_DETAILS[id],
  }));
};

export const getIntentLabel = (intent: OnboardingIntent): string => {
  const labels: Record<OnboardingIntent, string> = {
    journaling: 'Journaling & reflection',
    therapy: 'Therapy and coaching prep',
    legacy: 'Legacy and life archive',
  };

  return labels[intent];
};
