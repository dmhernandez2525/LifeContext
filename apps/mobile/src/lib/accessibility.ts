/**
 * Accessibility helpers for consistent a11y props across the app.
 */
import type { AccessibilityRole } from 'react-native';

interface A11yProps {
  accessible: boolean;
  accessibilityRole: AccessibilityRole;
  accessibilityLabel: string;
  accessibilityHint?: string;
  accessibilityState?: Record<string, boolean | undefined>;
}

export function a11yButton(label: string, hint?: string): A11yProps {
  return {
    accessible: true,
    accessibilityRole: 'button',
    accessibilityLabel: label,
    accessibilityHint: hint,
  };
}

export function a11yLink(label: string): A11yProps {
  return {
    accessible: true,
    accessibilityRole: 'link',
    accessibilityLabel: label,
  };
}

export function a11yHeader(label: string): A11yProps {
  return {
    accessible: true,
    accessibilityRole: 'header',
    accessibilityLabel: label,
  };
}

export function a11yImage(label: string): A11yProps {
  return {
    accessible: true,
    accessibilityRole: 'image',
    accessibilityLabel: label,
  };
}

export function a11yToggle(label: string, checked: boolean): A11yProps {
  return {
    accessible: true,
    accessibilityRole: 'switch',
    accessibilityLabel: label,
    accessibilityState: { checked },
  };
}

export function a11yTab(label: string, selected: boolean): A11yProps {
  return {
    accessible: true,
    accessibilityRole: 'tab',
    accessibilityLabel: label,
    accessibilityState: { selected },
  };
}

export function a11yTextInput(label: string, hint?: string): Omit<A11yProps, 'accessibilityRole'> & { accessibilityRole: 'none' } {
  return {
    accessible: true,
    accessibilityRole: 'none',
    accessibilityLabel: label,
    accessibilityHint: hint,
  };
}

export function a11yProgressBar(label: string, value: number, max: number = 100): A11yProps {
  return {
    accessible: true,
    accessibilityRole: 'progressbar',
    accessibilityLabel: `${label}: ${Math.round(value)} of ${max}`,
  };
}
