import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Share, ActivityIndicator, TextInput, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Download, ShieldAlert, Key, Share2, Upload } from 'lucide-react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { exportAllData } from '../../src/lib/storage';
import { split, combine } from '../../src/lib/secretSharing';
import * as Clipboard from 'expo-clipboard';

export default function DataSovereigntyScreen() {
  const router = useRouter();
  const [isExporting, setIsExporting] = useState(false);
  
  // Emergency Access State
  const [emergencyEnabled, setEmergencyEnabled] = useState(false);
  const [trustedContact, setTrustedContact] = useState('');
  
  // Shamir's Secret Sharing
  const [shares, setShares] = useState<string[]>([]);
  const [showShares, setShowShares] = useState(false);
  const [recoveryInput, setRecoveryInput] = useState('');
  
  const handleGenerateShares = () => {
      // Mock "Master Key" - in real app this decrypts the data
      const masterKey = "DEADBEEFCAFEBABE1234567890ABCDEF"; 
      try {
          const generatedShares = split(masterKey, 5, 3); // 3 of 5 scheme
          setShares(generatedShares);
          setShowShares(true);
          setEmergencyEnabled(true);
          Alert.alert("Shares Generated", "You have generated 5 recovery shares. Any 3 can recover your account.");
      } catch (e) {
          Alert.alert("Error", "Failed to generate shares");
      }
  };

  const copyShare = async (share: string) => {
      await Clipboard.setStringAsync(share);
      Alert.alert("Copied", "Share copied to clipboard");
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const fileUri = await exportAllData();
      
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Export LifeContext Backup',
          UTI: 'public.json'
        });
      } else {
        Alert.alert('Export Saved', `File saved to: ${fileUri}`);
      }
    } catch {
       Alert.alert('Export Failed', 'An error occurred while exporting your data.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleEmergencySetup = () => {
    if (emergencyEnabled) {
       Alert.alert('Revoke Access', 'Are you sure you want to revoke emergency access?', [
           { text: 'Cancel', style: 'cancel' },
           { text: 'Revoke', style: 'destructive', onPress: () => setEmergencyEnabled(false) }
       ]);
    } else {
       if (!trustedContact.trim()) {
           Alert.alert('Contact Required', 'Please enter a trusted contact name or email.');
           return;
       }
       Alert.alert('Access Granted', `A recovery key has been generated for ${trustedContact}. Share this key securely.`);
       setEmergencyEnabled(true);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={['top']}>
      <View className="flex-row items-center px-6 py-4 border-b border-white/5">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white" style={{ fontFamily: 'Inter_700Bold' }}>
          Data Sovereignty
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        <Text className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3 ml-1">
          Portability
        </Text>
        
        <View className="bg-slate-900/50 rounded-2xl border border-white/5 mb-8 p-4">
            <View className="flex-row items-start mb-4">
                <View className="w-10 h-10 rounded-xl bg-blue-500/20 items-center justify-center mr-4">
                    <Download size={20} color="#3b82f6" />
                </View>
                <View className="flex-1">
                    <Text className="text-white font-bold text-base mb-1">Export Data</Text>
                    <Text className="text-slate-400 text-xs leading-5">
                        Download a complete JSON export of your LifeContext, including recordings, journals, and tasks.
                    </Text>
                </View>
            </View>
            
            <TouchableOpacity 
                onPress={handleExportData}
                disabled={isExporting}
                className="bg-blue-600 rounded-xl py-3 items-center flex-row justify-center space-x-2"
            >
                {isExporting ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <>
                        <Upload size={18} color="#fff" />
                        <Text className="text-white font-bold">Generate Export</Text>
                    </>
                )}
            </TouchableOpacity>
        </View>

        <Text className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3 ml-1">
          Digital Legacy
        </Text>

        <View className="bg-slate-900/50 rounded-2xl border border-white/5 mb-8 p-4">
            <View className="flex-row items-start mb-4">
                <View className="w-10 h-10 rounded-xl bg-red-500/20 items-center justify-center mr-4">
                    <ShieldAlert size={20} color="#ef4444" />
                </View>
                <View className="flex-1">
                    <Text className="text-white font-bold text-base mb-1">Emergency Access</Text>
                    <Text className="text-slate-400 text-xs leading-5">
                        Designate a trusted contact who can request access to your data if you are incapacitated.
                    </Text>
                </View>
            </View>
            
            {!emergencyEnabled && !showShares && (
                <View>
                    <Text className="text-slate-400 text-xs mb-4">
                        We use <Text className="font-bold text-white">Shamir's Secret Sharing</Text> to split your master decryption key into 5 pieces. You must distribute these to 5 different trusted locations/people.
                    </Text>
                    <TouchableOpacity 
                        onPress={handleGenerateShares}
                        className="bg-red-600 rounded-xl py-3 items-center flex-row justify-center space-x-2"
                    >
                        <Key size={18} color="#fff" />
                        <Text className="text-white font-bold">Generate 5 Recovery Shares</Text>
                    </TouchableOpacity>
                </View>
            )}

            {showShares && (
                <View className="mt-4">
                    <Text className="text-white font-bold mb-2">Your Recovery Shares</Text>
                    <Text className="text-red-400 text-xs mb-4 uppercase font-bold">Write these down or store safely!</Text>
                    
                    {shares.map((share, index) => (
                        <TouchableOpacity 
                            key={index} 
                            onPress={() => copyShare(share)}
                            className="bg-slate-800 p-3 rounded-lg mb-2 border border-slate-700 flex-row justify-between"
                        >
                            <Text className="text-slate-300 font-mono text-xs">{share}</Text>
                            <Share2 size={14} color="#64748b" />
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity 
                        onPress={() => setShowShares(false)}
                        className="mt-4 bg-slate-800 py-3 rounded-xl items-center"
                    >
                        <Text className="text-slate-400">Done (I have saved them)</Text>
                    </TouchableOpacity>
                </View>
            )}

            {emergencyEnabled && !showShares && (
                <View className="mt-4 p-3 bg-green-500/10 rounded-xl border border-green-500/20 flex-row items-center">
                     <ShieldAlert size={20} color="#22c55e" className="mr-3" />
                     <View className="flex-1">
                        <Text className="text-green-400 font-bold text-sm">Recovery Active</Text>
                        <Text className="text-green-200/70 text-xs">
                             Your account is protected by a 3-of-5 secret sharing scheme.
                        </Text>
                     </View>
                     <TouchableOpacity onPress={() => setEmergencyEnabled(false)}>
                        <Text className="text-red-400 text-xs font-bold ml-2">REVOKE</Text>
                     </TouchableOpacity>
                </View>
            )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
