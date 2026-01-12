/**
 * Starter questions for life documentation
 * 50+ questions across 12 life categories
 */
import { PrivacyLevel, Question } from '@lcc/types';

// Early Life & Origins
export const EARLY_LIFE_QUESTIONS: Question[] = [
  { id: 'el-1', categoryId: 'early-life', text: 'Tell me about where you were born and your earliest memories. What stands out most from your childhood?', context: 'Your origins establish the foundation of your life story.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 1, isFollowUp: false },
  { id: 'el-2', categoryId: 'early-life', text: 'Who were the most influential people in your early life? How did they shape who you became?', context: 'Early influences often define our values and perspectives.', suggestedDuration: 20, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 2, isFollowUp: false },
  { id: 'el-3', categoryId: 'early-life', text: 'What was your family dynamic like growing up? Describe the atmosphere of your home.', context: 'Family environment shapes our emotional development.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 3, isFollowUp: false },
  { id: 'el-4', categoryId: 'early-life', text: 'What were your favorite activities and interests as a child? Which ones have stayed with you?', context: 'Childhood interests often reveal our core passions.', suggestedDuration: 10, defaultPrivacyLevel: PrivacyLevel.FAMILY, order: 4, isFollowUp: false },
];

// Family & Relationships
export const FAMILY_QUESTIONS: Question[] = [
  { id: 'fr-1', categoryId: 'family', text: 'Describe your relationship with your parents. How has it evolved over time?', context: 'Parent relationships profoundly impact our attachment styles.', suggestedDuration: 20, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 1, isFollowUp: false },
  { id: 'fr-2', categoryId: 'family', text: 'Tell me about your siblings or closest childhood companions. What role did they play in your development?', context: 'Sibling and peer relationships shape social skills.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.FAMILY, order: 2, isFollowUp: false },
  { id: 'fr-3', categoryId: 'family', text: 'What romantic relationships have been most significant in your life? What did you learn from each?', context: 'Romantic relationships teach us about love and ourselves.', suggestedDuration: 25, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 3, isFollowUp: false },
  { id: 'fr-4', categoryId: 'family', text: 'Who are your closest friends today? How did those friendships form?', context: 'Adult friendships reflect our evolved values.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.FRIENDS, order: 4, isFollowUp: false },
];

// Values & Beliefs
export const VALUES_QUESTIONS: Question[] = [
  { id: 'vb-1', categoryId: 'values', text: 'What values are most important to you? Where do you think these values came from?', context: 'Core values guide our decisions and define our character.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 1, isFollowUp: false },
  { id: 'vb-2', categoryId: 'values', text: 'How have your spiritual or religious beliefs evolved throughout your life?', context: 'Spiritual development reflects our search for meaning.', suggestedDuration: 20, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 2, isFollowUp: false },
  { id: 'vb-3', categoryId: 'values', text: 'What do you believe is the meaning of life? How has this view changed over time?', context: 'Exploring life\'s meaning reveals deep personal philosophy.', suggestedDuration: 20, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 3, isFollowUp: false },
  { id: 'vb-4', categoryId: 'values', text: 'What ethical principles guide your decision-making? Can you give an example?', context: 'Ethics in action show our true values.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 4, isFollowUp: false },
];

// Career & Work
export const CAREER_QUESTIONS: Question[] = [
  { id: 'cw-1', categoryId: 'career', text: 'Walk me through your career journey. What pivotal decisions shaped your path?', context: 'Career paths reveal our ambitions and adaptability.', suggestedDuration: 25, defaultPrivacyLevel: PrivacyLevel.PROFESSIONAL, order: 1, isFollowUp: false },
  { id: 'cw-2', categoryId: 'career', text: 'What accomplishments are you most proud of professionally? Why do they matter to you?', context: 'Professional pride shows what we value in work.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PROFESSIONAL, order: 2, isFollowUp: false },
  { id: 'cw-3', categoryId: 'career', text: 'What was your biggest professional failure? How did you recover and what did you learn?', context: 'Failures often teach more than successes.', suggestedDuration: 20, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 3, isFollowUp: false },
  { id: 'cw-4', categoryId: 'career', text: 'What does work-life balance mean to you? How do you try to achieve it?', context: 'Balance reflects our priorities.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 4, isFollowUp: false },
];

// Dreams & Aspirations
export const DREAMS_QUESTIONS: Question[] = [
  { id: 'da-1', categoryId: 'dreams', text: 'If you could accomplish anything in the next 10 years, what would it be?', context: 'Long-term dreams reveal our deepest desires.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 1, isFollowUp: false },
  { id: 'da-2', categoryId: 'dreams', text: 'What childhood dreams have you fulfilled? Which ones are still waiting?', context: 'Comparing dreams to reality shows growth.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 2, isFollowUp: false },
  { id: 'da-3', categoryId: 'dreams', text: 'What legacy do you want to leave behind? How do you want to be remembered?', context: 'Legacy thinking clarifies what truly matters.', suggestedDuration: 20, defaultPrivacyLevel: PrivacyLevel.FAMILY, order: 3, isFollowUp: false },
  { id: 'da-4', categoryId: 'dreams', text: 'If money were no object, how would you spend your time?', context: 'Removing constraints reveals true passions.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 4, isFollowUp: false },
];

// Fears & Challenges
export const FEARS_QUESTIONS: Question[] = [
  { id: 'fc-1', categoryId: 'fears', text: 'What are you most afraid of? Where do you think this fear comes from?', context: 'Understanding fears helps overcome them.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 1, isFollowUp: false },
  { id: 'fc-2', categoryId: 'fears', text: 'What has been the most difficult period of your life? How did you get through it?', context: 'Resilience stories reveal our strength.', suggestedDuration: 25, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 2, isFollowUp: false },
  { id: 'fc-3', categoryId: 'fears', text: 'What limiting beliefs have held you back? Are you working to overcome any of them?', context: 'Limiting beliefs often hide growth opportunities.', suggestedDuration: 20, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 3, isFollowUp: false },
  { id: 'fc-4', categoryId: 'fears', text: 'How do you handle stress and anxiety? What coping mechanisms work for you?', context: 'Coping strategies are valuable self-knowledge.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 4, isFollowUp: false },
];

// Strengths & Skills
export const STRENGTHS_QUESTIONS: Question[] = [
  { id: 'ss-1', categoryId: 'strengths', text: 'What are your greatest strengths? How have you developed them?', context: 'Recognizing strengths builds confidence.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 1, isFollowUp: false },
  { id: 'ss-2', categoryId: 'strengths', text: 'What skills have you mastered? Describe your journey from beginner to expert.', context: 'Skill development stories show dedication.', suggestedDuration: 20, defaultPrivacyLevel: PrivacyLevel.PROFESSIONAL, order: 2, isFollowUp: false },
  { id: 'ss-3', categoryId: 'strengths', text: 'What do others consistently come to you for help with?', context: 'What others seek shows our unique value.', suggestedDuration: 10, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 3, isFollowUp: false },
  { id: 'ss-4', categoryId: 'strengths', text: 'Describe a time when you surprised yourself with your own capabilities.', context: 'Surprises reveal hidden potential.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 4, isFollowUp: false },
];

// Weaknesses & Growth
export const WEAKNESSES_QUESTIONS: Question[] = [
  { id: 'wg-1', categoryId: 'weaknesses', text: 'What are your biggest weaknesses? How do they affect your life?', context: 'Honest weakness assessment enables growth.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 1, isFollowUp: false },
  { id: 'wg-2', categoryId: 'weaknesses', text: 'What patterns keep repeating in your life that you wish would change?', context: 'Patterns reveal areas needing attention.', suggestedDuration: 20, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 2, isFollowUp: false },
  { id: 'wg-3', categoryId: 'weaknesses', text: 'What feedback have you received repeatedly that you struggle to accept?', context: 'Difficult feedback often holds truth.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 3, isFollowUp: false },
  { id: 'wg-4', categoryId: 'weaknesses', text: 'What skill do you wish you had developed earlier in life?', context: 'Regrets can guide future priorities.', suggestedDuration: 10, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 4, isFollowUp: false },
];

// Hobbies & Interests
export const HOBBIES_QUESTIONS: Question[] = [
  { id: 'hi-1', categoryId: 'hobbies', text: 'What activities make you lose track of time? Why do you think they captivate you?', context: 'Flow states indicate deep passion.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.FRIENDS, order: 1, isFollowUp: false },
  { id: 'hi-2', categoryId: 'hobbies', text: 'What hobbies have you picked up and dropped over the years? What stuck?', context: 'Hobby patterns show evolving interests.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.FRIENDS, order: 2, isFollowUp: false },
  { id: 'hi-3', categoryId: 'hobbies', text: 'What would you like to learn if you had unlimited time?', context: 'Learning desires reveal curiosity areas.', suggestedDuration: 10, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 3, isFollowUp: false },
  { id: 'hi-4', categoryId: 'hobbies', text: 'How do you spend your ideal weekend?', context: 'Ideal time use shows true preferences.', suggestedDuration: 10, defaultPrivacyLevel: PrivacyLevel.FRIENDS, order: 4, isFollowUp: false },
];

// Health & Wellness
export const HEALTH_QUESTIONS: Question[] = [
  { id: 'hw-1', categoryId: 'health', text: 'How has your relationship with your body and health evolved over the years?', context: 'Body relationship impacts overall wellbeing.', suggestedDuration: 20, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 1, isFollowUp: false },
  { id: 'hw-2', categoryId: 'health', text: 'What mental health challenges have you faced? How have you addressed them?', context: 'Mental health awareness is crucial for growth.', suggestedDuration: 25, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 2, isFollowUp: false },
  { id: 'hw-3', categoryId: 'health', text: 'What wellness practices have made the biggest difference in your life?', context: 'Effective practices are worth documenting.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 3, isFollowUp: false },
  { id: 'hw-4', categoryId: 'health', text: 'How do you define and maintain your energy levels?', context: 'Energy management affects all life areas.', suggestedDuration: 10, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 4, isFollowUp: false },
];

// Philosophy & Worldview
export const PHILOSOPHY_QUESTIONS: Question[] = [
  { id: 'pw-1', categoryId: 'philosophy', text: 'How would you describe your overall philosophy of life in a few sentences?', context: 'Life philosophy guides daily decisions.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 1, isFollowUp: false },
  { id: 'pw-2', categoryId: 'philosophy', text: 'What books, ideas, or thinkers have most influenced your worldview?', context: 'Intellectual influences shape perspective.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 2, isFollowUp: false },
  { id: 'pw-3', categoryId: 'philosophy', text: 'How do you think about death and mortality? How does it affect how you live?', context: 'Mortality awareness can clarify priorities.', suggestedDuration: 20, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 3, isFollowUp: false },
  { id: 'pw-4', categoryId: 'philosophy', text: 'What do you believe about human nature - are people fundamentally good?', context: 'Views on human nature affect relationships.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 4, isFollowUp: false },
];

// Accomplishments
export const ACCOMPLISHMENTS_QUESTIONS: Question[] = [
  { id: 'ac-1', categoryId: 'accomplishments', text: 'What achievement are you most proud of in your entire life?', context: 'Peak achievements reveal deep values.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 1, isFollowUp: false },
  { id: 'ac-2', categoryId: 'accomplishments', text: 'What obstacles did you overcome to achieve something meaningful?', context: 'Obstacle stories show resilience.', suggestedDuration: 20, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 2, isFollowUp: false },
  { id: 'ac-3', categoryId: 'accomplishments', text: 'What accomplishment surprised you the most?', context: 'Surprises reveal hidden potential.', suggestedDuration: 10, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 3, isFollowUp: false },
];

// Regrets & Lessons
export const REGRETS_QUESTIONS: Question[] = [
  { id: 'rl-1', categoryId: 'regrets', text: 'If you could go back and change one decision, what would it be and why?', context: 'Regrets often hold important lessons.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 1, isFollowUp: false },
  { id: 'rl-2', categoryId: 'regrets', text: 'What\'s the most important lesson life has taught you?', context: 'Life lessons are wisdom to preserve.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 2, isFollowUp: false },
  { id: 'rl-3', categoryId: 'regrets', text: 'What advice would you give your younger self?', context: 'Advice to self reveals growth.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.FAMILY, order: 3, isFollowUp: false },
];

// Legacy & Impact
export const LEGACY_QUESTIONS: Question[] = [
  { id: 'li-1', categoryId: 'legacy', text: 'How do you want to be remembered by those who knew you?', context: 'Legacy desires clarify current priorities.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 1, isFollowUp: false },
  { id: 'li-2', categoryId: 'legacy', text: 'What impact do you hope to have on the world?', context: 'Impact goals drive meaningful action.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 2, isFollowUp: false },
  { id: 'li-3', categoryId: 'legacy', text: 'What wisdom would you most want to pass on to future generations?', context: 'Wisdom preservation is a gift to the future.', suggestedDuration: 20, defaultPrivacyLevel: PrivacyLevel.FAMILY, order: 3, isFollowUp: false },
];

// All questions combined
export const ALL_QUESTIONS: Question[] = [
  ...EARLY_LIFE_QUESTIONS,
  ...FAMILY_QUESTIONS,
  ...VALUES_QUESTIONS,
  ...CAREER_QUESTIONS,
  ...DREAMS_QUESTIONS,
  ...FEARS_QUESTIONS,
  ...STRENGTHS_QUESTIONS,
  ...WEAKNESSES_QUESTIONS,
  ...HOBBIES_QUESTIONS,
  ...HEALTH_QUESTIONS,
  ...PHILOSOPHY_QUESTIONS,
  ...ACCOMPLISHMENTS_QUESTIONS,
  ...REGRETS_QUESTIONS,
  ...LEGACY_QUESTIONS,
];

// Helper to get questions by category
export function getQuestionsByCategory(categoryId: string): Question[] {
  return ALL_QUESTIONS.filter(q => q.categoryId === categoryId);
}

// Question stats
export const QUESTION_STATS = {
  total: ALL_QUESTIONS.length,
  categories: 14,
};
