/**
 * Demo Tasks - Alex Chen's life project management
 * Tasks span personal goals, career ambitions, family milestones, and daily todos
 */

export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'blocked' | 'done';
export type TaskPriority = 'P0' | 'P1' | 'P2' | 'P3' | 'P4';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  dueDate: string | null;
  targetYear: number | null; // For long-term planning
  tags: string[];
  subtasks: { id: string; title: string; done: boolean }[];
  linkedJournalIds: string[];
  aiGenerated: boolean;
  createdAt: string;
  completedAt: string | null;
}

export const TASK_CATEGORIES = [
  'Career', 'Health & Fitness', 'Family', 'Relationships', 
  'Finance', 'Learning', 'Travel', 'Home', 'Legacy', 'Personal'
];

export const DEMO_TASKS: Task[] = [
  // ========== DONE ==========
  {
    id: 'task-marathon-signup',
    title: 'Sign up for Austin Marathon',
    description: 'Register for the 2025 Austin Marathon in February',
    status: 'done',
    priority: 'P1',
    category: 'Health & Fitness',
    dueDate: '2024-10-01',
    targetYear: null,
    tags: ['fitness', 'marathon', 'goal-2024'],
    subtasks: [
      { id: 'st-1', title: 'Choose distance (full vs half)', done: true },
      { id: 'st-2', title: 'Register online', done: true },
      { id: 'st-3', title: 'Book hotel near start line', done: true },
    ],
    linkedJournalIds: ['entry-2024-01-12', 'entry-2024-01-02'],
    aiGenerated: false,
    createdAt: '2024-01-02T10:00:00',
    completedAt: '2024-10-15T14:30:00',
  },
  {
    id: 'task-therapy-start',
    title: 'Start therapy',
    description: 'Find a therapist and schedule first session',
    status: 'done',
    priority: 'P0',
    category: 'Personal',
    dueDate: '2020-05-01',
    targetYear: null,
    tags: ['mental-health', 'self-care'],
    subtasks: [
      { id: 'st-1', title: 'Ask Sam for referral', done: true },
      { id: 'st-2', title: 'Check insurance coverage', done: true },
      { id: 'st-3', title: 'Schedule first session', done: true },
    ],
    linkedJournalIds: ['entry-2020-04-15', 'entry-2020-05-10'],
    aiGenerated: false,
    createdAt: '2020-04-16T08:00:00',
    completedAt: '2020-05-10T16:30:00',
  },

  // ========== IN PROGRESS ==========
  {
    id: 'task-marathon-training',
    title: 'Complete marathon training plan',
    description: '16-week training program for Austin Marathon',
    status: 'in_progress',
    priority: 'P1',
    category: 'Health & Fitness',
    dueDate: '2025-02-15',
    targetYear: null,
    tags: ['fitness', 'marathon', 'goal-2024'],
    subtasks: [
      { id: 'st-1', title: 'Week 1-4: Base building (15-20 miles/week)', done: true },
      { id: 'st-2', title: 'Week 5-8: Build phase (25-30 miles/week)', done: false },
      { id: 'st-3', title: 'Week 9-12: Peak training (35+ miles/week)', done: false },
      { id: 'st-4', title: 'Week 13-16: Taper', done: false },
      { id: 'st-5', title: 'Race day!', done: false },
    ],
    linkedJournalIds: ['entry-2024-01-12'],
    aiGenerated: false,
    createdAt: '2024-01-05T09:00:00',
    completedAt: null,
  },
  {
    id: 'task-startup-research',
    title: 'Validate AI parenting app idea',
    description: 'Research and validate the milestone documentation app for parents',
    status: 'in_progress',
    priority: 'P2',
    category: 'Career',
    dueDate: '2024-03-31',
    targetYear: null,
    tags: ['startup', 'ai', 'parenting'],
    subtasks: [
      { id: 'st-1', title: 'Talk to 10 new parents', done: true },
      { id: 'st-2', title: 'Research competitors', done: true },
      { id: 'st-3', title: 'Build landing page MVP', done: false },
      { id: 'st-4', title: 'Get 100 email signups', done: false },
      { id: 'st-5', title: 'Decide: go or no-go', done: false },
    ],
    linkedJournalIds: ['entry-2024-01-02'],
    aiGenerated: true,
    createdAt: '2024-01-15T10:00:00',
    completedAt: null,
  },

  // ========== TO DO ==========
  {
    id: 'task-japan-trip',
    title: 'Plan Japan trip with Sam',
    description: 'Finally making the Japan trip happen - 10 years of talking about it',
    status: 'todo',
    priority: 'P2',
    category: 'Travel',
    dueDate: '2024-09-01',
    targetYear: 2025,
    tags: ['travel', 'sam', 'bucket-list'],
    subtasks: [
      { id: 'st-1', title: 'Pick dates (March or October)', done: false },
      { id: 'st-2', title: 'Book flights', done: false },
      { id: 'st-3', title: 'Create itinerary', done: false },
      { id: 'st-4', title: 'Book hotels/ryokans', done: false },
      { id: 'st-5', title: 'Get JR passes', done: false },
    ],
    linkedJournalIds: [],
    aiGenerated: false,
    createdAt: '2024-01-20T11:00:00',
    completedAt: null,
  },
  {
    id: 'task-will-setup',
    title: 'Create will and estate plan',
    description: 'Get serious about legacy planning for Lily',
    status: 'todo',
    priority: 'P1',
    category: 'Legacy',
    dueDate: '2024-06-01',
    targetYear: null,
    tags: ['legal', 'legacy', 'family'],
    subtasks: [
      { id: 'st-1', title: 'Find estate lawyer', done: false },
      { id: 'st-2', title: 'Create will', done: false },
      { id: 'st-3', title: 'Set up trust for Lily', done: false },
      { id: 'st-4', title: 'Designate guardians', done: false },
      { id: 'st-5', title: 'Life insurance review', done: false },
    ],
    linkedJournalIds: [],
    aiGenerated: true,
    createdAt: '2024-01-10T09:00:00',
    completedAt: null,
  },

  // ========== BACKLOG (Life Goals) ==========
  {
    id: 'task-retire-early',
    title: 'FIRE: Financial independence target',
    description: 'Reach financial independence by age 50',
    status: 'backlog',
    priority: 'P3',
    category: 'Finance',
    dueDate: null,
    targetYear: 2042,
    tags: ['finance', 'retirement', 'long-term'],
    subtasks: [
      { id: 'st-1', title: 'Max out 401k annually', done: false },
      { id: 'st-2', title: 'Build 6-month emergency fund', done: true },
      { id: 'st-3', title: 'Invest in index funds', done: true },
      { id: 'st-4', title: 'Pay off mortgage early', done: false },
      { id: 'st-5', title: 'Reach $2M net worth', done: false },
    ],
    linkedJournalIds: [],
    aiGenerated: false,
    createdAt: '2021-01-01T10:00:00',
    completedAt: null,
  },
  {
    id: 'task-teach-lily',
    title: 'Teach Lily to code',
    description: 'Share my love of programming with Lily when she\'s old enough',
    status: 'backlog',
    priority: 'P4',
    category: 'Family',
    dueDate: null,
    targetYear: 2030,
    tags: ['lily', 'parenting', 'coding', 'legacy'],
    subtasks: [
      { id: 'st-1', title: 'Start with Scratch (age 6-7)', done: false },
      { id: 'st-2', title: 'Build something together', done: false },
      { id: 'st-3', title: 'Her first website', done: false },
    ],
    linkedJournalIds: [],
    aiGenerated: true,
    createdAt: '2023-06-15T10:00:00',
    completedAt: null,
  },
  {
    id: 'task-write-book',
    title: 'Write a book about tech career lessons',
    description: 'Compile everything I\'ve learned into a guide for junior developers',
    status: 'backlog',
    priority: 'P4',
    category: 'Legacy',
    dueDate: null,
    targetYear: 2028,
    tags: ['writing', 'career', 'legacy', 'teaching'],
    subtasks: [
      { id: 'st-1', title: 'Outline chapters', done: false },
      { id: 'st-2', title: 'Write 1000 words/week', done: false },
      { id: 'st-3', title: 'Get feedback from mentees', done: false },
      { id: 'st-4', title: 'Find publisher or self-publish', done: false },
    ],
    linkedJournalIds: [],
    aiGenerated: true,
    createdAt: '2023-09-01T10:00:00',
    completedAt: null,
  },

  // ========== BLOCKED ==========
  {
    id: 'task-seattle-decision',
    title: 'Decide on Seattle move',
    description: 'Maya has a job opportunity in Seattle - need to decide together',
    status: 'blocked',
    priority: 'P0',
    category: 'Family',
    dueDate: '2024-02-28',
    targetYear: null,
    tags: ['maya', 'career', 'family', 'major-decision'],
    subtasks: [
      { id: 'st-1', title: 'Research Seattle job market for me', done: true },
      { id: 'st-2', title: 'Visit Seattle together', done: false },
      { id: 'st-3', title: 'Talk to Lily\'s pediatrician about move', done: false },
      { id: 'st-4', title: 'Calculate financial impact', done: false },
      { id: 'st-5', title: 'Make decision together', done: false },
    ],
    linkedJournalIds: [],
    aiGenerated: false,
    createdAt: '2024-01-05T20:00:00',
    completedAt: null,
  },

  // More tasks to fill out the life plan
  ...generateMoreTasks(),
];

