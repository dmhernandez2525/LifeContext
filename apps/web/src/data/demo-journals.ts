/**
 * Demo Journal Entries - 10 years of Alex Chen's life documented
 * These entries span from college to present day, showing the full
 * range of human experience: joy, struggle, growth, and reflection.
 */

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: number; // 1-10
  tags: string[];
  chapterId: string;
  isVoiceEntry: boolean;
  duration?: number; // seconds for voice entries
  aiInsight?: string;
}

export const DEMO_JOURNAL_ENTRIES: JournalEntry[] = [
  // 2024 - Present Day
  {
    id: 'entry-2024-01-12',
    date: '2024-01-12T08:30:00',
    title: 'The Marathon Training Revelation',
    content: `Week 3 of marathon training. I woke up at 5:30 AM to run before Lily wakes up. It was 38 degrees and dark, and I asked myself "why am I doing this?"

Then I remembered: because I said I would. Because 35-year-old me needs to prove to myself that I can still do hard things that aren't just work.

5 miles today. Slow. Painful. But I finished. That's the whole point.

Maya left a note on my shoes: "Proud of you, even when you quit halfway through." She knows me too well.`,
    mood: 7,
    tags: ['fitness', 'marathon', 'morning-routine', 'growth'],
    chapterId: 'chapter-now',
    isVoiceEntry: false,
    aiInsight: 'This is the 12th consecutive entry mentioning fitness. Pattern detected: physical health correlates with your overall mood scores.',
  },
  {
    id: 'entry-2024-01-08',
    date: '2024-01-08T21:45:00',
    title: 'Lily Said My Name',
    content: `She said "Dada" for the first time last month, but today she ran to me and said "Dada HOME!" when I walked through the door.

I am not ashamed to say I ugly cried in the doorway.

All those late nights, all the work stress, all the times I've questioned whether I'm doing this right - this moment made it all worth it.

She's becoming a person. A real little human with preferences and humor and this incredible ability to make me feel like the luckiest person alive.

I need to work less. I need to be present more. I know I say this every few months but... I really mean it this time.`,
    mood: 10,
    tags: ['lily', 'parenting', 'milestone', 'gratitude'],
    chapterId: 'chapter-parenthood',
    isVoiceEntry: true,
    duration: 180,
    aiInsight: 'You\'ve mentioned wanting to "work less" 7 times in the past year. Consider: what specific change would make this happen?',
  },
  {
    id: 'entry-2024-01-02',
    date: '2024-01-02T10:00:00',
    title: 'New Year, Same Fears',
    content: `Resolutions feel performative but here they are anyway:

1. Run a marathon (already signed up for Austin Marathon in February)
2. Start that side project I've been talking about for 3 years
3. Be more present with Lily - no phone during playtime
4. Call mom every week, not just when she texts first
5. Journal daily (using LifeContext to actually do it this time)

The startup idea keeps nagging at me. An AI tool that helps parents document their kids' milestones. Ironic that I can't even document my own life consistently.

Maya says I should either do it or stop talking about it. She's right. She's annoyingly right.`,
    mood: 7,
    tags: ['new-year', 'goals', 'startup', 'reflection'],
    chapterId: 'chapter-now',
    isVoiceEntry: false,
    aiInsight: 'You\'ve mentioned the "AI tool for parents" idea in 5 entries over 6 months. This might be worth deeper exploration.',
  },

  // 2022 - Becoming a Parent
  {
    id: 'entry-2022-04-18',
    date: '2022-04-18T19:30:00',
    title: 'She\'s Here',
    content: `Lily Maya Chen. Born at 3:47 PM. 7 lbs:, 4 oz. The most beautiful creature I've ever seen.

14 hours of labor. Maya was incredible. I felt useless but tried to be supportive.

When they put Lily on Maya's chest and she opened her eyes and looked at me... I can't describe it. Everything I thought I knew about love was just a preview.

I'm terrified. I have no idea what I'm doing. But I've never been more sure of anything: I will protect this tiny human with everything I have.

Dad cried when I called him. First time I've ever heard that.`,
    mood: 10,
    tags: ['lily', 'birth', 'parenthood', 'love', 'milestone'],
    chapterId: 'chapter-parenthood',
    isVoiceEntry: true,
    duration: 300,
    aiInsight: 'This entry marks the beginning of your highest sustained joy period in the last 10 years.',
  },

  // 2020 - Burnout and Recovery
  {
    id: 'entry-2020-04-15',
    date: '2020-04-15T23:45:00',
    title: 'I Think I Need Help',
    content: `Day 35 of lockdown. I haven't left the apartment in a week. Work from home has become work-all-the-time.

I snapped at Maya today over something stupid. She looked so hurt. I apologized but I could see it wasn't enough.

I've been having trouble sleeping. When I do sleep, I dream about work. When I wake up, I check Slack before I even pee.

This isn't sustainable. I'm not okay.

Sam mentioned his therapist helped him a lot. Maybe it's time I stop pretending I don't need one.

I'm writing this at midnight because I can't stop my brain. That's probably not a good sign.`,
    mood: 3,
    tags: ['pandemic', 'burnout', 'mental-health', 'work-life-balance'],
    chapterId: 'chapter-career-pivot',
    isVoiceEntry: false,
    aiInsight: 'This was a turning point. 3 weeks after this entry, you started therapy - one of your most impactful decisions.',
  },
  {
    id: 'entry-2020-05-10',
    date: '2020-05-10T16:00:00',
    title: 'First Therapy Session',
    content: `I did it. Had my first session with Dr. Kim.

She asked me what brought me there and I started crying within 2 minutes. Embarrassing but also kind of a relief?

She said something that stuck: "You're not broken. You're having a normal response to an abnormal situation."

We talked about boundaries. Work boundaries. Personal boundaries. The fact that I've never really had any.

$150/session feels expensive but Maya pointed out I spend that much on coffee every month. Fair point.

Already scheduled next week.`,
    mood: 5,
    tags: ['therapy', 'mental-health', 'growth', 'self-care'],
    chapterId: 'chapter-career-pivot',
    isVoiceEntry: false,
    aiInsight: 'Starting therapy correlates with the beginning of your upward mood trajectory over the next 6 months.',
  },

  // 2018 - Wedding
  {
    id: 'entry-2018-09-22',
    date: '2018-09-22T23:59:00',
    title: 'Married.',
    content: `I am a married man. Holy shit.

The ceremony was perfect. Small. 50 people. Backyard of Maya's parents' place. String lights everywhere.

I cried reading my vows. Maya cried. Our moms cried. Even Sam teared up and he claims he doesn't have emotions.

The best part? Everything that went wrong:
- The caterer was 45 minutes late
- It started raining during our first dance
- Bruno (who was our ring bearer) ran away with the rings

And none of it mattered. Because at the end of the day, I married my best friend.

Dancing with Maya in the rain while everyone laughed... that's the memory I'll keep forever.

I promise to never take this for granted.`,
    mood: 10,
    tags: ['wedding', 'maya', 'love', 'milestone', 'family'],
    chapterId: 'chapter-marriage',
    isVoiceEntry: true,
    duration: 420,
    aiInsight: 'Four years later, you\'ve mentioned this day as a touchstone of happiness 23 times.',
  },

  // 2016 - Meeting Maya
  {
    id: 'entry-2016-11-12',
    date: '2016-11-12T23:30:00',
    title: 'Her Name is Maya',
    content: `Sam dragged me to his friend's housewarming party. I almost bailed three times.

Then I met Maya.

She was arguing with someone about whether hot dogs are sandwiches. She was wrong (they are sandwiches) but the way she defended her position was... magnetic.

We talked for 3 hours. About food, about design (she's a product designer), about the absurdity of networking events.

I got her number. My hands were sweating. I'm 24 and I felt like a teenager.

I know it's too early to say this but there's something different about her. Something that makes me want to be better.

Don't screw this up, Alex.`,
    mood: 9,
    tags: ['maya', 'love', 'first-meeting', 'relationships'],
    chapterId: 'chapter-finding-love',
    isVoiceEntry: false,
    aiInsight: 'This entry marks the beginning of your most significant relationship. Maya appears in 36% of all entries since.',
  },

  // 2014 - First Job
  {
    id: 'entry-2014-07-15',
    date: '2014-07-15T21:00:00',
    title: 'Imposter Syndrome is Real',
    content: `First month at StartupXYZ done.

Everyone here is so smart. I feel like they're going to figure out I don't belong here any minute.

My code review today had 47 comments. FORTY-SEVEN. Senior dev was nice about it but... 47.

I stayed late to fix them all. Ate dinner at my desk. Again.

The work is actually interesting though. Building a payments system from scratch. Terrifying responsibility.

Dad called to ask how it's going. Lied and said great. Didn't want to worry him.

Need to remember: everyone was new once. Even the scary senior devs.`,
    mood: 5,
    tags: ['work', 'imposter-syndrome', 'first-job', 'growth'],
    chapterId: 'chapter-first-job',
    isVoiceEntry: false,
    aiInsight: 'Imposter syndrome appears in 23 entries from 2014-2016. It decreases significantly after your first promotion.',
  },
  {
    id: 'entry-2014-10-08',
    date: '2014-10-08T02:30:00',
    title: 'I Broke Production',
    content: `It finally happened. I broke production.

Payments were down for 2 hours. 2 HOURS. On a Tuesday night. Peak traffic.

I thought I was going to get fired. I was already mentally drafting my resignation email.

But then something unexpected happened: the team rallied. CTO stayed on call with me. Senior dev walked me through the fix. Nobody yelled.

CTO said: "Now you know what it feels like. You'll never make this specific mistake again."

I'm still shaking as I write this. But weirdly... I also feel like I belong here a little more? Like I joined some club of people who've broken prod and lived to tell the tale.

Going to sleep now. Tomorrow is going to be interesting.`,
    mood: 4,
    tags: ['work', 'failure', 'growth', 'learning', 'team'],
    chapterId: 'chapter-first-job',
    isVoiceEntry: false,
    aiInsight: 'This "failure" appears in your narrative as a formative moment. You\'ve referenced it positively 8 times since.',
  },

  // 2012 - College
  {
    id: 'entry-2012-09-20',
    date: '2012-09-20T22:00:00',
    title: 'Met My Future Co-Founder (and Best Friend)',
    content: `Went to a Python meetup on campus. Expected awkward silence.

Instead met this guy Sam who's as obsessed with building things as I am. We stayed two hours after the meetup ended, just talking about ideas.

He wants to build a study group matching app. Called it "StudyBuddy." I said the name was terrible. He agreed but said it was just a placeholder.

We exchanged numbers. Made plans to start building this weekend.

Mom would be happy I'm making friends.

This might be the beginning of something cool.`,
    mood: 8,
    tags: ['college', 'sam', 'startup', 'friendship'],
    chapterId: 'chapter-college',
    isVoiceEntry: false,
    aiInsight: 'Sam Rodriguez becomes your longest-lasting friendship and appears in 13% of all entries.',
  },
  {
    id: 'entry-2013-04-15',
    date: '2013-04-15T03:00:00',
    title: 'StudyBuddy is Dead (And So Am I)',
    content: `We're shutting down StudyBuddy.

1,847 users at peak. Now 234 active. Nobody wants to pay for it.

9 months of late nights. Missed exams. Caffeine addiction. For nothing.

Sam and I had the conversation today. It was quiet. We both knew.

The thing is... I don't regret it. I learned more building this stupid app than in any classroom.

I learned that marketing matters. That users lie in surveys. That a great product doesn't guarantee success.

We're still friends. We're still going to build things. This was just practice.

But right now, I need sleep. And maybe a long break from side projects.`,
    mood: 4,
    tags: ['startup', 'failure', 'sam', 'learning', 'college'],
    chapterId: 'chapter-college',
    isVoiceEntry: false,
    aiInsight: 'Your reflective acceptance of failure here sets a pattern for how you process setbacks. This resilience appears consistently.',
  },

  // Adding more entries to reach 500+ (abbreviated patterns)
  ...generateBulkEntries(),
];

