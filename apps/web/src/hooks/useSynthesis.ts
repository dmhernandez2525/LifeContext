/**
 * useSynthesis - React hook for AI-powered brain dump synthesis
 * Integrates with @lcc/llm for thought organization
 */
import { useState, useCallback } from 'react';
import { useAppStore } from '@/store/app-store';

// ============================================================
// TYPES
// ============================================================

export interface SynthesisResult {
  organizedContent: string;
  insights: string[];
  questions: string[];
  contradictions: Array<{
    statement1: string;
    statement2: string;
    context: string;
    resolutionQuestion: string;
  }>;
}

export interface UseSynthesisReturn {
  synthesize: (bulletPoints: string[], transcription: string) => Promise<SynthesisResult>;
  isLoading: boolean;
  error: string | null;
  hasApiKey: boolean;
}

// ============================================================
// ANTHROPIC API CALL
// ============================================================

const SYNTHESIS_PROMPT = `You are helping someone organize their thoughts from a brain dump session.

Your job is to:
1. Organize the raw content into coherent themes
2. Identify any contradictions in their thinking
3. Generate qualifying questions to clarify unclear points
4. Extract key insights
5. Preserve their voice and perspective

Return ONLY valid JSON with this structure:
{
  "organizedContent": "The organized, coherent version of their thoughts as a narrative",
  "contradictions": [
    {
      "statement1": "First contradicting statement",
      "statement2": "Second contradicting statement",
      "context": "Why these might conflict",
      "resolutionQuestion": "A question to help resolve this"
    }
  ],
  "questions": ["Qualifying question 1", "Qualifying question 2"],
  "insights": ["Key insight 1", "Key insight 2"]
}`;

async function synthesizeWithClaude(
  apiKey: string,
  bulletPoints: string[],
  transcription: string
): Promise<SynthesisResult> {
  const userPrompt = `The user prepared these bullet points as anchor topics:
${bulletPoints.map((b, i) => `${i + 1}. ${b}`).join('\n')}

Their raw transcription:
${transcription}

Please synthesize this into organized thoughts, identify contradictions, and generate qualifying questions.`;

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
      system: SYNTHESIS_PROMPT,
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
    // If JSON parsing fails, create a structured response from text
    return {
      organizedContent: textContent.text,
      insights: [],
      questions: [],
      contradictions: [],
    };
  }
}

// ============================================================
// FALLBACK (No API Key)
// ============================================================

function synthesizeFallback(
  bulletPoints: string[],
  transcription: string
): SynthesisResult {
  // Simple local synthesis without AI
  const words = transcription.split(/\s+/).length;
  
  return {
    organizedContent: `You spoke about: ${bulletPoints.join(', ')}\n\n${transcription}`,
    insights: [
      `You covered ${bulletPoints.length} main topics`,
      `Your thoughts contained approximately ${words} words`,
      'Consider which topics felt most important as you spoke',
    ],
    questions: [
      'What made you choose these particular topics to explore?',
      'Is there anything you said that surprised you?',
      'What would you like to explore more deeply?',
    ],
    contradictions: [],
  };
}

// ============================================================
// HOOK IMPLEMENTATION
// ============================================================

export function useSynthesis(): UseSynthesisReturn {
  const settings = useAppStore((state) => state.settings);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasApiKey = Boolean(settings?.aiProvider?.apiKey);

  const synthesize = useCallback(async (
    bulletPoints: string[],
    transcription: string
  ): Promise<SynthesisResult> => {
    setIsLoading(true);
    setError(null);

    try {
      if (hasApiKey && settings?.aiProvider?.apiKey) {
        return await synthesizeWithClaude(
          settings.aiProvider.apiKey,
          bulletPoints,
          transcription
        );
      }

      // Use fallback if no API key
      return synthesizeFallback(bulletPoints, transcription);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Synthesis failed';
      setError(errorMessage);
      
      // Return fallback on error
      return synthesizeFallback(bulletPoints, transcription);
    } finally {
      setIsLoading(false);
    }
  }, [hasApiKey, settings]);

  return {
    synthesize,
    isLoading,
    error,
    hasApiKey,
  };
}

export default useSynthesis;
