/**
 * Demo User Profile: Alex Chen
 * A comprehensive fictional persona for demonstrating LifeContext features
 */

export interface DemoUserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  birthDate: string;
  location: string;
  occupation: string;
  joinDate: string;
  stats: {
    totalEntries: number;
    totalTasks: number;
    lifeDays: number;
    consecutiveStreak: number;
  };
}

export const DEMO_USER: DemoUserProfile = {
  id: 'demo-alex-chen',
  name: 'Alex Chen',
  email: 'alex@example.com',
  avatar: '/avatars/alex-chen.jpg',
  bio: 'Software engineer by day, amateur chef by night. Trying to figure out life one journal entry at a time.',
  birthDate: '1992-03-15',
  location: 'Austin, TX',
  occupation: 'Senior Software Engineer at TechCorp',
  joinDate: '2014-06-01',
  stats: {
    totalEntries: 547,
    totalTasks: 234,
    lifeDays: 3847,
    consecutiveStreak: 42,
  },
};

/**
 * Life Chapters - Major periods in Alex's life
 */
export interface LifeChapter {
  id: string;
  title: string;
  startDate: string;
  endDate: string | null;
  description: string;
  emoji: string;
  color: string;
  entryCount: number;
  keyMoments: string[];
}

export const DEMO_CHAPTERS: LifeChapter[] = [
  {
    id: 'chapter-college',
    title: 'College Years',
    startDate: '2010-08-15',
    endDate: '2014-05-20',
    description: 'Computer Science at UT Austin. Late nights coding, first startup attempt that failed spectacularly, met my best friends.',
    emoji: '🎓',
    color: '#FF6B35',
    entryCount: 89,
    keyMoments: [
      'First hackathon win',
      'Failed startup "StudyBuddy"',
      'Met Sam at a Python meetup',
      'Graduation speech anxiety',
    ],
  },
  {
    id: 'chapter-first-job',
    title: 'Breaking Into Tech',
    startDate: '2014-06-01',
    endDate: '2017-03-15',
    description: 'Junior developer at a startup. Imposter syndrome was real. Learned more in 2 years than 4 years of school.',
    emoji: '💻',
    color: '#6B5B95',
    entryCount: 112,
    keyMoments: [
      'First production bug - broke payments for 2 hours',
      'Promoted to mid-level',
      'First conference talk (terrified)',
      'Startup got acquired',
    ],
  },
  {
    id: 'chapter-finding-love',
    title: 'Finding Love',
    startDate: '2016-11-12',
    endDate: '2018-09-22',
    description: 'Met Maya at a friend\'s housewarming. Two years of dating, adventures, and learning what partnership means.',
    emoji: '💕',
    color: '#FF69B4',
    entryCount: 78,
    keyMoments: [
      'First date - terrible Thai food, great conversation',
      'Road trip to Big Bend',
      'Said "I love you" first',
      'Moved in together',
    ],
  },
  {
    id: 'chapter-career-pivot',
    title: 'The Big Company Years',
    startDate: '2017-04-01',
    endDate: '2021-08-31',
    description: 'Joined TechCorp. Bigger salary, bigger meetings, bigger existential questions. Is this what success looks like?',
    emoji: '🏢',
    color: '#4A90D9',
    entryCount: 134,
    keyMoments: [
      'First six-figure salary',
      'Led a team of 5',
      'Burnout hit HARD in 2020',
      'Therapy saved me',
    ],
  },
  {
    id: 'chapter-marriage',
    title: 'Building a Life Together',
    startDate: '2018-09-22',
    endDate: null,
    description: 'Married Maya. Bought our first home. Nothing prepares you for how hard and beautiful marriage is.',
    emoji: '💍',
    color: '#50C878',
    entryCount: 156,
    keyMoments: [
      'Wedding day - dad cried, I cried',
      'First home in East Austin',
      'Adopting our dog Bruno',
      'First big fight, first real repair',
    ],
  },
  {
    id: 'chapter-parenthood',
    title: 'Becoming Dad',
    startDate: '2022-04-18',
    endDate: null,
    description: 'Lily was born. Sleep became a memory. Purpose became clearer than ever.',
    emoji: '👶',
    color: '#FFD700',
    entryCount: 98,
    keyMoments: [
      'Birth - 14 hours of labor',
      'First smile',
      'Sleep deprivation hallucinations',
      'Her first word: "Dada"',
    ],
  },
  {
    id: 'chapter-now',
    title: 'The Present',
    startDate: '2024-01-01',
    endDate: null,
    description: 'Trying to balance career growth, being a good dad, staying healthy, and figuring out what legacy means.',
    emoji: '🌟',
    color: '#9370DB',
    entryCount: 24,
    keyMoments: [
      'Started journaling daily',
      'Training for first marathon',
      'Considering a startup again',
    ],
  },
];

/**
 * Relationships - People important to Alex
 */
export interface Relationship {
  id: string;
  name: string;
  relationship: string;
  emoji: string;
  firstMet: string;
  description: string;
  recentContext: string;
  mentionCount: number;
  sentiment: 'positive' | 'neutral' | 'complex';
}

