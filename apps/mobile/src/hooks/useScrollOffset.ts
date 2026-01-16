/**
 * useScrollOffset - Hook for tracking scroll offset and controlling tab bar visibility
 * 
 * Usage in screens:
 * const { scrollHandler } = useScrollOffset();
 * <Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16}>
 */
import { useCallback } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useAnimatedScrollHandler, useSharedValue, SharedValue } from 'react-native-reanimated';
import { useTabBar } from '../context/TabBarContext';

interface UseScrollOffsetReturn {
  scrollOffset: SharedValue<number>;
  scrollHandler: ReturnType<typeof useAnimatedScrollHandler>;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

export function useScrollOffset(): UseScrollOffsetReturn {
  const { setScrollOffset } = useTabBar();
  const scrollOffset = useSharedValue(0);
  const lastScrollY = useSharedValue(0);
  
  // Animated scroll handler for use with Animated.ScrollView
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentY = event.contentOffset.y;
      
      scrollOffset.value = currentY;
      lastScrollY.value = currentY;
      
      // We can't call non-worklet functions from here,
      // so visibility is handled in the context based on scrollOffset changes
    },
  });
  
  // Regular onScroll handler for non-animated ScrollViews
  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    scrollOffset.value = offsetY;
    setScrollOffset(offsetY);
  }, [setScrollOffset]);
  
  return {
    scrollOffset,
    scrollHandler,
    onScroll,
  };
}
