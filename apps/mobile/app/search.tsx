/**
 * Search Screen - Full-text search across all content
 */
import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { 
  Search as SearchIcon, 
  X, 
  Mic, 
  BookOpen, 
  Brain,
  Clock,
  ChevronRight,
  Filter,
} from 'lucide-react-native';
import { Card } from '../src/components/ui';
import * as storage from '../src/lib/storage';

// ============================================================
// TYPES
// ============================================================

interface SearchResult {
  id: string;
  type: 'recording' | 'journal' | 'brain-dump';
  title: string;
  preview: string;
  date: Date;
  matchCount: number;
}

type FilterType = 'all' | 'recording' | 'journal' | 'brain-dump';

// ============================================================
// FILTERS
// ============================================================

const FILTERS: { type: FilterType; label: string; color: string }[] = [
  { type: 'all', label: 'All', color: '#64748b' },
  { type: 'recording', label: 'Recordings', color: '#3b82f6' },
  { type: 'journal', label: 'Journal', color: '#10b981' },
  { type: 'brain-dump', label: 'Brain Dumps', color: '#a855f7' },
];

// ============================================================
// HELPERS
// ============================================================

function formatDate(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getTypeIcon(type: SearchResult['type']) {
  switch (type) {
    case 'recording': return Mic;
    case 'journal': return BookOpen;
    case 'brain-dump': return Brain;
  }
}

function getTypeColor(type: SearchResult['type']): string {
  switch (type) {
    case 'recording': return '#3b82f6';
    case 'journal': return '#10b981';
    case 'brain-dump': return '#a855f7';
  }
}

// ============================================================
// SEARCH RESULT ITEM
// ============================================================

interface SearchResultItemProps {
  result: SearchResult;
  query: string;
  index: number;
  onPress: () => void;
}

function SearchResultItem({ result, query, index, onPress }: SearchResultItemProps) {
  const IconComponent = getTypeIcon(result.type);
  const color = getTypeColor(result.type);

  // Highlight matching text
  const highlightText = (text: string) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => (
      part.toLowerCase() === query.toLowerCase() ? (
        <Text key={i} className="text-primary-400 font-semibold">{part}</Text>
      ) : (
        <Text key={i}>{part}</Text>
      )
    ));
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 50).springify().damping(15)}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Card variant="glass" className="border-white/5 mb-3">
          <View className="flex-row items-start">
            <View 
              className="w-10 h-10 rounded-xl items-center justify-center"
              style={{ backgroundColor: `${color}20` }}
            >
              <IconComponent size={18} color={color} />
            </View>
            
            <View className="flex-1 ml-3">
              <Text 
                className="text-white font-semibold text-base" 
                style={{ fontFamily: 'Inter_600SemiBold' }}
                numberOfLines={1}
              >
                {highlightText(result.title)}
              </Text>
              <Text 
                className="text-slate-400 text-sm mt-1 leading-5" 
                style={{ fontFamily: 'Inter_400Regular' }}
                numberOfLines={2}
              >
                {highlightText(result.preview)}
              </Text>
              
              <View className="flex-row items-center mt-2">
                <Clock size={12} color="#64748b" />
                <Text className="text-slate-500 text-xs ml-1" style={{ fontFamily: 'Inter_400Regular' }}>
                  {formatDate(result.date)}
                </Text>
                {result.matchCount > 1 && (
                  <Text className="text-primary-400 text-xs ml-3" style={{ fontFamily: 'Inter_600SemiBold' }}>
                    {result.matchCount} matches
                  </Text>
                )}
              </View>
            </View>
            
            <ChevronRight size={20} color="#64748b" />
          </View>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    
    const results: SearchResult[] = [];
    const searchTerm = query.toLowerCase();

    // Search recordings
    if (activeFilter === 'all' || activeFilter === 'recording') {
      const recordings = storage.getRecordings();
      for (const rec of recordings) {
        const text = rec.transcriptionText || '';
        if (text.toLowerCase().includes(searchTerm)) {
          results.push({
            id: rec.id,
            type: 'recording',
            title: 'Voice Recording',
            preview: text.slice(0, 150),
            date: new Date(rec.createdAt),
            matchCount: (text.match(new RegExp(searchTerm, 'gi')) || []).length,
          });
        }
      }
    }

    // Search journals
    if (activeFilter === 'all' || activeFilter === 'journal') {
      const journals = storage.getJournalEntries();
      for (const journal of journals) {
        const text = journal.content || '';
        if (text.toLowerCase().includes(searchTerm)) {
          results.push({
            id: journal.id,
            type: 'journal',
            title: 'Journal Entry',
            preview: text.slice(0, 150),
            date: new Date(journal.createdAt),
            matchCount: (text.match(new RegExp(searchTerm, 'gi')) || []).length,
          });
        }
      }
    }

    // Search brain dumps
    if (activeFilter === 'all' || activeFilter === 'brain-dump') {
      const dumps = storage.getBrainDumps();
      for (const dump of dumps) {
        const text = (dump.title || '') + ' ' + (dump.synthesis?.organizedContent || '');
        if (text.toLowerCase().includes(searchTerm)) {
          results.push({
            id: dump.id,
            type: 'brain-dump',
            title: dump.title || 'Brain Dump',
            preview: dump.synthesis?.organizedContent?.slice(0, 150) || '',
            date: new Date(dump.createdAt),
            matchCount: (text.match(new RegExp(searchTerm, 'gi')) || []).length,
          });
        }
      }
    }

    // Sort by match count and date
    return results.sort((a, b) => {
      if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount;
      return b.date.getTime() - a.date.getTime();
    });
  }, [query, activeFilter]);

  const handleResultPress = useCallback((result: SearchResult) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    switch (result.type) {
      case 'recording':
        router.push(`/recordings/${result.id}`);
        break;
      case 'journal':
        // TODO: Navigate to journal detail
        break;
      case 'brain-dump':
        // TODO: Navigate to brain dump detail
        break;
    }
  }, [router]);

  const handleClear = useCallback(() => {
    setQuery('');
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={['top']}>
      {/* Search Header */}
      <View className="px-6 pt-4 pb-4">
        <View className="flex-row items-center bg-slate-800 rounded-2xl border border-white/5 px-4">
          <SearchIcon size={20} color="#64748b" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search recordings, journals, notes..."
            placeholderTextColor="#64748b"
            className="flex-1 text-white text-base py-3 px-3"
            style={{ fontFamily: 'Inter_400Regular' }}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={handleClear}>
              <X size={20} color="#64748b" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filters */}
      <View className="px-6 pb-4">
        <View className="flex-row gap-2">
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.type}
              onPress={() => setActiveFilter(filter.type)}
              className={`px-4 py-2 rounded-full border ${
                activeFilter === filter.type 
                  ? 'bg-primary-500/20 border-primary-500' 
                  : 'bg-slate-800 border-white/5'
              }`}
            >
              <Text 
                className={`text-sm ${
                  activeFilter === filter.type ? 'text-primary-400' : 'text-slate-400'
                }`}
                style={{ fontFamily: activeFilter === filter.type ? 'Inter_600SemiBold' : 'Inter_400Regular' }}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Results */}
      <FlatList
        data={searchResults}
        keyExtractor={(item) => `${item.type}-${item.id}`}
        renderItem={({ item, index }) => (
          <SearchResultItem
            result={item}
            query={query}
            index={index}
            onPress={() => handleResultPress(item)}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          query.length > 0 ? (
            <View className="items-center py-12">
              <SearchIcon size={48} color="#475569" />
              <Text className="text-slate-400 text-base mt-4 text-center" style={{ fontFamily: 'Inter_600SemiBold' }}>
                No results found
              </Text>
              <Text className="text-slate-500 text-sm mt-2 text-center" style={{ fontFamily: 'Inter_400Regular' }}>
                Try different keywords or filters
              </Text>
            </View>
          ) : (
            <View className="items-center py-12">
              <Text className="text-slate-500 text-sm text-center" style={{ fontFamily: 'Inter_400Regular' }}>
                Start typing to search your context
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}
