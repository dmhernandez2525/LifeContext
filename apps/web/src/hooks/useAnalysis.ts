/**
 * useAnalysis - React hook for AI-powered pattern analysis
 * Analyzes recordings/transcripts to discover patterns
 */
import { useState, useCallback } from 'react';
import { useAppStore } from '@/store/app-store';
import type { PatternType } from '@lcc/types';

// ============================================================
// TYPES
// ============================================================

export interface AnalysisPattern {
  type: PatternType;
  title: string;
  description: string;
  evidence: string[];
  significance: number;
  recommendation?: string;
}

export interface UseAnalysisReturn {
  analyze: (contextSummaries: string[]) => Promise<AnalysisPattern[]>;
  isAnalyzing: boolean;
  error: string | null;
  hasApiKey: boolean;
}

// ============================================================
// ANTHROPIC API
// ============================================================

const ANALYSIS_PROMPT = `You are analyzing someone's life context to identify patterns.

Identify these types of patterns:
- recurring-theme: Topics or ideas that come up repeatedly
- contradiction: Conflicting beliefs or behaviors
- growth-area: Areas where they want to improve
- strength: Consistent positive traits or abilities
- blind-spot: Things they might not be aware of

Return ONLY valid JSON array:
[
  {
    "type": "recurring-theme|contradiction|growth-area|strength|blind-spot",
    "title": "Short title",
    "description": "Detailed description",
    "evidence": ["Quote or reference 1", "Quote or reference 2"],
    "significance": 0.8,
    "recommendation": "Optional actionable suggestion"
  }
]`;

async function analyzeWithClaude(
  apiKey: string,
  contextSummaries: string[]
): Promise<AnalysisPattern[]> {
  const userPrompt = `Analyze these context segments for patterns in this person's life:

${contextSummaries.map((c, i) => `--- Segment ${i + 1} ---\n${c}`).join('\n\n')}

Identify recurring themes, contradictions, strengths, growth areas, and potential blind spots.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: ANALYSIS_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  const textContent = data.content?.find((c: { type: string; text?: string }) => c.type === 'text');
  
  if (!textContent?.text) {
    throw new Error('No response from Claude');
  }

  try {
    return JSON.parse(textContent.text);
  } catch {
    return [];
  }
}

// ============================================================
// FALLBACK (Demo patterns when no API key)
// ============================================================

function generateDemoPatterns(contexts: string[]): AnalysisPattern[] {
  const words = contexts.join(' ').toLowerCase();
  const patterns: AnalysisPattern[] = [];

  // Generate contextual demo patterns based on content
  if (words.includes('work') || words.includes('career') || words.includes('job')) {
    patterns.push({
      type: 'recurring-theme',
      title: 'Career Focus',
      description: 'Work and career appear frequently in your thoughts. This suggests professional life is a significant part of your identity.',
      evidence: ['Multiple mentions of work-related topics'],
      significance: 0.7,
      recommendation: 'Consider how work aligns with your deeper values.',
    });
  }

  if (words.includes('family') || words.includes('parent') || words.includes('child')) {
    patterns.push({
      type: 'strength',
      title: 'Family Connection',
      description: 'Family relationships feature prominently, indicating strong bonds and emotional investment in loved ones.',
      evidence: ['References to family members and relationships'],
      significance: 0.8,
      recommendation: 'These connections are a source of strength.',
    });
  }

  if (words.includes('fear') || words.includes('worry') || words.includes('anxious')) {
    patterns.push({
      type: 'growth-area',
      title: 'Anxiety Patterns',
      description: 'Some anxiety-related themes present. This is common and awareness is the first step.',
      evidence: ['Mentions of fear or worry'],
      significance: 0.6,
      recommendation: 'Mindfulness practices might help.',
    });
  }

  // Always add at least one generic pattern
  if (patterns.length === 0) {
    patterns.push({
      type: 'recurring-theme',
      title: 'Self-Reflection',
      description: 'You are actively exploring your thoughts and experiences. This introspective quality is valuable for personal growth.',
      evidence: ['Engagement with life documentation'],
      significance: 0.75,
      recommendation: 'Continue this practice of self-examination.',
    });
  }

  return patterns;
}

// ============================================================
// HOOK IMPLEMENTATION
// ============================================================

export function useAnalysis(): UseAnalysisReturn {
  const settings = useAppStore((state) => state.settings);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasApiKey = Boolean(settings?.aiProvider?.apiKey);

  const analyze = useCallback(async (contextSummaries: string[]): Promise<AnalysisPattern[]> => {
    if (contextSummaries.length === 0) {
      return [];
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      if (hasApiKey && settings?.aiProvider?.apiKey) {
        return await analyzeWithClaude(settings.aiProvider.apiKey, contextSummaries);
      }

      // Use demo patterns if no API key
      return generateDemoPatterns(contextSummaries);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
      setError(errorMessage);
      
      // Return demo patterns on error
      return generateDemoPatterns(contextSummaries);
    } finally {
      setIsAnalyzing(false);
    }
  }, [hasApiKey, settings]);

  return {
    analyze,
    isAnalyzing,
    error,
    hasApiKey,
  };
}

export default useAnalysis;
