/**
 * BaseBottomSheet - Reusable glassmorphic bottom sheet wrapper
 * 
 * Uses @gorhom/bottom-sheet with custom styling to match Rocket Money aesthetic.
 */
import React, { forwardRef, useCallback, useMemo, ReactNode } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetProps,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';

// ============================================================
// TYPES
// ============================================================

export interface BaseBottomSheetProps extends Partial<Omit<BottomSheetProps, 'children'>> {
  children: ReactNode;
  snapPoints?: (string | number)[];
  onDismiss?: () => void;
  enableBlur?: boolean;
}

// ============================================================
// COMPONENT
// ============================================================

export const BaseBottomSheet = forwardRef<BottomSheet, BaseBottomSheetProps>(
  ({ children, snapPoints: customSnapPoints, onDismiss, enableBlur = true, ...props }, ref) => {
    
    const snapPoints = useMemo(
      () => customSnapPoints || ['50%', '90%'],
      [customSnapPoints]
    );

    // Backdrop component with tap-to-dismiss
    const renderBackdrop = useCallback(
      (backdropProps: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...backdropProps}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.4}
          pressBehavior="close"
        />
      ),
      []
    );

    // Custom background with glassmorphism
    const renderBackground = useCallback(
      () => (
        <View style={styles.backgroundContainer}>
          {enableBlur && Platform.OS !== 'web' ? (
            <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
          ) : null}
          <View style={styles.backgroundOverlay} />
        </View>
      ),
      [enableBlur]
    );

    // Handle indicator
    const renderHandle = useCallback(
      () => (
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>
      ),
      []
    );

    return (
      <BottomSheet
        ref={ref}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundComponent={renderBackground}
        handleComponent={renderHandle}
        onClose={onDismiss}
        animationConfigs={{
          damping: 500,
          stiffness: 300,
          mass: 1,
        }}
        style={styles.sheet}
        {...props}
      >
        <BottomSheetView style={styles.content}>
          {children}
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

BaseBottomSheet.displayName = 'BaseBottomSheet';

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  sheet: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 10,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.95)', // slate-950/95
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  handleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#475569', // slate-600
    borderRadius: 2.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
  },
});
