import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { Lock, Fingerprint, ScanFace } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeHaptics as Haptics } from '../../lib/haptics';
import { useSecurityStore } from '../../store/useSecurityStore';
import { authenticateBiometric, getLockoutRemainingMs, listSessions, recoverPasscode, verifyPasscode } from '../../security/authService';
import { PasscodePad } from './PasscodePad';
import { PasscodeRecoverySheet } from './PasscodeRecoverySheet';

const PASSCODE_LENGTH = 6;

export function LockScreen() {
  const {
    setIsLocked,
    isEnabled,
    biometricEnabled,
    setLastUnlockAt,
    setLastActive,
    setActiveSessionId,
    setFailedLockUntil,
  } = useSecurityStore();

  const [biometryType, setBiometryType] = useState<LocalAuthentication.AuthenticationType | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lockRemainingMs, setLockRemainingMs] = useState(0);
  const [showRecovery, setShowRecovery] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);

  const lockRemainingSeconds = useMemo(() => Math.ceil(lockRemainingMs / 1000), [lockRemainingMs]);

  const completeUnlock = useCallback(async () => {
    const now = Date.now();
    const sessions = await listSessions();
    setIsLocked(false);
    setLastUnlockAt(now);
    setLastActive(now);
    setFailedLockUntil(null);
    setActiveSessionId(sessions.activeSessionId);
    setPasscode('');
    setErrorMessage(null);
  }, [setActiveSessionId, setFailedLockUntil, setIsLocked, setLastActive, setLastUnlockAt]);

  const refreshBiometry = useCallback(async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      setBiometryType(null);
      return;
    }

    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      setBiometryType(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION);
      return;
    }

    if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      setBiometryType(LocalAuthentication.AuthenticationType.FINGERPRINT);
      return;
    }

    setBiometryType(types[0] ?? null);
  }, []);

  const handleBiometricUnlock = useCallback(async () => {
    if (!biometricEnabled || isAuthenticating) {
      return;
    }

    setIsAuthenticating(true);
    const success = await authenticateBiometric();
    setIsAuthenticating(false);

    if (success) {
      await completeUnlock();
      return;
    }

    setErrorMessage('Biometric authentication failed. Enter your passcode.');
  }, [biometricEnabled, completeUnlock, isAuthenticating]);

  useEffect(() => {
    setLockRemainingMs(getLockoutRemainingMs());
    void refreshBiometry();
  }, [refreshBiometry]);

  useEffect(() => {
    const timer = setInterval(() => {
      setLockRemainingMs(getLockoutRemainingMs());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (biometryType && biometricEnabled) {
      void handleBiometricUnlock();
    }
  }, [biometryType, biometricEnabled, handleBiometricUnlock]);

  const attemptPasscodeUnlock = useCallback(async (value: string) => {
    const result = await verifyPasscode(value);
    if (result.success) {
      await completeUnlock();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return;
    }

    if (result.remainingLockMs > 0) {
      const lockedUntil = Date.now() + result.remainingLockMs;
      setFailedLockUntil(lockedUntil);
      setLockRemainingMs(result.remainingLockMs);
      setErrorMessage(`Too many attempts. Try again in ${Math.ceil(result.remainingLockMs / 1000)}s.`);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setErrorMessage('Incorrect passcode. Please try again.');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }, [completeUnlock, setFailedLockUntil]);

  const handleDigit = (digit: string): void => {
    if (lockRemainingMs > 0) {
      return;
    }

    const next = `${passcode}${digit}`.slice(0, PASSCODE_LENGTH);
    setPasscode(next);
    if (next.length === PASSCODE_LENGTH) {
      void attemptPasscodeUnlock(next);
    }
  };

  const handleDelete = (): void => {
    if (lockRemainingMs > 0) {
      return;
    }

    setPasscode((previous) => previous.slice(0, -1));
  };

  const handleRecoverySubmit = async (input: { email: string; backupCode: string; newPasscode: string; confirmPasscode: string }): Promise<void> => {
    if (input.newPasscode.length < PASSCODE_LENGTH || !/^\d+$/.test(input.newPasscode)) {
      setRecoveryError('New passcode must be 6+ digits.');
      return;
    }

    if (input.newPasscode !== input.confirmPasscode) {
      setRecoveryError('New passcode and confirmation do not match.');
      return;
    }

    setIsRecovering(true);
    setRecoveryError(null);

    const recovered = await recoverPasscode(input.email, input.backupCode, input.newPasscode);
    if (!recovered) {
      setIsRecovering(false);
      setRecoveryError('Recovery details were not valid.');
      return;
    }

    const verifyResult = await verifyPasscode(input.newPasscode);
    setIsRecovering(false);

    if (!verifyResult.success) {
      setRecoveryError('Recovery succeeded, but unlock failed. Try again.');
      return;
    }

    setShowRecovery(false);
    Alert.alert('Passcode Updated', 'Your passcode has been reset successfully.');
    await completeUnlock();
  };

  if (!isEnabled) {
    return null;
  }

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} className="absolute inset-0 z-50 bg-slate-950 items-center justify-center">
      <SafeAreaView className="flex-1 items-center justify-center w-full px-6">
        <View className="items-center mb-8">
          <View className="w-20 h-20 bg-primary-500/20 rounded-3xl items-center justify-center mb-6">
            <Lock size={40} color="#a855f7" />
          </View>
          <Text className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Inter_700Bold' }}>LifeContext Locked</Text>
          <Text className="text-slate-400 text-sm text-center" style={{ fontFamily: 'Inter_400Regular' }}>
            Enter your passcode to continue.
          </Text>
          {lockRemainingSeconds > 0 && (
            <Text className="mt-2 text-sm text-amber-400">Too many attempts. Try again in {lockRemainingSeconds}s.</Text>
          )}
          {errorMessage && <Text className="mt-2 text-sm text-red-400 text-center">{errorMessage}</Text>}
        </View>

        {biometryType && biometricEnabled && (
          <TouchableOpacity onPress={() => void handleBiometricUnlock()} activeOpacity={0.8} className="mb-8 rounded-2xl border border-white/10 bg-white/10 px-6 py-3 flex-row items-center">
            {biometryType === LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION ? <ScanFace size={20} color="#fff" /> : <Fingerprint size={20} color="#fff" />}
            <Text className="ml-2 text-white font-semibold" style={{ fontFamily: 'Inter_600SemiBold' }}>
              {isAuthenticating ? 'Authenticating...' : 'Unlock with Biometrics'}
            </Text>
          </TouchableOpacity>
        )}

        <PasscodePad value={passcode} length={PASSCODE_LENGTH} disabled={lockRemainingMs > 0} onDigit={handleDigit} onDelete={handleDelete} />

        <TouchableOpacity onPress={() => setShowRecovery(true)} className="mt-6">
          <Text className="text-slate-400 text-sm">Forgot passcode? Recover with backup code</Text>
        </TouchableOpacity>
      </SafeAreaView>

      <PasscodeRecoverySheet
        isVisible={showRecovery}
        isSubmitting={isRecovering}
        errorMessage={recoveryError}
        onClose={() => {
          setShowRecovery(false);
          setRecoveryError(null);
        }}
        onSubmit={handleRecoverySubmit}
      />
    </Animated.View>
  );
}
