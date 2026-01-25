
import { View, Text, TouchableOpacity, Share, Platform } from 'react-native';
import { useMemo, useState, useCallback } from 'react';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { BaseBottomSheet } from '@/components/navigation/BottomSheets/BaseBottomSheet';
import { Copy, Check, Share as ShareIcon, X } from 'lucide-react-native';

// Generate a random invite code
function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusable chars (0,O,1,I)
  const segments = [4, 4, 4];
  return segments
    .map(len => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join(''))
    .join('-');
}

interface InviteSheetProps {
  isVisible: boolean;
  onClose: () => void;
  inviteCode?: string;
}

export const InviteSheet = ({ isVisible, onClose, inviteCode: providedCode }: InviteSheetProps) => {
  // TODO: Replace with server-generated codes stored per user/family circle
  // For now, generate a random code per session (should be persisted and validated server-side)
  const inviteCode = useMemo(() => providedCode || generateInviteCode(), [providedCode]);
  const inviteLink = `https://lifecontext.app/join/family/${inviteCode}`;
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await Clipboard.setStringAsync(inviteLink);
    setCopied(true);
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    // Reset after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  }, [inviteLink]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join my LifeContext Family Circle to see my journals and life chapters: ${inviteLink}`,
      });
    } catch {
      // Share was cancelled or failed - no action needed
    }
  };

  return (
    <BaseBottomSheet
      index={isVisible ? 0 : -1}
      onClose={onClose}
      snapPoints={['65%']}
    >
      <View className="px-6 py-2">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-xl font-bold text-gray-900 dark:text-white">
              Invite Family
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Add trusted members to your circle
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-full">
            <X size={20} color="#71717a" />
          </TouchableOpacity>
        </View>

        {/* QR Code Card */}
        <View className="items-center justify-center p-8 bg-white rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm mb-8">
           <View className="overflow-hidden rounded-xl">
             <QRCode
               value={inviteLink}
               size={200}
               color="black"
               backgroundColor="white"
             />
           </View>
           <Text className="mt-6 text-2xl font-mono font-bold tracking-widest text-indigo-600">
             {inviteCode}
           </Text>
           <Text className="mt-2 text-xs text-center text-gray-400">
             Scan with camera to join
           </Text>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-4 mb-6">
          <TouchableOpacity
            onPress={handleCopy}
            className={`flex-1 flex-row items-center justify-center h-14 rounded-2xl ${copied ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-zinc-800'}`}
          >
            {copied ? (
              <>
                <Check size={20} color="#22c55e" className="mr-2" />
                <Text className="font-semibold text-green-600 dark:text-green-400">
                  Copied!
                </Text>
              </>
            ) : (
              <>
                <Copy size={20} color="#71717a" className="mr-2" />
                <Text className="font-semibold text-gray-700 dark:text-gray-300">
                  Copy Link
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleShare}
            className="flex-1 flex-row items-center justify-center bg-indigo-600 h-14 rounded-2xl"
          >
            <ShareIcon size={20} color="white" className="mr-2" />
            <Text className="font-semibold text-white">
              Share
            </Text>
          </TouchableOpacity>
        </View>

        {/* Privacy Note */}
        <Text className="text-center text-xs text-gray-400 px-8 leading-5">
          Members will only see content you explicitly mark as "Family" or "Trusted". You can revoke access at any time.
        </Text>
      </View>
    </BaseBottomSheet>
  );
};
