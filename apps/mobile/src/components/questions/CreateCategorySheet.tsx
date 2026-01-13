import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { BaseBottomSheet } from '@/components/navigation/BottomSheets/BaseBottomSheet';
import { Palette, Type, Check, X } from 'lucide-react-native';
import * as questions from '@/lib/questions';

interface CreateCategorySheetProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ICON_OPTIONS = ['user', 'heart', 'briefcase', 'target', 'star', 'activity', 'image', 'users'];
const COLOR_OPTIONS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export const CreateCategorySheet = ({ isVisible, onClose, onSuccess }: CreateCategorySheetProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(ICON_OPTIONS[0]);
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter a category name.');
      return;
    }

    setIsCreating(true);

    try {
      questions.createCategory({
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        name: name.trim(),
        description: description.trim() || 'Custom category',
        icon: selectedIcon,
        color: selectedColor,
      });

      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      setName('');
      setDescription('');
      setSelectedIcon(ICON_OPTIONS[0]);
      setSelectedColor(COLOR_OPTIONS[0]);
      
      onSuccess?.();
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to create category.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <BaseBottomSheet
      index={isVisible ? 0 : -1}
      onClose={onClose}
      snapPoints={['70%']}
    >
      <View className="px-6 py-2">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-xl font-bold text-gray-900 dark:text-white">
              Create Category
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Organize your life questions
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-full">
            <X size={20} color="#71717a" />
          </TouchableOpacity>
        </View>

        {/* Name Input */}
        <View className="mb-4">
          <Text className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 ml-1">
            Name
          </Text>
          <View className="flex-row items-center bg-gray-100 dark:bg-zinc-800 rounded-xl px-4">
            <Type size={18} color="#71717a" />
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g., Dreams & Aspirations"
              placeholderTextColor="#9ca3af"
              className="flex-1 py-4 px-3 text-base text-gray-900 dark:text-white"
            />
          </View>
        </View>

        {/* Description Input */}
        <View className="mb-4">
          <Text className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 ml-1">
            Description (Optional)
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="What questions will this category hold?"
            placeholderTextColor="#9ca3af"
            className="bg-gray-100 dark:bg-zinc-800 rounded-xl px-4 py-4 text-base text-gray-900 dark:text-white"
          />
        </View>

        {/* Color Picker */}
        <View className="mb-4">
          <Text className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 ml-1">
            Color
          </Text>
          <View className="flex-row gap-2 flex-wrap">
            {COLOR_OPTIONS.map((color) => (
              <TouchableOpacity
                key={color}
                onPress={() => setSelectedColor(color)}
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  selectedColor === color ? 'border-2 border-white' : ''
                }`}
                style={{ backgroundColor: color }}
              >
                {selectedColor === color && <Check size={16} color="white" />}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Icon Picker */}
        <View className="mb-6">
          <Text className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 ml-1">
            Icon
          </Text>
          <View className="flex-row gap-2 flex-wrap">
            {ICON_OPTIONS.map((icon) => (
              <TouchableOpacity
                key={icon}
                onPress={() => setSelectedIcon(icon)}
                className={`w-12 h-12 rounded-xl items-center justify-center ${
                  selectedIcon === icon 
                    ? 'bg-indigo-600' 
                    : 'bg-gray-100 dark:bg-zinc-800'
                }`}
              >
                <Text className={`text-xs ${selectedIcon === icon ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                  {icon.slice(0, 4)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Create Button */}
        <TouchableOpacity 
          onPress={handleCreate}
          disabled={isCreating || !name.trim()}
          className={`flex-row items-center justify-center h-14 rounded-2xl ${
            name.trim() ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-zinc-700'
          }`}
        >
          <Palette size={20} color="white" className="mr-2" />
          <Text className="font-bold text-white">
            {isCreating ? 'Creating...' : 'Create Category'}
          </Text>
        </TouchableOpacity>
      </View>
    </BaseBottomSheet>
  );
};
