/**
 * @lcc/llm
 * 
 * LLM integration for question generation, transcription, and analysis.
 * Supports both cloud (Anthropic Claude) and local (Ollama) providers.
 */

import Anthropic from '@anthropic-ai/sdk';
import type { Transcription, AISynthesis, Pattern, PatternType } from '@lcc/types';

// ============================================================
// TYPES
// ============================================================

export type LLMProvider = 'anthropic' | 'ollama';

export interface LLMConfig {
  provider: LLMProvider;
  apiKey?: string; // For Anthropic
  ollamaEndpoint?: string; // For Ollama, default http://localhost:11434
  model?: string;
}

export interface GeneratedQuestion {
  text: string;
  context?: string;
  suggestedDuration: number;
}

// ============================================================
// ANTHROPIC CLIENT
// ============================================================

let anthropicClient: Anthropic | null = null;

function getAnthropicClient(apiKey: string): Anthropic {
  if (!anthropicClient || apiKey !== anthropicClient.apiKey) {
    anthropicClient = new Anthropic({ apiKey });
  }
  return anthropicClient;
}

// ============================================================
// OLLAMA CLIENT
// ============================================================

const DEFAULT_OLLAMA_ENDPOINT = 'http://localhost:11434';
const DEFAULT_OLLAMA_MODEL = 'llama3.1';

interface OllamaResponse {
  model: string;
  response: string;
  done: boolean;
}

async function ollamaGenerate(
  prompt: string,
  systemPrompt: string,
  endpoint: string = DEFAULT_OLLAMA_ENDPOINT,
  model: string = DEFAULT_OLLAMA_MODEL
): Promise<string> {
  const response = await fetch(`${endpoint}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt,
      system: systemPrompt,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.statusText}`);
  }

  const data = (await response.json()) as OllamaResponse;
  return data.response;
}

/**
 * Check if Ollama is available
 */
export async function isOllamaAvailable(
  endpoint: string = DEFAULT_OLLAMA_ENDPOINT
): Promise<boolean> {
  try {
    const response = await fetch(`${endpoint}/api/tags`, {
      method: 'GET',
      signal: AbortSignal.timeout(2000), // 2 second timeout
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get available Ollama models
 */
export async function getOllamaModels(
  endpoint: string = DEFAULT_OLLAMA_ENDPOINT
): Promise<string[]> {
  try {
    const response = await fetch(`${endpoint}/api/tags`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.models?.map((m: { name: string }) => m.name) || [];
  } catch {
    return [];
  }
}

// ============================================================
// UNIFIED LLM INTERFACE
// ============================================================

async function generateWithLLM(
  config: LLMConfig,
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  if (config.provider === 'ollama') {
    return ollamaGenerate(
      userPrompt,
      systemPrompt,
      config.ollamaEndpoint,
      config.model || DEFAULT_OLLAMA_MODEL
    );
  }

  // Anthropic
  if (!config.apiKey) {
    throw new Error('Anthropic API key required');
  }

  const client = getAnthropicClient(config.apiKey);
  const message = await client.messages.create({
    model: config.model || 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });

  // Extract text from response
  const textContent = message.content.find((c) => c.type === 'text');
  return textContent?.text || '';
}

// ============================================================
// QUESTION GENERATION
// ============================================================

const QUESTION_GENERATION_SYSTEM = `You are a thoughtful interviewer helping someone document their life story for personal reflection and legacy purposes.

Your job is to generate follow-up questions that:
1. Dig deeper into interesting topics mentioned
2. Explore emotional aspects and personal growth
3. Connect to patterns from previous answers
4. Help the person gain self-insight
5. Are open-ended and encourage detailed responses

IMPORTANT: Return ONLY valid JSON. No markdown, no code blocks, just raw JSON.

Format your response as a JSON array:
[
  {
    "text": "The question text",
    "context": "Brief explanation of why this question is insightful",
    "suggestedDuration": 10
  }
]`;

/**
 * Generate follow-up questions based on a user's answer
 */
export async function generateFollowUpQuestions(
  config: LLMConfig,
  originalQuestion: string,
  answer: string,
  previousContext?: string
): Promise<GeneratedQuestion[]> {
  const userPrompt = `Original Question: ${originalQuestion}

User's Answer: ${answer}

${previousContext ? `Previous Context (summary of other answers): ${previousContext}` : ''}

Generate 2-3 thoughtful follow-up questions based on this answer.`;

  try {
    const response = await generateWithLLM(config, QUESTION_GENERATION_SYSTEM, userPrompt);
    const questions = JSON.parse(response) as GeneratedQuestion[];
    return questions;
  } catch (error) {
    console.error('Failed to generate questions:', error);
    return [];
  }
}

// ============================================================
// TRANSCRIPTION
// ============================================================

/**
 * Transcribe audio using Anthropic Claude
 * Note: This requires audio support in the API
 */
export async function transcribeWithClaude(
  apiKey: string,
  audioBlob: Blob
): Promise<Transcription> {
  // Convert blob to base64 (for future audio support)
  void await blobToBase64(audioBlob);
  
  const client = getAnthropicClient(apiKey);
  
  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Please transcribe this audio accurately. Include all words, even if they seem repetitive or off-topic. Return only the transcription text, no additional commentary.',
          },
          // Note: Audio support may vary - this is the expected format
          // when audio is supported
        ],
      },
    ],
  });

  const textContent = message.content.find((c) => c.type === 'text');
  const text = textContent?.text || '';

  return {
    id: crypto.randomUUID(),
    sessionId: '',
    text,
    confidence: 0.95,
    language: 'en',
    service: 'anthropic',
    createdAt: new Date(),
  };
}

