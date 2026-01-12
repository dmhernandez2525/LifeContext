import { View, Text, Pressable, TextInput } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useAppStore, DEFAULT_SETTINGS } from '@lcc/core';

type Step = 'welcome' | 'passcode' | 'confirm' | 'complete';

export default function OnboardingScreen() {
  const router = useRouter();
  const { initialize } = useAppStore();
  const [step, setStep] = useState<Step>('welcome');
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [error, setError] = useState('');

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    switch (step) {
      case 'welcome':
        setStep('passcode');
        break;
      case 'passcode':
        if (passcode.length < 6) {
          setError('Passcode must be at least 6 characters');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          return;
        }
        setError('');
        setStep('confirm');
        break;
      case 'confirm':
        if (confirmPasscode !== passcode) {
          setError('Passcodes do not match');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          return;
        }
        setError('');
        setStep('complete');
        // Initialize the app with default settings
        initialize(DEFAULT_SETTINGS);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'complete':
        router.replace('/(tabs)');
        break;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-background">
      <View className="flex-1 p-6 justify-center">
        {step === 'welcome' && (
          <>
            <Text className="text-6xl text-center mb-6">🛡️</Text>
            <Text className="text-3xl font-bold text-white text-center mb-4">
              Welcome to LifeContext
            </Text>
            <Text className="text-dark-text-secondary text-center text-lg leading-7 mb-8">
              Your private space to capture life's moments, thoughts, and
              memories. Everything is encrypted and stored locally on your
              device.
            </Text>

            <View className="bg-dark-surface rounded-xl p-4 border border-dark-border mb-8">
              <View className="flex-row items-center mb-3">
                <Text className="text-xl mr-3">🔒</Text>
                <Text className="text-white font-medium">Zero-Knowledge</Text>
              </View>
              <Text className="text-dark-text-secondary text-sm">
                We never see your data. Everything is encrypted with your
                passcode before it leaves your device.
              </Text>
            </View>

            <View className="bg-dark-surface rounded-xl p-4 border border-dark-border mb-8">
              <View className="flex-row items-center mb-3">
                <Text className="text-xl mr-3">📱</Text>
                <Text className="text-white font-medium">Local-First</Text>
              </View>
              <Text className="text-dark-text-secondary text-sm">
                Your data is stored on your device. No account required. No
                cloud dependency.
              </Text>
            </View>
          </>
        )}

        {step === 'passcode' && (
          <>
            <Text className="text-6xl text-center mb-6">🔐</Text>
            <Text className="text-3xl font-bold text-white text-center mb-4">
              Create a Passcode
            </Text>
            <Text className="text-dark-text-secondary text-center mb-8">
              This passcode encrypts all your data. Choose something memorable
              - it cannot be recovered if forgotten.
            </Text>

            <TextInput
              value={passcode}
              onChangeText={setPasscode}
              placeholder="Enter passcode (6+ characters)"
              placeholderTextColor="#64748b"
              secureTextEntry
              autoFocus
              className="bg-dark-surface text-white text-center text-xl px-4 py-4 rounded-xl border border-dark-border mb-4"
            />

            {error && (
              <Text className="text-red-400 text-center mb-4">{error}</Text>
            )}

            <View className="bg-amber-900/30 rounded-xl p-4 border border-amber-800">
              <Text className="text-amber-200 text-sm text-center">
                ⚠️ Important: Write this passcode down somewhere safe. Without
                it, your data cannot be recovered.
              </Text>
            </View>
          </>
        )}

        {step === 'confirm' && (
          <>
            <Text className="text-6xl text-center mb-6">✓</Text>
            <Text className="text-3xl font-bold text-white text-center mb-4">
              Confirm Passcode
            </Text>
            <Text className="text-dark-text-secondary text-center mb-8">
              Enter your passcode again to confirm.
            </Text>

            <TextInput
              value={confirmPasscode}
              onChangeText={setConfirmPasscode}
              placeholder="Confirm passcode"
              placeholderTextColor="#64748b"
              secureTextEntry
              autoFocus
              className="bg-dark-surface text-white text-center text-xl px-4 py-4 rounded-xl border border-dark-border mb-4"
            />

            {error && (
              <Text className="text-red-400 text-center mb-4">{error}</Text>
            )}
          </>
        )}

        {step === 'complete' && (
          <>
            <Text className="text-6xl text-center mb-6">🎉</Text>
            <Text className="text-3xl font-bold text-white text-center mb-4">
              You're All Set!
            </Text>
            <Text className="text-dark-text-secondary text-center text-lg mb-8">
              Your encryption key has been created. You're ready to start
              documenting your life.
            </Text>

            <View className="bg-green-900/30 rounded-xl p-4 border border-green-800 mb-8">
              <Text className="text-green-200 text-center">
                ✓ Encryption active
              </Text>
              <Text className="text-green-200 text-center">
                ✓ Local storage ready
              </Text>
              <Text className="text-green-200 text-center">
                ✓ Privacy protected
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Bottom Button */}
      <View className="p-6">
        <Pressable
          onPress={handleNext}
          disabled={
            (step === 'passcode' && passcode.length < 6) ||
            (step === 'confirm' && confirmPasscode.length < 6)
          }
          className={`py-4 rounded-xl ${
            (step === 'passcode' && passcode.length < 6) ||
            (step === 'confirm' && confirmPasscode.length < 6)
              ? 'bg-dark-border opacity-50'
              : 'bg-brand-500 active:opacity-80'
          }`}
        >
          <Text className="text-white text-center font-semibold text-lg">
            {step === 'welcome'
              ? 'Get Started'
              : step === 'complete'
                ? 'Start Using LifeContext'
                : 'Continue'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
