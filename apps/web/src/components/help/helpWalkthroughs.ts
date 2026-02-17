import type { WalkthroughDefinition } from './helpTypes';

export const WALKTHROUGHS: WalkthroughDefinition[] = [
  {
    id: 'new-entry',
    title: 'Create a Journal Entry',
    steps: [
      {
        id: 'journal-nav',
        title: 'Open Journal',
        description: 'Use the Journal item in the sidebar to open entry editing.',
        selector: '[data-help-nav="/app/journal"]',
        path: '/app/journal',
      },
      {
        id: 'journal-main',
        title: 'Write and Save',
        description: 'Add text, mood, and energy, then save your entry in the journal editor.',
        selector: 'main',
      },
    ],
  },
  {
    id: 'brain-dump',
    title: 'Start a Brain Dump',
    steps: [
      {
        id: 'brain-dump-nav',
        title: 'Open Brain Dump',
        description: 'Navigate to Brain Dump from the sidebar.',
        selector: '[data-help-nav="/app/brain-dump"]',
        path: '/app/brain-dump',
      },
      {
        id: 'brain-dump-main',
        title: 'Record and Synthesize',
        description: 'Record freely, then review transcription and synthesis output.',
        selector: 'main',
      },
    ],
  },
  {
    id: 'search',
    title: 'Find Context Quickly',
    steps: [
      {
        id: 'dashboard-nav',
        title: 'Open Dashboard',
        description: 'Global search is easiest to access from Dashboard.',
        selector: '[data-help-nav="/app"]',
        path: '/app',
      },
      {
        id: 'dashboard-search',
        title: 'Use Search',
        description: 'Use the search bar to jump into matching journal, recording, or brain dump content.',
        selector: '[data-help-search="global"]',
      },
    ],
  },
  {
    id: 'settings',
    title: 'Adjust Security and Export Settings',
    steps: [
      {
        id: 'settings-nav',
        title: 'Open Settings',
        description: 'Navigate to Settings from the sidebar.',
        selector: '[data-help-nav="/app/settings"]',
        path: '/app/settings',
      },
      {
        id: 'settings-main',
        title: 'Configure Preferences',
        description: 'Manage encryption, backup, and storage options from the settings page.',
        selector: 'main',
      },
    ],
  },
  {
    id: 'help-basics',
    title: 'Use Voice Docs Commands',
    steps: [
      {
        id: 'help-input',
        title: 'Type a Command',
        description: 'Try commands like "take me to roadmap" or "find export backup".',
        selector: '[data-help-input]',
        path: '/help',
      },
      {
        id: 'help-history',
        title: 'Review Help History',
        description: 'Reuse previous interactions by selecting an item from history.',
        selector: '[data-help-history]',
      },
    ],
  },
];

export const findWalkthrough = (input: string): WalkthroughDefinition | null => {
  const normalized = input.toLowerCase();

  if (normalized.includes('journal') || normalized.includes('entry')) {
    return WALKTHROUGHS.find((walkthrough) => walkthrough.id === 'new-entry') ?? null;
  }

  if (normalized.includes('brain') || normalized.includes('record')) {
    return WALKTHROUGHS.find((walkthrough) => walkthrough.id === 'brain-dump') ?? null;
  }

  if (normalized.includes('search') || normalized.includes('find')) {
    return WALKTHROUGHS.find((walkthrough) => walkthrough.id === 'search') ?? null;
  }

  if (normalized.includes('setting') || normalized.includes('export') || normalized.includes('privacy')) {
    return WALKTHROUGHS.find((walkthrough) => walkthrough.id === 'settings') ?? null;
  }

  if (normalized.includes('command') || normalized.includes('help')) {
    return WALKTHROUGHS.find((walkthrough) => walkthrough.id === 'help-basics') ?? null;
  }

  return null;
};
