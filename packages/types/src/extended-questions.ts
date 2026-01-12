/**
 * Extended Questions - Additional life context questions
 * covering diverse scenarios and experiences
 */
import { Question, PrivacyLevel } from '@lcc/types';

// ============================================================
// IMMIGRATION & CULTURAL IDENTITY
// ============================================================

export const IMMIGRATION_QUESTIONS: Omit<Question, 'id'>[] = [
  {
    categoryId: 'immigration',
    text: "What was your experience leaving your home country?",
    context: "Understanding the journey of departure",
    suggestedDuration: 10,
    defaultPrivacyLevel: PrivacyLevel.PRIVATE,
    order: 1,
    isFollowUp: false,
  },
  {
    categoryId: 'immigration',
    text: "What did you bring with you that was most meaningful?",
    context: "Objects and memories that traveled with you",
    suggestedDuration: 5,
    defaultPrivacyLevel: PrivacyLevel.FAMILY,
    order: 2,
    isFollowUp: false,
  },
  {
    categoryId: 'immigration',
    text: "What surprised you most about your new country?",
    context: "Cultural adjustments and discoveries",
    suggestedDuration: 8,
    defaultPrivacyLevel: PrivacyLevel.FAMILY,
    order: 3,
    isFollowUp: false,
  },
  {
    categoryId: 'immigration',
    text: "What do you miss most from your homeland?",
    context: "Nostalgia and cultural longing",
    suggestedDuration: 8,
    defaultPrivacyLevel: PrivacyLevel.FAMILY,
    order: 4,
    isFollowUp: false,
  },
  {
    categoryId: 'immigration',
    text: "How has immigration shaped your identity?",
    context: "The intersection of cultures in who you are",
    suggestedDuration: 10,
    defaultPrivacyLevel: PrivacyLevel.PRIVATE,
    order: 5,
    isFollowUp: false,
  },
  {
    categoryId: 'immigration',
    text: "What traditions from your original culture do you maintain?",
    context: "Preserving heritage in a new land",
    suggestedDuration: 8,
    defaultPrivacyLevel: PrivacyLevel.FAMILY,
    order: 6,
    isFollowUp: false,
  },
];

// ============================================================
// ADOPTION & IDENTITY
// ============================================================

export const ADOPTION_QUESTIONS: Omit<Question, 'id'>[] = [
  {
    categoryId: 'adoption',
    text: "When and how did you learn about your adoption?",
    context: "The story of understanding your origins",
    suggestedDuration: 10,
    defaultPrivacyLevel: PrivacyLevel.PRIVATE,
    order: 1,
    isFollowUp: false,
  },
  {
    categoryId: 'adoption',
    text: "How do you feel about your biological and adoptive families?",
    context: "Navigating complex family relationships",
    suggestedDuration: 12,
    defaultPrivacyLevel: PrivacyLevel.PRIVATE,
    order: 2,
    isFollowUp: false,
  },
  {
    categoryId: 'adoption',
    text: "Have you searched for or connected with biological relatives?",
    context: "The journey of discovering roots",
    suggestedDuration: 10,
    defaultPrivacyLevel: PrivacyLevel.PRIVATE,
    order: 3,
    isFollowUp: false,
  },
  {
    categoryId: 'adoption',
    text: "What does 'family' mean to you?",
    context: "Defining family on your own terms",
    suggestedDuration: 8,
    defaultPrivacyLevel: PrivacyLevel.FAMILY,
    order: 4,
    isFollowUp: false,
  },
  {
    categoryId: 'adoption',
    text: "How has being adopted influenced your identity?",
    context: "The impact on how you see yourself",
    suggestedDuration: 10,
    defaultPrivacyLevel: PrivacyLevel.PRIVATE,
    order: 5,
    isFollowUp: false,
  },
];

// ============================================================
// DISABILITY & CHRONIC ILLNESS
// ============================================================

