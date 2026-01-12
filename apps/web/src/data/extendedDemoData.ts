/**
 * Extended Demo Data - Rich, immersive life story content
 * 
 * This extends the base demo data with:
 * - 35+ additional recordings across ALL categories
 * - 25+ additional journal entries covering weeks
 * - Life milestones and family stories
 * - Deeper patterns and insights
 */

import { PrivacyLevel } from '@lcc/types';
import { 
  DemoRecording, 
  DemoPattern, 
  DemoJournalEntry,
  DemoInsight 
} from './demoData';

// ============================================================
// EXTENDED RECORDINGS - Deep dive into all life areas
// ============================================================

export const EXTENDED_RECORDINGS: DemoRecording[] = [
  // More Early Life
  {
    id: 'demo-rec-ext-1',
    questionId: 'el-4',
    categoryId: 'early-life',
    transcript: `My first day of school - I remember it so vividly. My mom had bought me this red backpack with a dinosaur on it. I was terrified. I held onto her leg and wouldn't let go. The teacher, Mrs. Patterson, eventually coaxed me in with cookies. I remember looking back and seeing my mom crying through the window. Years later she told me that was one of the hardest days of her life. It's funny how these moments that feel so small become defining memories. That day I learned that new things are scary but often turn out okay.`,
    duration: 98,
    privacyLevel: PrivacyLevel.FAMILY,
    createdAt: new Date('2026-01-10T11:00:00'),
  },

  // Education & Learning
  {
    id: 'demo-rec-ext-2',
    questionId: 'edu-1',
    categoryId: 'education',
    transcript: `My education journey was shaped by one teacher - Mr. Hernandez in 10th grade. He taught history but really he taught us how to think critically. He'd say 'Question everything, including what I tell you.' He saw something in me and pushed me to apply for the honors program. Without him, I never would have gone to college. I was the first in my family. He came to my graduation. I still email him sometimes. One person can change the trajectory of a life.`,
    duration: 112,
    privacyLevel: PrivacyLevel.FAMILY,
    createdAt: new Date('2026-01-10T11:30:00'),
  },
  {
    id: 'demo-rec-ext-3',
    questionId: 'edu-2',
    categoryId: 'education',
    transcript: `College was transformative but also disorienting. I came from a small town and suddenly I was at this big university with people from everywhere. I felt like a fraud - imposter syndrome before I knew what that was. I almost dropped out freshman year. What saved me was finding my people - other first-gen students who understood the cultural whiplash. We formed this study group that became a support group. Some of them are still my closest friends.`,
    duration: 105,
    privacyLevel: PrivacyLevel.FAMILY,
    createdAt: new Date('2026-01-10T12:00:00'),
  },

  // Hobbies & Interests
  {
    id: 'demo-rec-ext-4',
    questionId: 'hi-1',
    categoryId: 'hobbies',
    transcript: `Photography became my hobby during the divorce. I needed something that wasn't work, wasn't family drama. I bought a cheap camera and started wandering around the city on weekends. There's something meditative about looking for beautiful light, interesting angles. It taught me to see differently. Now I shoot mostly portraits. I love capturing people in candid moments when they forget they're being photographed. That's when you see the real person.`,
    duration: 95,
    privacyLevel: PrivacyLevel.FRIENDS,
    createdAt: new Date('2026-01-10T13:00:00'),
  },
  {
    id: 'demo-rec-ext-5',
    questionId: 'hi-2',
    categoryId: 'hobbies',
    transcript: `I cook as a form of therapy. My grandmother taught me the basics - her recipes from the old country. Sunday sauce that simmers for hours. Dumplings wrapped by hand. When I cook her recipes, I feel connected to her even though she's been gone for thirty years. I taught my kids some of them. The tradition continues. Food is memory. Food is love made edible. The kitchen is where I process the world.`,
    duration: 88,
    privacyLevel: PrivacyLevel.FAMILY,
    createdAt: new Date('2026-01-10T14:00:00'),
  },

  // Accomplishments
  {
    id: 'demo-rec-ext-6',
    questionId: 'ac-1',
    categoryId: 'accomplishments',
    transcript: `My proudest accomplishment isn't professional - it's personal. It was showing up for my kids consistently after the divorce. There were days I could barely function, but I made their soccer games, their school plays, their parent-teacher conferences. I never let my internal struggle become their burden. Looking back, I don't know how I did it. But both kids have told me they always felt loved and supported. That matters more than any career achievement.`,
    duration: 102,
    privacyLevel: PrivacyLevel.FAMILY,
    createdAt: new Date('2026-01-10T15:00:00'),
  },
  {
    id: 'demo-rec-ext-7',
    questionId: 'ac-2',
    categoryId: 'accomplishments',
    transcript: `Running my first marathon at 42 was significant. Not because of the time - it was slow. But because three years earlier I could barely run a mile. I had this mindset that I wasn't 'athletic' because I was never picked for sports teams as a kid. Running taught me that identity isn't fixed. You can become someone different at any age. Crossing that finish line, I cried. Not from exhaustion but from realizing I had overcome a story I'd been telling myself for decades.`,
    duration: 110,
    privacyLevel: PrivacyLevel.FRIENDS,
    createdAt: new Date('2026-01-10T15:30:00'),
  },

  // Regrets & Lessons
  {
    id: 'demo-rec-ext-8',
    questionId: 'rl-1',
    categoryId: 'regrets',
    transcript: `I regret not spending more time with my grandmother before she died. I was eleven, too young to understand mortality. But I also had this teenage-approaching indifference that makes me cringe now. I chose video games over sitting with her. She was there, in the next room, for five years, and I didn't truly appreciate her presence. She's been gone longer than she was alive in my memory. The lesson: presence matters more than presents. Be there for the people who matter while you can.`,
    duration: 115,
    privacyLevel: PrivacyLevel.PRIVATE,
    createdAt: new Date('2026-01-11T09:00:00'),
  },
  {
    id: 'demo-rec-ext-9',
    questionId: 'rl-2',
    categoryId: 'regrets',
    transcript: `I regret staying in my unhappy marriage as long as I did. We both knew it wasn't working for years before we admitted it. We stayed 'for the kids' but that's a lie we tell ourselves. Kids know when their parents are miserable. They absorb that tension. If I could go back, I would have had the hard conversation sooner. We wasted years that could have been spent healing and finding genuine happiness. Sometimes loving someone means letting them go.`,
    duration: 108,
    privacyLevel: PrivacyLevel.PRIVATE,
    createdAt: new Date('2026-01-11T09:30:00'),
  },

  // Philosophy & Worldview
  {
    id: 'demo-rec-ext-10',
    questionId: 'pw-1',
    categoryId: 'philosophy',
    transcript: `I believe we're all connected - that what I do affects others in ways I can't see. It's not magic, it's just... ripples. A kindness I show today might be passed on by the recipient. A cruelty might do the same. This makes me take my actions seriously. I also believe that meaning isn't found, it's made. We create our purpose through our choices. There's no cosmic to-do list with our names on it. That's terrifying and liberating at the same time.`,
    duration: 95,
    privacyLevel: PrivacyLevel.PRIVATE,
    createdAt: new Date('2026-01-11T10:00:00'),
  },
  {
    id: 'demo-rec-ext-11',
    questionId: 'pw-2',
    categoryId: 'philosophy',
    transcript: `Death doesn't scare me as much as it used to. What scares me is not living fully before it arrives. I saw my grandmother die peacefully because she had no unfinished business. She had said what needed to be said, loved who she loved openly. That's what I'm working toward. I want to die with nothing left unsaid. That's why I started this life documentation project. I want my kids to know who I was, really was, not just the highlight reel.`,
    duration: 103,
    privacyLevel: PrivacyLevel.FAMILY,
    createdAt: new Date('2026-01-11T10:30:00'),
  },

  // More Family
  {
    id: 'demo-rec-ext-12',
    questionId: 'fr-2',
    categoryId: 'family',
    transcript: `My sister Emily and I weren't close growing up. She's five years younger, so we were in different worlds. But after our parents got sick - first Dad's heart attack, then Mom's cancer scare - we became each other's support system. We call each other every few days now. She knows things about me that no one else does. Sometimes the people you think you don't have much in common with become your closest allies. We're the only ones who share that childhood.`,
    duration: 99,
    privacyLevel: PrivacyLevel.FAMILY,
    createdAt: new Date('2026-01-11T11:00:00'),
  },
  {
    id: 'demo-rec-ext-13',
    questionId: 'fr-4',
    categoryId: 'family',
    transcript: `My daughter Emma is sixteen now. We butt heads constantly - she's stubborn like me. But underneath it, we have this deep connection. She comes to my room at midnight sometimes just to talk. Tells me things I don't think she tells her mom. I treasure those conversations. My son Jake is fourteen, quieter. He shows love through actions - making me coffee in the morning, remembering details I mentioned weeks ago. They're so different, and I love them with an intensity that sometimes overwhelms me.`,
    duration: 107,
    privacyLevel: PrivacyLevel.FAMILY,
    createdAt: new Date('2026-01-11T11:30:00'),
  },

  // Career depth
  {
    id: 'demo-rec-ext-14',
    questionId: 'cw-2',
    categoryId: 'career',
    transcript: `My management style was shaped by the worst boss I ever had - by doing the opposite. He micromanaged, took credit, threw people under the bus. I swore I'd never be like that. Now I try to clear the path for my team to do their best work, give credit publicly, take blame privately. It's not always easy - there's pressure from above to be more controlling. But I've seen the results. People stay longer, work harder, are more creative when they feel trusted. The old command-and-control model is dying.`,
    duration: 115,
    privacyLevel: PrivacyLevel.PROFESSIONAL,
    createdAt: new Date('2026-01-11T12:00:00'),
  },
  {
    id: 'demo-rec-ext-15',
    questionId: 'cw-4',
    categoryId: 'career',
    transcript: `My relationship with money is complicated. Growing up we didn't have much. I remembered my parents fighting about bills. That gave me this scarcity mindset that took years to unlearn. Even when I earned good money, I saved obsessively and felt guilty spending on anything 'unnecessary.' Therapy helped me realize that experiences aren't unnecessary. Time with family isn't luxury. I'm still frugal but now I can enjoy what I've earned without guilt.`,
    duration: 95,
    privacyLevel: PrivacyLevel.PRIVATE,
    createdAt: new Date('2026-01-11T12:30:00'),
  },

  // Health depth
  {
    id: 'demo-rec-ext-16',
    questionId: 'hw-1',
    categoryId: 'health',
    transcript: `My physical health is better now than in my twenties. Back then I ate terribly, never exercised, worked insane hours. Now I run, I do yoga, I eat mostly plants. The catalyst was turning 40 and getting a scary blood pressure reading. The doctor said 'change your lifestyle or change your will.' That was a wake-up call. It's not about vanity or even longevity. It's about having energy to be present for the people I love. My body is a vehicle for love. I need to maintain it.`,
    duration: 108,
    privacyLevel: PrivacyLevel.PRIVATE,
    createdAt: new Date('2026-01-11T13:00:00'),
  },
  {
    id: 'demo-rec-ext-17',
    questionId: 'hw-3',
    categoryId: 'health',
    transcript: `Sleep was the game-changer nobody talks about. For years I wore sleep deprivation as a badge of honor. 'I'll sleep when I'm dead.' Then I read the research about what sleep deprivation actually does - to memory, mood, health, relationships. Now I protect my eight hours like a sacred ritual. No screens after 9pm. Same bedtime every night. The transformation was dramatic. I'm sharper, calmer, kinder when I'm well-rested. Should have learned this decades ago.`,
    duration: 98,
    privacyLevel: PrivacyLevel.PRIVATE,
    createdAt: new Date('2026-01-11T13:30:00'),
  },

  // Strengths & Skills expansion
  {
    id: 'demo-rec-ext-18',
    questionId: 'ss-2',
    categoryId: 'strengths',
    transcript: `I'm good at translating between different groups. In meetings, I notice when engineers and salespeople are talking past each other. I can rephrase what Chris said in a way that Maria understands, and vice versa. This came from growing up as a translator - literally. My grandmother didn't speak much English, so I translated for her at the grocery store, at doctor's appointments. That made me attentive to how people's meanings get lost in their words.`,
    duration: 102,
    privacyLevel: PrivacyLevel.PROFESSIONAL,
    createdAt: new Date('2026-01-11T14:00:00'),
  },
  {
    id: 'demo-rec-ext-19',
    questionId: 'ss-3',
    categoryId: 'strengths',
    transcript: `Writing is my secret superpower. I'm not a novelist, but I can write clearly. Emails that get action. Documents that change minds. This skill came from loving reading since childhood. I absorbed sentence structures, rhythms, what makes writing flow. In the workplace, clear writing is rare and valuable. I've seen careers stall because someone couldn't communicate their ideas. And I've seen mediocre ideas succeed because they were presented brilliantly.`,
    duration: 95,
    privacyLevel: PrivacyLevel.PROFESSIONAL,
    createdAt: new Date('2026-01-11T14:30:00'),
  },

  // Weaknesses & Growth depth
  {
    id: 'demo-rec-ext-20',
    questionId: 'wg-1',
    categoryId: 'weaknesses',
    transcript: `Perfectionism is my biggest weakness disguised as a strength. I spend too long on things that are good enough. I rewrite emails fifteen times. I stress about presentation decks that nobody remembers five minutes later. This comes from childhood - feeling like I had to prove I belonged because I was different from my peers. I'm working on it. Learning that 'done' is often better than 'perfect.' Progress is public; perfection is a prison.`,
    duration: 92,
    privacyLevel: PrivacyLevel.PRIVATE,
    createdAt: new Date('2026-01-11T15:00:00'),
  },
  {
    id: 'demo-rec-ext-21',
    questionId: 'wg-2',
    categoryId: 'weaknesses',
    transcript: `I struggle with asking for help. I'd rather figure everything out myself, even when help is available. This goes back to being the oldest child, to being the 'responsible one.' Also to not wanting to burden people. But this is a form of pride, isn't it? Assuming I have to do everything alone. Denying others the joy of helping me. It keeps me isolated when I don't have to be. My therapist calls it 'pathological independence.' I'm learning to say 'I need help' without shame.`,
    duration: 105,
    privacyLevel: PrivacyLevel.PRIVATE,
    createdAt: new Date('2026-01-11T15:30:00'),
  },

  // Dreams deeper
  {
    id: 'demo-rec-ext-22',
    questionId: 'da-2',
    categoryId: 'dreams',
    transcript: `I dream about owning a little cabin somewhere with a view. Mountains, maybe a lake. A place off-grid where I could unplug completely. I'd spend my mornings writing, afternoons hiking or gardening. It's not about escape - it's about simplicity. My life has been so complex, so driven. I fantasize about a chapter of radical simplicity. Maybe after the kids are grown. A place to just... be. Without the constant doing.`,
    duration: 88,
    privacyLevel: PrivacyLevel.PRIVATE,
    createdAt: new Date('2026-01-11T16:00:00'),
  },
  {
    id: 'demo-rec-ext-23',
    questionId: 'da-4',
    categoryId: 'dreams',
    transcript: `I want to become a better listener. Truly. Not the performative listening where you're planning your response while they're talking. Deep listening. Present listening. My grandfather had this quality - when you talked to him, you felt like the most important person in the world. I want to give that gift to people. To my kids especially. It's a dream that's also a practice. Every conversation is an opportunity. But I fail more than I succeed.`,
    duration: 95,
    privacyLevel: PrivacyLevel.FAMILY,
    createdAt: new Date('2026-01-11T16:30:00'),
  },

  // Fears deeper
  {
    id: 'demo-rec-ext-24',
    questionId: 'fc-3',
    categoryId: 'fears',
    transcript: `I fear becoming my father - not in the bad ways, but in the absent ways. Being physically present but emotionally somewhere else. I catch myself doing it. Sitting with my kids but thinking about work. Looking at my phone when they're talking. Each time I notice it, I feel shame. And fear. Because I know how it felt to be on the receiving end. Breaking generational patterns is daily work. You don't overcome it once; you overcome it every moment.`,
    duration: 100,
    privacyLevel: PrivacyLevel.PRIVATE,
    createdAt: new Date('2026-01-11T17:00:00'),
  },
  {
    id: 'demo-rec-ext-25',
    questionId: 'fc-4',
    categoryId: 'fears',
    transcript: `I fear irrelevance. Getting old and having nothing to contribute. Becoming one of those people who only talks about the past because they have no present. This fear drives me to keep learning, keep growing, stay curious. Some days I wonder if that's healthy motivation or anxiety dressed up as ambition. Probably both. I try to balance the drive to stay relevant with acceptance of what aging will naturally bring. It's a tension I don't think I'll ever fully resolve.`,
    duration: 103,
    privacyLevel: PrivacyLevel.PRIVATE,
    createdAt: new Date('2026-01-11T17:30:00'),
  },

  // Legacy deep
  {
    id: 'demo-rec-ext-26',
    questionId: 'li-1',
    categoryId: 'legacy',
    transcript: `The impact I most want to have is on my children. I want them to feel deeply loved and to know how to love themselves. That's it. Everything else - career, achievements, possessions - fades. But if my kids grow into adults who treat themselves kindly, who can form healthy relationships, who know their worth... that's a successful life. I'm their foundation. I take that responsibility seriously. Most days. Some days I just wing it and hope for the best.`,
    duration: 97,
    privacyLevel: PrivacyLevel.FAMILY,
    createdAt: new Date('2026-01-11T18:00:00'),
  },
  {
    id: 'demo-rec-ext-27',
    questionId: 'li-2',
    categoryId: 'legacy',
    transcript: `I want to be an example that reinvention is possible. So many people feel stuck - in careers, in relationships, in identities that no longer fit. I was stuck too. But I got unstuck. Career pivot at 35, divorce at 40, finding genuine happiness at 45. If my story can show one person that it's not too late to change, to grow, to start over... that's legacy enough. You're never stuck. The door may be hard to open, but it's never locked.`,
    duration: 102,
    privacyLevel: PrivacyLevel.FAMILY,
    createdAt: new Date('2026-01-11T18:30:00'),
  },
];