/**
 * Generate bulk realistic entries to reach 500+ total
 */
function generateBulkEntries(): JournalEntry[] {
  const entries: JournalEntry[] = [];
  const templates = [
    { title: 'Morning Reflection', tags: ['morning', 'reflection'], mood: 6 },
    { title: 'Work Day Thoughts', tags: ['work', 'career'], mood: 6 },
    { title: 'Weekend Adventures', tags: ['weekend', 'leisure'], mood: 8 },
    { title: 'Family Time', tags: ['family', 'lily', 'maya'], mood: 9 },
    { title: 'Workout Done', tags: ['fitness', 'health'], mood: 7 },
    { title: 'Tough Day', tags: ['stress', 'challenges'], mood: 4 },
    { title: 'Grateful For', tags: ['gratitude', 'reflection'], mood: 8 },
    { title: 'Learning Something New', tags: ['growth', 'learning'], mood: 7 },
    { title: 'Date Night', tags: ['maya', 'relationships'], mood: 9 },
    { title: 'Random Thoughts', tags: ['reflection'], mood: 6 },
  ];

  const chapters = [
    'chapter-college', 'chapter-first-job', 'chapter-finding-love',
    'chapter-career-pivot', 'chapter-marriage', 'chapter-parenthood', 'chapter-now'
  ];

  // Generate entries from 2014 to 2024
  for (let year = 2014; year <= 2024; year++) {
    const entriesPerYear = year >= 2022 ? 80 : year >= 2018 ? 60 : 40;
    
    for (let i = 0; i < entriesPerYear; i++) {
      const month = Math.floor(Math.random() * 12) + 1;
      const day = Math.floor(Math.random() * 28) + 1;
      const template = templates[Math.floor(Math.random() * templates.length)];
      
      entries.push({
        id: `entry-${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}-${i}`,
        date: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:00:00`,
        title: template.title,
        content: `This is a ${template.title.toLowerCase()} entry from ${year}. Life was ${template.mood > 6 ? 'good' : template.mood > 4 ? 'okay' : 'challenging'} during this time.`,
        mood: template.mood + Math.floor(Math.random() * 3) - 1,
        tags: template.tags,
        chapterId: chapters[Math.min(Math.floor((year - 2010) / 2), chapters.length - 1)],
        isVoiceEntry: Math.random() > 0.7,
        duration: Math.random() > 0.7 ? Math.floor(Math.random() * 300) + 60 : undefined,
      });
    }
  }

  return entries;
}

// Export count for verification
export const TOTAL_ENTRY_COUNT = DEMO_JOURNAL_ENTRIES.length;
