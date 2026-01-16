import React from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Lock, ShieldCheck } from 'lucide-react-native';
import { useSecurityStore, LockTimeout } from '../../src/store/useSecurityStore';
import * as LocalAuthentication from 'expo-local-authentication';

const TIMEOUT_OPTIONS: { label: string; value: LockTimeout }[] = [
  { label: 'Immediately', value: 0 },
  { label: 'After 1 minute', value: 60 },
  { label: 'After 5 minutes', value: 300 },
  { label: 'After 15 minutes', value: 900 },
];

export default function SecuritySettingsScreen() {
  const router = useRouter();
  const { isEnabled, lockTimeout, setEnabled, setLockTimeout } = useSecurityStore();

  const handleToggleSecurity = async (value: boolean) => {
    if (value) {
      // Verify biometrics before enabling
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        Alert.alert('Not Available', 'Biometric authentication is not available on this device.');
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to enable App Lock',
      });

      if (result.success) {
        setEnabled(true);
      } else {
        // failed or cancelled
        setEnabled(false);
      }
    } else {
      // Verify before disabling
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to disable App Lock',
      });
      
      if (result.success) {
        setEnabled(false);
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 border-b border-white/5">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white" style={{ fontFamily: 'Inter_700Bold' }}>
          Security
        </Text>
      </View>

      <ScrollView className="flex-1">
        <View className="px-6 py-8">
          <View className="mb-8 items-center">
            <View className="w-20 h-20 bg-slate-900 rounded-full items-center justify-center mb-4 border border-slate-800 shadow-lg">
              <ShieldCheck size={40} color={isEnabled ? "#4ade80" : "#94a3b8"} />
            </View>
            <Text className="text-white font-bold text-lg mb-1">
              {isEnabled ? 'App Lock Active' : 'App Lock Disabled'}
            </Text>
            <Text className="text-slate-500 text-sm text-center">
              {isEnabled 
                ? 'Your journal and personal data are protected.' 
                : 'Enable App Lock to protect your privacy.'}
            </Text>
          </View>
          
          <View className="bg-slate-900/50 rounded-2xl border border-white/5 mb-6 overflow-hidden">
            <View className="flex-row items-center justify-between p-4 border-b border-white/5">
              <View className="flex-row items-center space-x-3">
                <View className="w-8 h-8 rounded-lg bg-primary-500/20 items-center justify-center">
                   <Lock size={18} color="#a855f7" />
                </View>
                <View>
                    <Text className="text-white font-medium">Biometric Lock</Text>
                    <Text className="text-slate-500 text-xs">Require FaceID/TouchID</Text>
                </View>
              </View>
              <Switch
                value={isEnabled}
                onValueChange={handleToggleSecurity}
                trackColor={{ false: '#334155', true: '#a855f7' }}
                thumbColor="#fff"
              />
            </View>
          </View>

          {isEnabled && (
            <>
                <Text className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3 ml-1">
                    Auto-Lock Timeout
                </Text>
                <View className="bg-slate-900/50 rounded-2xl border border-white/5 overflow-hidden">
                {TIMEOUT_OPTIONS.map((option, index) => (
                    <TouchableOpacity
                    key={option.value}
                    onPress={() => setLockTimeout(option.value)}
                    className={`flex-row items-center justify-between p-4 ${
                        index !== TIMEOUT_OPTIONS.length - 1 ? 'border-b border-white/5' : ''
                    }`}
                    >
                    <Text className={`font-medium ${lockTimeout === option.value ? 'text-primary-400' : 'text-slate-300'}`}>
                        {option.label}
                    </Text>
                    {lockTimeout === option.value && (
                        <View className="w-2 h-2 rounded-full bg-primary-500" />
                    )}
                    </TouchableOpacity>
                ))}
                </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
