/**
 * Settings Screen - AI-powered premiums and local data controls
 */
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert, TextInput, Modal, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { 
  Settings, 
  Key, 
  Database, 
  ShieldCheck, 
  FileJson, 
  Trash2, 
  Info, 
  ChevronRight, 
  Cpu, 
  Zap, 
  Cloud, 
  Mic
} from 'lucide-react-native';
import { getSettings, updateSettings, clearAllData, exportAllData, AppSettings } from '../../src/lib/storage';
import * as Sharing from 'expo-sharing';
import { Card, Button } from '../../src/components/ui';

export default function SettingsScreen() {
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  const [apiKeyModalVisible, setApiKeyModalVisible] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [whisperKeyInput, setWhisperKeyInput] = useState('');
  
  useEffect(() => {
    setSettings(getSettings());
  }, []);
  
  const handleToggle = (key: keyof AppSettings, value: boolean) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updateSettings({ [key]: value });
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSaveApiKeys = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };
  
  const handleExportData = async () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const fileUri = await exportAllData();
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Export LifeContext Context',
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to export your local context.');
    }
  };
  
  const handleDeleteData = () => {
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    Alert.alert(
      'Purge Local Context?',
      'This will permanently delete all recordings, journals, and brain dumps. Your data stays on this device, and once deleted, it is gone forever.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Purge Everything',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            setSettings(getSettings());
            if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  const SettingItem = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    onPress, 
    value, 
    onToggle, 
    isDestructive 
  }: { 
    icon: any; 
    title: string; 
    subtitle: string; 
    onPress?: () => void; 
    value?: boolean; 
    onToggle?: (v: boolean) => void;
    isDestructive?: boolean;
  }) => (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={!onPress}
      className="flex-row items-center py-4 px-4 active:bg-white/5 rounded-2xl"
    >
      <View className={`w-10 h-10 items-center justify-center rounded-xl mr-4 ${isDestructive ? 'bg-red-500/10' : 'bg-slate-900'}`}>
        <Icon size={20} color={isDestructive ? '#ef4444' : '#94a3b8'} strokeWidth={2} />
      </View>
      <View className="flex-1 mr-2">
        <Text className={`text-sm font-semibold mb-0.5 ${isDestructive ? 'text-red-400' : 'text-white'}`} style={{ fontFamily: 'Inter_600SemiBold' }}>
          {title}
        </Text>
        <Text className="text-slate-500 text-[11px] leading-4" style={{ fontFamily: 'Inter_400Regular' }}>
          {subtitle}
        </Text>
      </View>
      {onToggle !== undefined ? (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#1e293b', true: '#0ea5e9' }}
          thumbColor="#ffffff"
        />
      ) : (
        <ChevronRight size={16} color="#334155" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={['top']}>
      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-8">
          <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-[3px] mb-1" style={{ fontFamily: 'Inter_700Bold' }}>
            System Settings
          </Text>
          <Text className="text-3xl font-bold text-white lowercase" style={{ fontFamily: 'Inter_700Bold' }}>
            archive.config
          </Text>
        </View>

        {/* AI & Brain Section */}
        <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4 ml-1" style={{ fontFamily: 'Inter_700Bold' }}>
          AI Intelligence
        </Text>
        <Card variant="glass" className="mb-6 p-1 border-white/5">
          <SettingItem
            icon={Key}
            title="Authentication Keys"
            subtitle={settings.apiKey ? 'Claude and Whisper keys are active' : 'Connect Anthropic/OpenAI keys for synthesis'}
            onPress={() => {
              setApiKeyInput(settings.apiKey || '');
              setWhisperKeyInput(settings.whisperApiKey || '');
              setApiKeyModalVisible(true);
            }}
          />
          <View className="h-px bg-white/5 mx-4" />
          <SettingItem
            icon={Zap}
            title="Live Inference"
            subtitle="Real-time transcription while recording"
            value={settings.showLiveTranscription}
            onToggle={(v) => handleToggle('showLiveTranscription', v)}
          />
        </Card>

        {/* Experience Section */}
        <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4 ml-1" style={{ fontFamily: 'Inter_700Bold' }}>
          Experience
        </Text>
        <Card variant="glass" className="mb-6 p-1 border-white/5">
          <SettingItem
            icon={Mic}
            title="Haptic Feedback"
            subtitle="Tactile response for recording and navigation"
            value={settings.hapticFeedback}
            onToggle={(v) => handleToggle('hapticFeedback', v)}
          />
          <View className="h-px bg-white/5 mx-4" />
          <SettingItem
            icon={ShieldCheck}
            title="Privacy Guard"
            subtitle="Local-first encryption on device storage"
            onPress={() => Alert.alert('Privacy Guard', 'All your context is stored locally using MMKV with encryption. Your audio files never leave your device.')}
          />
        </Card>

        {/* Data section */}
        <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4 ml-1" style={{ fontFamily: 'Inter_700Bold' }}>
          Data Sovereignty
        </Text>
        <Card variant="glass" className="mb-8 p-1 border-white/5">
          <SettingItem
            icon={FileJson}
            title="Export Context"
            subtitle="Download your entire life context as JSON"
            onPress={handleExportData}
          />
          <View className="h-px bg-white/5 mx-4" />
          <SettingItem
            icon={Cloud}
            title="Cloud Sync"
            subtitle="Secure backup to your personal cloud"
            value={settings.cloudSyncEnabled}
            onToggle={(v) => handleToggle('cloudSyncEnabled', v)}
          />
          <View className="h-px bg-white/5 mx-4" />
          <SettingItem
            icon={Trash2}
            title="Purge Data"
            subtitle="Permanently delete all local content"
            onPress={handleDeleteData}
            isDestructive
          />
        </Card>

        {/* About Info */}
        <View className="items-center pb-20 opacity-40">
          <Info size={20} color="#94a3b8" />
          <Text className="text-slate-500 text-[10px] mt-2 mb-1" style={{ fontFamily: 'Inter_400Regular' }}>
            LifeContext Mobile v1.0.4 r2
          </Text>
          <Text className="text-slate-600 text-[9px] uppercase tracking-widest font-bold" style={{ fontFamily: 'Inter_700Bold' }}>
            Privacy Sovereign Edition
          </Text>
        </View>
      </ScrollView>

      {/* Modern API Key Modal */}
      <Modal visible={apiKeyModalVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setApiKeyModalVisible(false)}>
        <View className="flex-1 bg-slate-950 p-8">
          <View className="flex-row justify-between items-center mb-10">
            <Text className="text-2xl font-bold text-white" style={{ fontFamily: 'Inter_700Bold' }}>AI Credentials</Text>
            <TouchableOpacity onPress={() => setApiKeyModalVisible(false)}>
              <Text className="text-primary-400 font-bold" style={{ fontFamily: 'Inter_700Bold' }}>Close</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="mb-8">
              <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-3" style={{ fontFamily: 'Inter_700Bold' }}>Anthropic Key</Text>
              <TextInput
                value={apiKeyInput}
                onChangeText={setApiKeyInput}
                placeholder="sk-ant-..."
                placeholderTextColor="#334155"
                secureTextEntry
                className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white"
                style={{ fontFamily: 'Inter_400Regular' }}
              />
              <Text className="text-slate-600 text-[10px] mt-2 italic" style={{ fontFamily: 'Inter_400Regular' }}>
                Required for strategic brain dump synthesis.
              </Text>
            </View>
            
            <View className="mb-10">
              <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-3" style={{ fontFamily: 'Inter_700Bold' }}>OpenAI Key (Optional)</Text>
              <TextInput
                value={whisperKeyInput}
                onChangeText={setWhisperKeyInput}
                placeholder="sk-..."
                placeholderTextColor="#334155"
                secureTextEntry
                className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white"
                style={{ fontFamily: 'Inter_400Regular' }}
              />
              <Text className="text-slate-600 text-[10px] mt-2 italic" style={{ fontFamily: 'Inter_400Regular' }}>
                Used for high-fidelity speech-to-text.
              </Text>
            </View>

            <TouchableOpacity 
              onPress={handleSaveApiKeys}
              className="bg-primary-500 py-4 rounded-2xl items-center shadow-lg shadow-primary-500/20"
            >
              <Text className="text-white font-bold text-lg" style={{ fontFamily: 'Inter_700Bold' }}>Save Credentials</Text>
            </TouchableOpacity>

            <View className="mt-8 items-center">
               <ShieldCheck size={20} color="#10b981" />
               <Text className="text-slate-500 text-[11px] text-center mt-3 leading-5" style={{ fontFamily: 'Inter_400Regular' }}>
                 Your keys are stored only on your device's secure storage and are never transmitted to our servers.
               </Text>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

