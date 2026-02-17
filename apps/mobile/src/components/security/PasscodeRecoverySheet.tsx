import { useState } from 'react';
import { Modal, Pressable, Text, TextInput, View } from 'react-native';

interface PasscodeRecoverySheetProps {
  isVisible: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onSubmit: (input: { email: string; backupCode: string; newPasscode: string; confirmPasscode: string }) => Promise<void>;
}

export function PasscodeRecoverySheet({
  isVisible,
  isSubmitting,
  errorMessage,
  onClose,
  onSubmit,
}: PasscodeRecoverySheetProps) {
  const [email, setEmail] = useState('');
  const [backupCode, setBackupCode] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');

  const submit = async (): Promise<void> => {
    await onSubmit({ email, backupCode, newPasscode, confirmPasscode });
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-end bg-black/70 px-4 py-6">
        <View className="w-full rounded-2xl border border-white/10 bg-slate-950 p-5">
          <Text className="text-lg font-bold text-white" style={{ fontFamily: 'Inter_700Bold' }}>
            Recover Passcode
          </Text>
          <Text className="mt-1 text-xs text-slate-400">
            Use your recovery email and backup code to set a new passcode.
          </Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Recovery email"
            placeholderTextColor="#64748b"
            className="mt-4 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
          />

          <TextInput
            value={backupCode}
            onChangeText={setBackupCode}
            autoCapitalize="characters"
            placeholder="Backup code"
            placeholderTextColor="#64748b"
            className="mt-3 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
          />

          <TextInput
            value={newPasscode}
            onChangeText={setNewPasscode}
            placeholder="New passcode (6+ digits)"
            placeholderTextColor="#64748b"
            secureTextEntry
            keyboardType="number-pad"
            className="mt-3 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
          />

          <TextInput
            value={confirmPasscode}
            onChangeText={setConfirmPasscode}
            placeholder="Confirm new passcode"
            placeholderTextColor="#64748b"
            secureTextEntry
            keyboardType="number-pad"
            className="mt-3 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
          />

          {errorMessage && <Text className="mt-3 text-sm text-red-400">{errorMessage}</Text>}

          <View className="mt-4 flex-row gap-2">
            <Pressable onPress={onClose} className="flex-1 rounded-xl border border-white/10 bg-slate-900 py-3">
              <Text className="text-center text-white">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => void submit()}
              disabled={isSubmitting}
              className={`flex-1 rounded-xl py-3 ${isSubmitting ? 'bg-slate-700' : 'bg-primary-500 active:opacity-80'}`}
            >
              <Text className="text-center text-white">{isSubmitting ? 'Recovering...' : 'Reset Passcode'}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
