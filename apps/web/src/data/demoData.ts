/**
 * Demo Data - Pre-filled context for showcasing the application
 * 
 * This data simulates a user who has been using the app for several weeks,
 * answering questions across multiple categories with rich, detailed responses.
 */

import { PrivacyLevel } from '@lcc/types';
import type { PatternType } from '@lcc/types';

// ============================================================
// DEMO RECORDINGS - Simulated answered questions
// ============================================================

export interface DemoRecording {
  id: string;
  questionId: string;
  categoryId: string;
  transcript: string;
  duration: number; // seconds
  privacyLevel: PrivacyLevel;
  createdAt: Date;
}

export const DEMO_RECORDINGS: DemoRecording[] = [
  // Early Life & Origins
  {
    id: 'demo-rec-1',
    questionId: 'el-1',
    categoryId: 'early-life',
    transcript: `I was born in a small town in Ohio, about an hour outside of Cleveland. My earliest memories are actually pretty vivid - I remember the yellow wallpaper in my bedroom, and this old oak tree in our backyard that I used to climb. I must have been about four or five. My mom used to watch me from the kitchen window while she cooked dinner. The neighborhood was quiet, safe. Kids would play outside until the streetlights came on. That was the rule - you had to be home when the lights turned on. Those were simpler times, I think. We didn't have much, but we had each other. My dad worked at the factory, and my mom stayed home with us kids. I have two younger sisters. Being the oldest, I always felt this responsibility to look out for them, to set an example. That feeling never really went away.`,
    duration: 187,
    privacyLevel: PrivacyLevel.FAMILY,
    createdAt: new Date('2026-01-02T14:30:00'),
  },
  {
    id: 'demo-rec-2',
    questionId: 'el-2',
    categoryId: 'early-life',
    transcript: `The most influential person in my early life was definitely my grandmother - my mom's mom. She lived with us for about five years when I was growing up, from when I was six until I was eleven. She was this tiny woman, barely five feet tall, but she had this presence that filled the room. She was the one who taught me to read before I started school. She'd sit with me every evening and we'd go through these old books she brought from the old country. She also taught me that kindness costs nothing but means everything. She'd say that all the time. "Kindness costs nothing but means everything." When she passed away when I was eleven, it was the first real loss I experienced. But her lessons stuck with me. I still hear her voice sometimes when I'm making a difficult decision.`,
    duration: 156,
    privacyLevel: PrivacyLevel.FAMILY,
    createdAt: new Date('2026-01-02T15:00:00'),
  },
  {
    id: 'demo-rec-3',
    questionId: 'el-3',
    categoryId: 'early-life',
    transcript: `Our family dynamic was... complicated, I guess. On the surface, we looked like the typical American family. But my parents had their struggles. My dad worked long hours and wasn't around much. When he was home, he was tired. My mom carried a lot of the emotional weight of the family. She was the one who came to school events, helped with homework, dealt with our problems. I think she was lonely sometimes. I remember her staring out the window a lot. As I got older, I realized she had given up her career as a nurse to raise us. I wonder sometimes if she regretted that. The atmosphere at home was generally warm, but there were undercurrents of unspoken things. We didn't talk about feelings much. That's something I've had to learn as an adult.`,
    duration: 142,
    privacyLevel: PrivacyLevel.PRIVATE,
    createdAt: new Date('2026-01-03T10:15:00'),
  },

  // Family & Relationships
  {
    id: 'demo-rec-4',
    questionId: 'fr-1',
    categoryId: 'family',
    transcript: `My relationship with my parents has gone through several phases. When I was young, I idolized my dad. He was this strong, quiet figure. But as a teenager, I resented him for never being around. We had some rough years where we barely spoke. It wasn't until I became a parent myself that I truly understood him. He was doing his best with what he had. He worked those long hours because he wanted to provide for us. Now, we're actually closer than we've ever been. We talk on the phone every Sunday. My mom and I have always been close, but our relationship deepened when I went through my divorce. She was my rock during that time. She didn't judge, she just listened. I'm grateful for her every day.`,
    duration: 134,
    privacyLevel: PrivacyLevel.FAMILY,
    createdAt: new Date('2026-01-03T14:00:00'),
  },
  {
    id: 'demo-rec-5',
    questionId: 'fr-3',
    categoryId: 'family',
    transcript: `The most significant romantic relationship in my life was my marriage. We met in college, got married at 24, and were together for 12 years before we divorced. It taught me so much. I learned about compromise, about communication - and about how bad I was at both of those things. I learned that love isn't enough if you're not willing to grow together. We grew apart instead. It was painful, but necessary. I also learned about my own patterns - I tend to withdraw when things get hard, instead of leaning in. That's something I'm actively working on now. My current relationship is different. I'm different. I communicate more. I'm more present. I've learned that vulnerability isn't weakness - it's the foundation of real connection.`,
    duration: 167,
    privacyLevel: PrivacyLevel.PRIVATE,
    createdAt: new Date('2026-01-04T09:30:00'),
  },

  // Values & Beliefs
  {
    id: 'demo-rec-6',
    questionId: 'vb-1',
    categoryId: 'values',
    transcript: `My core values are authenticity, kindness, and growth. Authenticity because I spent too many years trying to be what others expected me to be. It was exhausting and unfulfilling. Now I prioritize being genuine, even when it's uncomfortable. Kindness because, as my grandmother taught me, it costs nothing but means everything. I try to extend kindness to everyone, including myself - which is honestly the hardest part. And growth because I believe we're here to evolve. Standing still feels like moving backward. These values came from a mix of my upbringing and my own experiences. The authenticity piece really crystallized after my divorce, when I realized I had lost myself trying to be what I thought a spouse should be.`,
    duration: 145,
    privacyLevel: PrivacyLevel.PRIVATE,
    createdAt: new Date('2026-01-04T11:00:00'),
  },
  {
    id: 'demo-rec-7',
    questionId: 'vb-2',
    categoryId: 'values',
    transcript: `I grew up in a moderately religious household - we went to church on Sundays, celebrated the major holidays. But as I got older, I questioned a lot of what I was taught. I went through an atheist phase in my twenties where I rejected all of it. Now, in my forties, I've found a more nuanced position. I'm not religious in the traditional sense, but I'm deeply spiritual. I believe in something greater than myself. I believe in interconnection - that we're all part of something larger. I meditate daily, which has become a cornerstone of my practice. I believe that treating others with compassion is the closest thing to a universal truth. The golden rule, in whatever form, appears in every major tradition for a reason.`,
    duration: 158,
    privacyLevel: PrivacyLevel.PRIVATE,
    createdAt: new Date('2026-01-05T08:45:00'),
  },

  // Career & Work
  {
    id: 'demo-rec-8',
    questionId: 'cw-1',
    categoryId: 'career',
    transcript: `My career has been anything but linear. I started out studying engineering because my dad thought it was practical. Spent five years at a big manufacturing company, hated every minute of it. Then I took a risk and pivoted to product management at a tech startup. That was terrifying but exhilarating. The startup failed, but I learned more in those two years than in the previous five. That led to my current role leading product at a mid-sized company. The pivotal decision was definitely leaving engineering. Everyone thought I was crazy - I had a stable job, good benefits. But I was dying inside. Sometimes you have to bet on yourself, even when the outcome is uncertain. I've never regretted that leap.`,
    duration: 143,
    privacyLevel: PrivacyLevel.PROFESSIONAL,
    createdAt: new Date('2026-01-05T14:20:00'),
  },
  {
    id: 'demo-rec-9',
    questionId: 'cw-3',
    categoryId: 'career',
    transcript: `My biggest professional failure was the startup I mentioned. I was one of the co-founders. We raised money, built a team, poured everything into it. And it still failed. We ran out of runway before we found product-market fit. I lost a lot of money - my own savings and other people's. That was hard to live with. I felt like a fraud for months afterward. The recovery was slow. I had to separate my identity from the company's outcome. I wasn't a failure; the business failed. There's a difference. What I learned was the importance of timing, of market dynamics, of not falling in love with your own product. I also learned that I could survive my worst fear coming true. That's oddly liberating.`,
    duration: 156,
    privacyLevel: PrivacyLevel.PROFESSIONAL,
    createdAt: new Date('2026-01-06T10:00:00'),
  },

  // Dreams & Aspirations
  {
    id: 'demo-rec-10',
    questionId: 'da-1',
    categoryId: 'dreams',
    transcript: `In the next ten years, I want to achieve financial independence. Not to stop working, but to work because I choose to, not because I have to. I want the freedom to pursue projects that matter to me without worrying about money. Beyond that, I want to write a book. I've been journaling for years, and I think there's something there worth sharing. Something about reinvention in midlife, about finding yourself after you've lost yourself. I also want to be a better father. My kids are teenagers now, and these years feel precious. I want to be present for them in a way my father couldn't be for me. Not because he didn't want to, but because circumstances didn't allow it.`,
    duration: 148,
    privacyLevel: PrivacyLevel.PRIVATE,
    createdAt: new Date('2026-01-06T16:30:00'),
  },
  {
    id: 'demo-rec-11',
    questionId: 'da-3',
    categoryId: 'dreams',
    transcript: `How do I want to be remembered? That's a big question. I think... I want to be remembered as someone who was genuinely kind. Not performatively kind, but authentically caring about others. I want my kids to remember a father who was present, who listened, who supported their dreams even when they were different from mine. I want the people I worked with to remember someone who treated them with respect and helped them grow. I don't need to be remembered as successful in the traditional sense. I'd rather be remembered as someone who made the people around them feel valued. That's the legacy that matters to me.`,
    duration: 128,
    privacyLevel: PrivacyLevel.FAMILY,
    createdAt: new Date('2026-01-07T09:15:00'),
  },

  // Fears & Challenges
  {
    id: 'demo-rec-12',
    questionId: 'fc-1',
    categoryId: 'fears',
    transcript: `What am I most afraid of? Honestly, it's ending up alone. Not in the sense of not having a partner, but in the sense of losing connection with the people I love. My relationship with my dad was so distant when I was young, and I see how that pattern tries to repeat itself. I sometimes withdraw when things get hard. I retreat into work or solitude. It's a defense mechanism, but it creates the very thing I fear. The fear comes from those childhood experiences, I think. From watching my mom look out that window with loneliness in her eyes. I don't want that to be me. I'm learning to fight that instinct, to reach out instead of pulling back.`,
    duration: 139,
    privacyLevel: PrivacyLevel.PRIVATE,
    createdAt: new Date('2026-01-07T11:45:00'),
  },
  {
    id: 'demo-rec-13',
    questionId: 'fc-2',
    categoryId: 'fears',
    transcript: `The most difficult period of my life was definitely my divorce. It wasn't just the end of my marriage - it was an identity crisis. I didn't know who I was outside of being a husband and father in that particular configuration. For about six months, I was in a really dark place. I wasn't eating well, wasn't sleeping. I questioned everything about myself. How I got through it... therapy, mostly. Having someone neutral to talk to was invaluable. Also, running. I started running during that time as a way to process emotions. And my mom - calling her every day, sometimes just to hear her voice. The experience taught me that I'm more resilient than I thought. That I can survive things that feel unsurvivable.`,
    duration: 163,
    privacyLevel: PrivacyLevel.PRIVATE,
    createdAt: new Date('2026-01-08T14:00:00'),
  },

  // Strengths & Skills
  {
    id: 'demo-rec-14',
    questionId: 'ss-1',
    categoryId: 'strengths',
    transcript: `My greatest strengths are empathy, strategic thinking, and the ability to stay calm under pressure. The empathy comes naturally - I've always been able to sense what others are feeling. Sometimes too much, honestly. It can be overwhelming. The strategic thinking I developed through my career in product management. You have to see the big picture while managing the details. And staying calm under pressure - that's something I cultivated through experience. When the startup was failing, when my marriage was ending, I discovered I could function even when everything felt like it was falling apart. I'm not sure if that's a strength or just survival, but it's served me well.`,
    duration: 137,
    privacyLevel: PrivacyLevel.PRIVATE,
    createdAt: new Date('2026-01-08T16:20:00'),
  },

  // Health & Wellness
  {
    id: 'demo-rec-15',
    questionId: 'hw-2',
    categoryId: 'health',
    transcript: `Mental health has been a journey. In my twenties and early thirties, I didn't even acknowledge that mental health was a thing. I thought you just pushed through. Then the divorce happened and I couldn't push through anymore. I started therapy for the first time at 38. It was revelatory. I learned about attachment styles, about how my childhood shaped my adult patterns. I learned that I have anxious-avoidant tendencies - I crave connection but sabotage it by withdrawing. Now I see a therapist monthly, more often when things are hard. I meditate daily. I run three times a week. These aren't luxuries - they're necessities for me to function well. I wish I had started earlier, but I'm grateful I started at all.`,
    duration: 152,
    privacyLevel: PrivacyLevel.PRIVATE,
    createdAt: new Date('2026-01-09T10:30:00'),
  },

  // Legacy & Impact
  {
    id: 'demo-rec-16',
    questionId: 'li-3',
    categoryId: 'legacy',
    transcript: `The wisdom I'd most want to pass on to future generations - to my kids, specifically - is this: You are not your achievements. Your worth isn't measured by your job title or your bank account or even your relationships. You have inherent worth just by existing. I spent so many years tying my identity to external things, and it led to suffering. When the startup failed, when my marriage ended, I felt worthless because I had defined myself by those things. Learn earlier than I did that you are enough, exactly as you are. Also: kindness costs nothing but means everything. That's grandmother's wisdom, still true.`,
    duration: 131,
    privacyLevel: PrivacyLevel.FAMILY,
    createdAt: new Date('2026-01-10T09:00:00'),
  },
];

