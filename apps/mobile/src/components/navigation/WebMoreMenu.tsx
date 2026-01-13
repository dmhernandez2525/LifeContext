/**
 * WebMoreMenu - Web fallback for the bottom sheet "More" menu
 * 
 * Uses a simple dropdown/modal since @gorhom/bottom-sheet doesn't work on web
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Sparkles,
  Columns,
  Brain,
  Settings,
  Search,
  HelpCircle,
  X,
} from 'lucide-react-native';

interface WebMoreMenuProps {
  visible: boolean;
  onClose: () => void;
}

const MENU_ITEMS = [
  { route: 'insights', icon: Sparkles, label: 'AI Insights', color: '#0ea5e9' },
  { route: 'kanban', icon: Columns, label: 'Task Board', color: '#f59e0b' },
  { route: 'braindump', icon: Brain, label: 'Brain Dump', color: '#a855f7' },
  { route: 'questions', icon: HelpCircle, label: 'Questions', color: '#10b981' },
  { route: 'record', icon: Sparkles, label: 'Record', color: '#3b82f6' },
  { route: 'settings', icon: Settings, label: 'Settings', color: '#64748b' },
  { route: '/search', icon: Search, label: 'Search', color: '#94a3b8', isExternal: true },
];

export function WebMoreMenu({ visible, onClose }: WebMoreMenuProps) {
  const router = useRouter();

  const handleItemPress = (route: string, isExternal?: boolean) => {
    onClose();
    if (isExternal) {
      router.push(route as any);
    } else {
      router.push(`/(tabs)/${route}` as any);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.menuContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>More</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* Menu Items */}
          {MENU_ITEMS.map((item) => {
            const IconComponent = item.icon;
            return (
              <TouchableOpacity
                key={item.route}
                style={styles.menuItem}
                onPress={() => handleItemPress(item.route, (item as any).isExternal)}
                activeOpacity={0.7}
              >
                <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
                  <IconComponent size={20} color={item.color} />
                </View>
                <Text style={styles.menuItemLabel}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 100,
  },
  menuContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f8fafc',
  },
  closeButton: {
    padding: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemLabel: {
    fontSize: 16,
    color: '#f8fafc',
    fontWeight: '500',
  },
});
