import { useNavigate } from 'react-router-dom';
import { 
  Mic, 
  Lock, 
  Share2, 
  Brain, 
  Users, 
  Database,
  ArrowRight
} from 'lucide-react';

const FEATURES = [
  {
    id: 'journaling',
    title: 'Secure Journaling',
    description: 'Capture your thoughts via voice, video, or text. Our AI transcribes and organizes everything locally.',
    icon: Mic,
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-100 dark:bg-purple-900/20',
    link: '/features/journaling'
  },
  {
    id: 'legacy',
    title: 'Legacy Building',
    description: 'Structure your life story for future generations. Answer deep questions about your values and history.',
    icon: Database,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-900/20',
    link: '/features/legacy'
  },
  {
    id: 'relationships',
    title: 'Relationship Tech',
    description: 'Understand your connection patterns. Map out your social context and deepen your bonds.',
    icon: Users,
    color: 'text-pink-600 dark:text-pink-400',
    bg: 'bg-pink-100 dark:bg-pink-900/20',
    link: '/features/relationships'
  },
  {
    id: 'privacy',
    title: 'Zero-Knowledge Privacy',
    description: 'Your data is encrypted with your key. We cannot see it, sell it, or train AI on it.',
    icon: Lock,
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-100 dark:bg-green-900/20',
    link: '/data-ownership'
  },
  {
    id: 'insights',
    title: 'AI Insights',
    description: 'Discover hidden patterns in your mood, energy, and values over time.',
    icon: Brain,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    link: '/features/journaling' // Linking to journaling as insights is part of it for now
  },
  {
    id: 'sharing',
    title: 'Granular Sharing',
    description: 'Share specific parts of your context with specific people. Total control over who sees what.',
    icon: Share2,
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-100 dark:bg-indigo-900/20',
    link: '/solutions/partners'
  }
];

export default function FeaturesPage() {
  const navigate = useNavigate();

  return (
    <div className="pt-32 pb-24 px-6 bg-white dark:bg-gray-950 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            The Operating System for
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
              Your Life Context
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
            A comprehensive suite of tools designed to help you capture, understand, and leverage your personal data without compromising privacy.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature) => (
            <div 
              key={feature.id}
              onClick={() => navigate(feature.link)}
              className="group bg-gray-50 dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-500/30 transition-all cursor-pointer hover:-translate-y-1 shadow-sm hover:shadow-xl hover:shadow-purple-900/5 dark:hover:shadow-none"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${feature.bg}`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed min-h-[4.5rem]">
                {feature.description}
              </p>
              
              <div className="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-24 text-center">
          <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-3xl p-12 max-w-4xl mx-auto shadow-2xl shadow-purple-900/20">
            <h2 className="text-3xl font-bold mb-6">Ready to take control of your context?</h2>
            <button 
              onClick={() => navigate('/register')}
              className="bg-purple-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-purple-500 hover:scale-105 transition-all shadow-lg shadow-purple-600/30"
            >
              Start Free Trial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