export const DISABILITY_QUESTIONS: Omit<Question, 'id'>[] = [
  {
    categoryId: 'disability',
    text: "How would you describe your disability or condition to someone who doesn't understand it?",
    context: "Explaining your experience",
    suggestedDuration: 8,
    defaultPrivacyLevel: PrivacyLevel.PRIVATE,
    order: 1,
    isFollowUp: false,
  },
  {
    categoryId: 'disability',
    text: "What are the biggest misconceptions people have?",
    context: "Correcting assumptions",
    suggestedDuration: 8,
    defaultPrivacyLevel: PrivacyLevel.FAMILY,
    order: 2,
    isFollowUp: false,
  },
  {
    categoryId: 'disability',
    text: "How has your condition shaped your perspective on life?",
    context: "Wisdom gained through experience",
    suggestedDuration: 10,
    defaultPrivacyLevel: PrivacyLevel.PRIVATE,
    order: 3,
    isFollowUp: false,
  },
  {
    categoryId: 'disability',
    text: "What adaptations have you made that you're proud of?",
    context: "Innovation and resilience",
    suggestedDuration: 8,
    defaultPrivacyLevel: PrivacyLevel.FAMILY,
    order: 4,
    isFollowUp: false,
  },
  {
    categoryId: 'disability',
    text: "Who has been most supportive in your journey?",
    context: "Recognizing your support system",
    suggestedDuration: 6,
    defaultPrivacyLevel: PrivacyLevel.FAMILY,
    order: 5,
    isFollowUp: false,
  },
  {
    categoryId: 'disability',
    text: "What do you want others to understand about living with this?",
    context: "Sharing your truth",
    suggestedDuration: 10,
    defaultPrivacyLevel: PrivacyLevel.TRUSTED,
    order: 6,
    isFollowUp: false,
  },
];

// ============================================================
// LGBTQ+ IDENTITY
// ============================================================

export const LGBTQ_QUESTIONS: Omit<Question, 'id'>[] = [
  {
    categoryId: 'identity',
    text: "When did you first realize you were different?",
    context: "Early awareness of identity",
    suggestedDuration: 10,
    defaultPrivacyLevel: PrivacyLevel.PRIVATE,
    order: 1,
    isFollowUp: false,
  },
  {
    categoryId: 'identity',
    text: "What was your coming out experience like?",
    context: "The journey of self-disclosure",
    suggestedDuration: 12,
    defaultPrivacyLevel: PrivacyLevel.PRIVATE,
    order: 2,
    isFollowUp: false,
  },
  {
    categoryId: 'identity',
    text: "How have your relationships with family changed?",
    context: "Family dynamics after coming out",
    suggestedDuration: 10,
    defaultPrivacyLevel: PrivacyLevel.PRIVATE,
    order: 3,
    isFollowUp: false,
  },
  {
    categoryId: 'identity',
    text: "What community has meant the most to you?",
    context: "Finding your people",
    suggestedDuration: 8,
    defaultPrivacyLevel: PrivacyLevel.TRUSTED,
    order: 4,
    isFollowUp: false,
  },
  {
    categoryId: 'identity',
    text: "What advice would you give your younger self?",
    context: "Wisdom for past struggles",
    suggestedDuration: 8,
    defaultPrivacyLevel: PrivacyLevel.PRIVATE,
    order: 5,
    isFollowUp: false,
  },
];

// ============================================================
// SPIRITUAL & RELIGIOUS TRANSITIONS
// ============================================================

export const SPIRITUAL_QUESTIONS: Omit<Question, 'id'>[] = [
  {
    categoryId: 'spirituality',
    text: "How has your spiritual or religious life evolved over time?",
    context: "The arc of your spiritual journey",
    suggestedDuration: 12,
    defaultPrivacyLevel: PrivacyLevel.PRIVATE,
    order: 1,
    isFollowUp: false,
  },
  {
    categoryId: 'spirituality',
    text: "What experiences have most shaped your beliefs?",
    context: "Transformative moments",
    suggestedDuration: 10,
    defaultPrivacyLevel: PrivacyLevel.PRIVATE,
    order: 2,
    isFollowUp: false,
  },
  {
    categoryId: 'spirituality',
    text: "Have you ever had a crisis of faith? How did you navigate it?",
    context: "Periods of doubt and questioning",
    suggestedDuration: 10,
    defaultPrivacyLevel: PrivacyLevel.PRIVATE,
    order: 3,
    isFollowUp: false,
  },
  {
    categoryId: 'spirituality',
    text: "What spiritual practices bring you peace?",
    context: "Daily rituals and disciplines",
    suggestedDuration: 6,
    defaultPrivacyLevel: PrivacyLevel.FAMILY,
    order: 4,
    isFollowUp: false,
  },
  {
    categoryId: 'spirituality',
    text: "How do your beliefs influence your daily decisions?",
    context: "Living out your values",
    suggestedDuration: 8,
    defaultPrivacyLevel: PrivacyLevel.PRIVATE,
    order: 5,
    isFollowUp: false,
  },
];