export const DEMO_RELATIONSHIPS: Relationship[] = [
  {
    id: 'rel-maya',
    name: 'Maya Chen',
    relationship: 'Wife',
    emoji: '💕',
    firstMet: '2016-11-12',
    description: 'My partner in everything. Product designer, amateur photographer, terrible at cooking but makes the best playlists.',
    recentContext: 'Discussed her job opportunity in Seattle. Scared but supportive.',
    mentionCount: 312,
    sentiment: 'positive',
  },
  {
    id: 'rel-lily',
    name: 'Lily Chen',
    relationship: 'Daughter',
    emoji: '👶',
    firstMet: '2022-04-18',
    description: '2 years old. Already has my stubborn streak and Maya\'s creativity. Light of my life.',
    recentContext: 'Started preschool last week. Transition has been rough.',
    mentionCount: 156,
    sentiment: 'positive',
  },
  {
    id: 'rel-mom',
    name: 'Linda Chen',
    relationship: 'Mother',
    emoji: '👵',
    firstMet: '1992-03-15',
    description: 'Immigrant from Taiwan. Sacrificed everything for my education. Still makes me feel like a kid.',
    recentContext: 'Health scare last month - turned out okay but reminded me to call more.',
    mentionCount: 89,
    sentiment: 'complex',
  },
  {
    id: 'rel-dad',
    name: 'Michael Chen',
    relationship: 'Father',
    emoji: '👴',
    firstMet: '1992-03-15',
    description: 'Engineer like me. Always wanted me to be a doctor. We\'ve come a long way since then.',
    recentContext: 'Finally told me he was proud of me at Lily\'s birthday.',
    mentionCount: 67,
    sentiment: 'complex',
  },
  {
    id: 'rel-sam',
    name: 'Sam Rodriguez',
    relationship: 'Best Friend',
    emoji: '🤝',
    firstMet: '2012-09-15',
    description: 'Met at a Python meetup in college. Co-founder of our failed startup. Still debugging life together.',
    recentContext: 'Planning a trip to Japan next year. Finally making it happen.',
    mentionCount: 145,
    sentiment: 'positive',
  },
  {
    id: 'rel-dr-kim',
    name: 'Dr. Sarah Kim',
    relationship: 'Therapist',
    emoji: '🧠',
    firstMet: '2020-04-01',
    description: 'Started seeing her during pandemic burnout. Best investment I\'ve ever made.',
    recentContext: 'Working through fear of failure around startup ideas.',
    mentionCount: 34,
    sentiment: 'positive',
  },
  {
    id: 'rel-boss',
    name: 'James Park',
    relationship: 'Manager',
    emoji: '👔',
    firstMet: '2021-09-01',
    description: 'Current boss at TechCorp. Good mentor, sometimes pushes too hard.',
    recentContext: 'Gave me feedback that I need to delegate more.',
    mentionCount: 28,
    sentiment: 'neutral',
  },
  {
    id: 'rel-bruno',
    name: 'Bruno',
    relationship: 'Dog',
    emoji: '🐕',
    firstMet: '2019-08-15',
    description: 'Golden retriever. The most emotionally intelligent member of our family.',
    recentContext: 'Had a scare at the vet but he\'s fine. Expensive lesson in pet insurance.',
    mentionCount: 78,
    sentiment: 'positive',
  },
];

/**
 * Emotional Trends Data - Monthly mood averages
 */
export interface EmotionalDataPoint {
  month: string;
  overall: number; // 1-10
  anxiety: number;
  joy: number;
  stress: number;
  gratitude: number;
  topEmotion: string;
  note: string;
}

export const DEMO_EMOTIONAL_TRENDS: EmotionalDataPoint[] = [
  { month: '2024-01', overall: 7.2, anxiety: 4, joy: 7, stress: 5, gratitude: 8, topEmotion: 'hopeful', note: 'New year energy, started journaling daily' },
  { month: '2023-12', overall: 6.8, anxiety: 5, joy: 8, stress: 4, gratitude: 9, topEmotion: 'grateful', note: 'Holidays with family' },
  { month: '2023-11', overall: 6.0, anxiety: 6, joy: 5, stress: 7, gratitude: 6, topEmotion: 'stressed', note: 'Work deadline crunch' },
  { month: '2023-10', overall: 7.5, anxiety: 3, joy: 8, stress: 4, gratitude: 8, topEmotion: 'content', note: 'Great work-life balance month' },
  { month: '2023-09', overall: 6.5, anxiety: 5, joy: 6, stress: 6, gratitude: 7, topEmotion: 'reflective', note: 'Lily started daycare' },
  { month: '2023-08', overall: 7.0, anxiety: 4, joy: 7, stress: 5, gratitude: 7, topEmotion: 'happy', note: 'Family vacation to California' },
  { month: '2023-07', overall: 5.5, anxiety: 7, joy: 5, stress: 8, gratitude: 5, topEmotion: 'overwhelmed', note: 'Career doubts hit hard' },
  { month: '2023-06', overall: 6.2, anxiety: 6, joy: 6, stress: 6, gratitude: 6, topEmotion: 'uncertain', note: 'Considering startup again' },
  { month: '2023-05', overall: 7.8, anxiety: 3, joy: 9, stress: 3, gratitude: 9, topEmotion: 'joyful', note: 'Lily turned 1!' },
  { month: '2023-04', overall: 6.5, anxiety: 5, joy: 7, stress: 5, gratitude: 7, topEmotion: 'balanced', note: 'Finding routine' },
  { month: '2022-04', overall: 9.5, anxiety: 6, joy: 10, stress: 6, gratitude: 10, topEmotion: 'overwhelmed with love', note: 'Lily was born' },
  { month: '2020-04', overall: 4.0, anxiety: 9, joy: 3, stress: 9, gratitude: 4, topEmotion: 'anxious', note: 'Pandemic burnout peak' },
  { month: '2018-09', overall: 9.8, anxiety: 2, joy: 10, stress: 2, gratitude: 10, topEmotion: 'ecstatic', note: 'Wedding day' },
];
