import React, { useMemo } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const LIFE_START_YEAR = 1990; // Configurable
const CURRENT_YEAR = new Date().getFullYear();

// Mock chapters logic
const CHAPTERS = [
    { name: 'Childhood', start: 1990, end: 2008, color: '#3b82f6', icon: '👶' },
    { name: 'College', start: 2008, end: 2012, color: '#10b981', icon: '🎓' },
    { name: 'Career 1.0', start: 2012, end: 2018, color: '#f59e0b', icon: '💼' },
    { name: 'Nomad Life', start: 2018, end: 2021, color: '#8b5cf6', icon: '🌍' },
    { name: 'Current', start: 2021, end: 2030, color: '#ec4899', icon: '🚀' },
];

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
                return (
                    <LinearGradient
                        key={index}
                        colors={isCurrent ? ['#be185d', '#ec4899'] : ['#1e293b', '#334155']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className={`rounded-2xl p-4 w-32 h-40 justify-between ${isCurrent ? '' : 'opacity-80'}`}
                    >
                        <View>
                             <Text className="text-2xl mb-1">{chapter.icon}</Text>
                             <Text className={`font-bold ${isCurrent ? 'text-white' : 'text-slate-200'}`}>
                                 {chapter.name}
                             </Text>
                        </View>
                        <View>
                            <Text className={`${isCurrent ? 'text-pink-100' : 'text-slate-400'} text-xs`}>
                                {chapter.start} - {chapter.end}
                            </Text>
                            <Text className={`${isCurrent ? 'text-pink-100' : 'text-slate-400'} text-xs font-bold`}>
                                {(chapter.end - chapter.start)} Years
                            </Text>
                        </View>
                    </LinearGradient>
                )
            })}
        </ScrollView>
    </View>
  );
}