// ============================================================
// DEMO PATTERNS - AI-discovered insights from the recordings
// ============================================================

export interface DemoPattern {
  id: string;
  type: PatternType;
  title: string;
  description: string;
  evidence: string[];
  significance: number;
  recommendation?: string;
  createdAt: Date;
}

export const DEMO_PATTERNS: DemoPattern[] = [
  {
    id: 'demo-pattern-1',
    type: 'recurring-theme',
    title: 'Kindness as Core Identity',
    description: 'Across multiple responses about values, legacy, and relationships, kindness emerges as a central, defining value. This is traced directly to your grandmother\'s influence and appears to be deeply internalized.',
    evidence: [
      '"Kindness costs nothing but means everything" - quoted multiple times',
      'Legacy answer: wanting to be remembered as "genuinely kind"',
      'Values: kindness listed as one of three core values',
    ],
    significance: 0.95,
    recommendation: 'How are you actively practicing kindness toward yourself, not just others?',
    createdAt: new Date('2026-01-10T12:00:00'),
  },
  {
    id: 'demo-pattern-2',
    type: 'contradiction',
    title: 'Connection vs. Withdrawal',
    description: 'You express a deep fear of ending up alone and a strong desire for connection. Yet you also describe a pattern of withdrawing when things get difficult. This tension appears in discussions of your marriage, your relationship with your father, and your general coping style.',
    evidence: [
      'Fears: "I sometimes withdraw when things get hard"',
      'Marriage reflection: "I tend to withdraw instead of leaning in"',
      'Fears: "It creates the very thing I fear"',
    ],
    significance: 0.92,
    recommendation: 'What would it look like to "lean in" during your next difficult moment, even just slightly?',
    createdAt: new Date('2026-01-10T12:00:00'),
  },
  {
    id: 'demo-pattern-3',
    type: 'strength',
    title: 'Resilience Through Crisis',
    description: 'Multiple experiences of significant challenge - failed startup, divorce, career pivot - demonstrate a strong capacity for resilience and reinvention. You consistently describe surviving and learning from "unsurvivable" situations.',
    evidence: [
      'Startup failure: "I learned that I could survive my worst fear coming true"',
      'Divorce: "I\'m more resilient than I thought"',
      'Career: "Sometimes you have to bet on yourself"',
    ],
    significance: 0.88,
    recommendation: 'This resilience is a core strength. How might you use it to take a new risk?',
    createdAt: new Date('2026-01-10T12:00:00'),
  },
  {
    id: 'demo-pattern-4',
    type: 'growth-area',
    title: 'Self-Worth Tied to External Validation',
    description: 'Despite intellectual awareness, there\'s a pattern of defining self-worth through achievements, relationships, or roles. The divorce and startup failure both triggered identity crises because of this connection.',
    evidence: [
      'Legacy: "You are not your achievements... I spent so many years tying my identity to external things"',
      'Divorce: "I didn\'t know who I was outside of being a husband and father"',
      'Startup: "I felt like a fraud for months"',
    ],
    significance: 0.85,
    recommendation: 'Practice completing the sentence "I am..." without reference to roles, achievements, or relationships.',
    createdAt: new Date('2026-01-10T12:00:00'),
  },
  {
    id: 'demo-pattern-5',
    type: 'recurring-theme',
    title: 'Generational Healing',
    description: 'There\'s a consistent theme of wanting to break patterns from your parents\' generation - being more present than your father, more expressive than your family of origin, more connected than your mother.',
    evidence: [
      'Dreams: "I want to be present for them in a way my father couldn\'t be for me"',
      'Family dynamics: "We didn\'t talk about feelings much. That\'s something I\'ve had to learn"',
      'Parent relationship: "I truly understood him... He was doing his best"',
    ],
    significance: 0.82,
    recommendation: 'How are you actively modeling emotional expressiveness for your children?',
    createdAt: new Date('2026-01-10T12:00:00'),
  },
  {
    id: 'demo-pattern-6',
    type: 'blind-spot',
    title: 'Delayed Self-Care',
    description: 'Mental health practices and self-care were described as starting late - therapy at 38, meditation after the divorce. There\'s a pattern of waiting for crisis before prioritizing wellbeing.',
    evidence: [
      'Mental health: "I wish I had started earlier, but I\'m grateful I started at all"',
      'Twenties: "I didn\'t even acknowledge that mental health was a thing"',
      'Divorce: "Then I couldn\'t push through anymore"',
    ],
    significance: 0.75,
    recommendation: 'What\'s one self-care practice you\'ve been putting off that you could start today?',
    createdAt: new Date('2026-01-10T12:00:00'),
  },
];

