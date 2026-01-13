import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Card } from '../ui';
import { StoredTask } from '../../lib/storage';
import { Target, CheckCircle2 } from 'lucide-react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';

interface GoalCardProps {
  goal: StoredTask;
  onPress: (goal: StoredTask) => void;
  onDelete: (goalId: string) => void;
  index: number;
}

export function GoalCard({ goal, onPress, onDelete, index }: GoalCardProps) {
  const isCompleted = goal.status === 'done';
  const progress = isCompleted ? 100 : goal.status === 'in-progress' ? 50 : 0;
  
  return (
    <Animated.View 
      layout={Layout.springify()}
      entering={FadeInDown.delay(index * 100).springify()}
      className="mb-3"
    >
      <TouchableOpacity
        onPress={() => onPress(goal)}
        onLongPress={() => onDelete(goal.id)}
        activeOpacity={0.8}
      >
        <Card variant="glass" className={`border-l-4 ${isCompleted ? 'border-l-green-500' : 'border-l-purple-500'} border-white/5`}>
          <View className="flex-row justify-between items-start">
            <View className="flex-1 mr-4">
              <View className="flex-row items-center space-x-2 mb-1">
                {isCompleted && (
                  <CheckCircle2 size={16} color="#4ade80" />
                )}
                <Text 
                  className={`text-base font-bold ${isCompleted ? 'text-slate-400 line-through' : 'text-white'}`}
                  style={{ fontFamily: 'Inter_700Bold' }}
                >
                  {goal.title}
                </Text>
              </View>
              
              {goal.description ? (
                <Text 
                  className="text-slate-400 text-xs leading-5"
                  numberOfLines={2}
                  style={{ fontFamily: 'Inter_400Regular' }}
                >
                  {goal.description}
                </Text>
              ) : null}
            </View>
            
            <View className="items-end">
              <View className={`px-2 py-1 rounded-lg ${isCompleted ? 'bg-green-500/20' : 'bg-purple-500/20'}`}>
                <Text 
                  className={`text-[10px] font-bold uppercase ${isCompleted ? 'text-green-400' : 'text-purple-400'}`}
                  style={{ fontFamily: 'Inter_700Bold' }}
                >
                  {isCompleted ? 'Achieved' : 'Goal'}
                </Text>
              </View>
              {goal.updatedAt && (
                <Text className="text-[10px] text-slate-600 mt-2">
                  {new Date(goal.updatedAt).getFullYear()}
                </Text>
              )}
            </View>
          </View>

          {/* Progress Bar (Simulated for now based on status) */}
          <View className="mt-3 h-1 bg-slate-800 rounded-full overflow-hidden w-full">
            <View 
              className={`h-full rounded-full ${isCompleted ? 'bg-green-500' : 'bg-purple-500'}`} 
              style={{ width: `${progress}%` }} 
            />
          </View>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );
}
