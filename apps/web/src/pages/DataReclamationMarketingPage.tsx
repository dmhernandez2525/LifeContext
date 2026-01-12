/**
 * DataReclamationMarketingPage - Marketing page for Data Reclamation feature
 * Showcases browser data collection, GDPR automation, and data broker info
 */
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Database, 
  Download, 
  Shield, 
  Chrome,
  Mail,
  Users,
  AlertTriangle,
  ChevronRight,
  Check,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

const PLATFORMS = [
  { name: 'Google', icon: '🔍', status: 'available' },
  { name: 'Meta (Facebook)', icon: '📘', status: 'available' },
  { name: 'Amazon', icon: '📦', status: 'available' },
  { name: 'Apple', icon: '🍎', status: 'available' },
  { name: 'Microsoft', icon: '🪟', status: 'available' },
  { name: 'Netflix', icon: '🎬', status: 'available' },
  { name: 'Spotify', icon: '🎵', status: 'available' },
  { name: 'LinkedIn', icon: '💼', status: 'available' },
];

export default function DataReclamationMarketingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Free During Beta
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Your Data is <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Already Out There</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Google knows your searches. Meta knows your relationships. Data brokers sell your home address. 
              <strong className="text-white"> It's time to get it all back.</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/data-reclamation"
                className="bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2"
              >
                <Database className="w-5 h-5" />
                Start Reclaiming
              </Link>
              <Link
                to="/data-reclamation/gdpr"
                className="bg-purple-600/30 border border-purple-500/50 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-600/50 transition-colors flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                GDPR Requests
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Three Pillars of Data Reclamation
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              A comprehensive approach to understanding and controlling your digital footprint.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Browser Data */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6">
                <Chrome className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Browser Data Export
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Export 5+ years of browsing history, bookmarks, and cookies. See yourself as trackers see you.
              </p>
              <ul className="space-y-2">
                {['Chrome extension', 'History analytics', 'Cookie tracker map', 'Ad profile insights'].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Check className="w-4 h-4 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* GDPR Requests */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-6">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                GDPR Request Automation
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Pre-written templates for 8+ major platforms. Copy, customize, and send in minutes.
              </p>
              <ul className="space-y-2">
                {['Google, Meta, Amazon', 'Apple, Microsoft', 'Netflix, Spotify', 'LinkedIn & more'].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Check className="w-4 h-4 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Data Brokers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-full text-xs font-bold">
                Coming Soon
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Data Broker Removal
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Request removal from data brokers who sell your personal information to anyone who pays.
              </p>
              <ul className="space-y-2">
                {['Spokeo', 'PeopleFinders', 'Whitepages', 'BeenVerified'].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Data Broker Buyback Section (Advanced) */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-red-500/5 to-transparent"></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-2 rounded-full text-sm font-bold mb-6">
                <Shield className="w-4 h-4" />
                Advanced Protection
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Stop Them From Selling You
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Data brokers like Spokeo, Whitepages, and PeopleFinders trade your personal info for pennies. remove yourself from their databases automatically.
              </p>
              
              <div className="space-y-6">
                {[
                  { title: 'Scan 50+ Brokers', desc: 'We check every major data broker for your records.' },
                  { title: 'Auto-Removal Requests', desc: 'We send legal opt-out requests on your behalf.' },
                  { title: 'Continuous Monitoring', desc: 'We verify they actually delete it (and keep it deleted).' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                      <Check className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{item.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <button
                  onClick={() => alert("This feature is currently in closed beta. We've added you to the waitlist.")} 
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors flex items-center gap-2 shadow-lg shadow-red-600/20"
                >
                  Start Removal Scan
                  <ChevronRight className="w-5 h-5" />
                </button>
                <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                  * Requires Identity Verification level 2
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-700 shadow-2xl">
              <div className="flex items-center justify-between mb-8 border-b border-gray-100 dark:border-gray-800 pb-4">
                <h3 className="font-bold text-gray-900 dark:text-white">Live Broker Scan (Demo)</h3>
                <span className="animate-pulse flex items-center gap-2 text-xs font-mono text-green-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  SCANNING
                </span>
              </div>
              
              <div className="space-y-4 font-mono text-sm max-h-[400px] overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-gray-900 pointer-events-none"></div>
                
                {[
                  { broker: 'Spokeo', status: 'FOUND', records: 'Address, Age, Relatives', color: 'text-red-500' },
                  { broker: 'Whitepages', status: 'FOUND', records: 'Phone, Email', color: 'text-red-500' },
                  { broker: 'Intelius', status: 'SCANNING', records: '...', color: 'text-gray-400' },
                  { broker: 'PeopleFinders', status: 'QUEUED', records: '', color: 'text-gray-400' },
                  { broker: 'BeenVerified', status: 'QUEUED', records: '', color: 'text-gray-400' },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <span className="font-bold text-gray-700 dark:text-gray-300">{row.broker}</span>
                    <span className={cn("font-bold", row.color)}>{row.status}</span>
                  </div>
                ))}
                
                <div className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg mt-4">
                  <p className="text-red-800 dark:text-red-300 text-xs">
                    ⚠️ 2 Profiles found potentially exposing your home address.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chrome Extension CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Chrome className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Get the Chrome Extension
          </h2>
          <p className="text-blue-100 max-w-xl mx-auto mb-8">
            Export your complete browsing history with one click. See patterns, top sites, 
            and how your digital trails have evolved over years.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://chrome.google.com/webstore/category/extensions"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download for Chrome
            </a>
            <div className="text-blue-200 text-sm flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
              Firefox & Safari coming soon
            </div>
          </div>
        </div>
      </section>

      {/* Platforms Supported */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Supported Platforms
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Pre-written GDPR/CCPA request templates for major platforms.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PLATFORMS.map(platform => (
              <div key={platform.name} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 flex items-center gap-3">
                <span className="text-2xl">{platform.icon}</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{platform.name}</p>
                  <p className="text-xs text-green-600">Template Available</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/data-reclamation/gdpr"
              className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 font-medium hover:underline"
            >
              View all templates
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Privacy Promise */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Shield className="w-16 h-16 text-purple-600 dark:text-purple-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Your Reclaimed Data Stays Yours
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-8">
            Everything you collect is encrypted with your passcode and stored on YOUR device. 
            We never see it. We can't see it. That's the point.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {['Zero-Knowledge', 'Local-First', 'Encrypted', 'Exportable'].map(tag => (
              <span key={tag} className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to See What They Know?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-8">
            Start with browser data export, then request your files from the platforms that track you.
          </p>
          <Link
            to="/data-reclamation"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors"
          >
            Start Data Reclamation
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