// ============================================================
// DEMO INSIGHTS - Higher-level synthesis from patterns
// ============================================================

export interface DemoInsight {
  id: string;
  title: string;
  content: string;
  category: 'life-theme' | 'superpower' | 'growth-opportunity' | 'contradiction';
  actionable: boolean;
  actions?: string[];
  createdAt: Date;
}

export const DEMO_INSIGHTS: DemoInsight[] = [
  {
    id: 'demo-insight-1',
    title: 'Your Life Theme: The Reluctant Connector',
    content: 'Your essence is someone who deeply values connection and kindness, but who has learned to protect themselves through withdrawal. You are on a journey to reconcile these parts - to connect openly without the fear that drove you to isolate. Your grandmother\'s legacy of kindness lives in you; your task is to extend that kindness inward.',
    category: 'life-theme',
    actionable: false,
    createdAt: new Date('2026-01-10T12:00:00'),
  },
  {
    id: 'demo-insight-2',
    title: 'Your Superpower: Crisis Navigation',
    content: 'You have demonstrated an exceptional ability to navigate crisis and emerge transformed. Failed startup, divorce, career pivot - each challenged your identity and each led to growth. This resilience is not just survival; it\'s a capacity for reinvention that few possess.',
    category: 'superpower',
    actionable: true,
    actions: [
      'Identify one area of your life that feels "stuck" and apply your reinvention capacity',
      'Share your crisis-navigation stories with others who are struggling - your experience is valuable',
    ],
    createdAt: new Date('2026-01-10T12:00:00'),
  },
  {
    id: 'demo-insight-3',
    title: 'Growth Opportunity: Proactive Self-Care',
    content: 'You\'ve learned valuable self-care practices, but typically only after crisis forced you to. The opportunity is to become proactive about your wellbeing - to treat therapy, meditation, and connection as daily vitamins rather than emergency medicine.',
    category: 'growth-opportunity',
    actionable: true,
    actions: [
      'Schedule a "preventive" therapy session even when things are good',
      'Create a daily non-negotiable self-care routine before stress builds',
    ],
    createdAt: new Date('2026-01-10T12:00:00'),
  },
  {
    id: 'demo-insight-4',
    title: 'Core Tension: Autonomy vs. Connection',
    content: 'There\'s a deep tension between your need for independence/solitude and your desire for deep connection. This isn\'t a problem to be solved but a polarity to be managed. Both needs are valid; the question is how to honor both without one dominating.',
    category: 'contradiction',
    actionable: true,
    actions: [
      'Experiment with scheduled solitude that doesn\'t create distance (e.g., "I need an hour alone, let\'s reconnect at 7pm")',
      'Practice naming your need in the moment: "I\'m feeling the pull to withdraw. Can you help me stay?"',
    ],
    createdAt: new Date('2026-01-10T12:00:00'),
  },
];

