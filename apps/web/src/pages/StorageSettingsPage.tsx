import { useState } from 'react';
import { HardDrive, Cloud, AlertCircle, Archive, Database, Save, Check } from 'lucide-react';
import { useStorageStore } from '@/store/storage-store';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export default function StorageSettingsPage() {
  const { strategy, provider, s3Config, setStrategy, setProvider, setS3Config } = useStorageStore();
  const [_showConfig, _setShowConfig] = useState(false);

  return (
    <div className="pt-24 pb-12 px-6 max-w-4xl mx-auto min-h-screen">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Storage Strategy</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Decide how your raw data is preserved. We believe in "Future-Proofing" your context.
        </p>
      </div>

      {/* Retention Policy */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Archive className="w-5 h-5 text-purple-600" />
          Data Retention Policy
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => setStrategy('archivist')}
            className={cn(
              "p-6 rounded-2xl border-2 text-left transition-all relative overflow-hidden",
              strategy === 'archivist'
                ? "border-purple-600 bg-purple-50 dark:bg-purple-900/10"
                : "border-gray-200 dark:border-gray-800 hover:border-purple-300"
            )}
          >
            {strategy === 'archivist' && (
              <div className="absolute top-4 right-4 bg-purple-600 text-white p-1 rounded-full">
                <Check className="w-4 h-4" />
              </div>
            )}
            <div className="mb-4 w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Archivist (Recommended)</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Keep <strong>Original Raw Video</strong> forever.
            </p>
            <div className="bg-white/50 dark:bg-black/20 p-3 rounded-lg text-xs font-mono text-purple-800 dark:text-purple-300">
              Why? In 10 years, AI models will be 1000x better. They can re-watch your videos to find "micro-expressions" and deep context we miss today.
            </div>
          </button>

          <button
            onClick={() => setStrategy('optimized')}
            className={cn(
              "p-6 rounded-2xl border-2 text-left transition-all relative",
              strategy === 'optimized'
                ? "border-blue-600 bg-blue-50 dark:bg-blue-900/10"
                : "border-gray-200 dark:border-gray-800 hover:border-blue-300"
            )}
          >
            {strategy === 'optimized' && (
              <div className="absolute top-4 right-4 bg-blue-600 text-white p-1 rounded-full">
                <Check className="w-4 h-4" />
              </div>
            )}
             <div className="mb-4 w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Space Saver</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Transcribe to text, then <strong>Delete Video</strong>.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Saves space, but you lose the tone/voice data forever. Not recommended for legacy building.
            </p>
          </button>
        </div>
      </section>

      {/* Storage Target */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          Where to Store?
        </h2>

         <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden">
           <div className="p-6 border-b border-gray-100 dark:border-gray-800">
             <div className="flex flex-wrap gap-4">
               {[
                 { id: 'internal', label: 'Browser (IndexedDB)', icon: Database },
                 { id: 'filesystem', label: 'Local Folder', icon: FolderOpen },
                 { id: 's3', label: 'S3 / R2 / MinIO', icon: Cloud },
               ].map((opt) => (
                 <button
                    key={opt.id}
                    onClick={() => setProvider(opt.id as any)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors border",
                      provider === opt.id
                        ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent"
                        : "bg-transparent border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                 >
                   <opt.icon className="w-4 h-4" />
                   {opt.label}
                 </button>
               ))}
             </div>
           </div>

           <div className="p-8 bg-gray-50 dark:bg-gray-950/50">
             {provider === 'internal' && (
               <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                 <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                 <p>Videos are stored inside your browser. If you clear cookies/data, they may be lost. We recommend exporting regularly.</p>
               </div>
             )}

             {provider === 'filesystem' && (
               <div className="text-center py-8">
                 <p className="text-gray-500 mb-4">Select a folder on your device to serve as your "Vault".</p>
                 <button className="bg-gray-200 dark:bg-gray-800 px-6 py-2 rounded-xl font-medium text-gray-700 dark:text-gray-300">
                   Select Vault Location...
                 </button>
                 <p className="text-xs text-gray-400 mt-2">Uses File System Access API</p>
               </div>
             )}

             {provider === 's3' && (
               <div className="space-y-4 max-w-md">
                 <p className="text-sm text-gray-500 mb-4">Connect to any S3-compatible cold storage (AWS, Cloudflare R2, MinIO, Wasabi).</p>
                 <div>
                   <label className="block text-xs font-medium uppercase text-gray-500 mb-1">Endpoint</label>
                   <input 
                      type="text" 
                      value={s3Config.endpoint}
                      onChange={(e) => setS3Config({ endpoint: e.target.value })}
                      placeholder="https://s3.us-east-1.amazonaws.com"
                      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2"
                   />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium uppercase text-gray-500 mb-1">Bucket</label>
                      <input 
                          type="text" 
                          value={s3Config.bucket}
                          onChange={(e) => setS3Config({ bucket: e.target.value })}
                          className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium uppercase text-gray-500 mb-1">Region</label>
                      <input 
                          type="text" 
                          value={s3Config.region}
                          onChange={(e) => setS3Config({ region: e.target.value })}
                          className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2"
                      />
                    </div>
                 </div>
                 <div>
                   <button className="flex items-center gap-2 text-sm text-purple-600 font-medium">
                     <Save className="w-4 h-4" />
                     Save Configuration
                   </button>
                 </div>
               </div>
             )}
           </div>
         </div>
      </section>

      <div className="flex justify-end">
        <Link to="/features" className="text-gray-500 hover:text-gray-900 transition-colors">
          Back to Features
        </Link>
      </div>

    </div>
  );
}

function Zap({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function FolderOpen({ className }: { className?: string }) {
    return (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
      >
        <path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2" />
      </svg>
    );
  }
