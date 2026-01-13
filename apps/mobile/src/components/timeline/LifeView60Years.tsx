import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { MapPin } from 'lucide-react-native';

interface LifeView60YearsProps {
  birthYear?: number;
  currentYear?: number;
  onDecadePress?: (decade: string) => void;
}

const DECADES = ['1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s', '2030s', '2040s', '2050s'];

export function LifeView60Years({ 
  birthYear = 1990, 
  currentYear = new Date().getFullYear(),
  onDecadePress 
}: LifeView60YearsProps) {
  
  const currentDecade = useMemo(() => {
    const decadeStart = Math.floor(currentYear / 10) * 10;
    return `${decadeStart}s`;
  }, [currentYear]);

  const ageAtDecade = (decade: string) => {
    const decadeStart = parseInt(decade.slice(0, 4));
    const age = decadeStart - birthYear;
    if (age < 0) return null;
    if (age > 100) return null;
    return age;
  };

  const isLivedDecade = (decade: string) => {
    const decadeStart = parseInt(decade.slice(0, 4));
    return decadeStart >= birthYear - (birthYear % 10) && decadeStart <= currentYear;
  };

  const isFutureDecade = (decade: string) => {
    const decadeStart = parseInt(decade.slice(0, 4));
    return decadeStart > currentYear;
  };

  return (
    <View className="py-4">
      <View className="flex-row items-center justify-between px-6 mb-4">
        <Text className="text-white text-lg font-bold" style={{ fontFamily: 'Inter_700Bold' }}>
          Your Life Journey
        </Text>
        <Text className="text-slate-400 text-sm" style={{ fontFamily: 'Inter_400Regular' }}>
          60 Years View
        </Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
      >
        {DECADES.map((decade, index) => {
          const age = ageAtDecade(decade);
          const isCurrentDecade = decade === currentDecade;
          const isLived = isLivedDecade(decade);
          const isFuture = isFutureDecade(decade);

          return (
            <Animated.View 
              key={decade}
              entering={FadeInUp.delay(index * 50).springify().damping(15)}
            >
              <TouchableOpacity
                onPress={() => onDecadePress?.(decade)}
                className={`mr-3 items-center ${!isLived && !isFuture ? 'opacity-30' : ''}`}
              >
                {/* Decade Segment */}
                <View 
                  className={`w-16 h-24 rounded-xl items-center justify-center relative ${
                    isCurrentDecade 
                      ? 'bg-blue-600' 
                      : isLived 
                        ? 'bg-slate-700' 
                        : 'bg-slate-800/50 border border-dashed border-slate-700'
                  }`}
                >
                  {/* "You are here" marker */}
                  {isCurrentDecade && (
                    <View className="absolute -top-3 bg-blue-500 px-2 py-0.5 rounded-full">
                      <MapPin size={12} color="#fff" />
                    </View>
                  )}

                  {/* Age label */}
                  {age !== null && age >= 0 && (
                    <Text className={`text-2xl font-bold ${isCurrentDecade ? 'text-white' : 'text-slate-300'}`}>
                      {age}s
                    </Text>
                  )}

                  {/* Life stage indicator */}
                  <Text className={`text-[10px] mt-1 ${isCurrentDecade ? 'text-blue-200' : 'text-slate-500'}`}>
                    {age !== null && age < 20 ? 'Youth' : 
                     age !== null && age < 40 ? 'Prime' : 
                     age !== null && age < 60 ? 'Peak' : 
                     age !== null && age < 80 ? 'Wisdom' : ''}
                  </Text>
                </View>

                {/* Decade Label */}
                <Text className={`mt-2 text-xs font-medium ${isCurrentDecade ? 'text-blue-400' : 'text-slate-400'}`}>
                  {decade}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>

      {/* Progress Line */}
      <View className="px-6 mt-4">
        <View className="h-1 bg-slate-800 rounded-full overflow-hidden">
          <View 
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
            style={{ 
              width: `${Math.min(((currentYear - birthYear) / 80) * 100, 100)}%` 
            }}
          />
        </View>
        <View className="flex-row justify-between mt-2">
          <Text className="text-slate-500 text-xs">Born {birthYear}</Text>
          <Text className="text-slate-500 text-xs">Now: {currentYear - birthYear} years</Text>
        </View>
      </View>
    </View>
  );
}