// ============================================================
// TRAUMA RECOVERY (Trauma-informed, optional)
// ============================================================

export const TRAUMA_QUESTIONS: Omit<Question, 'id'>[] = [
  {
    categoryId: 'healing',
    text: "If you're comfortable, what has been your biggest struggle to overcome?",
    context: "Only share what feels safe",
    suggestedDuration: 10,
    defaultPrivacyLevel: PrivacyLevel.PRIVATE,
    order: 1,
    isFollowUp: false,
  },
  {
    categoryId: 'healing',
    text: "What coping strategies have helped you the most?",
    context: "Tools for resilience",
    suggestedDuration: 8,
    defaultPrivacyLevel: PrivacyLevel.PRIVATE,
    order: 2,
    isFollowUp: false,
  },
  {
    categoryId: 'healing',
    text: "Who has been instrumental in your healing?",
    context: "Acknowledging support",
    suggestedDuration: 6,
    defaultPrivacyLevel: PrivacyLevel.PRIVATE,
    order: 3,
    isFollowUp: false,
  },
  {
    categoryId: 'healing',
    text: "What would you want someone going through similar challenges to know?",
    context: "Sharing wisdom from experience",
    suggestedDuration: 8,
    defaultPrivacyLevel: PrivacyLevel.PRIVATE,
    order: 4,
    isFollowUp: false,
  },
  {
    categoryId: 'healing',
    text: "How has healing changed the way you see the world?",
    context: "Transformation through recovery",
    suggestedDuration: 10,
    defaultPrivacyLevel: PrivacyLevel.PRIVATE,
    order: 5,
    isFollowUp: false,
  },
];

// ============================================================
// PARENTING & CHILDREN
// ============================================================

export const PARENTING_QUESTIONS: Omit<Question, 'id'>[] = [
  {
    categoryId: 'parenting',
    text: "What did you feel when you first held your child?",
    context: "That first moment",
    suggestedDuration: 8,
    defaultPrivacyLevel: PrivacyLevel.FAMILY,
    order: 1,
    isFollowUp: false,
  },
  {
    categoryId: 'parenting',
    text: "What parenting mistakes have taught you the most?",
    context: "Learning through imperfection",
    suggestedDuration: 10,
    defaultPrivacyLevel: PrivacyLevel.PRIVATE,
    order: 2,
    isFollowUp: false,
  },
  {
    categoryId: 'parenting',
    text: "What values do you most want to pass on to your children?",
    context: "Your legacy to the next generation",
    suggestedDuration: 10,
    defaultPrivacyLevel: PrivacyLevel.FAMILY,
    order: 3,
    isFollowUp: false,
  },
  {
    categoryId: 'parenting',
    text: "What do you wish you had known before becoming a parent?",
    context: "Hindsight wisdom",
    suggestedDuration: 8,
    defaultPrivacyLevel: PrivacyLevel.FAMILY,
    order: 4,
    isFollowUp: false,
  },
  {
    categoryId: 'parenting',
    text: "How are you different from your own parents?",
    context: "Breaking or continuing patterns",
    suggestedDuration: 10,
    defaultPrivacyLevel: PrivacyLevel.PRIVATE,
    order: 5,
    isFollowUp: false,
  },
  {
    categoryId: 'parenting',
    text: "What moment with your child has brought you the most joy?",
    context: "Celebrating connection",
    suggestedDuration: 8,
    defaultPrivacyLevel: PrivacyLevel.FAMILY,
    order: 6,
    isFollowUp: false,
  },
];

// ============================================================
// AGING & MORTALITY
// ============================================================

export const AGING_QUESTIONS: Omit<Question, 'id'>[] = [
  {
    categoryId: 'aging',
    text: "How do you feel about getting older?",
    context: "Perspectives on aging",
    suggestedDuration: 8,
    defaultPrivacyLevel: PrivacyLevel.PRIVATE,
    order: 1,
    isFollowUp: false,
  },
  {
    categoryId: 'aging',
    text: "What have you gotten better at with age?",
    context: "The gifts of experience",
    suggestedDuration: 8,
    defaultPrivacyLevel: PrivacyLevel.FAMILY,
    order: 2,
    isFollowUp: false,
  },
  {
    categoryId: 'aging',
    text: "What do you wish you had done differently when you were younger?",
    context: "Reflections on roads not taken",
    suggestedDuration: 10,
    defaultPrivacyLevel: PrivacyLevel.PRIVATE,
    order: 3,
    isFollowUp: false,
  },
  {
    categoryId: 'aging',
    text: "How do you want to be remembered?",
    context: "Your legacy in words",
    suggestedDuration: 10,
    defaultPrivacyLevel: PrivacyLevel.FAMILY,
    order: 4,
    isFollowUp: false,
  },
  {
    categoryId: 'aging',
    text: "What brings you peace when thinking about mortality?",
    context: "Coming to terms with life's end",
    suggestedDuration: 10,
    defaultPrivacyLevel: PrivacyLevel.PRIVATE,
    order: 5,
    isFollowUp: false,
  },
  {
    categoryId: 'aging',
    text: "What would you tell your younger self about what really matters?",
    context: "Wisdom distilled",
    suggestedDuration: 10,
    defaultPrivacyLevel: PrivacyLevel.FAMILY,
    order: 6,
    isFollowUp: false,
  },
];

