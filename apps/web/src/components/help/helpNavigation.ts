import type { CommandParseResult, NavigationTarget } from './helpTypes';

export const NAVIGATION_TARGETS: NavigationTarget[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/app',
    description: 'Overview, recent entries, and quick actions',
    keywords: ['home', 'overview', 'dashboard'],
  },
  {
    id: 'questions',
    label: 'Questions',
    path: '/app/questions',
    description: 'Guided prompts to capture structured context',
    keywords: ['questions', 'prompts', 'interview'],
  },
  {
    id: 'journal',
    label: 'Journal',
    path: '/app/journal',
    description: 'Daily entries with mood and energy tracking',
    keywords: ['journal', 'entry', 'diary', 'write'],
  },
  {
    id: 'brain-dump',
    label: 'Brain Dump',
    path: '/app/brain-dump',
    description: 'Free-form recording with synthesis',
    keywords: ['brain dump', 'record', 'voice', 'ramble'],
  },
  {
    id: 'insights',
    label: 'AI Insights',
    path: '/app/insights',
    description: 'Patterns, themes, and recommendation view',
    keywords: ['insights', 'patterns', 'analysis'],
  },
  {
    id: 'timeline',
    label: 'Timeline',
    path: '/app/timeline',
    description: 'Chronological context view',
    keywords: ['timeline', 'history', 'chronological'],
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/app/settings',
    description: 'Encryption, export, sync, and preferences',
    keywords: ['settings', 'preferences', 'config', 'export', 'security'],
  },
  {
    id: 'help',
    label: 'Help',
    path: '/help',
    description: 'Documentation and support resources',
    keywords: ['help', 'docs', 'documentation'],
  },
  {
    id: 'roadmap',
    label: 'Roadmap',
    path: '/roadmap',
    description: 'Track planned and in-progress features',
    keywords: ['roadmap', 'planned', 'in progress', 'features'],
  },
  {
    id: 'feature-request',
    label: 'Feature Request',
    path: '/feature-request',
    description: 'Submit and vote on product requests',
    keywords: ['feature request', 'feedback', 'vote'],
  },
  {
    id: 'pricing',
    label: 'Pricing',
    path: '/pricing',
    description: 'Plan tiers and pricing details',
    keywords: ['pricing', 'plans', 'subscription'],
  },
];

const normalize = (value: string): string => {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
};

export const parseCommand = (input: string): CommandParseResult => {
  const normalized = normalize(input);

  const walkthroughMatch = normalized.match(/(?:show me how|walk me through|tutorial for)\s+(.+)/i);
  if (walkthroughMatch?.[1]) {
    return { type: 'walkthrough', value: walkthroughMatch[1].trim() };
  }

  const navigateMatch = normalized.match(/(?:take me to|go to|open|navigate to)\s+(.+)/i);
  if (navigateMatch?.[1]) {
    return { type: 'navigate', value: navigateMatch[1].trim() };
  }

  const searchMatch = normalized.match(/(?:find|search for|look up)\s+(.+)/i);
  if (searchMatch?.[1]) {
    return { type: 'search', value: searchMatch[1].trim() };
  }

  if (normalized.startsWith('show me ') || normalized.startsWith('how do i ')) {
    return { type: 'walkthrough', value: normalized };
  }

  return { type: 'none' };
};

const scoreTarget = (target: NavigationTarget, input: string): number => {
  const normalizedInput = normalize(input);

  let score = 0;
  if (normalize(target.label) === normalizedInput) {
    score += 100;
  }

  if (normalize(target.label).includes(normalizedInput)) {
    score += 40;
  }

  for (const keyword of target.keywords) {
    const normalizedKeyword = normalize(keyword);
    if (normalizedInput.includes(normalizedKeyword)) {
      score += 20;
    }
  }

  return score;
};

export const findNavigationTarget = (input: string): NavigationTarget | null => {
  let best: NavigationTarget | null = null;
  let bestScore = 0;

  for (const target of NAVIGATION_TARGETS) {
    const score = scoreTarget(target, input);

    if (score > bestScore) {
      best = target;
      bestScore = score;
    }
  }

  return bestScore >= 20 ? best : null;
};

export const filterNavigationTargets = (input: string): NavigationTarget[] => {
  if (!input.trim()) {
    return NAVIGATION_TARGETS;
  }

  return [...NAVIGATION_TARGETS]
    .map((target) => ({ target, score: scoreTarget(target, input) }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .map((entry) => entry.target);
};

export const getBreadcrumbs = (pathname: string): string[] => {
  return pathname
    .split('/')
    .filter(Boolean)
    .map((segment) => segment.replace(/-/g, ' '));
};

const suggestionsBySection: Record<string, string[]> = {
  dashboard: ['Take me to questions', 'Show me how to start a journal entry', 'Find my latest brain dump'],
  questions: ['Show me how to record an answer', 'Take me to journal', 'Find settings for privacy'],
  journal: ['Show me how to create a new entry', 'Find entries about work', 'Take me to timeline'],
  'brain-dump': ['Show me how brain dump works', 'Take me to insights', 'Find my latest journal entry'],
  settings: ['Show me how to export backup', 'Take me to dashboard', 'Find data reclamation settings'],
  help: ['Take me to roadmap', 'Show me how to use commands', 'Search for export backup'],
  roadmap: ['Take me to pricing', 'Take me to feature request', 'Show me how to use commands'],
  default: ['Take me to dashboard', 'Show me how to use Brain Dump', 'Find settings'],
};

export const getContextualSuggestions = (appSection: string, breadcrumbs: string[]): string[] => {
  const base = suggestionsBySection[appSection] ?? suggestionsBySection.default;
  const trail = breadcrumbs.join(' > ');

  if (!trail) {
    return base;
  }

  return [
    ...base,
    `How is this related to ${trail}?`,
  ];
};