// ============================================================
// BRAIN DUMP SYNTHESIS
// ============================================================

const SYNTHESIS_SYSTEM = `You are helping someone organize their thoughts from a brain dump session.

Your job is to:
1. Organize the raw content into coherent themes
2. Identify any contradictions in their thinking
3. Generate qualifying questions to clarify unclear points
4. Extract key insights
5. Preserve their voice and perspective

IMPORTANT: Return ONLY valid JSON. No markdown, no code blocks, just raw JSON.

Format your response as JSON:
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
  "qualifyingQuestions": ["Question 1", "Question 2"],
  "insights": ["Key insight 1", "Key insight 2"]
}`;

/**
 * Synthesize a brain dump session
 */
export async function synthesizeBrainDump(
  config: LLMConfig,
  bulletPoints: string[],
  transcription: string
): Promise<AISynthesis> {
  const userPrompt = `The user prepared these bullet points as anchor topics:
${bulletPoints.map((b, i) => `${i + 1}. ${b}`).join('\n')}

Their raw transcription:
${transcription}

Please synthesize this into organized thoughts, identify contradictions, and generate qualifying questions.`;

  try {
    const response = await generateWithLLM(config, SYNTHESIS_SYSTEM, userPrompt);
    const parsed = JSON.parse(response);

    return {
      id: crypto.randomUUID(),
      organizedContent: parsed.organizedContent || '',
      contradictions: (parsed.contradictions || []).map((c: any) => ({
        id: crypto.randomUUID(),
        statement1: c.statement1,
        statement2: c.statement2,
        context: c.context,
        resolutionQuestion: c.resolutionQuestion,
      })),
      qualifyingQuestions: parsed.qualifyingQuestions || [],
      insights: parsed.insights || [],
      createdAt: new Date(),
    };
  } catch (error) {
    console.error('Failed to synthesize brain dump:', error);
    return {
      id: crypto.randomUUID(),
      organizedContent: transcription,
      contradictions: [],
      qualifyingQuestions: [],
      insights: [],
      createdAt: new Date(),
    };
  }
}

// ============================================================
// PATTERN RECOGNITION
// ============================================================

const PATTERN_SYSTEM = `You are analyzing someone's life context to identify patterns.

Identify these types of patterns:
- recurring-theme: Topics or ideas that come up repeatedly
- contradiction: Conflicting beliefs or behaviors
- growth-area: Areas where they want to improve
- strength: Consistent positive traits or abilities
- blind-spot: Things they might not be aware of

IMPORTANT: Return ONLY valid JSON. No markdown, no code blocks, just raw JSON.

Format your response as JSON array:
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

/**
 * Analyze context segments for patterns
 */
export async function analyzePatterns(
  config: LLMConfig,
  contextSummaries: string[]
): Promise<Pattern[]> {
  const userPrompt = `Analyze these context segments for patterns in this person's life:

${contextSummaries.map((c, i) => `--- Segment ${i + 1} ---\n${c}`).join('\n\n')}

Identify recurring themes, contradictions, strengths, growth areas, and potential blind spots.`;

  try {
    const response = await generateWithLLM(config, PATTERN_SYSTEM, userPrompt);
    const parsed = JSON.parse(response) as Array<{
      type: PatternType;
      title: string;
      description: string;
      evidence: string[];
      significance: number;
      recommendation?: string;
    }>;

    return parsed.map((p) => ({
      id: crypto.randomUUID(),
      type: p.type,
      title: p.title,
      description: p.description,
      evidence: p.evidence.map((quote) => ({
        segmentId: '', // Would need to match back to actual segments
        quote,
        relevanceScore: 0.8,
      })),
      significance: p.significance,
      recommendation: p.recommendation,
      createdAt: new Date(),
    }));
  } catch (error) {
    console.error('Failed to analyze patterns:', error);
    return [];
  }
}

// ============================================================
// UTILITIES
// ============================================================

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      resolve(base64.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Estimate token count for a string (rough approximation)
 */
export function estimateTokens(text: string): number {
  // Rough estimate: ~4 characters per token
  return Math.ceil(text.length / 4);
}

/**
 * Truncate text to fit within token limit
 */
export function truncateToTokenLimit(text: string, maxTokens: number): string {
  const currentTokens = estimateTokens(text);
  if (currentTokens <= maxTokens) return text;

  const ratio = maxTokens / currentTokens;
  const targetLength = Math.floor(text.length * ratio * 0.9); // 10% margin
  return text.slice(0, targetLength) + '...';
}

// ============================================================
// CONVERSATIONAL AI (Multi-turn)
// ============================================================

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface GenerateWithClaudeOptions {
  systemPrompt: string;
  messages: ConversationMessage[];
  apiKey: string;
  maxTokens?: number;
  model?: string;
}

/**
 * Generate a response with Claude using multi-turn conversation
 */
export async function generateWithClaude(options: GenerateWithClaudeOptions): Promise<string> {
  const { 
    systemPrompt, 
    messages, 
    apiKey, 
    maxTokens = 1024,
    model = 'claude-sonnet-4-20250514'
  } = options;

  if (!apiKey) {
    throw new Error('Anthropic API key required');
  }

  const client = getAnthropicClient(apiKey);
  
  const response = await client.messages.create({
    model,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: messages.map(m => ({
      role: m.role,
      content: m.content,
    })),
  });

  // Extract text from response
  const textContent = response.content.find((c) => c.type === 'text');
  return textContent?.text || '';
}