// ============================================================
// FINANCIAL LESSONS
// ============================================================

export const FINANCIAL_QUESTIONS: Omit<Question, 'id'>[] = [
  {
    categoryId: 'financial',
    text: "What was your relationship with money growing up?",
    context: "Early money experiences",
    suggestedDuration: 8,
    defaultPrivacyLevel: PrivacyLevel.PRIVATE,
    order: 1,
    isFollowUp: false,
  },
  {
    categoryId: 'financial',
    text: "What's the best financial decision you've ever made?",
    context: "Financial wisdom",
    suggestedDuration: 6,
    defaultPrivacyLevel: PrivacyLevel.FAMILY,
    order: 2,
    isFollowUp: false,
  },
  {
    categoryId: 'financial',
    text: "What's the worst financial mistake you've made and what did you learn?",
    context: "Expensive lessons",
    suggestedDuration: 8,
    defaultPrivacyLevel: PrivacyLevel.PRIVATE,
    order: 3,
    isFollowUp: false,
  },
  {
    categoryId: 'financial',
    text: "How do you define 'enough' when it comes to money?",
    context: "Your philosophy on wealth",
    suggestedDuration: 8,
    defaultPrivacyLevel: PrivacyLevel.PRIVATE,
    order: 4,
    isFollowUp: false,
  },
  {
    categoryId: 'financial',
    text: "What financial advice would you give the next generation?",
    context: "Money wisdom to pass on",
    suggestedDuration: 10,
    defaultPrivacyLevel: PrivacyLevel.FAMILY,
    order: 5,
    isFollowUp: false,
  },
];

// ============================================================
// EXPORT ALL
// ============================================================

export const ALL_EXTENDED_QUESTIONS = [
  ...IMMIGRATION_QUESTIONS,
  ...ADOPTION_QUESTIONS,
  ...DISABILITY_QUESTIONS,
  ...LGBTQ_QUESTIONS,
  ...SPIRITUAL_QUESTIONS,
  ...TRAUMA_QUESTIONS,
  ...PARENTING_QUESTIONS,
  ...AGING_QUESTIONS,
  ...FINANCIAL_QUESTIONS,
];

export const EXTENDED_CATEGORIES = [
  { name: 'Immigration & Culture', slug: 'immigration', description: 'Your journey between worlds', icon: '✈️', color: '#0ea5e9', order: 16 },
  { name: 'Adoption & Origins', slug: 'adoption', description: 'Understanding your roots', icon: '🌱', color: '#22c55e', order: 17 },
  { name: 'Disability & Health', slug: 'disability', description: 'Living with chronic conditions', icon: '💙', color: '#6366f1', order: 18 },
  { name: 'Identity & Expression', slug: 'identity', description: 'Who you truly are', icon: '🌈', color: '#ec4899', order: 19 },
  { name: 'Spirituality & Faith', slug: 'spirituality', description: 'Your spiritual journey', icon: '✨', color: '#8b5cf6', order: 20 },
  { name: 'Healing & Recovery', slug: 'healing', description: 'Overcoming challenges', icon: '🦋', color: '#14b8a6', order: 21 },
  { name: 'Parenting & Children', slug: 'parenting', description: 'Raising the next generation', icon: '👨‍👩‍👧', color: '#f97316', order: 22 },
  { name: 'Aging & Legacy', slug: 'aging', description: 'Wisdom of experience', icon: '🕰️', color: '#64748b', order: 23 },
  { name: 'Financial Journey', slug: 'financial', description: 'Money lessons and wisdom', icon: '💰', color: '#eab308', order: 24 },
];
