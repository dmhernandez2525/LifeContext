import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export type Decade = '2020s' | '2030s' | '2040s' | '2050s' | '2060s' | '2070s+';

interface LifeTimelineProps {
  selectedDecade: Decade;
  onSelectDecade: (decade: Decade) => void;
}

const DECADES: { id: Decade; label: string; color: string; gradient: [string, string] }[] = [
  { id: '2020s', label: '2020s', color: '#60a5fa', gradient: ['#3b82f6', '#60a5fa'] },
  { id: '2030s', label: '2030s', color: '#a78bfa', gradient: ['#8b5cf6', '#a78bfa'] },
  { id: '2040s', label: '2040s', color: '#f472b6', gradient: ['#ec4899', '#f472b6'] },
  { id: '2050s', label: '2050s', color: '#fb923c', gradient: ['#f97316', '#fb923c'] },
  { id: '2060s', label: '2060s', color: '#facc15', gradient: ['#eab308', '#facc15'] },
  { id: '2070s+', label: '2070s+', color: '#4ade80', gradient: ['#22c55e', '#4ade80'] },
];

export function LifeTimeline({ selectedDecade, onSelectDecade }: LifeTimelineProps) {
  return (
    <View className="mb-6">
      <View className="px-6 mb-3">
        <Text className="text-white text-lg font-bold" style={{ fontFamily: 'Inter_700Bold' }}>
          Your Timeline
        </Text>
        <Text className="text-slate-400 text-xs" style={{ fontFamily: 'Inter_400Regular' }}>
          Visualize your journey through the decades
        </Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={{ paddingHorizontal: 24 }}
        className="flex-row"
      >
        {DECADES.map((decade) => {
          const isSelected = selectedDecade === decade.id;
          
          return (
            <TouchableOpacity
              key={decade.id}
              onPress={() => onSelectDecade(decade.id)}
              activeOpacity={0.8}
              className={`mr-3 items-center justify-center rounded-2xl overflow-hidden ${isSelected ? 'h-32 w-24' : 'h-28 w-20'} transition-all`}
            >
              <LinearGradient
                colors={isSelected ? decade.gradient : ['#1e293b', '#0f172a']}
                className="absolute inset-0"
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              
              <View className="items-center z-10 p-2">
                <Text 
                  className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-slate-500'}`}
                  style={{ fontFamily: 'Inter_700Bold' }}
                >
                  {decade.label.replace('s', '')}
                </Text>
                <Text 
                  className={`text-xs ${isSelected ? 'text-white/80' : 'text-slate-600'}`}
                  style={{ fontFamily: 'Inter_500Medium' }}
                >
                  s
                </Text>
                
                {isSelected && (
                  <View className="mt-2 w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </View>

              {/* Decorative circle glow */}
              {isSelected && (
                <View className="absolute -bottom-8 -right-8 w-24 h-24 bg-white/10 rounded-full blur-xl" />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