// ============================================================
// EXTENDED JOURNAL ENTRIES - Three more weeks of daily life
// ============================================================

export const EXTENDED_JOURNAL_ENTRIES: DemoJournalEntry[] = [
  // Week 2
  {
    id: 'demo-journal-ext-1',
    date: new Date('2026-01-03'),
    content: "Started recording my life story today. Using this new app. Felt strange talking to myself about my childhood. But also cathartic? I cried twice. Going to try to do one question a day.",
    mood: 'okay',
    energyLevel: 3,
    mediaType: 'text',
    tags: ['life-story', 'new-project'],
  },
  {
    id: 'demo-journal-ext-2',
    date: new Date('2026-01-02'),
    content: "Emma made honor roll. So proud of her. Took her out for ice cream even though it's January. Some moments are worth breaking routine for. She said 'Thanks for showing up, Dad.' That meant everything.",
    mood: 'great',
    energyLevel: 4,
    mediaType: 'text',
    tags: ['parenting', 'emma', 'celebration'],
  },
  {
    id: 'demo-journal-ext-3',
    date: new Date('2026-01-01'),
    content: "New Year's resolutions: 1) Be more present with kids. 2) Meditate daily without exception. 3) Document my life story. 4) Call Mom twice a week not once. 5) Finish the novel I started reading in October. Simple goals, hard execution.",
    mood: 'good',
    energyLevel: 4,
    mediaType: 'text',
    tags: ['resolutions', 'new-year'],
  },
  {
    id: 'demo-journal-ext-4',
    date: new Date('2025-12-31'),
    content: "Last day of the year. Spent the evening at Sarah's. Watched the ball drop with people I love. Felt grateful. Also felt the absence of people no longer here - grandma, my old college roommate Tyler, marriages that ended. Life is addition and subtraction. Mostly I'm in surplus.",
    mood: 'good',
    energyLevel: 3,
    mediaType: 'text',
    tags: ['new-year', 'reflection', 'gratitude'],
  },
  {
    id: 'demo-journal-ext-5',
    date: new Date('2025-12-30'),
    content: "Jake asked me about my divorce today. First time he's really wanted to talk about it. Tried to be honest but age-appropriate. Told him adults sometimes grow in different directions. That love can change. He asked if I was happy now. I said yes, honestly yes. He seemed relieved.",
    mood: 'okay',
    energyLevel: 3,
    mediaType: 'text',
    tags: ['parenting', 'jake', 'divorce'],
  },
  {
    id: 'demo-journal-ext-6',
    date: new Date('2025-12-29'),
    content: "Ran 6 miles in the cold. That runner's high is real. Came home and made grandma's soup. House smelled like my childhood. Pulled out old photo albums and looked at pictures of her. Miss her voice. But felt her presence in the soup, in the kitchen, in carrying forward what she taught me.",
    mood: 'good',
    energyLevel: 4,
    mediaType: 'text',
    tags: ['exercise', 'grandmother', 'cooking'],
  },
  {
    id: 'demo-journal-ext-7',
    date: new Date('2025-12-28'),
    content: "Difficult conversation with my ex about summer schedules. We're civil but there's always an undercurrent of old hurts. Left the call feeling drained. Went for a walk to clear my head. Reminded myself that tension is temporary but being a good co-parent lasts forever. Deep breaths.",
    mood: 'low',
    energyLevel: 2,
    mediaType: 'text',
    tags: ['co-parenting', 'stress'],
  },

  // Week 3
  {
    id: 'demo-journal-ext-8',
    date: new Date('2025-12-27'),
    content: "Lazy day with the kids. Watched movies, made popcorn. I kept looking at them and feeling this fierce love. They're growing so fast. Emma will be driving next year. These lazy days are numbered. I'm soaking them up like sun.",
    mood: 'great',
    energyLevel: 3,
    mediaType: 'text',
    tags: ['family', 'kids', 'presence'],
  },
  {
    id: 'demo-journal-ext-9',
    date: new Date('2025-12-26'),
    content: "Post-Christmas quiet. Cleaned up the wrapping paper. Put away the gifts. There's something melancholy about the day after. The anticipation is over. But also peaceful. Read my new book for hours. Peace is underrated.",
    mood: 'good',
    energyLevel: 3,
    mediaType: 'text',
    tags: ['christmas', 'reading', 'quiet'],
  },
  {
    id: 'demo-journal-ext-10',
    date: new Date('2025-12-25'),
    content: "Christmas morning. The kids' faces when they opened their gifts - still magical even as teenagers. Video called with my parents. Dad actually cried, which never happens. He's getting older. We all are. Tried to be present and grateful for exactly what today was.",
    mood: 'great',
    energyLevel: 4,
    mediaType: 'text',
    tags: ['christmas', 'family', 'gratitude'],
  },
  {
    id: 'demo-journal-ext-11',
    date: new Date('2025-12-24'),
    content: "Christmas Eve prep. Made grandma's cookies with the kids. Emma rolled her eyes at first but by hour two she was laughing and having fun. Jake documented the whole thing on his phone. Tradition continues. These are the memories that matter.",
    mood: 'great',
    energyLevel: 4,
    mediaType: 'text',
    tags: ['christmas', 'traditions', 'baking'],
  },
  {
    id: 'demo-journal-ext-12',
    date: new Date('2025-12-23'),
    content: "Last work day before holiday break. Wrapped up loose ends. Gave my team genuine thank-yous for a hard year. Leadership is relationships, and relationships are attention. Paying attention to what matters - people - before projects. Always.",
    mood: 'good',
    energyLevel: 3,
    mediaType: 'text',
    tags: ['work', 'leadership', 'gratitude'],
  },
  {
    id: 'demo-journal-ext-13',
    date: new Date('2025-12-22'),
    content: "Therapy session before holidays. Talked about the stress of performing 'happy family' at gatherings. How exhausting it can be. Therapist suggested I don't have to perform. I can just... be. Let myself feel what I feel. Revolutionary concept, apparently, for someone raised to keep it together.",
    mood: 'okay',
    energyLevel: 3,
    mediaType: 'text',
    tags: ['therapy', 'holidays', 'authenticity'],
  },
  {
    id: 'demo-journal-ext-14',
    date: new Date('2025-12-21'),
    content: "Winter solstice. Shortest day of the year. Felt appropriate - I've been in a bit of a dark mood. Sometimes you have to just let the darkness be. Tomorrow has one more minute of light. And the next day, another. Forward motion, even when imperceptible.",
    mood: 'low',
    energyLevel: 2,
    mediaType: 'text',
    tags: ['solstice', 'mood', 'reflection'],
  },

  // Week 4
  {
    id: 'demo-journal-ext-15',
    date: new Date('2025-12-20'),
    content: "Amazing dinner with Sarah. We talked for three hours. About everything and nothing. This is what I missed during my marriage - genuine partnership. Someone who's interested in my inner world, and whose inner world I want to explore. Love is curiosity that never ends.",
    mood: 'great',
    energyLevel: 4,
    mediaType: 'text',
    tags: ['relationship', 'sarah', 'connection'],
  },
  {
    id: 'demo-journal-ext-16',
    date: new Date('2025-12-19'),
    content: "Jake's basketball game. They lost but he played his heart out. Sat with the other parents and felt like I belonged, for once. Used to feel like an outsider at these things - the divorced dad, the one who missed the early years because of work. But I'm here now. That's what matters.",
    mood: 'good',
    energyLevel: 3,
    mediaType: 'text',
    tags: ['jake', 'basketball', 'parenting'],
  },
  {
    id: 'demo-journal-ext-17',
    date: new Date('2025-12-18'),
    content: "Caught myself catastrophizing about a work problem. Stopped midthought. Asked 'Is this actually a crisis or am I making it one?' It wasn't. Solved it in an hour. So much of my stress is manufactured. The cognitive patterns are sticky but I'm getting better at noticing them.",
    mood: 'okay',
    energyLevel: 3,
    mediaType: 'text',
    tags: ['work', 'anxiety', 'mindfulness'],
  },
  {
    id: 'demo-journal-ext-18',
    date: new Date('2025-12-17'),
    content: "Skipped the run. Skipped meditation. Worked 12 hours. Realized at 10pm I hadn't eaten since breakfast. This is the old pattern. When stress rises, self-care plummets. I see it happening but can't always stop it. Tomorrow I reset. No excuses.",
    mood: 'low',
    energyLevel: 2,
    mediaType: 'text',
    tags: ['stress', 'self-care', 'work'],
  },
  {
    id: 'demo-journal-ext-19',
    date: new Date('2025-12-16'),
    content: "Helped Emma with college application essays. She writes beautifully. Better than I did at her age. Reading about her hopes and fears reminded me of my own at 17. We're so similar in some ways. Also so different. She has confidence I didn't have. I'm proud of who she's becoming.",
    mood: 'good',
    energyLevel: 4,
    mediaType: 'text',
    tags: ['emma', 'college', 'parenting'],
  },
  {
    id: 'demo-journal-ext-20',
    date: new Date('2025-12-15'),
    content: "Called Dad for no reason. Just to talk. We talked about the weather, sports, nothing important. But it was important. Underneath the small talk was love. I could hear him smiling. These calls might not seem like much but they're everything. He won't be here forever.",
    mood: 'good',
    energyLevel: 3,
    mediaType: 'text',
    tags: ['dad', 'family', 'connection'],
  },
];

