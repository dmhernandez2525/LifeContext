import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Mic, 
  Type, 
  Moon, 
  Sun, 
  Globe,
  Download,
  Upload,
  Trash2,
  Save,
  CheckCircle,
  Loader2,
  AlertCircle,
  Sparkles,
  Cloud,
  RefreshCw,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/app-store';
import { useDataExport, useDemoData, useCloudSync } from '@/hooks';

export default function SettingsPage() {
  const { settings, updateSettings, reset } = useAppStore();
  const { downloadExport, uploadImport, isExporting, isImporting, error: exportError } = useDataExport();
  const { seedDemoData, isSeeding, isSeeded, progress: seedProgress } = useDemoData();
  const cloudSync = useCloudSync();
  
  const [saved, setSaved] = useState(false);
  const [apiKey, setApiKey] = useState(settings?.aiProvider.apiKey || '');
  const [whisperApiKey, setWhisperApiKey] = useState(settings?.aiProvider.whisperApiKey || '');
  const [useOwnKey, setUseOwnKey] = useState(!settings?.aiProvider.useDefaultKey);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    updateSettings({
      aiProvider: {
        ...settings!.aiProvider,
        apiKey: useOwnKey ? apiKey : undefined,
        whisperApiKey: whisperApiKey || undefined,
        useDefaultKey: !useOwnKey,
      },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExport = async () => {
    await downloadExport();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const success = await uploadImport(file);
      if (success) {
        window.location.reload();
      }
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      reset();
      window.location.href = '/';
    }
  };

  if (!settings) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Customize your experience
        </p>
      </div>

      {/* Input Method */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Input Method
        </h2>
        <div className="space-y-3">
          {[
            { value: 'voice', icon: Mic, label: 'Voice recording', description: 'Speak naturally, transcribe after' },
            { value: 'voice-transcribed', icon: Mic, label: 'Voice with live transcription', description: 'See your words as you speak' },
            { value: 'text', icon: Type, label: 'Type my answers', description: 'Traditional text input' },
          ].map((option) => (
            <label
              key={option.value}
              className={cn(
                'flex items-start space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-colors',
                settings.preferredInputMethod === option.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              )}
            >
              <input
                type="radio"
                name="inputMethod"
                value={option.value}
                checked={settings.preferredInputMethod === option.value}
                onChange={(e) => updateSettings({ preferredInputMethod: e.target.value as 'voice' | 'voice-transcribed' | 'text' })}
                className="sr-only"
              />
              <option.icon className={cn(
                'w-5 h-5 mt-0.5',
                settings.preferredInputMethod === option.value
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-400'
              )} />
              <div>
                <p className={cn(
                  'font-medium',
                  settings.preferredInputMethod === option.value
                    ? 'text-blue-900 dark:text-blue-100'
                    : 'text-gray-900 dark:text-white'
                )}>
                  {option.label}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {option.description}
                </p>
              </div>
            </label>
          ))}
        </div>
      </motion.section>

      {/* Theme */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Appearance
        </h2>
        <div className="flex space-x-3">
          {[
            { value: 'light', icon: Sun, label: 'Light' },
            { value: 'dark', icon: Moon, label: 'Dark' },
            { value: 'system', icon: Globe, label: 'System' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => updateSettings({ theme: option.value as 'light' | 'dark' | 'system' })}
              className={cn(
                'flex-1 flex flex-col items-center p-4 rounded-lg border-2 transition-colors',
                settings.theme === option.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              )}
            >
              <option.icon className={cn(
                'w-6 h-6 mb-2',
                settings.theme === option.value
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-400'
              )} />
              <span className={cn(
                'text-sm font-medium',
                settings.theme === option.value
                  ? 'text-blue-900 dark:text-blue-100'
                  : 'text-gray-700 dark:text-gray-300'
              )}>
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </motion.section>

      {/* AI Provider */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          AI Provider
        </h2>
        
        <div className="space-y-4">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={useOwnKey}
              onChange={(e) => setUseOwnKey(e.target.checked)}
              className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Use my own Anthropic API key
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                More private - your requests go directly to Anthropic
              </p>
            </div>
          </label>

          {useOwnKey && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Anthropic API Key
              </label>
              <div className="flex space-x-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-ant-..."
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Used for AI analysis, pattern recognition, and insights
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              OpenAI API Key (Whisper)
            </label>
            <div className="flex space-x-2">
              <input
                type="password"
                value={whisperApiKey}
                onChange={(e) => setWhisperApiKey(e.target.value)}
                placeholder="sk-..."
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                onClick={handleSave}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                <span>{saved ? 'Saved' : 'Save'}</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Used for high-quality voice transcription (optional)
            </p>
          </div>
        </div>
      </motion.section>

      {/* Demo Mode */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
        className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Demo Mode
            </h2>
          </div>
          {isSeeded && (
            <span className="text-xs font-medium px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
              Active
            </span>
          )}
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Populate the app with pre-filled demo data to showcase all features. Includes answered questions, 
          AI-generated insights, and patterns across multiple life categories.
        </p>
        
        <button
          onClick={seedDemoData}
          disabled={isSeeding || isSeeded}
          className={cn(
            "w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all",
            isSeeded
              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
          )}
        >
          {isSeeding ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Seeding... {seedProgress}%</span>
            </>
          ) : isSeeded ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Demo Data Active</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Seed Demo Data</span>
            </>
          )}
        </button>
        
        {isSeeded && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
            16 recordings • 6 patterns • 4 insights • ~39 minutes of content
          </p>
        )}
      </motion.section>

      {/* Cloud Backup */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Cloud className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Cloud Backup
            </h2>
          </div>
          {cloudSync.isConnected && (
            <span className="text-xs font-medium px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
              {cloudSync.provider === 'google-drive' ? 'Google Drive' : 'OneDrive'} Connected
            </span>
          )}
        </div>
        
        {cloudSync.error && (
          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 mb-4 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{cloudSync.error}</span>
          </div>
        )}
        
        {cloudSync.isConnected ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {cloudSync.lastSyncedAt 
                ? `Last synced: ${cloudSync.lastSyncedAt.toLocaleString()}`
                : 'Never synced'}
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={cloudSync.sync}
                disabled={cloudSync.isSyncing}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
              >
                {cloudSync.isSyncing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Syncing...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Sync Now</span>
                  </>
                )}
              </button>
              <button
                onClick={cloudSync.disconnect}
                className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Connect your cloud storage to automatically backup your encrypted data.
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={cloudSync.connectOneDrive}
                disabled={cloudSync.isConnecting}
                className={cn(
                  "flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border transition-colors",
                  cloudSync.isConnecting
                    ? "border-gray-200 dark:border-gray-700 opacity-50"
                    : "border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                )}
              >
                {cloudSync.isConnecting ? (
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0078d4">
                    <path d="M10.5 18.5c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5c1.7 0 3.2 1 3.9 2.4.4-.1.8-.2 1.1-.2 2.2 0 4 1.8 4 4s-1.8 4-4 4H10.5z"/>
                  </svg>
                )}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">OneDrive</span>
              </button>
              <button
                onClick={cloudSync.connectGoogleDrive}
                disabled={cloudSync.isConnecting}
                className={cn(
                  "flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border transition-colors",
                  cloudSync.isConnecting
                    ? "border-gray-200 dark:border-gray-700 opacity-50"
                    : "border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/20"
                )}
              >
                {cloudSync.isConnecting ? (
                  <Loader2 className="w-5 h-5 animate-spin text-green-600" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M6.28 7.5L12 4.5l5.72 3 .28-.27L12 3 5.73 7.23l.55.27z" fill="#4285f4"/>
                    <path d="M18 14.73V9l-6 3.5-6-3.5v5.73l6 3.77 6-3.77z" fill="#34a853"/>
                    <path d="M6 14.73L6 9l6 3.5V20l-6-5.27z" fill="#188038"/>
                    <path d="M18 9v5.73L12 20v-7.5L18 9z" fill="#1967d2"/>
                  </svg>
                )}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Google Drive</span>
              </button>
            </div>
            
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
              Your data is encrypted before upload. Cloud providers only see encrypted content.
            </p>
          </>
        )}
      </motion.section>

      {/* Data Management */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Data Management
        </h2>
        
        {exportError && (
          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 mb-4 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{exportError}</span>
          </div>
        )}
        
        <div className="space-y-3">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left disabled:opacity-50"
          >
            {isExporting ? (
              <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
            ) : (
              <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            )}
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Export Data</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Download encrypted backup</p>
            </div>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            onClick={handleImportClick}
            disabled={isImporting}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left disabled:opacity-50"
          >
            {isImporting ? (
              <Loader2 className="w-5 h-5 text-green-600 dark:text-green-400 animate-spin" />
            ) : (
              <Upload className="w-5 h-5 text-green-600 dark:text-green-400" />
            )}
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Import Data</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Restore from backup</p>
            </div>
          </button>

          <button
            onClick={handleReset}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
          >
            <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
            <div>
              <p className="font-medium text-red-600 dark:text-red-400">Reset All Data</p>
              <p className="text-sm text-red-500 dark:text-red-500/80">Delete everything permanently</p>
            </div>
          </button>
        </div>
      </motion.section>
    </div>
  );
}
