/**
 * Settings Screen - API keys, preferences, and data management
 */
import { View, Text, ScrollView, Pressable, Switch, Alert, TextInput, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { getSettings, updateSettings, clearAllData, exportAllData, AppSettings } from '../../src/lib/storage';
import * as Sharing from 'expo-sharing';

export default function SettingsScreen() {
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  const [apiKeyModalVisible, setApiKeyModalVisible] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [whisperKeyInput, setWhisperKeyInput] = useState('');
  
  // Reload settings when screen focuses
  useEffect(() => {
    setSettings(getSettings());
  }, []);
  
  const handleToggle = (key: keyof AppSettings, value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updateSettings({ [key]: value });
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSaveApiKeys = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    updateSettings({
      apiKey: apiKeyInput || undefined,
      whisperApiKey: whisperKeyInput || undefined,
    });
    setSettings(prev => ({
      ...prev,
      apiKey: apiKeyInput || undefined,
      whisperApiKey: whisperKeyInput || undefined,
    }));
    setApiKeyModalVisible(false);
    Alert.alert('Saved', 'API keys updated successfully.');
  };
  
  const handleExportData = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const fileUri = await exportAllData();
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Export LifeContext Data',
        });
      } else {
        Alert.alert('Exported', `Data saved to: ${fileUri}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to export data.');
    }
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
          onPress: async () => {
            await clearAllData();
            setSettings(getSettings());
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Deleted', 'All data has been cleared.');
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
      disabled={!onPress && !rightElement}
      className="flex-row items-center py-4 active:opacity-70"
    >
      <Text className="text-2xl mr-4">{icon}</Text>
      <View className="flex-1">
        <Text className={`font-medium ${destructive ? 'text-red-400' : 'text-white'}`}>
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
        
        {/* AI Settings */}
        <View className="bg-dark-surface rounded-2xl px-5 border border-dark-border mb-4">
          <Text className="text-dark-text-secondary text-sm uppercase tracking-wide pt-4 pb-2">
            AI Provider
          </Text>
          <SettingRow
            icon="🤖"
            title="Claude AI"
            subtitle={settings.apiKey ? 'API key configured ✓' : 'Not configured'}
            onPress={() => {
              setApiKeyInput(settings.apiKey || '');
              setWhisperKeyInput(settings.whisperApiKey || '');
              setApiKeyModalVisible(true);
            }}
          />
          <View className="h-px bg-dark-border" />
          <SettingRow
            icon="🎙️"
            title="Whisper (Transcription)"
            subtitle={settings.whisperApiKey ? 'API key configured ✓' : 'Uses Claude key if set'}
            onPress={() => {
              setApiKeyInput(settings.apiKey || '');
              setWhisperKeyInput(settings.whisperApiKey || '');
              setApiKeyModalVisible(true);
            }}
          />
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
                value={settings.showLiveTranscription}
                onValueChange={(v) => handleToggle('showLiveTranscription', v)}
                trackColor={{ false: '#334155', true: '#0ea5e9' }}
                thumbColor="#fff"
              />
            }
          />
          <View className="h-px bg-dark-border" />
          <SettingRow
            icon="📳"
            title="Haptic Feedback"
            subtitle="Vibration on actions"
            rightElement={
              <Switch
                value={settings.hapticFeedback}
                onValueChange={(v) => handleToggle('hapticFeedback', v)}
                trackColor={{ false: '#334155', true: '#0ea5e9' }}
                thumbColor="#fff"
              />
            }
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
            subtitle="Download JSON backup"
            onPress={handleExportData}
          />
          <View className="h-px bg-dark-border" />
          <SettingRow
            icon="☁️"
            title="Cloud Sync"
            subtitle={settings.cloudSyncEnabled ? 'Enabled' : 'Disabled'}
            rightElement={
              <Switch
                value={settings.cloudSyncEnabled}
                onValueChange={(v) => handleToggle('cloudSyncEnabled', v)}
                trackColor={{ false: '#334155', true: '#0ea5e9' }}
                thumbColor="#fff"
              />
            }
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
            subtitle="Your data stays local"
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
      
      {/* API Key Modal */}
      <Modal
        visible={apiKeyModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setApiKeyModalVisible(false)}
      >
        <View className="flex-1 bg-dark-background p-6">
          <View className="flex-row justify-between items-center mb-8">
            <Text className="text-2xl font-bold text-white">API Keys</Text>
            <Pressable onPress={() => setApiKeyModalVisible(false)}>
              <Text className="text-brand-400 font-semibold">Cancel</Text>
            </Pressable>
          </View>
          
          <Text className="text-dark-text-secondary mb-2">
            Claude API Key (Anthropic)
          </Text>
          <TextInput
            value={apiKeyInput}
            onChangeText={setApiKeyInput}
            placeholder="sk-ant-..."
            placeholderTextColor="#64748b"
            secureTextEntry
            className="bg-dark-surface border border-dark-border rounded-xl p-4 text-white mb-6"
          />
          
          <Text className="text-dark-text-secondary mb-2">
            Whisper API Key (OpenAI) - Optional
          </Text>
          <TextInput
            value={whisperKeyInput}
            onChangeText={setWhisperKeyInput}
            placeholder="sk-..."
            placeholderTextColor="#64748b"
            secureTextEntry
            className="bg-dark-surface border border-dark-border rounded-xl p-4 text-white mb-6"
          />
          
          <Text className="text-dark-text-secondary text-sm mb-8">
            API keys are stored securely on your device and never shared.
          </Text>
          
          <Pressable
            onPress={handleSaveApiKeys}
            className="bg-brand-500 rounded-xl p-4 active:opacity-80"
          >
            <Text className="text-white font-semibold text-center">Save Keys</Text>
          </Pressable>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