// ============================================================
// EXTENDED PATTERNS - Deeper insights
// ============================================================

export const EXTENDED_PATTERNS: DemoPattern[] = [
  {
    id: 'demo-pattern-ext-1',
    type: 'recurring-theme',
    title: 'The Translator Identity',
    description: 'From childhood translating for your grandmother, to mediating between parents, to bridging communication gaps at work - you have a consistent pattern of being the translator between different worlds. This is both a strength and a potential burden.',
    evidence: [
      'Translating for grandmother at stores and doctors',
      'Work skill: "translating between engineers and salespeople"',
      'Family role: eldest child as emotional bridge',
    ],
    significance: 0.88,
    recommendation: 'Are you translating for others at the expense of speaking your own language?',
    createdAt: new Date('2026-01-11T20:00:00'),
  },
  {
    id: 'demo-pattern-ext-2',
    type: 'growth-area',
    title: 'Patience with Self',
    description: 'You extend tremendous patience and empathy to others but apply perfectionism and impatience to yourself. There is a gap between how you treat the people you love and how you treat yourself.',
    evidence: [
      '"I rewrite emails fifteen times"',
      'Guilt about non-productive time: "felt guilty about not being productive"',
      'Immediate self-criticism when patterns repeat despite knowing better',
    ],
    significance: 0.86,
    recommendation: 'Practice speaking to yourself as you would to a beloved friend.',
    createdAt: new Date('2026-01-11T20:00:00'),
  },
  {
    id: 'demo-pattern-ext-3',
    type: 'strength',
    title: 'Wisdom Keeper',
    description: 'You actively carry forward wisdom from previous generations - your grandmother\'s saying, cooking traditions, lessons learned - while adding your own insights. You are a bridge between past and future.',
    evidence: [
      'Teaching grandmother\'s recipes to children',
      'Quoting grandmother\'s wisdom frequently',
      'Desire to document life story for descendants',
    ],
    significance: 0.84,
    recommendation: 'Consider formalizing this role by recording family history interviews.',
    createdAt: new Date('2026-01-11T20:00:00'),
  },
  {
    id: 'demo-pattern-ext-4',
    type: 'blind-spot',
    title: 'Productivity as Worth',
    description: 'Despite intellectual understanding that worth doesn\'t come from doing, there\'s a persistent pattern of measuring days by output. Rest is framed as "productive" to justify it.',
    evidence: [
      'Feeling guilty about rest: "felt a little guilty about not being productive"',
      '"Reminded myself that rest is productive" - needing productivity frame to justify it',
      '12-hour work days without eating',
    ],
    significance: 0.79,
    recommendation: 'Experiment with rest that has no purpose. Be unproductive on purpose.',
    createdAt: new Date('2026-01-11T20:00:00'),
  },
];

