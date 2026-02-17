export const discoveryBySection: Record<string, string> = {
  dashboard: 'Discovery: try "take me to journal" to navigate hands-free.',
  journal: 'Discovery: try "find entries about work" to jump by context.',
  'brain-dump': 'Discovery: try "show me how brain dump works" for a guided walkthrough.',
  settings: 'Discovery: try "show me how to export backup" for step-by-step guidance.',
  help: 'Discovery: try "take me to roadmap" to navigate public docs faster.',
  roadmap: 'Discovery: try "take me to feature request" to share roadmap feedback.',
  default: 'Discovery: press Ctrl+/ or Cmd+/ anywhere to open help instantly.',
};

export const walkthroughQuickActions: Array<{ id: string; label: string }> = [
  { id: 'new-entry', label: 'Show me how: New entry' },
  { id: 'brain-dump', label: 'Show me how: Brain Dump' },
  { id: 'search', label: 'Show me how: Search' },
  { id: 'settings', label: 'Show me how: Settings' },
  { id: 'help-basics', label: 'Show me how: Help commands' },
];
