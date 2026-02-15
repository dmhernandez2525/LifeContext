import type {
  OnboardingAnalyticsStore,
  OnboardingAnalyticsSummary,
  OnboardingIntent,
  OnboardingMode,
  OnboardingSessionRecord,
  OnboardingStepId,
  OnboardingVariant,
} from './types';

const ONBOARDING_ANALYTICS_KEY = 'lcc-onboarding-analytics';

const createEmptyStore = (): OnboardingAnalyticsStore => ({
  sessions: [],
  updatedAt: new Date().toISOString(),
});

const loadAnalyticsStore = (): OnboardingAnalyticsStore => {
  const raw = localStorage.getItem(ONBOARDING_ANALYTICS_KEY);
  if (!raw) {
    return createEmptyStore();
  }

  try {
    const parsed = JSON.parse(raw) as Partial<OnboardingAnalyticsStore>;
    if (!parsed.sessions || !Array.isArray(parsed.sessions)) {
      return createEmptyStore();
    }

    return {
      sessions: parsed.sessions as OnboardingSessionRecord[],
      updatedAt: parsed.updatedAt ?? new Date().toISOString(),
    };
  } catch {
    return createEmptyStore();
  }
};

const saveAnalyticsStore = (store: OnboardingAnalyticsStore): void => {
  localStorage.setItem(
    ONBOARDING_ANALYTICS_KEY,
    JSON.stringify({
      ...store,
      updatedAt: new Date().toISOString(),
    })
  );
};

const updateSession = (
  sessionId: string,
  update: (session: OnboardingSessionRecord) => OnboardingSessionRecord
): void => {
  const store = loadAnalyticsStore();
  const index = store.sessions.findIndex((session) => session.sessionId === sessionId);

  if (index < 0) {
    return;
  }

  const nextSessions = [...store.sessions];
  nextSessions[index] = update(nextSessions[index]);
  saveAnalyticsStore({ ...store, sessions: nextSessions });
};

export const ensureOnboardingSession = (
  sessionId: string,
  variant: OnboardingVariant,
  intent: OnboardingIntent,
  mode: OnboardingMode,
  startedAt: string
): void => {
  const store = loadAnalyticsStore();
  const existing = store.sessions.find((session) => session.sessionId === sessionId);

  if (existing) {
    return;
  }

  const session: OnboardingSessionRecord = {
    sessionId,
    variant,
    intent,
    mode,
    status: 'in_progress',
    startedAt,
    stepsViewed: [],
    stepDurationsMs: {},
  };

  saveAnalyticsStore({
    ...store,
    sessions: [...store.sessions, session],
  });
};

export const trackOnboardingStepViewed = (
  sessionId: string,
  stepId: OnboardingStepId,
  intent: OnboardingIntent,
  mode: OnboardingMode
): void => {
  updateSession(sessionId, (session) => {
    const viewedSet = new Set(session.stepsViewed);
    viewedSet.add(stepId);

    return {
      ...session,
      intent,
      mode,
      stepsViewed: Array.from(viewedSet),
    };
  });
};

export const trackOnboardingStepDuration = (
  sessionId: string,
  stepId: OnboardingStepId,
  durationMs: number
): void => {
  if (durationMs <= 0) {
    return;
  }

  updateSession(sessionId, (session) => {
    const previousDuration = session.stepDurationsMs[stepId] ?? 0;

    return {
      ...session,
      stepDurationsMs: {
        ...session.stepDurationsMs,
        [stepId]: previousDuration + durationMs,
      },
    };
  });
};

export const completeOnboardingSession = (
  sessionId: string,
  intent: OnboardingIntent,
  mode: OnboardingMode
): void => {
  updateSession(sessionId, (session) => ({
    ...session,
    intent,
    mode,
    status: 'completed',
    completedAt: new Date().toISOString(),
  }));
};

export const skipOnboardingSession = (
  sessionId: string,
  dropOffStep: OnboardingStepId,
  intent: OnboardingIntent,
  mode: OnboardingMode
): void => {
  updateSession(sessionId, (session) => ({
    ...session,
    intent,
    mode,
    status: 'skipped',
    dropOffStep,
    skippedAt: new Date().toISOString(),
  }));
};

export const getOnboardingAnalyticsSummary = (): OnboardingAnalyticsSummary => {
  const store = loadAnalyticsStore();

  const totalSessions = store.sessions.length;
  const completedSessions = store.sessions.filter((session) => session.status === 'completed').length;
  const skippedSessions = store.sessions.filter((session) => session.status === 'skipped').length;

  const durationTotals: Partial<Record<OnboardingStepId, number>> = {};
  const durationCounts: Partial<Record<OnboardingStepId, number>> = {};
  const dropOffCounts: Partial<Record<OnboardingStepId, number>> = {};

  for (const session of store.sessions) {
    for (const [stepId, duration] of Object.entries(session.stepDurationsMs)) {
      const typedStepId = stepId as OnboardingStepId;
      durationTotals[typedStepId] = (durationTotals[typedStepId] ?? 0) + duration;
      durationCounts[typedStepId] = (durationCounts[typedStepId] ?? 0) + 1;
    }

    if (session.dropOffStep) {
      dropOffCounts[session.dropOffStep] = (dropOffCounts[session.dropOffStep] ?? 0) + 1;
    }
  }

  const avgStepDurationMs = Object.entries(durationTotals).reduce(
    (accumulator, [stepId, totalDuration]) => {
      const typedStepId = stepId as OnboardingStepId;
      const count = durationCounts[typedStepId] ?? 1;

      return {
        ...accumulator,
        [typedStepId]: Math.round(totalDuration / count),
      };
    },
    {} as Partial<Record<OnboardingStepId, number>>
  );

  return {
    totalSessions,
    completedSessions,
    skippedSessions,
    completionRate: totalSessions === 0 ? 0 : completedSessions / totalSessions,
    avgStepDurationMs,
    dropOffCounts,
  };
};
