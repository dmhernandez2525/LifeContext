/**
 * useSynthesis - React Native hook for AI-powered thought synthesis
 * Uses Claude API for organizing thoughts and generating insights
 */
import { useState, useCallback } from 'react';
import { getSettings } from '../lib/storage';

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

export interface UseSynthesisOptions {
  onResult?: (result: SynthesisResult) => void;
  onError?: (error: Error) => void;
}

export interface UseSynthesisReturn {
  isLoading: boolean;
  result: SynthesisResult | null;
  error: string | null;
  hasApiKey: boolean;
  
  synthesize: (bulletPoints: string[], transcript: string) => Promise<SynthesisResult>;
}

// ============================================================
// CLAUDE API
// ============================================================

const SYNTHESIS_PROMPT = `You are an AI assistant helping to synthesize and organize thoughts from a brain dump session.

The user provided these anchor points:
{bulletPoints}

And this is what they said:
{transcript}

Please analyze this content and provide:
1. A well-organized summary of their thoughts
2. Key insights you noticed
3. Questions that could help clarify their thinking
4. Any contradictions between their stated goals and expressed concerns

Respond in JSON format:
{
  "organizedContent": "A coherent summary...",
  "insights": ["insight 1", "insight 2"],
  "questions": ["question 1", "question 2"],
  "contradictions": [
    {
      "statement1": "first statement",
      "statement2": "contradicting statement", 
      "context": "why this matters",
      "resolutionQuestion": "question to resolve this"
    }
  ]
}`;

async function synthesizeWithClaude(
  bulletPoints: string[],
  transcript: string,
  apiKey: string
): Promise<SynthesisResult> {
  const prompt = SYNTHESIS_PROMPT
    .replace('{bulletPoints}', bulletPoints.map((p, i) => `${i + 1}. ${p}`).join('\n'))
    .replace('{transcript}', transcript);
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2000,
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
  
  // Parse JSON from response
  const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse JSON from response');
  }
  
  return JSON.parse(jsonMatch[0]);
}

// ============================================================
// FALLBACK (Demo)
// ============================================================

function generateDemoSynthesis(bulletPoints: string[], transcript: string): SynthesisResult {
  return {
    organizedContent: `Based on your thoughts about ${bulletPoints.join(', ')}, here's what stands out:\n\n${transcript.slice(0, 200)}...\n\nThis reflects your focus on personal growth and meaningful progress.`,
    insights: [
      'You value intentionality in your daily actions.',
      'There\'s a pattern of wanting to balance productivity with wellbeing.',
      'Your goals are connected to a larger sense of purpose.',
    ],
    questions: [
      'What would success look like in 6 months?',
      'Which of these priorities feels most urgent?',
      'What resources do you need to make progress?',
    ],
    contradictions: [],
  };
}

// ============================================================
// HOOK IMPLEMENTATION
// ============================================================

export function useSynthesis(options: UseSynthesisOptions = {}): UseSynthesisReturn {
  const { onResult, onError } = options;
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SynthesisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const settings = getSettings();
  const hasApiKey = Boolean(settings.apiKey);
  
  const synthesize = useCallback(async (
    bulletPoints: string[],
    transcript: string
  ): Promise<SynthesisResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      let synthesisResult: SynthesisResult;
      
      if (hasApiKey && settings.apiKey) {
        synthesisResult = await synthesizeWithClaude(bulletPoints, transcript, settings.apiKey);
      } else {
        // Demo mode
        await new Promise(resolve => setTimeout(resolve, 2000));
        synthesisResult = generateDemoSynthesis(bulletPoints, transcript);
      }
      
      setResult(synthesisResult);
      onResult?.(synthesisResult);
      
      return synthesisResult;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Synthesis failed');
      setError(error.message);
      onError?.(error);
      
      // Return demo on error
      const demo = generateDemoSynthesis(bulletPoints, transcript);
      setResult(demo);
      return demo;
    } finally {
      setIsLoading(false);
    }
  }, [hasApiKey, settings.apiKey, onResult, onError]);
  
  return {
    isLoading,
    result,
    error,
    hasApiKey,
    synthesize,
  };
}

export default useSynthesis;
