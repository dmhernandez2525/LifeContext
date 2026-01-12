import { Shield, Lock, Database, Server, Key, FileJson, CheckCircle } from 'lucide-react';

export default function DataSovereigntyPage() {
  return (
    <div className="pt-32 pb-24 px-6 bg-white dark:bg-gray-950 min-h-screen transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-1.5 rounded-full font-medium text-sm mb-6">
            <Shield className="w-4 h-4" />
            <span>Privacy First Architecture</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Your Data. Your Disk. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400">
              Zero Compromise.
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
            We built LifeContext Compiler with a radical premise: a cloud service that knows nothing about you. 
            Here is exactly how we protect your life's work.
          </p>
        </div>

        {/* The Protocol Diagram */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-8 md:p-12 mb-20 border border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">The Security Protocol</h2>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 -z-10" />

            <div className="text-center relative">
              <div className="w-24 h-24 mx-auto bg-green-100 dark:bg-green-500/10 rounded-full flex items-center justify-center mb-6 border-4 border-white dark:border-gray-900">
                <Key className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">1. Encryption</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Data is encrypted <strong>locally</strong> on your device using a key derived from your password.
              </p>
            </div>

            <div className="text-center relative">
              <div className="w-24 h-24 mx-auto bg-blue-100 dark:bg-blue-500/10 rounded-full flex items-center justify-center mb-6 border-4 border-white dark:border-gray-900">
                <Lock className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">2. Transmission</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Only the encrypted blob is sent to our sync servers. We cannot decrypt it.
              </p>
            </div>

            <div className="text-center relative">
              <div className="w-24 h-24 mx-auto bg-purple-100 dark:bg-purple-500/10 rounded-full flex items-center justify-center mb-6 border-4 border-white dark:border-gray-900">
                <Server className="w-10 h-10 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">3. Storage</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Stored as opaque binary data. If our servers are hacked, your data remains unreadable.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center"> {/* Added a new container for the Emergency Protocol */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 inline-block max-w-md">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Emergency Protocol</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                What happens if you're incapacitated? Configure a "Key Splitting" protocol to allow trusted contacts to recover your data only when they act together.
              </p>
              <a href="/security/emergency" className="text-purple-600 dark:text-purple-400 font-medium hover:underline">
                Configure Dead Man's Switch →
              </a>
            </div>
          </div>

          <div className="mt-8 text-center">
             <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 inline-block max-w-md">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Bring Your Own Storage</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Don't want to delete your raw videos? Connect your own S3 bucket or Local Drive to build a "Life Data Lake" for future AI models.
              </p>
              <a href="/settings/storage" className="text-purple-600 dark:text-purple-400 font-medium hover:underline">
                Configure Storage Strategy →
              </a>
            </div>
          </div>
        </div>

      {/* Trust No One Section */}
      <section className="py-24 bg-red-50 dark:bg-red-950/10 border-y border-red-100 dark:border-red-900/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Why Trust Us? <span className="text-red-600">Don't.</span></h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
            We built this because we have trust issues. You should too.
            <br/><br/>
            Any company that asks you to "trust" them is a security risk. We designed LifeContext so that we (or any government/hacker) 
            can never access your data, even if compelled by law or force.
          </p>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-red-200 dark:border-red-900/50 inline-block text-left">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Our "Canary" Promise:</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">✅ We cannot reset your password.</li>
              <li className="flex items-center gap-2">✅ We cannot decrypt your journals.</li>
              <li className="flex items-center gap-2">✅ You can export/delete everything instantly.</li>
              <li className="flex items-center gap-2">✅ <strong>Self-Hosting is encouraged.</strong></li>
            </ul>
          </div>
        </div>
      </section>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <Database className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              Local-First Database
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              Most apps load data from the cloud. LCC loads data from your device's IndexedDB. This means the app works perfectly offline, feels instantly responsive, and ensures you always have a copy of your data physically on your machine.
            </p>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <FileJson className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              Portable Format
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              Vendor lock-in is the enemy of legacy. Your data can be exported at any time to standard JSON or Markdown formats, ensuring your great-grandchildren can read your life context even if LCC no longer exists.
            </p>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden">
          <div className="grid grid-cols-3 bg-gray-50 dark:bg-gray-900 p-6 border-b border-gray-200 dark:border-gray-800 font-bold text-sm uppercase tracking-wide text-gray-500">
            <div>Feature</div>
            <div className="text-center">Typical Cloud App</div>
            <div className="text-center text-purple-600 dark:text-purple-400">LifeContext</div>
          </div>
          
          {[
            { feature: 'Can employees read your notes?', bad: 'Often yes', good: 'Impossible' },
            { feature: 'Works offline?', bad: 'Limited', good: 'Full Functionality' },
            { feature: 'AI Training', bad: 'Uses your data', good: 'No training on user data' },
            { feature: 'If company shuts down', bad: 'Data lost', good: 'App keeps working' },
            { feature: 'Export options', bad: 'Difficult / Proprietary', good: 'JSON / Markdown' },
          ].map((row, i) => (
            <div key={i} className="grid grid-cols-3 p-6 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
              <div className="font-medium text-gray-900 dark:text-white">{row.feature}</div>
              <div className="text-center text-gray-500">{row.bad}</div>
              <div className="text-center font-bold text-green-600 dark:text-green-400 flex justify-center items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {row.good}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
