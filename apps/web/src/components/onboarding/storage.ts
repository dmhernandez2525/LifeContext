import type { OnboardingDraft, OnboardingVariant } from './types';

const ONBOARDING_COMPLETE_KEY = 'lcc-onboarding-complete';
const ONBOARDING_PROGRESS_KEY = 'lcc-onboarding-progress';
const ONBOARDING_VARIANT_KEY = 'lcc-onboarding-variant';

const isOnboardingVariant = (value: string): value is OnboardingVariant => {
  return value === 'control' || value === 'streamlined';
};

export const getOnboardingComplete = (): boolean => {
  return localStorage.getItem(ONBOARDING_COMPLETE_KEY) === 'true';
};

export const setOnboardingComplete = (isComplete: boolean): void => {
  localStorage.setItem(ONBOARDING_COMPLETE_KEY, String(isComplete));
};

export const loadOnboardingDraft = (): OnboardingDraft | null => {
  const raw = localStorage.getItem(ONBOARDING_PROGRESS_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<OnboardingDraft>;

    if (
      !parsed.sessionId ||
      !parsed.variant ||
      !parsed.intent ||
      parsed.intentChosen === undefined ||
      !parsed.mode ||
      parsed.currentStepIndex === undefined ||
      parsed.passcodeConfirmed === undefined ||
      parsed.dataReclamationEnabled === undefined ||
      !parsed.startedAt ||
      !parsed.updatedAt
    ) {
      return null;
    }

    if (!isOnboardingVariant(parsed.variant)) {
      return null;
    }

    return {
      sessionId: parsed.sessionId,
      variant: parsed.variant,
      intent: parsed.intent,
      intentChosen: parsed.intentChosen,
      mode: parsed.mode,
      currentStepIndex: parsed.currentStepIndex,
      passcodeConfirmed: parsed.passcodeConfirmed,
      dataReclamationEnabled: parsed.dataReclamationEnabled,
      startedAt: parsed.startedAt,
      updatedAt: parsed.updatedAt,
    };
  } catch {
    return null;
  }
};

export const saveOnboardingDraft = (draft: OnboardingDraft): void => {
  localStorage.setItem(ONBOARDING_PROGRESS_KEY, JSON.stringify(draft));
};

export const clearOnboardingDraft = (): void => {
  localStorage.removeItem(ONBOARDING_PROGRESS_KEY);
};

const createVariant = (): OnboardingVariant => {
  const randomValues = new Uint32Array(1);

  if ('crypto' in window && 'getRandomValues' in window.crypto) {
    window.crypto.getRandomValues(randomValues);
    return randomValues[0] % 2 === 0 ? 'control' : 'streamlined';
  }

  return Date.now() % 2 === 0 ? 'control' : 'streamlined';
};

export const getOrAssignOnboardingVariant = (): OnboardingVariant => {
  const existing = localStorage.getItem(ONBOARDING_VARIANT_KEY);

  if (existing && isOnboardingVariant(existing)) {
    return existing;
  }

  const variant = createVariant();
  localStorage.setItem(ONBOARDING_VARIANT_KEY, variant);
  return variant;
};
