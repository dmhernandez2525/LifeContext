import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mic, 
  Shield, 
  Brain, 
  ChevronRight,
  Lock,
  Sparkles,
  Users,
  Share2,
  Check
} from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import VideoShowcase from '@/components/marketing/VideoShowcase';

const useCases = [
  {
    title: 'Your Digital Essence',
    subtitle: 'The Personal Jarvis',
    description: 'More than a journal, LCC is a living extension of your consciousness. An AI coach that understands your philosophies, dreams, and values to provide truly personalized guidance.',
    bullets: [
      'Proactive Personal Coaching',
      'Integration with your inner world',
      'A digital clone that grows with you'
    ]
  },
  {
    title: 'Across Generations',
    subtitle: 'Legacy & Lineage',
    description: 'Pass down more than just photos. Give your children the context of your strengths, weaknesses, and the stories that shaped you. Help them understand family mental health patterns through generations.',
    bullets: [
      'Preserve your "Voice"',
      'Generational wisdom transfer',
      'Deep context for heirs'
    ]
  },
  {
    title: 'Deepen Connection',
    subtitle: 'Relationships & Partners',
    description: 'Find alignment where it matters most. Safely compare life contexts with partners to identify shared passions or understand how past traumas influence your current dynamics.',
    bullets: [
      'Trauma-informed alignment',
      'Shared growth mapping',
      'Conflict pattern recognition'
    ]
  },
  {
    title: 'Granular Sharing',
    subtitle: 'Trust Levels',
    description: 'You decide who sees what. Define security levels for different groups—from high-level intros for a new manager to intimate details for a spouse.',
    bullets: [
      'Profile-based permissioning',
      'Professional vs Private views',
      'Revocable access control'
    ]
  }
];

