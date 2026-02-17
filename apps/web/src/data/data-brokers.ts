/**
 * Data broker database with opt-out URLs and instructions.
 */

export type BrokerCategory = 'people-search' | 'marketing' | 'financial' | 'background-check';
export type OptOutDifficulty = 'easy' | 'medium' | 'hard';

export interface DataBroker {
  name: string;
  category: BrokerCategory;
  website: string;
  optOutUrl: string;
  optOutMethod: 'online-form' | 'email' | 'mail' | 'phone';
  difficulty: OptOutDifficulty;
  estimatedTime: string;
  dataTypes: string[];
  instructions: string[];
}

export const DATA_BROKERS: DataBroker[] = [
  {
    name: 'Spokeo',
    category: 'people-search',
    website: 'spokeo.com',
    optOutUrl: 'https://www.spokeo.com/optout',
    optOutMethod: 'online-form',
    difficulty: 'easy',
    estimatedTime: '5 min',
    dataTypes: ['Name', 'Address', 'Phone', 'Email', 'Relatives'],
    instructions: [
      'Search for your profile on spokeo.com',
      'Copy the URL of your profile listing',
      'Go to spokeo.com/optout and paste the URL',
      'Enter your email for confirmation',
      'Click the confirmation link in the email',
    ],
  },
  {
    name: 'Whitepages',
    category: 'people-search',
    website: 'whitepages.com',
    optOutUrl: 'https://www.whitepages.com/suppression-requests',
    optOutMethod: 'online-form',
    difficulty: 'medium',
    estimatedTime: '10 min',
    dataTypes: ['Name', 'Address', 'Phone', 'Age', 'Relatives'],
    instructions: [
      'Search for your listing on whitepages.com',
      'Copy the URL of your profile',
      'Go to whitepages.com/suppression-requests',
      'Paste URL and verify via phone call',
      'Enter the verification code',
    ],
  },
  {
    name: 'BeenVerified',
    category: 'people-search',
    website: 'beenverified.com',
    optOutUrl: 'https://www.beenverified.com/app/optout/search',
    optOutMethod: 'online-form',
    difficulty: 'easy',
    estimatedTime: '5 min',
    dataTypes: ['Name', 'Address', 'Phone', 'Email', 'Social Media'],
    instructions: [
      'Go to beenverified.com/app/optout/search',
      'Search for your name and state',
      'Find your listing and click opt out',
      'Enter your email for confirmation',
      'Click the confirmation link',
    ],
  },
  {
    name: 'Intelius',
    category: 'people-search',
    website: 'intelius.com',
    optOutUrl: 'https://www.intelius.com/opt-out',
    optOutMethod: 'online-form',
    difficulty: 'medium',
    estimatedTime: '10 min',
    dataTypes: ['Name', 'Address', 'Phone', 'Age', 'Property Records'],
    instructions: [
      'Go to intelius.com/opt-out',
      'Search for your profile',
      'Select the correct listing',
      'Provide your email and verify identity',
      'Confirm removal via email link',
    ],
  },
  {
    name: 'PeopleFinders',
    category: 'people-search',
    website: 'peoplefinders.com',
    optOutUrl: 'https://www.peoplefinders.com/manage',
    optOutMethod: 'online-form',
    difficulty: 'easy',
    estimatedTime: '5 min',
    dataTypes: ['Name', 'Address', 'Phone', 'Age'],
    instructions: [
      'Go to peoplefinders.com/manage',
      'Search for your listing',
      'Click on your record',
      'Select "This is me" and request removal',
      'Confirm via email',
    ],
  },
  {
    name: 'Acxiom',
    category: 'marketing',
    website: 'acxiom.com',
    optOutUrl: 'https://isapps.acxiom.com/optout/optout.aspx',
    optOutMethod: 'online-form',
    difficulty: 'medium',
    estimatedTime: '15 min',
    dataTypes: ['Name', 'Address', 'Phone', 'Purchase History', 'Demographics'],
    instructions: [
      'Go to isapps.acxiom.com/optout/optout.aspx',
      'Fill out the form with your personal information',
      'Select all data categories for removal',
      'Submit and wait for confirmation email',
      'Follow up if no response in 30 days',
    ],
  },
  {
    name: 'LexisNexis',
    category: 'background-check',
    website: 'lexisnexis.com',
    optOutUrl: 'https://consumer.risk.lexisnexis.com/request',
    optOutMethod: 'online-form',
    difficulty: 'hard',
    estimatedTime: '20 min',
    dataTypes: ['Name', 'SSN (partial)', 'Address History', 'Court Records', 'Employment'],
    instructions: [
      'Go to consumer.risk.lexisnexis.com/request',
      'Select "Opt Out" under consumer options',
      'Provide full legal name and current address',
      'Upload a government-issued ID for verification',
      'Submit and allow 30 days for processing',
    ],
  },
  {
    name: 'Epsilon',
    category: 'marketing',
    website: 'epsilon.com',
    optOutUrl: 'https://www.epsilon.com/consumer-information',
    optOutMethod: 'email',
    difficulty: 'medium',
    estimatedTime: '10 min',
    dataTypes: ['Name', 'Address', 'Email', 'Purchase Behavior', 'Interests'],
    instructions: [
      'Email optout@epsilon.com with your full name',
      'Include your current and previous addresses',
      'Request removal from all marketing databases',
      'Reference CCPA/GDPR rights in your email',
      'Allow 45 days for processing',
    ],
  },
  {
    name: 'Oracle Data Cloud',
    category: 'marketing',
    website: 'oracle.com/data-cloud',
    optOutUrl: 'https://www.oracle.com/legal/privacy/marketing-cloud-data-cloud-privacy-policy.html',
    optOutMethod: 'online-form',
    difficulty: 'hard',
    estimatedTime: '15 min',
    dataTypes: ['Name', 'Email', 'Online Behavior', 'Purchase Intent', 'Demographics'],
    instructions: [
      'Visit Oracle Data Cloud privacy policy page',
      'Find the opt-out section and follow the link',
      'Fill out the data subject request form',
      'Specify "deletion" as your request type',
      'Submit and allow 30-45 days for processing',
    ],
  },
  {
    name: 'TruthFinder',
    category: 'background-check',
    website: 'truthfinder.com',
    optOutUrl: 'https://www.truthfinder.com/opt-out/',
    optOutMethod: 'online-form',
    difficulty: 'easy',
    estimatedTime: '5 min',
    dataTypes: ['Name', 'Address', 'Phone', 'Criminal Records', 'Social Media'],
    instructions: [
      'Go to truthfinder.com/opt-out/',
      'Enter your first name, last name, and state',
      'Find your listing in the results',
      'Click "Remove This Record"',
      'Confirm via email link',
    ],
  },
];

export const CATEGORY_LABELS: Record<BrokerCategory, string> = {
  'people-search': 'People Search',
  'marketing': 'Marketing Data',
  'financial': 'Financial Data',
  'background-check': 'Background Check',
};

export const DIFFICULTY_CONFIG: Record<OptOutDifficulty, { label: string; color: string }> = {
  easy: { label: 'Easy', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' },
  medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' },
  hard: { label: 'Hard', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' },
};

export function getBrokersByCategory(category: BrokerCategory): DataBroker[] {
  return DATA_BROKERS.filter(b => b.category === category);
}

export function getAllBrokerCategories(): BrokerCategory[] {
  return Array.from(new Set(DATA_BROKERS.map(b => b.category)));
}
