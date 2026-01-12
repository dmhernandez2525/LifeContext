/**
 * Insights Screen - AI-powered pattern analysis and life insights
 */
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAnalysis, AnalysisPattern } from '../../src/hooks';
import { getRecordings, getJournalEntries, getBrainDumps } from '../../src/lib/storage';

export default function InsightsScreen() {
  const { isLoading, patterns, error, hasApiKey, analyze } = useAnalysis();
  const [stats, setStats] = useState({ recordings: 0, journals: 0, brainDumps: 0 });
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  
  // Load stats on mount
  useEffect(() => {
    const recordings = getRecordings();
    const journals = getJournalEntries();
    const brainDumps = getBrainDumps();
    
    setStats({
      recordings: recordings.length,
      journals: journals.length,
      brainDumps: brainDumps.length,
    });
  }, []);
  
  const handleAnalyze = async () => {
    setHasAnalyzed(true);
    await analyze();
  };
  
  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'health': return '❤️';
      case 'career': return '💼';
      case 'relationships': return '👥';
      case 'personal-growth': return '🌱';
      case 'productivity': return '⚡';
      default: return '💡';
    }
  };
  
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    return 'text-orange-400';
  };
  
  const totalEntries = stats.recordings + stats.journals + stats.brainDumps;
  
  return (
    <SafeAreaView className="flex-1 bg-dark-background" edges={['top']}>
      <ScrollView className="flex-1 p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-white">Insights</Text>
          <Text className="text-dark-text-secondary mt-1">
            AI-powered patterns from your life context
          </Text>
        </View>
        
        {/* Stats Overview */}
        <View className="bg-dark-surface rounded-2xl p-5 border border-dark-border mb-4">
          <Text className="text-dark-text-secondary text-sm uppercase tracking-wide mb-4">
            Your Data
          </Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-white">{stats.recordings}</Text>
              <Text className="text-dark-text-secondary text-xs mt-1">Recordings</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-white">{stats.journals}</Text>
              <Text className="text-dark-text-secondary text-xs mt-1">Journals</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-white">{stats.brainDumps}</Text>
              <Text className="text-dark-text-secondary text-xs mt-1">Brain Dumps</Text>
            </View>
          </View>
        </View>
        
        {/* API Key Warning */}
        {!hasApiKey && (
          <View className="bg-amber-900/20 border border-amber-700 rounded-xl p-4 mb-4">
            <Text className="text-amber-400 font-semibold mb-1">⚠️ Demo Mode</Text>
            <Text className="text-amber-200/70 text-sm">
              Add your Claude API key in Settings for real AI-powered insights.
            </Text>
          </View>
        )}
        
        {/* Analyze Button */}
        {!hasAnalyzed && !isLoading && (
          <Pressable
            onPress={handleAnalyze}
            disabled={totalEntries === 0}
            className={`rounded-xl p-4 mb-4 ${
              totalEntries > 0 
                ? 'bg-brand-500 active:opacity-80' 
                : 'bg-dark-border'
            }`}
          >
            <Text className={`text-center font-semibold ${
              totalEntries > 0 ? 'text-white' : 'text-dark-text-secondary'
            }`}>
              {totalEntries > 0 ? '✨ Analyze My Patterns' : 'Add content to analyze'}
            </Text>
          </Pressable>
        )}
        
        {/* Loading */}
        {isLoading && (
          <View className="items-center py-12">
            <ActivityIndicator size="large" color="#0ea5e9" />
            <Text className="text-brand-400 mt-4">Analyzing patterns...</Text>
          </View>
        )}
        
        {/* Error */}
        {error && (
          <View className="bg-red-900/20 border border-red-700 rounded-xl p-4 mb-4">
            <Text className="text-red-400">{error}</Text>
          </View>
        )}
        
        {/* Patterns */}
        {patterns.length > 0 && (
          <View className="mb-4">
            <Text className="text-dark-text-secondary text-sm uppercase tracking-wide mb-3">
              Discovered Patterns
            </Text>
            {patterns.map((pattern, index) => (
              <PatternCard key={index} pattern={pattern} />
            ))}
          </View>
        )}
        
        {/* Empty State */}
        {hasAnalyzed && !isLoading && patterns.length === 0 && (
          <View className="bg-dark-surface rounded-2xl p-8 border border-dark-border items-center">
            <Text className="text-4xl mb-4">🔍</Text>
            <Text className="text-white font-semibold text-lg text-center mb-2">
              No Patterns Found
            </Text>
            <Text className="text-dark-text-secondary text-center">
              Add more recordings, journals, and brain dumps to discover patterns.
            </Text>
          </View>
        )}
        
        {/* Initial Empty State */}
        {!hasAnalyzed && !isLoading && totalEntries === 0 && (
          <View className="bg-dark-surface rounded-2xl p-8 border border-dark-border items-center">
            <Text className="text-4xl mb-4">📊</Text>
            <Text className="text-white font-semibold text-lg text-center mb-2">
              Start Your Journey
            </Text>
            <Text className="text-dark-text-secondary text-center">
              Record brain dumps and journal entries to unlock personalized insights 
              about your life patterns.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Pattern Card Component
function PatternCard({ pattern }: { pattern: AnalysisPattern }) {
  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'health': return '❤️';
      case 'career': return '💼';
      case 'relationships': return '👥';
      case 'personal-growth': return '🌱';
      case 'productivity': return '⚡';
      default: return '💡';
    }
  };
  
  return (
    <View className="bg-dark-surface rounded-xl p-4 border border-dark-border mb-3">
      {/* Header */}
      <View className="flex-row items-center mb-2">
        <Text className="text-xl mr-2">{getCategoryEmoji(pattern.category)}</Text>
        <Text className="text-white font-semibold flex-1">{pattern.pattern}</Text>
        <Text className={`text-xs ${
          pattern.confidence >= 0.8 ? 'text-green-400' : 
          pattern.confidence >= 0.6 ? 'text-yellow-400' : 'text-orange-400'
        }`}>
          {Math.round(pattern.confidence * 100)}%
        </Text>
      </View>
      
      {/* Description */}
      <Text className="text-dark-text-secondary text-sm leading-5 mb-3">
        {pattern.description}
      </Text>
      
      {/* Recommendation */}
      <View className="bg-brand-900/20 border border-brand-800 rounded-lg p-3">
        <Text className="text-brand-400 text-sm">
          💡 {pattern.recommendation}
        </Text>
      </View>
    </View>
  );
}
