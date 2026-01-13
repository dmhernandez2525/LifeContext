/**
 * MediaTypeSelector - Select journal entry type (Text, Voice, Photo, Video)
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  FadeIn,
} from 'react-native-reanimated';
import { 
  Type, 
  Mic, 
  Image as ImageIcon, 
  Video,
  LucideIcon,
} from 'lucide-react-native';

// ============================================================
// TYPES
// ============================================================

export type MediaType = 'text' | 'voice' | 'photo' | 'video';

interface MediaTypeSelectorProps {
  value: MediaType;
  onChange: (type: MediaType) => void;
  disabled?: boolean;
}

interface MediaTypeOption {
  type: MediaType;
  icon: LucideIcon;
  label: string;
  color: string;
}

// ============================================================
// OPTIONS
// ============================================================

const MEDIA_TYPES: MediaTypeOption[] = [
  { type: 'text', icon: Type, label: 'Text', color: '#3b82f6' },
  { type: 'voice', icon: Mic, label: 'Voice', color: '#10b981' },
  { type: 'photo', icon: ImageIcon, label: 'Photo', color: '#f59e0b' },
  { type: 'video', icon: Video, label: 'Video', color: '#a855f7' },
];

// ============================================================
// MAIN COMPONENT
// ============================================================

export function MediaTypeSelector({ value, onChange, disabled = false }: MediaTypeSelectorProps) {
  const handleSelect = (type: MediaType) => {
    if (disabled) return;
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onChange(type);
  };

  return (
    <View style={styles.container}>
      {MEDIA_TYPES.map((option, index) => {
        const isSelected = value === option.type;
        const IconComponent = option.icon;
        
        return (
          <TouchableOpacity
            key={option.type}
            style={[
              styles.option,
              isSelected && { backgroundColor: `${option.color}20`, borderColor: option.color },
            ]}
            onPress={() => handleSelect(option.type)}
            activeOpacity={0.7}
            disabled={disabled}
          >
            <Animated.View
              entering={FadeIn.delay(index * 50)}
              style={styles.optionContent}
            >
              <IconComponent 
                size={20} 
                color={isSelected ? option.color : '#64748b'} 
                strokeWidth={isSelected ? 2.5 : 2}
              />
              <Text 
                style={[
                  styles.optionLabel, 
                  isSelected && { color: option.color }
                ]}
              >
                {option.label}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  option: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
  },
  optionContent: {
    alignItems: 'center',
    gap: 6,
  },
  optionLabel: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#64748b',
  },
});
