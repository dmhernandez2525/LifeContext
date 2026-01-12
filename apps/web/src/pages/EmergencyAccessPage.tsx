import { useState } from 'react';
import { Shield, AlertTriangle, Copy } from 'lucide-react';
import { splitKey, SECURITY_CONFIG, reconstructKey } from '@/lib/security';
import { cn } from '@/lib/utils';

export default function EmergencyAccessPage() {
  const [mode, setMode] = useState<'generate' | 'recover'>('generate');
  
  // Generation State
  const [secret, setSecret] = useState('');
  const [numShares, setNumShares] = useState(SECURITY_CONFIG.DEFAULT_SHARES);
  const [threshold, setThreshold] = useState(SECURITY_CONFIG.DEFAULT_THRESHOLD);
  const [generatedShares, setGeneratedShares] = useState<string[]>([]);
  
  // Recovery State
  const [recoveryShares, setRecoveryShares] = useState<string[]>(['', '', '']);
  const [recoveredSecret, setRecoveredSecret] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!secret) return;
    try {
      const shares = splitKey(secret, numShares, threshold);
      setGeneratedShares(shares);
    } catch (e) {
      console.error(e);
      alert('Failed to generate keys. Please ensure your secret is valid.');
    }
  };

  const handleRecover = () => {
    try {
      const validShares = recoveryShares.filter(s => s.trim().length > 0);
      const result = reconstructKey(validShares);
      setRecoveredSecret(result);
    } catch (e) {
      setRecoveredSecret('Invalid or insufficient shares.');
    }
  };

  return (
    <div className="pt-24 pb-12 px-6 max-w-4xl mx-auto min-h-screen">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Emergency Access Protocol</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Shamir's Secret Sharing: Split your master key into multiple parts. <br/>
          Distribute them to trusted people. No single person can access your data.
        </p>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setMode('generate')}
          className={cn(
            "px-6 py-2 rounded-full font-medium transition-all",
            mode === 'generate' 
              ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg" 
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
          )}
        >
          Generate Shards
        </button>
        <button
          onClick={() => setMode('recover')}
          className={cn(
            "px-6 py-2 rounded-full font-medium transition-all",
            mode === 'recover' 
              ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg" 
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
          )}
        >
          Recover Secret
        </button>
      </div>

      {mode === 'generate' ? (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-xl">
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Secret to Protect (e.g. Master Password)
            </label>
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your master password..."
            />
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Total Guardians (N)
              </label>
              <input
                type="number"
                min={2}
                max={20}
                value={numShares}
                onChange={(e) => setNumShares(parseInt(e.target.value))}
                className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3"
              />
              <p className="text-xs text-gray-500 mt-1">How many people will hold keys?</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Required to Unlock (M)
              </label>
              <input
                type="number"
                min={2}
                max={numShares}
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value))}
                className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum people needed to access?</p>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!secret}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-8"
          >
            Generate {numShares} Emergency Shards
          </button>

          {generatedShares.length > 0 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 p-4 rounded-xl flex gap-3 text-amber-800 dark:text-amber-200 text-sm">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <p>
                  <strong>CRITICAL:</strong> Distribute these shards immediately. If you lose these AND your master password, your data is mathematically unrecoverable. We cannot help you.
                </p>
              </div>

              {generatedShares.map((share, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 group">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-1 font-mono text-xs break-all text-gray-600 dark:text-gray-400">
                    {share}
                  </div>
                  <button 
                    onClick={() => navigator.clipboard.writeText(share)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-500 transition-colors"
                    title="Copy shard"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-xl">
           <div className="space-y-4 mb-8">
             <p className="text-sm text-gray-500">Enter the shards provided by your guardians to reconstruct the master secret.</p>
             {recoveryShares.map((share, idx) => (
               <div key={idx} className="flex gap-2">
                 <input
                   type="text"
                   value={share}
                   onChange={(e) => {
                     const newShares = [...recoveryShares];
                     newShares[idx] = e.target.value;
                     setRecoveryShares(newShares);
                   }}
                   className="flex-1 bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 font-mono text-xs"
                   placeholder={`Enter Shard #${idx + 1}`}
                 />
                 {idx === recoveryShares.length - 1 && (
                   <button 
                     onClick={() => setRecoveryShares([...recoveryShares, ''])}
                     className="px-3 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700"
                   >
                     +
                   </button>
                 )}
               </div>
             ))}
           </div>

           <button
            onClick={handleRecover}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-colors mb-8"
          >
            Reconstruct Secret
          </button>

          {recoveredSecret && (
            <div className="p-6 bg-gray-50 dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 text-center">
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Reconstructed Secret</p>
              <p className="text-xl font-mono font-bold text-gray-900 dark:text-white break-all">{recoveredSecret}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
