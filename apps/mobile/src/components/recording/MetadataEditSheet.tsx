import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Platform, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { BaseBottomSheet } from '@/components/navigation/BottomSheets/BaseBottomSheet';
import { Tag, Edit3, Lock, Globe, Users, Check, X, LucideIcon } from 'lucide-react-native';

type PrivacyLevel = 'private' | 'family' | 'public' | 'legacy';

interface MetadataEditSheetProps {
  isVisible: boolean;
  onClose: () => void;
  initialTitle?: string;
  initialTags?: string[];
  initialPrivacy?: PrivacyLevel;
  onSave: (data: { title: string; tags: string[]; privacy: PrivacyLevel }) => void;
}

const PRIVACY_OPTIONS: { level: PrivacyLevel; icon: LucideIcon; label: string; description: string; color: string }[] = [
  { level: 'private', icon: Lock, label: 'Private', description: 'Only you', color: '#6366f1' },
  { level: 'family', icon: Users, label: 'Family', description: 'Family circle', color: '#10b981' },
  { level: 'public', icon: Globe, label: 'Public', description: 'Everyone', color: '#3b82f6' },
  { level: 'legacy', icon: Lock, label: 'Legacy', description: 'After passing', color: '#f59e0b' },
];

const SUGGESTED_TAGS = ['personal', 'work', 'health', 'family', 'reflection', 'goals', 'gratitude', 'milestone'];

export function MetadataEditSheet({ 
  isVisible, 
  onClose, 
  initialTitle = '', 
  initialTags = [], 
  initialPrivacy = 'private',
  onSave 
}: MetadataEditSheetProps) {
  const [title, setTitle] = useState(initialTitle);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [privacy, setPrivacy] = useState<PrivacyLevel>(initialPrivacy);
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim().toLowerCase())) {
      setTags([...tags, newTag.trim().toLowerCase()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleToggleSuggestedTag = (tag: string) => {
    if (tags.includes(tag)) {
      handleRemoveTag(tag);
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleSave = () => {
    onSave({ title, tags, privacy });
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    onClose();
  };

  return (
    <BaseBottomSheet
      index={isVisible ? 0 : -1}
      onClose={onClose}
      snapPoints={['75%']}
    >
      <ScrollView className="flex-1 px-6 py-2" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-xl font-bold text-gray-900 dark:text-white">
              Edit Details
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Update metadata and privacy
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-full">
            <X size={20} color="#71717a" />
          </TouchableOpacity>
        </View>

        {/* Title Input */}
        <View className="mb-5">
          <Text className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 ml-1">
            Title
          </Text>
          <View className="flex-row items-center bg-gray-100 dark:bg-zinc-800 rounded-xl px-4">
            <Edit3 size={18} color="#71717a" />
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Recording title..."
              placeholderTextColor="#9ca3af"
              className="flex-1 py-4 px-3 text-base text-gray-900 dark:text-white"
            />
          </View>
        </View>

        {/* Tags */}
        <View className="mb-5">
          <Text className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 ml-1">
            Tags
          </Text>
          
          {/* Tag Input */}
          <View className="flex-row items-center bg-gray-100 dark:bg-zinc-800 rounded-xl px-4 mb-3">
            <Tag size={18} color="#71717a" />
            <TextInput
              value={newTag}
              onChangeText={setNewTag}
              placeholder="Add tag..."
              placeholderTextColor="#9ca3af"
              onSubmitEditing={handleAddTag}
              className="flex-1 py-3 px-3 text-base text-gray-900 dark:text-white"
            />
            {newTag.trim() && (
              <TouchableOpacity onPress={handleAddTag} className="p-2">
                <Check size={18} color="#10b981" />
              </TouchableOpacity>
            )}
          </View>

          {/* Current Tags */}
          {tags.length > 0 && (
            <View className="flex-row flex-wrap gap-2 mb-3">
              {tags.map(tag => (
                <TouchableOpacity 
                  key={tag}
                  onPress={() => handleRemoveTag(tag)}
                  className="bg-indigo-100 dark:bg-indigo-900/30 px-3 py-1.5 rounded-full flex-row items-center"
                >
                  <Text className="text-indigo-700 dark:text-indigo-300 text-sm mr-1">#{tag}</Text>
                  <X size={12} color="#818cf8" />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Suggested Tags */}
          <Text className="text-[10px] text-gray-400 uppercase tracking-wide mb-2 ml-1">
            Suggestions
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {SUGGESTED_TAGS.filter(t => !tags.includes(t)).map(tag => (
              <TouchableOpacity 
                key={tag}
                onPress={() => handleToggleSuggestedTag(tag)}
                className="bg-gray-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full"
              >
                <Text className="text-gray-600 dark:text-gray-400 text-sm">#{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Privacy Level */}
        <View className="mb-6">
          <Text className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 ml-1">
            Privacy
          </Text>
          <View className="gap-2">
            {PRIVACY_OPTIONS.map(option => {
              const Icon = option.icon;
              const isSelected = privacy === option.level;
              return (
                <TouchableOpacity
                  key={option.level}
                  onPress={() => setPrivacy(option.level)}
                  className={`flex-row items-center p-4 rounded-xl border ${
                    isSelected 
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500' 
                      : 'bg-gray-50 dark:bg-zinc-800/50 border-transparent'
                  }`}
                >
                  <View 
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: `${option.color}20` }}
                  >
                    <Icon size={18} color={option.color} />
                  </View>
                  <View className="flex-1">
                    <Text className={`font-semibold ${isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-900 dark:text-white'}`}>
                      {option.label}
                    </Text>
                    <Text className="text-xs text-gray-500 dark:text-gray-400">
                      {option.description}
                    </Text>
                  </View>
                  {isSelected && <Check size={20} color="#6366f1" />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          onPress={handleSave}
          className="bg-indigo-600 h-14 rounded-2xl items-center justify-center mb-8"
        >
          <Text className="font-bold text-white">Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </BaseBottomSheet>
  );
}
