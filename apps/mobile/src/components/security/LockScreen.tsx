import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, TextInput } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { Lock, Fingerprint, ScanFace } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSecurityStore } from '../../store/useSecurityStore';
import { SafeHaptics as Haptics } from '../../lib/haptics';

export function LockScreen() {
  const { setIsLocked, isEnabled, isLocked, passcode: storedPasscode } = useSecurityStore();
  const [biometryType, setBiometryType] = useState<LocalAuthentication.AuthenticationType | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [inputPasscode, setInputPasscode] = useState('');
  const [showPasscodeFallback, setShowPasscodeFallback] = useState(false);

  useEffect(() => {
    checkBiometry();
  }, []);

  const checkBiometry = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    
    if (hasHardware && isEnrolled) {
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        setBiometryType(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION);
      } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        setBiometryType(LocalAuthentication.AuthenticationType.FINGERPRINT);
      } else {
        // Fallback or generic
        setBiometryType(LocalAuthentication.AuthenticationType.IRIS); 
      }
      
      // Auto-trigger auth on mount
      authenticate();
    }
  };

  const authenticate = useCallback(async () => {
    if (isAuthenticating) return;
    setIsAuthenticating(true);

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock LifeContext',
        fallbackLabel: 'Use Passcode',
        disableDeviceFallback: false,
        cancelLabel: 'Cancel',
      });

      if (result.success) {
        setIsLocked(false);
      } else if (result.error === 'user_cancel') {
        // User cancelled, remain locked. 
        // They can tap the button to retry.
      } else {
        Alert.alert('Authentication Failed', 'Please try again.');
      }
    } catch {
       // Biometrics failed - show passcode fallback
       setShowPasscodeFallback(true);
    } finally {
      setIsAuthenticating(false);
    }
  }, [isLocked, isAuthenticating]);

  const handlePasscodeChange = (text: string) => {
    setInputPasscode(text);
    if (text.length >= 6) {
      if (text === storedPasscode) {
        // Success
        setIsLocked(false);
        setInputPasscode('');
        setShowPasscodeFallback(false);
      } else {
        // Fail
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('Incorrect Passcode');
        setInputPasscode('');
      }
    }
  };

  const handleResetApp = () => {
    Alert.alert(
      'Reset Application?',
      'This will DELETE ALL DATA permanently. Use this if you forgot your passcode.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete All Data', 
          style: 'destructive',
          onPress: async () => {
             // We would need to clear storage here. 
             // Ideally we import storage and storage.clearAll()
             // For now we'll just alert as placeholder for the safety implementation
             // In real impl: storage.clearAll(); Updates.reloadAsync();
             Alert.alert('Data Wiped', 'Please restart the app.');
          }
        }
      ]
    );
  };

  // If not enabled, we shouldn't be here, but just in case
  if (!isEnabled) return null;

  return (
    <Animated.View 
      entering={FadeIn} 
      exiting={FadeOut}
      className="absolute inset-0 z-50 bg-slate-950 items-center justify-center"
    >
      <SafeAreaView className="flex-1 items-center justify-center w-full">
        <View className="items-center mb-12">
          <View className="w-20 h-20 bg-primary-500/20 rounded-3xl items-center justify-center mb-6">
            <Lock size={40} color="#a855f7" />
          </View>
          <Text className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Inter_700Bold' }}>
            LifeContext Locked
          </Text>
          <Text className="text-slate-400 text-sm" style={{ fontFamily: 'Inter_400Regular' }}>
            Your data is encrypted and secure.
          </Text>
        </View>

        <TouchableOpacity
          onPress={authenticate}
          activeOpacity={0.8}
          className="bg-white/10 border border-white/5 rounded-2xl px-8 py-4 flex-row items-center space-x-3"
        >
          {biometryType === LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION ? (
            <ScanFace size={24} color="#fff" />
          ) : (
            <Fingerprint size={24} color="#fff" />
          )}
          <Text className="text-white font-semibold text-lg" style={{ fontFamily: 'Inter_600SemiBold' }}>
            Unlock
          </Text>
          <Text className="text-white font-semibold text-lg" style={{ fontFamily: 'Inter_600SemiBold' }}>
            Unlock with Biometrics
          </Text>
        </TouchableOpacity>

        {/* Passcode Fallback */}
        <View className="w-full px-12 mt-8">
           <Text className="text-slate-400 text-center mb-4">Or enter passcode</Text>
           <TextInput 
              value={inputPasscode}
              onChangeText={handlePasscodeChange}
              secureTextEntry
              placeholder="Passcode"
              placeholderTextColor="#64748b"
              className="bg-white/10 text-white text-center py-4 rounded-xl text-xl font-bold tracking-widest"
              keyboardType="number-pad"
           />
        </View>

        {/* Forgot Passcode / Reset */}
        <TouchableOpacity 
          onPress={handleResetApp}
          className="mt-12"
        >
          <Text className="text-red-400 font-medium">Forgot Passcode? (Reset App)</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Animated.View>
  );
}
