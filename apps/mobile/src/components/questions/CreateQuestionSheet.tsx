import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, Platform, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { BaseBottomSheet } from '@/components/navigation/BottomSheets/BaseBottomSheet';
import { HelpCircle, Check, X } from 'lucide-react-native';
import * as questions from '@/lib/questions';

interface CreateQuestionSheetProps {
  isVisible: boolean;
  onClose: () => void;
  categoryId?: string;
  onSuccess?: () => void;
}

export const CreateQuestionSheet = ({ isVisible, onClose, categoryId, onSuccess }: CreateQuestionSheetProps) => {
  const [text, setText] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(categoryId || '');
  const [isCreating, setIsCreating] = useState(false);

  const categories = questions.getCategories();

  const handleCreate = async () => {
    if (!text.trim()) {
      Alert.alert('Question Required', 'Please enter a question.');
      return;
    }
    if (!selectedCategoryId) {
      Alert.alert('Category Required', 'Please select a category.');
      return;
    }

    setIsCreating(true);

    try {
      questions.createQuestion(selectedCategoryId, text.trim());

      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      setText('');
      setSelectedCategoryId(categoryId || '');
      
      onSuccess?.();
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to create question.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <BaseBottomSheet
      index={isVisible ? 0 : -1}
      onClose={onClose}
      snapPoints={['65%']}
    >
      <View className="px-6 py-2 flex-1">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-xl font-bold text-gray-900 dark:text-white">
              Add Question
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Create a custom life question
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-full">
            <X size={20} color="#71717a" />
          </TouchableOpacity>
        </View>

        {/* Question Input */}
        <View className="mb-4">
          <Text className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 ml-1">
            Question
          </Text>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="What would you like to reflect on?"
            placeholderTextColor="#9ca3af"
            multiline
            className="bg-gray-100 dark:bg-zinc-800 rounded-xl px-4 py-4 text-base text-gray-900 dark:text-white min-h-[80px]"
            textAlignVertical="top"
          />
        </View>

        {/* Category Selector */}
        <View className="mb-6">
          <Text className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 ml-1">
            Category
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setSelectedCategoryId(cat.id)}
                  className={`px-4 py-3 rounded-xl flex-row items-center ${
                    selectedCategoryId === cat.id 
                      ? 'bg-indigo-600' 
                      : 'bg-gray-100 dark:bg-zinc-800'
                  }`}
                >
                  <View 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: cat.color }}
                  />
                  <Text className={`text-sm font-medium ${
                    selectedCategoryId === cat.id 
                      ? 'text-white' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Create Button */}
        <TouchableOpacity 
          onPress={handleCreate}
          disabled={isCreating || !text.trim() || !selectedCategoryId}
          className={`flex-row items-center justify-center h-14 rounded-2xl ${
            text.trim() && selectedCategoryId ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-zinc-700'
          }`}
        >
          <HelpCircle size={20} color="white" className="mr-2" />
          <Text className="font-bold text-white">
            {isCreating ? 'Adding...' : 'Add Question'}
          </Text>
        </TouchableOpacity>
      </View>
    </BaseBottomSheet>
  );
};
