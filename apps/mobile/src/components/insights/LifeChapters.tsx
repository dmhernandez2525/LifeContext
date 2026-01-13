import React, { useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Briefcase, Heart, MapPin, Activity, Star } from 'lucide-react-native';

const LIFE_START_YEAR = 1990;
const CURRENT_YEAR = new Date().getFullYear();

// Enhanced chapters with mood, transitions, themes, and stats
type MoodSummary = 'positive' | 'neutral' | 'challenging' | 'mixed';
type TransitionType = 'career' | 'relationship' | 'location' | 'health';

interface Chapter {
  name: string;
  start: number;
  end: number;
  icon: string;
  moodSummary: MoodSummary;
  transitions: TransitionType[];
  themes: string[];
  recordings: number;
  journals: number;
  richness: number; // 0-100
}

const CHAPTERS: Chapter[] = [
  { name: 'Childhood', start: 1990, end: 2008, icon: '👶', moodSummary: 'positive', transitions: [], themes: ['Family', 'Learning'], recordings: 0, journals: 2, richness: 15 },
  { name: 'College', start: 2008, end: 2012, icon: '🎓', moodSummary: 'mixed', transitions: ['location'], themes: ['Education', 'Friends', 'Discovery'], recordings: 3, journals: 8, richness: 45 },
  { name: 'Career 1.0', start: 2012, end: 2018, icon: '💼', moodSummary: 'challenging', transitions: ['career', 'relationship'], themes: ['Work', 'Ambition', 'Burnout'], recordings: 12, journals: 21, richness: 70 },
  { name: 'Nomad Life', start: 2018, end: 2021, icon: '🌍', moodSummary: 'positive', transitions: ['location', 'career'], themes: ['Travel', 'Freedom', 'Growth'], recordings: 28, journals: 45, richness: 85 },
  { name: 'Current', start: 2021, end: 2030, icon: '🚀', moodSummary: 'positive', transitions: ['health'], themes: ['Purpose', 'Balance', 'Creation'], recordings: 15, journals: 30, richness: 60 },
];

const getMoodGradient = (mood: MoodSummary, isCurrent: boolean): [string, string] => {
  if (isCurrent) return ['#be185d', '#ec4899'];
  switch (mood) {
    case 'positive': return ['#065f46', '#10b981'];
    case 'challenging': return ['#92400e', '#f59e0b'];
    case 'mixed': return ['#312e81', '#6366f1'];
    case 'neutral': default: return ['#1e293b', '#334155'];
  }
};

const TransitionIcon = ({ type }: { type: TransitionType }) => {
  const size = 12;
  const color = '#94a3b8';
  switch (type) {
    case 'career': return <Briefcase size={size} color={color} />;
    case 'relationship': return <Heart size={size} color={color} />;
    case 'location': return <MapPin size={size} color={color} />;
    case 'health': return <Activity size={size} color={color} />;
    default: return null;
  }
};

export function LifeChapters() {
  const currentChapter = CHAPTERS[CHAPTERS.length - 1];

  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-4 px-6">
        <Text className="text-white font-bold text-lg">Life Chapters</Text>
        <Text className="text-slate-500 text-xs">Macro View</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}>
        {CHAPTERS.map((chapter, index) => {
          const isCurrent = chapter === currentChapter;
          const gradient = getMoodGradient(chapter.moodSummary, isCurrent);
          return (
            <LinearGradient
              key={index}
              colors={gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className={`rounded-2xl p-4 w-36 h-48 justify-between ${isCurrent ? '' : 'opacity-90'}`}
            >
              <View>
                <Text className="text-2xl mb-1">{chapter.icon}</Text>
                <Text className={`font-bold ${isCurrent ? 'text-white' : 'text-slate-100'}`}>
                  {chapter.name}
                </Text>
                {/* Transition Icons */}
                {chapter.transitions.length > 0 && (
                  <View className="flex-row gap-1 mt-1">
                    {chapter.transitions.map((t, i) => (
                      <TransitionIcon key={i} type={t} />
                    ))}
                  </View>
                )}
              </View>

              {/* Themes Chips */}
              <View className="flex-row flex-wrap gap-1 my-2">
                {chapter.themes.slice(0, 2).map((theme, i) => (
                  <View key={i} className="bg-white/20 px-2 py-0.5 rounded-full">
                    <Text className="text-white text-[9px]">{theme}</Text>
                  </View>
                ))}
              </View>

              {/* Richness Bar */}
              <View className="mb-2">
                <View className="h-1 bg-white/20 rounded-full overflow-hidden">
                  <View className="h-full bg-white/60 rounded-full" style={{ width: `${chapter.richness}%` }} />
                </View>
                <Text className="text-white/50 text-[8px] mt-0.5">{chapter.richness}% richness</Text>
              </View>

              <View>
                <Text className={`${isCurrent ? 'text-pink-100' : 'text-slate-300'} text-xs`}>
                  {chapter.start} - {chapter.end}
                </Text>
                <Text className={`${isCurrent ? 'text-pink-100' : 'text-slate-400'} text-[10px]`}>
                  {chapter.recordings}r • {chapter.journals}j
                </Text>
              </View>
            </LinearGradient>
          )
        })}
      </ScrollView>
    </View>
  );
}

