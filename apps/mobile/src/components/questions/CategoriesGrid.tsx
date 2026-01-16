/**
 * CategoriesGrid - Grid of question categories with progress indicators
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter, Href } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  User,
  Heart,
  Users,
  Briefcase,
  Image,
  Target,
  Activity,
  Star,
  LucideIcon,
} from 'lucide-react-native';
import { QuestionCategory, CategoryProgress } from '../../lib/questions';

// ============================================================
// ICON MAP
// ============================================================

const ICON_MAP: Record<string, LucideIcon> = {
  user: User,
  heart: Heart,
  users: Users,
  briefcase: Briefcase,
  image: Image,
  target: Target,
  activity: Activity,
  star: Star,
};

// ============================================================
// CATEGORY CARD
// ============================================================

interface CategoryCardProps {
  category: QuestionCategory;
  progress: CategoryProgress;
  index: number;
  onPress: () => void;
}

function CategoryCard({ category, progress, index, onPress }: CategoryCardProps) {
  const IconComponent = ICON_MAP[category.icon] || User;
  
  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).springify().damping(15)}
      style={styles.cardContainer}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: `${category.color}20` }]}>
          <IconComponent size={24} color={category.color} strokeWidth={2} />
        </View>

        {/* Content */}
        <Text style={styles.categoryName}>{category.name}</Text>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${progress.percentage}%`,
                  backgroundColor: category.color,
                }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {progress.answered}/{progress.total}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

interface CategoriesGridProps {
  categories: QuestionCategory[];
  progressMap: Map<string, CategoryProgress>;
}

export function CategoriesGrid({ categories, progressMap }: CategoriesGridProps) {
  const router = useRouter();

  const handleCategoryPress = (category: QuestionCategory) => {
    router.push(`/questions/${category.slug}` as Href);
  };

  return (
    <View style={styles.grid}>
      {categories.map((category, index) => (
        <CategoryCard
          key={category.id}
          category={category}
          progress={progressMap.get(category.id) || { categoryId: category.id, total: 0, answered: 0, percentage: 0 }}
          index={index}
          onPress={() => handleCategoryPress(category)}
        />
      ))}
    </View>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  cardContainer: {
    width: '48%',
  },
  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#f8fafc',
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBackground: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: '#94a3b8',
  },
});
