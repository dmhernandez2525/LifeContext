import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Trash2, Mic, BookOpen, HardDrive, RefreshCw } from 'lucide-react-native';
import { useStorageStats } from '../../src/hooks/useStorageStats';
import { clearAllData } from '../../src/lib/storage'; // We might want more granular utils later
import * as FileSystem from 'expo-file-system';

export default function StorageSettingsScreen() {
  const router = useRouter();
  const { stats, refreshStats, formatSize } = useStorageStats();
  const [isClearing, setIsClearing] = useState(false);

  // TODO: Add granular clear functions to storage.ts if needed
  const handleClearCache = async () => {
    // For now, let's say "Clear Exports" is the safe cache clear
    Alert.alert(
      'Clear Exports?',
      'This will delete all generated backup files. Your actual data will remains safe.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
             const EXPORTS_DIR = `${FileSystem.documentDirectory}exports/`;
             await FileSystem.deleteAsync(EXPORTS_DIR, { idempotent: true });
             await FileSystem.makeDirectoryAsync(EXPORTS_DIR, { intermediates: true });
             refreshStats();
          }
        }
      ]
    );
  };

  const handleDeleteAll = () => {
    Alert.alert(
      'Delete Everything?',
      'This action is IRREVERSIBLE. All recordings, journals, and logs will be permanently wiped.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            setIsClearing(true);
            try {
              await clearAllData();
              setTimeout(() => {
                // Restart app or Nav to onboarding?
                // For now, just refresh and show success
                refreshStats();
                setIsClearing(false);
                Alert.alert('Data Wiped', 'Application state has been reset.');
                router.replace('/');
              }, 1000);
            } catch (error) {
              setIsClearing(false);
              Alert.alert('Error', 'Failed to clear data.');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={['top']}>
      <View className="flex-row items-center px-6 py-4 border-b border-white/5">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white" style={{ fontFamily: 'Inter_700Bold' }}>
          Storage
        </Text>
        <View className="flex-1 items-end">
            <TouchableOpacity onPress={refreshStats} disabled={stats.isLoading}>
                <RefreshCw size={20} color="#94a3b8" className={stats.isLoading ? "opacity-50" : ""} />
            </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        {/* Total Usage Card */}
        <View className="bg-slate-900 rounded-2xl p-6 border border-white/5 mb-8 items-center">
          <Text className="text-slate-400 text-sm mb-2" style={{ fontFamily: 'Inter_500Medium' }}>
            Total Used Storage
          </Text>
          {stats.isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-4xl font-bold text-white mb-1" style={{ fontFamily: 'Inter_700Bold' }}>
              {formatSize(stats.totalSize)}
            </Text>
          )}
          <Text className="text-slate-600 text-xs">
            On internal device storage
          </Text>
        </View>

        {/* Breakdown */}
        <Text className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3 ml-1">
          Breakdown
        </Text>
        <View className="bg-slate-900/50 rounded-2xl border border-white/5 mb-8 overflow-hidden">
             {/* Audio */}
             <View className="flex-row items-center justify-between p-4 border-b border-white/5">
                <View className="flex-row items-center space-x-3">
                    <View className="w-8 h-8 rounded-lg bg-blue-500/20 items-center justify-center">
                        <Mic size={16} color="#3b82f6" />
                    </View>
                    <Text className="text-white font-medium">Recordings</Text>
                </View>
                <Text className="text-slate-400 font-medium">{formatSize(stats.recordingsSize)}</Text>
            </View>

            {/* Journals */}
            <View className="flex-row items-center justify-between p-4 border-b border-white/5">
                <View className="flex-row items-center space-x-3">
                    <View className="w-8 h-8 rounded-lg bg-green-500/20 items-center justify-center">
                        <BookOpen size={16} color="#10b981" />
                    </View>
                    <Text className="text-white font-medium">Journals & Media</Text>
                </View>
                <Text className="text-slate-400 font-medium">{formatSize(stats.journalsSize)}</Text>
            </View>

             {/* Exports/Cache */}
             <View className="flex-row items-center justify-between p-4">
                <View className="flex-row items-center space-x-3">
                    <View className="w-8 h-8 rounded-lg bg-yellow-500/20 items-center justify-center">
                        <HardDrive size={16} color="#f59e0b" />
                    </View>
                    <Text className="text-white font-medium">Backups & Exports</Text>
                </View>
                <Text className="text-slate-400 font-medium">{formatSize(stats.exportsSize)}</Text>
            </View>
        </View>

        {/* Actions */}
        <Text className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3 ml-1">
          Actions
        </Text>
        
        <TouchableOpacity 
            onPress={handleClearCache}
            className="flex-row items-center justify-center bg-slate-800 rounded-xl py-4 mb-3 border border-white/5"
        >
            <Text className="text-white font-bold mr-2">Clear Backups</Text>
        </TouchableOpacity>

        <TouchableOpacity 
            onPress={handleDeleteAll}
            disabled={isClearing}
            className="flex-row items-center justify-center bg-red-500/10 rounded-xl py-4 border border-red-500/30"
        >
            {isClearing ? (
               <ActivityIndicator color="#ef4444" />
            ) : (
                <>
                <Trash2 size={18} color="#ef4444" className="mr-2" />
                <Text className="text-red-500 font-bold ml-2">Delete All Data</Text>
                </>
            )}
        </TouchableOpacity>

        <Text className="text-slate-600 text-xs text-center mt-4 px-4 leading-5">
            Deleting all data will remove all recordings, journals, and local settings. This cannot be undone.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
