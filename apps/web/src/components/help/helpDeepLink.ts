import { db } from '@lcc/storage';
import type { DeepLinkResult } from './helpTypes';

interface EncryptedPayload {
  data?: string;
}

interface JournalLike {
  id: string;
  content: string | EncryptedPayload;
}

interface RecordingLike {
  id: string;
  questionId: string;
}

interface QuestionLike {
  id: string;
  text: string;
}

const decodeContent = (value: string | EncryptedPayload): string => {
  if (typeof value === 'string') {
    return value;
  }

  if (!value.data) {
    return '';
  }

  try {
    return atob(value.data);
  } catch {
    return '';
  }
};

const settingsHint = (query: string): DeepLinkResult | null => {
  const normalized = query.toLowerCase();

  if (normalized.includes('export') || normalized.includes('backup')) {
    return {
      path: '/app/settings#export',
      label: 'Settings Export',
      reason: 'Matched export settings keywords',
    };
  }

  if (normalized.includes('privacy') || normalized.includes('security') || normalized.includes('passcode')) {
    return {
      path: '/app/settings#security',
      label: 'Settings Security',
      reason: 'Matched privacy/security settings keywords',
    };
  }

  return null;
};

const findJournalMatch = async (query: string): Promise<DeepLinkResult | null> => {
  const journalEntries = (await db.journalEntries.toArray()) as unknown as JournalLike[];
  const normalized = query.toLowerCase();

  for (const entry of journalEntries) {
    const content = decodeContent(entry.content).toLowerCase();
    if (content.includes(normalized)) {
      return {
        path: `/app/journal?entryId=${encodeURIComponent(entry.id)}`,
        label: 'Journal Entry',
        reason: 'Matched journal content',
      };
    }
  }

  return null;
};

const findQuestionMatch = async (query: string): Promise<DeepLinkResult | null> => {
  const recordings = (await db.recordings.toArray()) as unknown as RecordingLike[];
  const questions = (await db.questions.toArray()) as unknown as QuestionLike[];
  const normalized = query.toLowerCase();

  const questionMap = new Map(questions.map((question) => [question.id, question.text.toLowerCase()]));

  for (const recording of recordings) {
    const questionText = questionMap.get(recording.questionId);
    if (questionText && questionText.includes(normalized)) {
      return {
        path: `/app/questions?recordingId=${encodeURIComponent(recording.id)}`,
        label: 'Question Recording',
        reason: 'Matched question prompt text',
      };
    }
  }

  return null;
};

export const resolveDeepLinkSearch = async (query: string): Promise<DeepLinkResult | null> => {
  const trimmed = query.trim();
  if (!trimmed) {
    return null;
  }

  const settings = settingsHint(trimmed);
  if (settings) {
    return settings;
  }

  const journal = await findJournalMatch(trimmed);
  if (journal) {
    return journal;
  }

  const question = await findQuestionMatch(trimmed);
  if (question) {
    return question;
  }

  return null;
};
