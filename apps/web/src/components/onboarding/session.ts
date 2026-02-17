export const createOnboardingSessionId = (): string => {
  if ('crypto' in window && 'randomUUID' in window.crypto) {
    return window.crypto.randomUUID();
  }

  return `session-${Date.now()}`;
};
