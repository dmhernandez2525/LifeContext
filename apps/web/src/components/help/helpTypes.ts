export interface HelpHistoryItem {
  id: string;
  query: string;
  response: string;
  appSection: string;
  breadcrumbs: string[];
  createdAt: number;
}

export interface NavigationTarget {
  id: string;
  label: string;
  path: string;
  description: string;
  keywords: string[];
}

export interface CommandParseResult {
  type: 'navigate' | 'walkthrough' | 'search' | 'none';
  value?: string;
}

export interface DeepLinkResult {
  path: string;
  label: string;
  reason: string;
}

export interface WalkthroughStep {
  id: string;
  title: string;
  description: string;
  selector?: string;
  path?: string;
}

export interface WalkthroughDefinition {
  id: string;
  title: string;
  steps: WalkthroughStep[];
}
