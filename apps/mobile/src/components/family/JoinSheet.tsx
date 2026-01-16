import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { BaseBottomSheet } from '@/components/navigation/BottomSheets/BaseBottomSheet';
import { QrCode, Keyboard, Check, X } from 'lucide-react-native';
import { useFamilyStore } from '@/store/useFamilyStore';
import { FamilyMember } from '@lcc/types';

interface JoinSheetProps {
  isVisible: boolean;
  onClose: () => void;
}

export const JoinSheet = ({ isVisible, onClose }: JoinSheetProps) => {
  const [inputCode, setInputCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const { addMember } = useFamilyStore();

  const handleJoin = async () => {
    if (!inputCode.trim()) {
      Alert.alert('Code Required', 'Please enter an invite code.');
      return;
    }

    setIsJoining(true);

    // TODO: Implement backend API call to validate invite code
    // POST /api/family/join { code: inputCode }
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newMember: FamilyMember = {
      id: `joined-${Date.now()}`,
      name: 'You',
      relationship: 'Self',
      status: 'active',
      joinedAt: new Date(),
    };

    addMember(newMember);

    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    Alert.alert(
      'Joined Successfully!',
      'You are now part of this Family Circle. Shared content will appear in your feed.',
      [{ text: 'OK', onPress: onClose }]
    );

    setIsJoining(false);
    setInputCode('');
  };

  const handleScanQR = () => {
    Alert.alert('Camera Access', 'QR scanning requires camera permissions. For now, please enter the code manually.');
  };

  return (
    <BaseBottomSheet
      index={isVisible ? 0 : -1}
      onClose={onClose}
      snapPoints={['55%']}
    >
      <View className="px-6 py-2">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-xl font-bold text-gray-900 dark:text-white">
              Join a Family Circle
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Enter the invite code or scan QR
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-full">
            <X size={20} color="#71717a" />
          </TouchableOpacity>
        </View>

        {/* Scan QR Option */}
        <TouchableOpacity 
          onPress={handleScanQR}
          className="flex-row items-center bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 mb-6"
        >
          <View className="w-12 h-12 bg-indigo-100 dark:bg-indigo-800 rounded-full items-center justify-center mr-4">
            <QrCode size={24} color="#6366f1" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-indigo-900 dark:text-indigo-100">
              Scan QR Code
            </Text>
            <Text className="text-sm text-indigo-600 dark:text-indigo-400">
              Point camera at invite QR
            </Text>
          </View>
        </TouchableOpacity>

        <View className="flex-row items-center mb-6">
          <View className="flex-1 h-px bg-gray-200 dark:bg-zinc-700" />
          <Text className="px-3 text-sm text-gray-400 uppercase font-medium">Or</Text>
          <View className="flex-1 h-px bg-gray-200 dark:bg-zinc-700" />
        </View>

        {/* Code Input */}
        <View className="mb-6">
          <Text className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 ml-1">
            Enter Invite Code
          </Text>
          <View className="flex-row items-center bg-gray-100 dark:bg-zinc-800 rounded-xl px-4">
            <Keyboard size={20} color="#71717a" />
            <TextInput
              value={inputCode}
              onChangeText={setInputCode}
              placeholder="LCC-FAMILY-XXXX-XXXX"
              placeholderTextColor="#9ca3af"
              className="flex-1 py-4 px-3 text-base text-gray-900 dark:text-white font-mono"
              autoCapitalize="characters"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* Join Button */}
        <TouchableOpacity 
          onPress={handleJoin}
          disabled={isJoining || !inputCode.trim()}
          className={`flex-row items-center justify-center h-14 rounded-2xl ${
            inputCode.trim() ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-zinc-700'
          }`}
        >
          <Check size={20} color="white" className="mr-2" />
          <Text className="font-bold text-white">
            {isJoining ? 'Joining...' : 'Join Circle'}
          </Text>
        </TouchableOpacity>

        {/* Privacy Note */}
        <Text className="text-center text-xs text-gray-400 mt-4 px-4 leading-5">
          By joining, you'll see content the circle owner shares with the family. You can leave at any time.
        </Text>
      </View>
    </BaseBottomSheet>
  );
};
