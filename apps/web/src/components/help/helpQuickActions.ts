import type { HelpQuickAction } from './helpUxTypes';

export const HELP_QUICK_ACTIONS: HelpQuickAction[] = [
  {
    id: 'new-entry',
    label: 'New Entry',
    path: '/app/journal',
    description: 'Open journal to create a new entry',
  },
  {
    id: 'search',
    label: 'Search',
    path: '/app',
    description: 'Go to dashboard and use global search',
  },
  {
    id: 'export',
    label: 'Export',
    path: '/app/settings#export',
    description: 'Open encrypted export settings',
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/app/settings',
    description: 'Manage privacy and app preferences',
  },
  {
    id: 'help',
    label: 'Help',
    path: '/help',
    description: 'Open full help center documentation',
  },
];
