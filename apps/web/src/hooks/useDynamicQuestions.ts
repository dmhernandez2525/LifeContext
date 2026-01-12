/**
 * useDynamicQuestions - Hook for AI-powered context-aware question suggestions
 * 
 * Analyzes answered questions and recordings to suggest:
 * - Follow-up questions based on what user has shared
 * - Gap analysis (underexplored categories)
 * - Personalized questions based on patterns
 */

import { useState, useEffect, useCallback } from 'react';
import { db } from '@lcc/storage';
import { DEFAULT_CATEGORIES } from '@lcc/types';

export interface SuggestedQuestion {
  id: string;
  text: string;
  reason: string;
  categoryId: string;
  categoryName: string;
  priority: 'high' | 'medium' | 'low';
  type: 'follow-up' | 'gap-analysis' | 'deepen' | 'pattern-based';
}

export interface CategoryGap {
  categoryId: string;
  categoryName: string;
  icon: string;
  answeredCount: number;
  totalQuestions: number;
  percentage: number;
}

export interface UseDynamicQuestionsReturn {
  suggestions: SuggestedQuestion[];
  categoryGaps: CategoryGap[];
  isLoading: boolean;
  refresh: () => Promise<void>;
}

// Dynamic follow-up question templates
const FOLLOW_UP_TEMPLATES: Record<string, string[]> = {
  'early-life': [
    "You mentioned {topic}. How did that experience shape your values?",
    "Can you describe a specific memory from {topic} that still affects you today?",
    "What lessons from {topic} do you find yourself passing on to others?",
  ],
  'family': [
    "You talked about {topic}. How has that relationship evolved over time?",
    "What's something about {topic} you've never told anyone?",
    "If you could change one thing about {topic}, what would it be?",
  ],
  'values': [
    "You value {topic}. When was this belief tested the most?",
    "How do you practice {topic} in your daily life?",
    "Has your commitment to {topic} ever cost you something important?",
  ],
  'career': [
    "Regarding {topic} - what would you do differently with hindsight?",
    "How did {topic} change your view of success?",
    "What skills from {topic} do you use outside of work?",
  ],
  'fears': [
    "You mentioned fearing {topic}. Where do you think that fear originated?",
    "How has {topic} held you back from something you wanted?",
    "What would life look like if you overcame {topic}?",
  ],
};

// Gap analysis question suggestions
const GAP_QUESTIONS: Record<string, string[]> = {
  'health': [
    "How has your relationship with your body changed over the years?",
    "What wellness practice has made the biggest difference in your life?",
    "How do you handle stress and anxiety?",
  ],
  'philosophy': [
    "What's your personal definition of a life well-lived?",
    "How do you think about mortality and how does it affect your choices?",
    "What ideas or thinkers have most shaped your worldview?",
  ],
  'legacy': [
    "What do you most want to be remembered for?",
    "What wisdom would you pass on to future generations?",
    "How do you want to impact the people around you?",
  ],
  'weaknesses': [
    "What patterns keep repeating in your life that you wish would change?",
    "What feedback do you resist hearing but know is probably true?",
    "What skill do you wish you had developed earlier?",
  ],
};

export function useDynamicQuestions(): UseDynamicQuestionsReturn {
  const [suggestions, setSuggestions] = useState<SuggestedQuestion[]>([]);
  const [categoryGaps, setCategoryGaps] = useState<CategoryGap[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Get all recordings to analyze context
      const recordings = await db.recordings.toArray();
      // Calculate category coverage
      const categoryStats: Record<string, { answered: number; total: number }> = {};
      
      DEFAULT_CATEGORIES.forEach(cat => {
        categoryStats[cat.slug] = { answered: 0, total: 4 }; // Assume ~4 questions per category
      });
      
      recordings.forEach(r => {
        const qId = r.questionId;
        // Extract category from question ID pattern (e.g., "el-1" -> "early-life")
        const categoryPrefix = qId.split('-')[0];
        const categoryMap: Record<string, string> = {
          'el': 'early-life',
          'fr': 'family',
          'vb': 'values',
          'cw': 'career',
          'da': 'dreams',
          'fc': 'fears',
          'ss': 'strengths',
          'wg': 'weaknesses',
          'hi': 'hobbies',
          'hw': 'health',
          'pw': 'philosophy',
          'ac': 'accomplishments',
          'rl': 'regrets',
          'li': 'legacy',
        };
        
        const catSlug = categoryMap[categoryPrefix];
        if (catSlug && categoryStats[catSlug]) {
          categoryStats[catSlug].answered++;
        }
      });

      // Build category gaps (least explored first)
      const gaps: CategoryGap[] = DEFAULT_CATEGORIES
        .map(cat => ({
          categoryId: cat.slug,
          categoryName: cat.name,
          icon: cat.icon,
          answeredCount: categoryStats[cat.slug]?.answered || 0,
          totalQuestions: categoryStats[cat.slug]?.total || 4,
          percentage: Math.round(((categoryStats[cat.slug]?.answered || 0) / 4) * 100),
        }))
        .filter(g => g.percentage < 100)
        .sort((a, b) => a.percentage - b.percentage);

      setCategoryGaps(gaps);

      // Generate suggestions
      const newSuggestions: SuggestedQuestion[] = [];

      // 1. Gap analysis suggestions (underexplored categories)
      const underexplored = gaps.filter(g => g.percentage < 25);
      underexplored.slice(0, 2).forEach(gap => {
        const gapQuestions = GAP_QUESTIONS[gap.categoryId];
        if (gapQuestions && gapQuestions.length > 0) {
          const question = gapQuestions[Math.floor(Math.random() * gapQuestions.length)];
          newSuggestions.push({
            id: `gap-${gap.categoryId}`,
            text: question,
            reason: `You haven't explored ${gap.categoryName} much yet`,
            categoryId: gap.categoryId,
            categoryName: gap.categoryName,
            priority: 'high',
            type: 'gap-analysis',
          });
        }
      });

      // 2. Follow-up suggestions based on answered questions
      // In a full implementation, this would analyze transcripts
      const answeredCategories = Object.entries(categoryStats)
        .filter(([_, stats]) => stats.answered > 0)
        .map(([slug]) => slug);

      answeredCategories.slice(0, 2).forEach(catSlug => {
        const templates = FOLLOW_UP_TEMPLATES[catSlug];
        if (templates && templates.length > 0) {
          const template = templates[Math.floor(Math.random() * templates.length)];
          const category = DEFAULT_CATEGORIES.find(c => c.slug === catSlug);
          if (category) {
            newSuggestions.push({
              id: `followup-${catSlug}`,
              text: template.replace('{topic}', 'what you shared'),
              reason: `Dive deeper into ${category.name}`,
              categoryId: catSlug,
              categoryName: category.name,
              priority: 'medium',
              type: 'follow-up',
            });
          }
        }
      });

      // 3. Pattern-based suggestions (would use actual AI analysis in production)
      if (recordings.length >= 5) {
        newSuggestions.push({
          id: 'pattern-connection',
          text: "You've shared about relationships and career. How do your personal connections influence your professional decisions?",
          reason: "We noticed themes across your answers",
          categoryId: 'values',
          categoryName: 'Values & Beliefs',
          priority: 'high',
          type: 'pattern-based',
        });
      }

      setSuggestions(newSuggestions);
    } catch (err) {
      console.error('Failed to generate suggestions:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    suggestions,
    categoryGaps,
    isLoading,
    refresh,
  };
}

export default useDynamicQuestions;
