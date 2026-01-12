import { View, Text, ScrollView, Pressable, Switch, Alert } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useAppStore } from '@lcc/core';

export default function SettingsScreen() {
  const { settings, updateSettings, reset } = useAppStore();
  const [showLiveTranscription, setShowLiveTranscription] = useState(
    settings?.showLiveTranscription ?? false
  );

  const handleToggleTranscription = (value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowLiveTranscription(value);
    updateSettings({ showLiveTranscription: value });
  };

  const handleExportData = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Export Data',
      'Your data will be exported as an encrypted backup file.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Export',
          onPress: () => {
            // TODO: Implement data export
            Alert.alert('Coming Soon', 'Data export will be available in a future update.');
          },
        },
      ]
    );
  };

  const handleDeleteData = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      'Delete All Data',
      'This action cannot be undone. All your recordings, journals, and settings will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            reset();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  const SettingRow = ({
    icon,
    title,
    subtitle,
    onPress,
    rightElement,
    destructive,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    destructive?: boolean;
  }) => (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center py-4 active:opacity-70"
    >
      <Text className="text-2xl mr-4">{icon}</Text>
      <View className="flex-1">
        <Text
          className={`font-medium ${destructive ? 'text-red-400' : 'text-white'}`}
        >
          {title}
        </Text>
        {subtitle && (
          <Text className="text-dark-text-secondary text-sm mt-0.5">
            {subtitle}
          </Text>
        )}
      </View>
      {rightElement}
      {onPress && !rightElement && (
        <Text className="text-dark-text-secondary text-lg">›</Text>
      )}
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-dark-background" edges={['top']}>
      <ScrollView className="flex-1 p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-white">Settings</Text>
          <Text className="text-dark-text-secondary mt-1">
            Customize your LifeContext experience
          </Text>
        </View>

        {/* Recording Settings */}
        <View className="bg-dark-surface rounded-2xl px-5 border border-dark-border mb-4">
          <Text className="text-dark-text-secondary text-sm uppercase tracking-wide pt-4 pb-2">
            Recording
          </Text>
          <SettingRow
            icon="🎤"
            title="Live Transcription"
            subtitle="Show text as you speak"
            rightElement={
              <Switch
                value={showLiveTranscription}
                onValueChange={handleToggleTranscription}
                trackColor={{ false: '#334155', true: '#0ea5e9' }}
                thumbColor="#fff"
              />
            }
          />
          <View className="h-px bg-dark-border" />
          <SettingRow
            icon="🔊"
            title="Audio Quality"
            subtitle="High (recommended)"
            onPress={() => {}}
          />
        </View>

        {/* AI Settings */}
        <View className="bg-dark-surface rounded-2xl px-5 border border-dark-border mb-4">
          <Text className="text-dark-text-secondary text-sm uppercase tracking-wide pt-4 pb-2">
            AI Provider
          </Text>
          <SettingRow
            icon="🤖"
            title="Claude AI"
            subtitle="Anthropic (Cloud)"
            onPress={() => {}}
          />
          <View className="h-px bg-dark-border" />
          <SettingRow
            icon="🔑"
            title="API Key"
            subtitle="Configure your own key"
            onPress={() => {}}
          />
        </View>

        {/* Privacy & Security */}
        <View className="bg-dark-surface rounded-2xl px-5 border border-dark-border mb-4">
          <Text className="text-dark-text-secondary text-sm uppercase tracking-wide pt-4 pb-2">
            Privacy & Security
          </Text>
          <SettingRow
            icon="🔒"
            title="Encryption"
            subtitle="AES-256-GCM (Active)"
            onPress={() => {}}
          />
          <View className="h-px bg-dark-border" />
          <SettingRow
            icon="🔐"
            title="Change Passcode"
            subtitle="Update your encryption key"
            onPress={() => {}}
          />
          <View className="h-px bg-dark-border" />
          <SettingRow
            icon="👥"
            title="Emergency Access"
            subtitle="Set up trusted contacts"
            onPress={() => {}}
          />
        </View>

        {/* Data Management */}
        <View className="bg-dark-surface rounded-2xl px-5 border border-dark-border mb-4">
          <Text className="text-dark-text-secondary text-sm uppercase tracking-wide pt-4 pb-2">
            Data Management
          </Text>
          <SettingRow
            icon="📤"
            title="Export Data"
            subtitle="Download encrypted backup"
            onPress={handleExportData}
          />
          <View className="h-px bg-dark-border" />
          <SettingRow
            icon="☁️"
            title="Cloud Sync"
            subtitle="Not configured"
            onPress={() => {}}
          />
          <View className="h-px bg-dark-border" />
          <SettingRow
            icon="🗑️"
            title="Delete All Data"
            subtitle="Permanently remove everything"
            onPress={handleDeleteData}
            destructive
          />
        </View>

        {/* About */}
        <View className="bg-dark-surface rounded-2xl px-5 border border-dark-border mb-8">
          <Text className="text-dark-text-secondary text-sm uppercase tracking-wide pt-4 pb-2">
            About
          </Text>
          <SettingRow
            icon="ℹ️"
            title="Version"
            subtitle="1.0.0"
          />
          <View className="h-px bg-dark-border" />
          <SettingRow
            icon="📜"
            title="Privacy Policy"
            onPress={() => {}}
          />
          <View className="h-px bg-dark-border" />
          <SettingRow
            icon="📋"
            title="Terms of Service"
            onPress={() => {}}
          />
        </View>

        {/* Footer */}
        <View className="items-center pb-8">
          <Text className="text-dark-text-secondary text-sm">
            Made with 💜 for your privacy
          </Text>
          <Text className="text-dark-text-secondary text-xs mt-1">
            Your data never leaves your device
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
