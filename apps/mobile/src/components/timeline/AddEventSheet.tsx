import { View, Text, TouchableOpacity, Modal, TextInput, Alert, Platform, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { saveTimelineEvent } from '../../lib/storage';

interface AddEventSheetProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function AddEventSheet({ visible, onClose, onSave }: AddEventSheetProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());

  // Reset form when opening
  useEffect(() => {
    if (visible) {
      setTitle('');
      setDescription('');
      setDate(new Date());
    }
  }, [visible]);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Required', 'Please enter a title');
      return;
    }

    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    try {
      await saveTimelineEvent({
        type: 'milestone',
        title: title.trim(),
        description: description.trim(),
        date: date.toISOString(),
      });
      onSave();
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to save event');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-slate-950">
        {/* Header */}
        <View className="px-6 py-4 flex-row justify-between items-center border-b border-white/5">
          <TouchableOpacity onPress={onClose}>
            <Text className="text-slate-400 text-base" style={{ fontFamily: 'Inter_400Regular' }}>Cancel</Text>
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold" style={{ fontFamily: 'Inter_700Bold' }}>
            New Event
          </Text>
          <TouchableOpacity onPress={handleSave}>
            <Text className="text-primary-500 text-base font-bold" style={{ fontFamily: 'Inter_700Bold' }}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-6 py-6">
          <View className="mb-6">
            <Text className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2" style={{ fontFamily: 'Inter_700Bold' }}>
              Title
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="What happened?"
              placeholderTextColor="#475569"
              className="bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white text-base"
              style={{ fontFamily: 'Inter_400Regular' }}
              autoFocus
            />
          </View>

          <View className="mb-6">
            <Text className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2" style={{ fontFamily: 'Inter_700Bold' }}>
              Date
            </Text>
            <View className="bg-white/5 border border-white/10 rounded-2xl px-4 py-4 flex-row items-center">
              <Calendar size={20} color="#94a3b8" className="mr-3" />
              <Text className="text-white text-base" style={{ fontFamily: 'Inter_400Regular' }}>
                {date.toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2" style={{ fontFamily: 'Inter_700Bold' }}>
              Description (Optional)
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Add details..."
              placeholderTextColor="#475569"
              multiline
              numberOfLines={4}
              className="bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white text-base min-h-[120px]"
              style={{ fontFamily: 'Inter_400Regular' }}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