// ============================================================
// DEMO STATS - For dashboard display
// ============================================================

export const DEMO_STATS = {
  totalRecordingTime: 2341, // seconds (~39 minutes)
  answeredQuestionIds: [
    'el-1', 'el-2', 'el-3',
    'fr-1', 'fr-3',
    'vb-1', 'vb-2',
    'cw-1', 'cw-3',
    'da-1', 'da-3',
    'fc-1', 'fc-2',
    'ss-1',
    'hw-2',
    'li-3',
  ],
};

// ============================================================
// DEMO JOURNAL ENTRIES - Daily diary entries
// ============================================================

export interface DemoJournalEntry {
  id: string;
  date: Date;
  content: string;
  mood: 'great' | 'good' | 'okay' | 'low' | 'bad';
  energyLevel: number;
  mediaType: 'text' | 'voice';
  duration?: number;
  tags: string[];
}

export const DEMO_JOURNAL_ENTRIES: DemoJournalEntry[] = [
  {
    id: 'demo-journal-1',
    date: new Date('2026-01-10'),
    content: "Had a breakthrough in therapy today. We talked about my tendency to withdraw and I finally connected it to watching my dad be emotionally absent. It's not just about the divorce - it's a pattern that goes way back. Felt both sad and relieved to see it so clearly. Going to try to notice when I'm pulling away this week.",
    mood: 'okay',
    energyLevel: 3,
    mediaType: 'text',
    tags: ['therapy', 'insight', 'family'],
  },
  {
    id: 'demo-journal-2',
    date: new Date('2026-01-09'),
    content: "Great morning run - 5 miles, clear head. Work was busy but manageable. Had dinner with the kids and actually stayed present instead of checking my phone. Small wins. Noticed I wanted to retreat after a stressful meeting but called Sarah instead. Progress.",
    mood: 'good',
    energyLevel: 4,
    mediaType: 'text',
    tags: ['exercise', 'family', 'progress'],
  },
  {
    id: 'demo-journal-3',
    date: new Date('2026-01-08'),
    content: "Rough day. Didn't sleep well, work was overwhelming, snapped at Jake over something small. Made up for it later but felt guilty. Need to be more mindful when I'm running on empty. Skipped meditation this morning and I could feel the difference all day.",
    mood: 'low',
    energyLevel: 2,
    mediaType: 'text',
    tags: ['stress', 'parenting', 'sleep'],
  },
  {
    id: 'demo-journal-4',
    date: new Date('2026-01-07'),
    content: "Sunday family dinner at mom's. She seemed more tired than usual. Made a mental note to call her more often during the week. Dad told a story I'd never heard about his own father. Strange to see him as someone who also had a complicated relationship with his dad. Generational stuff runs deep.",
    mood: 'good',
    energyLevel: 3,
    mediaType: 'text',
    tags: ['family', 'parents', 'reflection'],
  },
  {
    id: 'demo-journal-5',
    date: new Date('2026-01-06'),
    content: "Finished reading that book on attachment styles. So much of it hit home. Seeing my patterns in black and white was uncomfortable but necessary. Started journaling about my earliest memories of feeling safe vs. unsafe. Want to share some of this with my therapist next week.",
    mood: 'okay',
    energyLevel: 3,
    mediaType: 'text',
    tags: ['reading', 'self-development', 'therapy'],
  },
  {
    id: 'demo-journal-6',
    date: new Date('2026-01-05'),
    content: "Work presentation went really well. Got good feedback from the leadership team. Noticed I immediately downplayed it in my head - 'anyone could have done that.' Trying to practice accepting compliments. I did work hard on it. It's okay to feel proud.",
    mood: 'great',
    energyLevel: 4,
    mediaType: 'text',
    tags: ['work', 'achievement', 'self-worth'],
  },
  {
    id: 'demo-journal-7',
    date: new Date('2026-01-04'),
    content: "Quiet day. Spent the afternoon reading and napping. Felt a little guilty about not being productive, but also reminded myself that rest is productive. Called an old friend I hadn't talked to in months. Good conversation about nothing in particular. Sometimes those are the best.",
    mood: 'good',
    energyLevel: 4,
    mediaType: 'text',
    tags: ['rest', 'friendship', 'self-care'],
  },
];