const steps = [
  {
    icon: Mic,
    title: 'Speak Naturally',
    description: 'Brain dump your thoughts, memories, and philosophies through voice recording.'
  },
  {
    icon: Brain,
    title: 'AI Synthesis',
    description: 'LCC organizes the chaos, identifies patterns, and builds your persistent context.'
  },
  {
    icon: Shield,
    title: 'Local Encryption',
    description: 'Everything is hashed with your passcode and stored only on your device or trusted cloud.'
  }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { isInitialized } = useAppStore();

  const handleGetStarted = () => {
    if (isInitialized) {
      navigate('/app');
    } else {
      navigate('/register');
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white dark:bg-gray-950 transition-colors duration-300">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-100/40 via-blue-50/40 to-white dark:from-purple-900/20 dark:via-gray-950 dark:to-gray-950" />
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/80 to-white dark:from-gray-950/20 dark:via-gray-950/60 dark:to-gray-950" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 bg-purple-100 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-full px-4 py-1.5 mb-8">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Your Life, Compiled & Secured
              </span>
            </div>

            <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8 text-gray-900 dark:text-white">
              The Digital Messenger of
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-500 dark:to-blue-500">
                Your Personal Essence
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
              Build a comprehensive understanding of yourself. A private, voice-first journal that organizes your 
              life context to empower your legacy, your relationships, and your future.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleGetStarted}
                className="group relative inline-flex items-center space-x-2 bg-gray-900 dark:bg-white text-white dark:text-black px-10 py-5 rounded-2xl font-bold text-xl transition-all hover:scale-105 active:scale-95 overflow-hidden shadow-xl shadow-purple-900/10 dark:shadow-purple-500/10"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity" />
                <span>{isInitialized ? 'Continue Your Journey' : 'Begin Your Compilation'}</span>
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <a href="#how-it-works" className="px-8 py-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-lg font-medium">
                How it works
              </a>
            </div>
          </motion.div>

          {/* Video Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-20 max-w-5xl mx-auto"
          >
            <VideoShowcase />
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-500 font-mono">
              * Actual interaction. All processing happens locally on your device.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Social Proof / Stats Section */}
      <section className="py-12 border-y border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Privacy Focus', value: '100%', sub: 'Local & Encrypted' },
              { label: 'Data Ownership', value: 'Zero', sub: 'Vendor Lock-in' },
              { label: 'AI Processing', value: 'On-Device', sub: 'Compatible' },
              { label: 'Legacy Time', value: 'Forever', sub: 'Future-Proof Format' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">{stat.sub}</div>
                <div className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Levels / Sharing Section */}
      <section className="py-32 bg-white dark:bg-gray-950 relative overflow-hidden transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-8 text-gray-900 dark:text-white">
                Share what matters.<br />
                <span className="text-gray-400 dark:text-gray-600">Keep what's yours.</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
                Life isn't black and white. LCC allows you to segment your life context into dynamic 
                <strong className="text-purple-600 dark:text-purple-400"> Trust Levels</strong>. Automatically generate a professional summary for 
                a new manager, share deep philosophies with an AI coach, or keep your most 
                private worries encrypted for only you to see.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Granular Trust Levels</h4>
                    <p className="text-gray-500 dark:text-gray-500">Different contexts for partners, family, or work.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Share2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Jarvis Assistant</h4>
                    <p className="text-gray-500 dark:text-gray-500">Your data becomes a personalized engine for calendars and goals.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-purple-500/10 dark:bg-purple-500/20 blur-[120px] rounded-full" />
              <div className="relative z-10 w-full max-w-sm aspect-square bg-gradient-to-tr from-gray-900 to-gray-800 rounded-3xl border border-white/10 shadow-2xl flex items-center justify-center p-8">
                <div className="grid grid-cols-2 gap-4 w-full">
                   <div className="bg-gray-800/50 rounded-xl p-4 border border-white/5">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mb-2">
                        <Users className="w-4 h-4 text-green-400" />
                      </div>
                      <div className="h-2 w-16 bg-white/10 rounded mb-1" />
                      <div className="h-2 w-10 bg-white/5 rounded" />
                   </div>
                   <div className="bg-gray-800/50 rounded-xl p-4 border border-white/5">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mb-2">
                        <Lock className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="h-2 w-16 bg-white/10 rounded mb-1" />
                      <div className="h-2 w-8 bg-white/5 rounded" />
                   </div>
                   <div className="col-span-2 bg-gray-800/50 rounded-xl p-4 border border-white/5 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                        <Brain className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <div className="h-2 w-24 bg-white/10 rounded mb-2" />
                        <div className="h-2 w-full bg-white/5 rounded" />
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Use Cases */}
      <section className="py-32 bg-gray-50 dark:bg-gray-900/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white">Designed for Every Depth</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400">From daily productivity to generational legacy.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {useCases.map((useCase, idx) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-white dark:bg-gray-950/50 border border-gray-200 dark:border-white/5 rounded-3xl p-8 hover:border-purple-300 dark:hover:border-white/10 transition-all shadow-xl shadow-gray-200/50 dark:shadow-none"
              >
                <div className="aspect-video mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center relative group-hover:scale-105 transition-transform duration-500">
                  <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
                  {/* Dynamic Icon Composition based on index/title */}
                  {idx === 0 && <Brain className="w-24 h-24 text-purple-500/80 drop-shadow-2xl" />}
                  {idx === 1 && <Users className="w-24 h-24 text-blue-500/80 drop-shadow-2xl" />}
                  {idx === 2 && <Share2 className="w-24 h-24 text-pink-500/80 drop-shadow-2xl" />}
                  {idx === 3 && <Shield className="w-24 h-24 text-green-500/80 drop-shadow-2xl" />}
                </div>
                <span className="text-purple-600 dark:text-purple-400 font-mono text-sm tracking-widest uppercase mb-2 block">{useCase.subtitle}</span>
                <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{useCase.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed text-lg">{useCase.description}</p>
                <ul className="space-y-3">
                  {useCase.bullets.map(bullet => (
                    <li key={bullet} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 max-w-7xl mx-auto px-6 bg-white dark:bg-gray-950 transition-colors duration-300">
        <div className="grid lg:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div key={step.title} className="relative p-8 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5">
              <div className="text-6xl font-bold text-gray-200 dark:text-white/5 absolute top-4 right-4">{idx + 1}</div>
              <step.icon className="w-12 h-12 text-purple-600 dark:text-purple-500 mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy Deep Dive */}
      <section className="py-32 bg-gray-900 dark:bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="w-20 h-20 bg-purple-500/10 rounded-3xl flex items-center justify-center mx-auto mb-10 border border-purple-500/20">
            <Lock className="w-10 h-10 text-purple-400" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-8">Zero Knowledge. Absolute Privacy.</h2>
          <p className="text-xl text-gray-400 mb-12 leading-relaxed">
            Your data is encrypted using your passcode as the salt and key. We never store your 
            information on our servers. Even the AI fragments it processes are handled with 
            strict privacy policies, ensuring your life context remains yours alone.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-gray-800/50 border border-white/10">
              <div className="font-bold text-lg mb-1 flex justify-center"><Shield className="w-5 h-5 mb-1 text-green-400" /></div>
              <div className="font-bold">Local-First</div>
            </div>
            <div className="p-4 rounded-xl bg-gray-800/50 border border-white/10">
              <div className="font-bold text-lg mb-1 flex justify-center"><Lock className="w-5 h-5 mb-1 text-blue-400" /></div>
              <div className="font-bold">End-to-End</div>
            </div>
            <div className="p-4 rounded-xl bg-gray-800/50 border border-white/10">
              <div className="font-bold text-lg mb-1 flex justify-center"><Brain className="w-5 h-5 mb-1 text-pink-400" /></div>
              <div className="font-bold">Non-Trainable</div>
            </div>
            <div className="p-4 rounded-xl bg-gray-800/50 border border-white/10">
              <div className="font-bold text-lg mb-1 flex justify-center"><Check className="w-5 h-5 mb-1 text-purple-400" /></div>
              <div className="font-bold">Immutable</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Gallery */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Built for Real Life
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              A comprehensive dashboard for your entire life journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { src: '/demos/dashboard.png', title: 'Intelligent Dashboard', desc: 'Track progress, see suggested actions, explore life areas' },
              { src: '/demos/kanban.png', title: 'Life Planning Board', desc: 'Kanban-style goal tracking with drag-and-drop' },
              { src: '/demos/journal.png', title: 'Daily Journal', desc: 'Voice-first entries with AI synthesis' },
              { src: '/demos/insights.png', title: 'AI Insights', desc: 'Pattern recognition and personalized recommendations' },
            ].map((demo) => (
              <motion.div
                key={demo.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow"
              >
                <img 
                  src={demo.src} 
                  alt={demo.title}
                  className="w-full aspect-video object-cover object-top"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6">
                  <h3 className="text-xl font-bold text-white mb-1">{demo.title}</h3>
                  <p className="text-gray-300 text-sm">{demo.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / Final CTA */}
      <section className="py-24 bg-white dark:bg-gray-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Ready to compile your life?</h2>
          <button
            onClick={handleGetStarted}
            className="bg-purple-600 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:bg-purple-700 hover:scale-105 transition-all shadow-xl shadow-purple-600/30"
          >
            Get Started Now
          </button>
        </div>
      </section>
    </>
  );
}
