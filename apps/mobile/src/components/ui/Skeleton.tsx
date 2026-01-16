/**
 * Skeleton Loading Components
 * 
 * Premium shimmer placeholders for content loading states
 */
import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

// ============================================================
// SHIMMER ANIMATION
// ============================================================

function Shimmer({ children, style }: { children?: React.ReactNode; style?: ViewStyle | ViewStyle[] }) {
  const translateX = useSharedValue(-1);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          translateX.value,
          [-1, 1],
          [-200, 200]
        ),
      },
    ],
  }));

  return (
    <View style={[styles.shimmerContainer, style]}>
      {children}
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <LinearGradient
          colors={[
            'transparent',
            'rgba(255, 255, 255, 0.05)',
            'transparent',
          ]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

// ============================================================
// SKELETON COMPONENTS
// ============================================================

export function SkeletonCard({ height = 120 }: { height?: number }) {
  return (
    <Shimmer style={[styles.card, { height }]}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar} />
        <View style={styles.headerText}>
          <View style={[styles.line, { width: '60%' }]} />
          <View style={[styles.line, { width: '40%', marginTop: 8 }]} />
        </View>
      </View>
      <View style={styles.cardBody}>
        <View style={[styles.line, { width: '100%' }]} />
        <View style={[styles.line, { width: '90%', marginTop: 8 }]} />
        <View style={[styles.line, { width: '70%', marginTop: 8 }]} />
      </View>
    </Shimmer>
  );
}

export function SkeletonStatsRow() {
  return (
    <View style={styles.statsRow}>
      <Shimmer style={styles.statCard}>
        <View style={styles.statIcon} />
        <View style={[styles.line, { width: '50%', marginTop: 12 }]} />
        <View style={[styles.line, { width: '70%', marginTop: 8, height: 12 }]} />
      </Shimmer>
      <Shimmer style={styles.statCard}>
        <View style={styles.statIcon} />
        <View style={[styles.line, { width: '50%', marginTop: 12 }]} />
        <View style={[styles.line, { width: '70%', marginTop: 8, height: 12 }]} />
      </Shimmer>
      <Shimmer style={styles.statCard}>
        <View style={styles.statIcon} />
        <View style={[styles.line, { width: '50%', marginTop: 12 }]} />
        <View style={[styles.line, { width: '70%', marginTop: 8, height: 12 }]} />
      </Shimmer>
    </View>
  );
}

export function SkeletonProgressRing() {
  return (
    <Shimmer style={styles.progressRing}>
      <View style={styles.progressRingInner} />
    </Shimmer>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <View style={styles.list}>
      {Array.from({ length: count }).map((_, i) => (
        <Shimmer key={i} style={styles.listItem}>
          <View style={styles.listItemIcon} />
          <View style={styles.listItemContent}>
            <View style={[styles.line, { width: '70%' }]} />
            <View style={[styles.line, { width: '50%', marginTop: 8 }]} />
          </View>
        </Shimmer>
      ))}
    </View>
  );
}

export function SkeletonCategoryGrid() {
  return (
    <View style={styles.grid}>
      {Array.from({ length: 6 }).map((_, i) => (
        <Shimmer key={i} style={styles.gridItem}>
          <View style={styles.gridIcon} />
          <View style={[styles.line, { width: '80%', marginTop: 12 }]} />
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '40%' }]} />
          </View>
        </Shimmer>
      ))}
    </View>
  );
}

// ============================================================
// FULL SCREEN SKELETONS
// ============================================================

export function DashboardSkeleton() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.line, { width: 100, height: 14 }]} />
        <View style={[styles.line, { width: 180, height: 24, marginTop: 8 }]} />
      </View>

      {/* Progress Ring */}
      <View style={styles.progressSection}>
        <SkeletonProgressRing />
      </View>

      {/* Stats */}
      <SkeletonStatsRow />

      {/* Quick Actions */}
      <View style={styles.section}>
        <View style={[styles.line, { width: 120, height: 18 }]} />
        <View style={styles.quickActions}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Shimmer key={i} style={styles.quickAction}>
              <View style={styles.quickActionIcon} />
              <View style={[styles.line, { width: '70%', marginTop: 12 }]} />
              <View style={[styles.line, { width: '50%', marginTop: 6, height: 10 }]} />
            </Shimmer>
          ))}
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <View style={[styles.line, { width: 140, height: 18 }]} />
        <SkeletonList count={3} />
      </View>
    </View>
  );
}

export function TimelineSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.line, { width: 140, height: 24 }]} />
        <View style={[styles.line, { width: 180, height: 12, marginTop: 8 }]} />
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Shimmer key={i} style={styles.filterChip} />
        ))}
      </View>

      {/* Timeline */}
      <SkeletonList count={5} />
    </View>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  shimmerContainer: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  card: {
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
  },
  headerText: {
    flex: 1,
    marginLeft: 12,
  },
  line: {
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
  },
  cardBody: {
    marginTop: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
  },
  progressRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignSelf: 'center',
  },
  progressRingInner: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    bottom: 8,
    borderRadius: 66,
    backgroundColor: '#0f172a',
  },
  progressSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  list: {
    marginTop: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    borderRadius: 16,
  },
  listItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
  },
  listItemContent: {
    flex: 1,
    marginLeft: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
  },
  gridIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    borderRadius: 2,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    borderRadius: 2,
  },
  section: {
    marginBottom: 24,
  },
  header: {
    marginBottom: 24,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  quickAction: {
    width: 100,
    padding: 16,
    borderRadius: 16,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    width: 80,
    height: 36,
    borderRadius: 18,
  },
});