// ============================================================
// EXTENDED INSIGHTS
// ============================================================

export const EXTENDED_INSIGHTS: DemoInsight[] = [
  {
    id: 'demo-insight-ext-1',
    title: 'The Presence Paradox',
    content: 'Your greatest fear is disconnection, yet your default stress response is withdrawal. You crave depth but default to distance. This tension isn\'t a flaw to fix - it\'s a polarity to balance. The goal isn\'t eliminating the withdrawal instinct; it\'s building a pause between trigger and response.',
    category: 'contradiction',
    actionable: true,
    actions: [
      'Create a "withdrawal ritual" - when you feel the urge, do one connecting action first',
      'Share this pattern with loved ones so they can gently interrupt it',
    ],
    createdAt: new Date('2026-01-11T20:00:00'),
  },
  {
    id: 'demo-insight-ext-2',
    title: 'Your Love Language is Time',
    content: 'Across every relationship discussed - parents, children, partner, grandmother - the quality of the relationship is measured in time spent. Presence. Attention. Being there. This is how you receive love and how you express it. Your greatest gifts to others are not things but hours.',
    category: 'superpower',
    actionable: true,
    actions: [
      'Schedule recurring "presence time" with each key person in your life',
      'Notice and celebrate when you successfully give your full attention',
    ],
    createdAt: new Date('2026-01-11T20:00:00'),
  },
];

// ============================================================
// COMBINED DEMO DATA STATS
// ============================================================

export const EXTENDED_DEMO_STATS = {
  totalRecordings: 43, // 16 original + 27 extended
  totalJournalDays: 27, // 7 original + 20 extended
  totalPatterns: 10, // 6 original + 4 extended
  totalInsights: 6, // 4 original + 2 extended
  totalRecordingTime: 5430, // ~90 minutes
  totalWordCount: 15000, // approximate
};
