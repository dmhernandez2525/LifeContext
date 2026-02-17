import { View, Text } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { WifiOff } from 'lucide-react-native';
import { useNetworkStatus } from '../../lib/useNetworkStatus';

export function OfflineBanner() {
  const { isConnected } = useNetworkStatus();

  if (isConnected) return null;

  return (
    <Animated.View
      entering={FadeInUp.duration(300)}
      exiting={FadeOutUp.duration(300)}
    >
      <View
        className="flex-row items-center justify-center py-2 px-4 bg-amber-600/90"
        accessibilityRole="alert"
        accessibilityLabel="No internet connection"
      >
        <WifiOff size={14} color="#ffffff" />
        <Text
          className="text-white text-xs font-semibold ml-2"
          style={{ fontFamily: 'Inter_600SemiBold' }}
        >
          No internet connection
        </Text>
      </View>
    </Animated.View>
  );
}
