import React, { useEffect, useState } from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Lock, ShieldCheck } from 'lucide-react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useSecurityStore, type LockTimeout } from '../../src/store/useSecurityStore';
import { getSessionActivityLog, listSessions, revokeSession } from '../../src/security/authService';
import type { AuthActivityLog, AuthSession } from '../../src/security/authTypes';

const TIMEOUT_OPTIONS: { label: string; value: LockTimeout }[] = [
  { label: 'After 1 minute', value: 60 },
  { label: 'After 5 minutes', value: 300 },
  { label: 'After 15 minutes', value: 900 },
  { label: 'After 30 minutes', value: 1800 },
  { label: 'After 60 minutes', value: 3600 },
];

export default function SecuritySettingsScreen() {
  const router = useRouter();
  const {
    isEnabled,
    biometricEnabled,
    lockTimeout,
    activeSessionId,
    setEnabled,
    setBiometricEnabled,
    setLockTimeout,
    setActiveSessionId,
    lockNow,
    setIsLocked,
  } = useSecurityStore();

  const [sessions, setSessions] = useState<AuthSession[]>([]);
  const [activity, setActivity] = useState<AuthActivityLog[]>([]);

  const refreshSessionData = async (): Promise<void> => {
    const sessionData = await listSessions();
    setSessions(sessionData.sessions);
    setActiveSessionId(sessionData.activeSessionId);
    setActivity(getSessionActivityLog().slice(0, 8));
  };

  useEffect(() => {
    void refreshSessionData();
  }, []);

  const handleToggleSecurity = async (value: boolean): Promise<void> => {
    if (value) {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        Alert.alert('Not Available', 'Biometric authentication is not available on this device.');
        return;
      }

      setEnabled(true);
      return;
    }

    setEnabled(false);
    setIsLocked(false);
  };

  const handleToggleBiometric = async (value: boolean): Promise<void> => {
    if (!value) {
      setBiometricEnabled(false);
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to enable biometric unlock',
    });

    setBiometricEnabled(result.success);
  };

  const handleRevoke = async (sessionId: string): Promise<void> => {
    await revokeSession(sessionId);
    await refreshSessionData();

    if (sessionId === activeSessionId) {
      lockNow();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={['top']}>
      <View className="flex-row items-center px-6 py-4 border-b border-white/5">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white" style={{ fontFamily: 'Inter_700Bold' }}>Security</Text>
      </View>

      <ScrollView className="flex-1">
        <View className="px-6 py-8">
          <View className="mb-8 items-center">
            <View className="w-20 h-20 bg-slate-900 rounded-full items-center justify-center mb-4 border border-slate-800 shadow-lg">
              <ShieldCheck size={40} color={isEnabled ? '#4ade80' : '#94a3b8'} />
            </View>
            <Text className="text-white font-bold text-lg mb-1">{isEnabled ? 'App Lock Active' : 'App Lock Disabled'}</Text>
            <Text className="text-slate-500 text-sm text-center">
              {isEnabled ? 'Passcode + optional biometrics protect your vault.' : 'Enable App Lock to protect your privacy.'}
            </Text>
          </View>

          <View className="bg-slate-900/50 rounded-2xl border border-white/5 mb-6 overflow-hidden">
            <View className="flex-row items-center justify-between p-4 border-b border-white/5">
              <View className="flex-row items-center space-x-3">
                <View className="w-8 h-8 rounded-lg bg-primary-500/20 items-center justify-center"><Lock size={18} color="#a855f7" /></View>
                <View>
                  <Text className="text-white font-medium">App Lock</Text>
                  <Text className="text-slate-500 text-xs">Require authentication on resume</Text>
                </View>
              </View>
              <Switch value={isEnabled} onValueChange={(value) => void handleToggleSecurity(value)} trackColor={{ false: '#334155', true: '#a855f7' }} thumbColor="#fff" />
            </View>
            <View className="flex-row items-center justify-between p-4">
              <View>
                <Text className="text-white font-medium">Biometric Unlock</Text>
                <Text className="text-slate-500 text-xs">Face ID / Touch ID / fingerprint</Text>
              </View>
              <Switch value={biometricEnabled} onValueChange={(value) => void handleToggleBiometric(value)} trackColor={{ false: '#334155', true: '#22c55e' }} thumbColor="#fff" disabled={!isEnabled} />
            </View>
          </View>

          {isEnabled && (
            <>
              <Text className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3 ml-1">Auto-Lock Timeout</Text>
              <View className="bg-slate-900/50 rounded-2xl border border-white/5 overflow-hidden mb-6">
                {TIMEOUT_OPTIONS.map((option, index) => (
                  <TouchableOpacity key={option.value} onPress={() => setLockTimeout(option.value)} className={`flex-row items-center justify-between p-4 ${index !== TIMEOUT_OPTIONS.length - 1 ? 'border-b border-white/5' : ''}`}>
                    <Text className={`font-medium ${lockTimeout === option.value ? 'text-primary-400' : 'text-slate-300'}`}>{option.label}</Text>
                    {lockTimeout === option.value && <View className="w-2 h-2 rounded-full bg-primary-500" />}
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity onPress={lockNow} className="mb-6 rounded-xl border border-amber-700 bg-amber-900/30 p-4">
                <Text className="text-center text-amber-200 font-semibold">Lock Now</Text>
              </TouchableOpacity>

              <Text className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3 ml-1">Active Sessions</Text>
              <View className="bg-slate-900/50 rounded-2xl border border-white/5 mb-6 overflow-hidden">
                {sessions.length === 0 && <Text className="p-4 text-slate-400 text-sm">No active sessions found.</Text>}
                {sessions.map((session, index) => (
                  <View key={session.id} className={`p-4 ${index !== sessions.length - 1 ? 'border-b border-white/5' : ''}`}>
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1 pr-2">
                        <Text className="text-white font-medium">{session.deviceLabel}</Text>
                        <Text className="text-slate-400 text-xs">Last active: {new Date(session.lastActiveAt).toLocaleString()}</Text>
                      </View>
                      <TouchableOpacity onPress={() => void handleRevoke(session.id)} disabled={session.id === activeSessionId} className={`rounded-lg px-3 py-1.5 ${session.id === activeSessionId ? 'bg-slate-700' : 'bg-red-900/40 border border-red-800'}`}>
                        <Text className={`${session.id === activeSessionId ? 'text-slate-300' : 'text-red-300'} text-xs`}>{session.id === activeSessionId ? 'Current' : 'Revoke'}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>

              <Text className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3 ml-1">Session Activity</Text>
              <View className="bg-slate-900/50 rounded-2xl border border-white/5 overflow-hidden">
                {activity.length === 0 && <Text className="p-4 text-slate-400 text-sm">No recent security activity.</Text>}
                {activity.map((entry, index) => (
                  <View key={entry.id} className={`p-4 ${index !== activity.length - 1 ? 'border-b border-white/5' : ''}`}>
                    <Text className="text-white text-sm font-medium">{entry.details}</Text>
                    <Text className="text-slate-400 text-xs">{new Date(entry.createdAt).toLocaleString()} • {entry.deviceLabel}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
