/**
 * useSearch - Full-text search hook using fuse.js
 */
import { useState, useCallback, useMemo } from 'react';
import Fuse, { FuseResultMatch } from 'fuse.js';
import { db } from '@lcc/storage';

// ============================================================
// TYPES
// ============================================================

export interface SearchableItem {
  id: string;
  type: 'recording' | 'journal' | 'brain-dump';
  title: string;
  content: string;
  date: Date;
  categoryId?: string;
  categoryName?: string;
  duration?: number;
}

// Type for encrypted content that could be string or object with data field
type EncryptedContent = string | { data?: string; [key: string]: unknown };

export interface SearchResult extends SearchableItem {
  matches?: readonly FuseResultMatch[];
  score?: number;
}

export interface UseSearchOptions {
  threshold?: number;
  limit?: number;
}

export interface UseSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResult[];
  isSearching: boolean;
  isBuilding: boolean;
  totalItems: number;
  buildIndex: () => Promise<void>;
  search: (query: string) => void;
  clearResults: () => void;
}

// ============================================================
// HOOK IMPLEMENTATION
// ============================================================

export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  const { threshold = 0.3, limit = 20 } = options;

  const [query, setQuery] = useState('');
  const [items, setItems] = useState<SearchableItem[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);

  // Create fuse instance
  const fuse = useMemo(() => {
    if (items.length === 0) return null;
    
    return new Fuse(items, {
      keys: [
        { name: 'title', weight: 2 },
        { name: 'content', weight: 1 },
        { name: 'categoryName', weight: 0.5 },
      ],
      threshold,
      includeMatches: true,
      includeScore: true,
      minMatchCharLength: 2,
      ignoreLocation: true,
    });
  }, [items, threshold]);

  // Build search index from database
  const buildIndex = useCallback(async () => {
    setIsBuilding(true);
    
    try {
      const searchableItems: SearchableItem[] = [];
      
      // Load recordings
      const recordings = await db.recordings.toArray();
      const categories = await db.categories.toArray();
      const questions = await db.questions.toArray();
      
      const categoryMap = new Map(categories.map(c => [c.id, c.name]));
      const questionMap = new Map(questions.map(q => [q.id, { text: q.text, categoryId: q.categoryId }]));
      
      for (const recording of recordings) {
        const question = questionMap.get(recording.questionId);
        // Handle encrypted or plain text transcription
        let content = '';
        const transcription = recording.transcriptionText as unknown as EncryptedContent;
        if (typeof transcription === 'object' && transcription && 'data' in transcription) {
          try {
            content = atob(transcription.data || '');
          } catch {
            content = '';
          }
        } else if (typeof transcription === 'string') {
          content = transcription;
        }

        searchableItems.push({
          id: recording.id,
          type: 'recording',
          title: question?.text || 'Untitled Recording',
          content,
          date: recording.createdAt,
          categoryId: question?.categoryId,
          categoryName: question?.categoryId ? categoryMap.get(question.categoryId) : undefined,
          duration: recording.duration,
        });
      }
      
      // Load journal entries
      const journals = await db.journalEntries.toArray();
      for (const journal of journals) {
        // Try to decode content if it's base64 encoded
        let content = '';
        const journalContent = journal.content as unknown as EncryptedContent;
        if (typeof journalContent === 'object' && journalContent && 'data' in journalContent) {
          try {
            content = atob(journalContent.data || '');
          } catch {
            content = '';
          }
        } else if (typeof journalContent === 'string') {
          content = journalContent;
        }
        
        searchableItems.push({
          id: journal.id,
          type: 'journal',
          title: `Journal - ${new Date(journal.date).toLocaleDateString()}`,
          content,
          date: journal.createdAt,
          duration: journal.duration,
        });
      }
      
      // Load brain dumps
      const brainDumps = await db.brainDumps.toArray();
      for (const dump of brainDumps) {
        let content = '';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dumpData = dump as unknown as Record<string, unknown>;
        if (dumpData.synthesis && typeof dumpData.synthesis === 'object') {
          const synthesis = dumpData.synthesis as { organizedContent?: string };
          content = synthesis.organizedContent || '';
        } else if (Array.isArray(dumpData.bulletPoints)) {
          content = dumpData.bulletPoints.map((b: { text?: string }) => b.text || '').join(' ');
        }
        
        searchableItems.push({
          id: dump.id,
          type: 'brain-dump',
          title: (typeof dumpData.title === 'string' ? dumpData.title : '') || 'Brain Dump',
          content,
          date: dump.createdAt,
        });
      }
      
      setItems(searchableItems);
    } catch (err) {
      console.error('Failed to build search index:', err);
    } finally {
      setIsBuilding(false);
    }
  }, []);

  // Perform search
  const search = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
    setIsSearching(true);
    
    if (!searchQuery.trim() || !fuse) {
      setResults([]);
      setIsSearching(false);
      return;
    }
    
    try {
      const fuseResults = fuse.search(searchQuery, { limit });
      const searchResults: SearchResult[] = fuseResults.map(result => ({
        ...result.item,
        matches: result.matches,
        score: result.score,
      }));
      
      setResults(searchResults);
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [fuse, limit]);

  // Clear results
  const clearResults = useCallback(() => {
    setQuery('');
    setResults([]);
  }, []);

  return {
    query,
    setQuery,
    results,
    isSearching,
    isBuilding,
    totalItems: items.length,
    buildIndex,
    search,
    clearResults,
  };
}

export default useSearch;
