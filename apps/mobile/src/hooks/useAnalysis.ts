/**
 * useAnalysis - React Native hook for AI-powered pattern analysis
 * Uses Claude API for analyzing life patterns and generating insights
 */
import { useState, useCallback } from 'react';
import { getSettings, getRecordings, getJournalEntries, getBrainDumps } from '../lib/storage';

// ============================================================
// TYPES
// ============================================================

export interface AnalysisPattern {
  pattern: string;
  confidence: number;
  category: string;
  description: string;
  recommendation: string;
}

export interface UseAnalysisReturn {
  isLoading: boolean;
  patterns: AnalysisPattern[];
  error: string | null;
  hasApiKey: boolean;
  
  analyze: () => Promise<AnalysisPattern[]>;
}

// ============================================================
// CLAUDE API
// ============================================================

const ANALYSIS_PROMPT = `You are an AI assistant analyzing patterns in someone's life context data.

Here is their data:
- Recordings: {recordingCount} voice recordings
- Journal entries: {journalCount} entries
- Brain dumps: {brainDumpCount} sessions

Recent content themes:
{themes}

Please identify 3-5 key life patterns and provide actionable insights.

Respond in JSON format:
{
  "patterns": [
    {
      "pattern": "Pattern name",
      "confidence": 0.85,
      "category": "health|career|relationships|personal-growth|productivity",
      "description": "What this pattern reveals",
      "recommendation": "Actionable next step"
    }
  ]
}`;

async function analyzeWithClaude(
  context: { recordingCount: number; journalCount: number; brainDumpCount: number; themes: string },
  apiKey: string
): Promise<AnalysisPattern[]> {
  const prompt = ANALYSIS_PROMPT
    .replace('{recordingCount}', String(context.recordingCount))
    .replace('{journalCount}', String(context.journalCount))
    .replace('{brainDumpCount}', String(context.brainDumpCount))
    .replace('{themes}', context.themes || 'No specific themes identified yet.');
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1500,
      messages: [
        { role: 'user', content: prompt }
      ],
    }),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `Claude API error: ${response.status}`);
  }
  
  const data = await response.json();
  const textContent = data.content?.find((c: { type: string; text?: string }) => c.type === 'text');
  
  if (!textContent?.text) {
    throw new Error('No text response from Claude');
  }
  
  const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse JSON from response');
  }
  
  const result = JSON.parse(jsonMatch[0]);
  return result.patterns || [];
}

// ============================================================
// FALLBACK (Demo)
// ============================================================

function generateDemoPatterns(): AnalysisPattern[] {
  return [
    {
      pattern: 'Morning Productivity Peak',
      confidence: 0.92,
      category: 'productivity',
      description: 'Your recordings show higher energy and clarity in morning sessions.',
      recommendation: 'Schedule important tasks and deep work in the morning hours.',
    },
    {
      pattern: 'Reflection Drives Growth',
      confidence: 0.87,
      category: 'personal-growth',
      description: 'Journal entries after brain dumps show deeper insights.',
      recommendation: 'Continue the practice of reflection after each brain dump session.',
    },
    {
      pattern: 'Work-Life Balance Focus',
      confidence: 0.78,
      category: 'health',
      description: 'Multiple mentions of balance and boundaries in recent entries.',
      recommendation: 'Set specific "off" hours and protect them consistently.',
    },
  ];
}

// ============================================================
// HOOK IMPLEMENTATION
// ============================================================

export function useAnalysis(): UseAnalysisReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [patterns, setPatterns] = useState<AnalysisPattern[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const settings = getSettings();
  const hasApiKey = Boolean(settings.apiKey);
  
  const analyze = useCallback(async (): Promise<AnalysisPattern[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Gather context
      const recordings = getRecordings();
      const journals = getJournalEntries();
      const brainDumps = getBrainDumps();
      
      // Extract themes from recent content
      const recentTexts = [
        ...recordings.slice(-5).map(r => r.transcriptionText || ''),
        ...journals.slice(-5).map(j => j.content),
        ...brainDumps.slice(-5).map(b => b.synthesis?.organizedContent || ''),
      ].filter(Boolean);
      
      const themes = recentTexts.join('\n').slice(0, 1000) || 'No content yet';
      
      let analysisPatterns: AnalysisPattern[];
      
      if (hasApiKey && settings.apiKey) {
        analysisPatterns = await analyzeWithClaude(
          {
            recordingCount: recordings.length,
            journalCount: journals.length,
            brainDumpCount: brainDumps.length,
            themes,
          },
          settings.apiKey
        );
      } else {
        // Demo mode
        await new Promise(resolve => setTimeout(resolve, 1500));
        analysisPatterns = generateDemoPatterns();
      }
      
      setPatterns(analysisPatterns);
      return analysisPatterns;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Analysis failed');
      setError(error.message);
      
      // Return demo on error
      const demo = generateDemoPatterns();
      setPatterns(demo);
      return demo;
    } finally {
      setIsLoading(false);
    }
  }, [hasApiKey, settings.apiKey]);
  
  return {
    isLoading,
    patterns,
    error,
    hasApiKey,
    analyze,
  };
}

export default useAnalysis;
