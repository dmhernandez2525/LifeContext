import { View, Text, Pressable, TextInput } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeHaptics as Haptics } from '../src/lib/haptics';
import { useAppStore, DEFAULT_SETTINGS } from '@lcc/core';
import { useSecurityStore } from '../src/store/useSecurityStore';
import { registerCredential } from '../src/security/authService';

type Step = 'welcome' | 'passcode' | 'confirm' | 'complete';

export default function OnboardingScreen() {
  const router = useRouter();
  const { initialize } = useAppStore();
  const { setEnabled, setRecoveryEmail } = useSecurityStore();
  const [step, setStep] = useState<Step>('welcome');
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [recoveryEmail, setRecoveryEmailInput] = useState('');
  const [error, setError] = useState('');
  const [backupCode, setBackupCode] = useState<string | null>(null);

  const handleNext = async (): Promise<void> => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    switch (step) {
      case 'welcome':
        setStep('passcode');
        return;
      case 'passcode':
        if (!/^\d{6,}$/.test(passcode)) {
          setError('Passcode must be 6+ numeric digits');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          return;
        }
        setError('');
        setStep('confirm');
        return;
      case 'confirm':
        if (confirmPasscode !== passcode) {
          setError('Passcodes do not match');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          return;
        }

        setError('');
        initialize(DEFAULT_SETTINGS);
        setEnabled(true);
        setRecoveryEmail(recoveryEmail.trim() || null);

        const credential = await registerCredential(passcode, recoveryEmail);
        setBackupCode(credential.backupCode);
        setStep('complete');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        return;
      case 'complete':
        router.replace('/(tabs)');
        return;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-background">
      <View className="flex-1 p-6 justify-center">
        {step === 'welcome' && (
          <>
            <Text className="text-6xl text-center mb-6">🛡️</Text>
            <Text className="text-3xl font-bold text-white text-center mb-4">Welcome to LifeContext</Text>
            <Text className="text-dark-text-secondary text-center text-lg leading-7 mb-8">
              Your private space for secure life documentation. Everything stays encrypted on-device.
            </Text>
            <View className="bg-dark-surface rounded-xl p-4 border border-dark-border mb-6">
              <Text className="text-white font-medium mb-2">Zero-Knowledge</Text>
              <Text className="text-dark-text-secondary text-sm">Credentials are validated locally with encrypted secure-store data.</Text>
            </View>
            <View className="bg-dark-surface rounded-xl p-4 border border-dark-border mb-8">
              <Text className="text-white font-medium mb-2">Recovery Ready</Text>
              <Text className="text-dark-text-secondary text-sm">Add a recovery email and backup code during setup so you can recover passcode access later.</Text>
            </View>
          </>
        )}

        {step === 'passcode' && (
          <>
            <Text className="text-6xl text-center mb-6">🔐</Text>
            <Text className="text-3xl font-bold text-white text-center mb-4">Create Passcode</Text>
            <Text className="text-dark-text-secondary text-center mb-6">Use a numeric passcode (6+ digits) for fast lock-screen entry.</Text>
            <TextInput
              value={passcode}
              onChangeText={setPasscode}
              placeholder="Enter passcode"
              placeholderTextColor="#64748b"
              secureTextEntry
              keyboardType="number-pad"
              autoFocus
              className="bg-dark-surface text-white text-center text-xl px-4 py-4 rounded-xl border border-dark-border mb-4"
            />
            <TextInput
              value={recoveryEmail}
              onChangeText={setRecoveryEmailInput}
              placeholder="Recovery email (optional)"
              placeholderTextColor="#64748b"
              autoCapitalize="none"
              keyboardType="email-address"
              className="bg-dark-surface text-white text-base px-4 py-4 rounded-xl border border-dark-border mb-4"
            />
            {error && <Text className="text-red-400 text-center mb-4">{error}</Text>}
            <View className="bg-amber-900/30 rounded-xl p-4 border border-amber-800">
              <Text className="text-amber-200 text-sm text-center">Write down your passcode and backup code. They cannot be recovered by support.</Text>
            </View>
          </>
        )}

        {step === 'confirm' && (
          <>
            <Text className="text-6xl text-center mb-6">✓</Text>
            <Text className="text-3xl font-bold text-white text-center mb-4">Confirm Passcode</Text>
            <Text className="text-dark-text-secondary text-center mb-8">Enter your passcode again to finalize encryption credentials.</Text>
            <TextInput
              value={confirmPasscode}
              onChangeText={setConfirmPasscode}
              placeholder="Confirm passcode"
              placeholderTextColor="#64748b"
              secureTextEntry
              keyboardType="number-pad"
              autoFocus
              className="bg-dark-surface text-white text-center text-xl px-4 py-4 rounded-xl border border-dark-border mb-4"
            />
            {error && <Text className="text-red-400 text-center mb-4">{error}</Text>}
          </>
        )}

        {step === 'complete' && (
          <>
            <Text className="text-6xl text-center mb-6">🎉</Text>
            <Text className="text-3xl font-bold text-white text-center mb-4">Security Setup Complete</Text>
            <Text className="text-dark-text-secondary text-center text-lg mb-6">Biometric + passcode authentication is ready.</Text>

            <View className="bg-slate-900 rounded-xl p-4 border border-slate-700 mb-6">
              <Text className="text-slate-300 text-xs uppercase tracking-widest mb-2">Recovery Backup Code</Text>
              <Text className="text-white text-lg font-bold tracking-widest text-center">{backupCode ?? 'Generating...'}</Text>
              <Text className="text-slate-400 text-xs mt-2 text-center">Store this code in a password manager. You need it for passcode recovery.</Text>
            </View>

            <View className="bg-green-900/30 rounded-xl p-4 border border-green-800 mb-8">
              <Text className="text-green-200 text-center">✓ Secure credential storage enabled</Text>
              <Text className="text-green-200 text-center">✓ Session timeout monitoring active</Text>
              <Text className="text-green-200 text-center">✓ Biometric unlock available</Text>
            </View>
          </>
        )}
      </View>

      <View className="p-6">
        <Pressable
          onPress={() => void handleNext()}
          disabled={(step === 'passcode' && passcode.length < 6) || (step === 'confirm' && confirmPasscode.length < 6)}
          className={`py-4 rounded-xl ${(step === 'passcode' && passcode.length < 6) || (step === 'confirm' && confirmPasscode.length < 6) ? 'bg-dark-border opacity-50' : 'bg-brand-500 active:opacity-80'}`}
        >
          <Text className="text-white text-center font-semibold text-lg">
            {step === 'welcome' ? 'Get Started' : step === 'complete' ? 'Start Using LifeContext' : 'Continue'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