function generateMoreTasks(): Task[] {
  const tasks: Task[] = [];
  
  const longTermGoals = [
    { title: 'Visit all 7 continents', category: 'Travel', targetYear: 2040 },
    { title: 'Run a company', category: 'Career', targetYear: 2030 },
    { title: 'Own a vacation home', category: 'Finance', targetYear: 2035 },
    { title: 'Learn to play piano', category: 'Learning', targetYear: 2026 },
    { title: 'Speak conversational Spanish', category: 'Learning', targetYear: 2025 },
    { title: 'Complete Ironman triathlon', category: 'Health & Fitness', targetYear: 2027 },
    { title: 'Mentor 10 junior developers', category: 'Career', targetYear: 2028 },
    { title: 'Read 500 books', category: 'Learning', targetYear: 2040 },
    { title: 'Build passive income stream', category: 'Finance', targetYear: 2026 },
    { title: 'Lily\'s college fund fully funded', category: 'Family', targetYear: 2035 },
  ];

  longTermGoals.forEach((goal, i) => {
    tasks.push({
      id: `task-goal-${i}`,
      title: goal.title,
      description: `Long-term goal planned for ${goal.targetYear}`,
      status: 'backlog',
      priority: 'P3',
      category: goal.category,
      dueDate: null,
      targetYear: goal.targetYear,
      tags: ['long-term', goal.category.toLowerCase()],
      subtasks: [],
      linkedJournalIds: [],
      aiGenerated: i % 3 === 0,
      createdAt: '2024-01-01T10:00:00',
      completedAt: null,
    });
  });

  return tasks;
}

export const TASK_STATS = {
  total: DEMO_TASKS.length,
  done: DEMO_TASKS.filter(t => t.status === 'done').length,
  inProgress: DEMO_TASKS.filter(t => t.status === 'in_progress').length,
  todo: DEMO_TASKS.filter(t => t.status === 'todo').length,
  backlog: DEMO_TASKS.filter(t => t.status === 'backlog').length,
  blocked: DEMO_TASKS.filter(t => t.status === 'blocked').length,
};
