/**
 * GDPR Request Platform Templates
 * Pre-written, legally compliant emails for data portability requests
 */

export interface PlatformTemplate {
  name: string;
  category: string;
  email: string;
  subject: string;
  body: string;
  expectedResponseTime: string; // e.g. "7-30 days"
  notes?: string;
}

export const GDPR_TEMPLATES: PlatformTemplate[] = [
  {
    name: 'Google',
    category: 'Tech Giants',
    email: 'privacy@google.com',
    subject: 'GDPR Article 15: Data Subject Access Request',
    expectedResponseTime: '30 days',
    body: `Dear Google Privacy Team,

I am writing to request access to my personal data under Article 15 of the General Data Protection Regulation (GDPR).

Please provide me with a copy of all personal data you hold about me, including but not limited to:
- Search history
- YouTube watch history
- Gmail metadata
- Location history
- Google Maps timeline
- Google Photos metadata
- Ad personalization data

I request this data in a structured, commonly used, and machine-readable format (e.g., JSON, CSV) as per Article 20 (Right to Data Portability).

My account email: [INSERT YOUR EMAIL]

Please confirm receipt of this request and provide the requested data within the statutory 30-day period.

Thank you,
[YOUR NAME]`,
    notes: 'Google usually responds via Google Takeout. You can also use https://takeout.google.com directly.',
  },
  {
    name: 'Meta (Facebook/Instagram)',
    category: 'Social Media',
    email: 'privacy@fb.com',
    subject: 'GDPR Data Subject Access Request',
    expectedResponseTime: '30 days',
    body: `Dear Meta Privacy Team,

I am exercising my rights under Article 15 of the GDPR and request access to all personal data you hold about me across Facebook and Instagram.

Please include:
- Posts, comments, and reactions
- Messages and call logs
- Photos and videos
- Ad interactions and ad targeting data
- Off-Facebook activity
- Account activity logs

Format: JSON or CSV (machine-readable)

Account Email/Username: [INSERT]

I expect a response within 30 days as required by law.

Best regards,
[YOUR NAME]`,
    notes: 'Meta provides data via "Download Your Information" feature in settings.',
  },
  {
    name: 'Amazon',
    category: 'E-Commerce',
    email: 'privacy@amazon.com',
    subject: 'GDPR/CCPA Data Portability Request',
    expectedResponseTime: '45 days',
    body: `Dear Amazon Privacy Team,

I am requesting a copy of my personal data under GDPR Article 15 and CCPA Section 1798.100.

Please provide:
- Purchase history (all orders)
- Product reviews
- Browsing history on Amazon.com
- Alexa voice recordings (if applicable)
- Prime Video watch history
- Kindle reading history

Format: Downloadable CSV/JSON

Account Email: [INSERT]

Thank you,
[YOUR NAME]`,
    notes: 'Amazon has a self-service portal: amazon.com/gp/privacycentral/dsar',
  },
  {
    name: 'LinkedIn',
    category: 'Social Media',
    email: 'privacy@linkedin.com',
    subject: 'GDPR Data Access Request',
    expectedResponseTime: '30 days',
    body: `Dear LinkedIn Privacy Team,

I request access to my personal data under GDPR Article 15.

Please include:
- Profile information and edit history
- Connections and network data
- Messages and InMail
- Job applications and recruiter interactions
- Ad engagement data

Format: Machine-readable (JSON/CSV)

Account: [YOUR EMAIL/PROFILE URL]

Regards,
[YOUR NAME]`,
  },
  {
    name: 'Twitter (X)',
    category: 'Social Media',
    email: 'privacy@twitter.com',
    subject: 'Data Portability Request - GDPR Article 20',
    expectedResponseTime: '30 days',
    body: `Dear Twitter Privacy Team,

Pursuant to GDPR Article 15 and 20, I request my data in a portable format.

Include:
- Tweets, retweets, likes
- Direct messages
- Follower/following lists
- Account activity and login history
- Ad engagement

Account: @[YOUR HANDLE]

Thank you,
[YOUR NAME]`,
    notes: 'X offers "Download your archive" in settings.',
  },
  {
    name: 'Apple',
    category: 'Tech Giants',
    email: 'privacy@apple.com',
    subject: 'GDPR Data Access Request',
    expectedResponseTime: '45 days',
    body: `Dear Apple Privacy Team,

I request a copy of my personal data under GDPR Article 15.

Include:
- iCloud data (photos, documents, backups)
- App Store purchase history
- Apple Music/Podcasts history
- Siri interactions
- Device usage analytics

Apple ID: [YOUR EMAIL]

Best,
[YOUR NAME]`,
    notes: 'Apple has a data portal: privacy.apple.com',
  },
  {
    name: 'Microsoft',
    category: 'Tech Giants',
    email: 'privacy@microsoft.com',
    subject: 'GDPR Article 15 Request',
    expectedResponseTime: '30 days',
    body: `Dear Microsoft Privacy Team,

I request my data under GDPR Article 15.

Include:
- Microsoft Account activity
- Office 365 / OneDrive files
- Xbox gaming history
- Bing search history
- Cortana interactions

Account: [YOUR EMAIL]

Regards,
[YOUR NAME]`,
  },
  {
    name: 'TikTok',
    category: 'Social Media',
    email: 'privacy@tiktok.com',
    subject: 'Data Portability Request',
    expectedResponseTime: '30 days',
    body: `Dear TikTok Privacy Team,

GDPR Article 15 - Data Subject Access Request

Include:
- Videos posted and deleted
- Likes, comments, shares
- Watch history and For You Page algorithm data
- Direct messages

Username: @[YOUR HANDLE]

Thank you,
[YOUR NAME]`,
  },
];

export function getTemplatesByCategory(category: string): PlatformTemplate[] {
  return GDPR_TEMPLATES.filter((t) => t.category === category);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(GDPR_TEMPLATES.map((t) => t.category)));
}
