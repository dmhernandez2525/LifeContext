type HapticIntensity = 'light' | 'medium' | 'heavy';

const patternByIntensity: Record<HapticIntensity, number> = {
  light: 8,
  medium: 14,
  heavy: 20,
};

const isTouchCapable = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  return navigator.maxTouchPoints > 0 || 'ontouchstart' in window;
};

export const triggerHelpHaptic = (intensity: HapticIntensity = 'light'): void => {
  if (!isTouchCapable()) {
    return;
  }

  if (!('vibrate' in navigator)) {
    return;
  }

  navigator.vibrate(patternByIntensity[intensity]);
};
