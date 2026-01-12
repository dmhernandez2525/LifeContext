import { useNavigate } from 'react-router-dom';
import { Mic, Video, Brain, Lock, CloudOff } from 'lucide-react';

export default function SecureJournalingPage() {
  const navigate = useNavigate();

  return (
    <div className="pt-32 pb-24 bg-white dark:bg-gray-950 min-h-screen transition-colors duration-300">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-6 mb-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-4 py-1.5 rounded-full font-medium text-sm mb-6">
            <Lock className="w-4 h-4" />
            <span>End-to-End Encrypted</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8">
            The Journal That
            <br />
            <span className="text-purple-600 dark:text-purple-400">Can't Be Read.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto mb-10">
            Most journaling apps are basically blogs you hope nobody finds. LifeContext is a digital vault. Voice, video, and text—encrypted before it ever leaves your device.
          </p>
          <button 
            onClick={() => navigate('/register')}
            className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform"
          >
            Start Encrypted Journaling
          </button>
        </div>
      </div>

      {/* Feature Showcase */}
      <div className="max-w-7xl mx-auto px-6 mb-32">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Mic,
              title: 'Voice-First Capture',
              desc: 'Speak freely. Our Whisper integration transcribes your thoughts locally or via secure API, turning rambles into structured text.'
            },
            {
              icon: Video,
              title: 'Video Memories',
              desc: 'Sometimes words aren\'t enough. Capture your energy and expressions with video entries that preserve the real you.'
            },
            {
              icon: Brain,
              title: 'Mood & Energy Tracking',
              desc: 'Tag entries with mood and energy levels. Watch as the AI builds a map of what drains and sustains you over time.'
            }
          ].map((item, i) => (
            <div key={i} className="bg-gray-50 dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800">
              <item.icon className="w-10 h-10 text-purple-600 dark:text-purple-400 mb-6" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Security Deep Dive */}
      <div className="bg-gray-900 dark:bg-black text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-purple-900/10" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Why "Private" Usually Isn't</h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Most "secure" notes apps manage the encryption keys for you. If they get subpoenaed or hacked, your diary is open.
              <br /><br />
              With **LifeContext Compiler**, your password generates the encryption key on your device. We store a blob of nonsense. Without your password, your journal is mathematically indistinguishable from random noise.
            </p>
            <div className="flex items-center gap-4 text-green-400 font-bold">
              <CloudOff className="w-6 h-6" />
              <span>Zero-Knowledge Architecture</span>
            </div>
          </div>
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
             <div className="font-mono text-sm text-gray-400 space-y-2">
               <p className="text-green-500">// What we see on our servers:</p>
               <p>Block_ID: 9f8a7d...</p>
               <p>Content: U2FsdGVkX1+...</p>
               <p>HMAC: 8a9b2c...</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
