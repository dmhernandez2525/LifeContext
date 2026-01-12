import { useNavigate } from 'react-router-dom';
import { Network, GitCompare, HeartHandshake, Zap } from 'lucide-react';

export default function RelationshipTechPage() {
  const navigate = useNavigate();

  return (
    <div className="pt-32 pb-24 bg-white dark:bg-gray-950 min-h-screen transition-colors duration-300">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-6 mb-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400 px-4 py-1.5 rounded-full font-medium text-sm mb-6">
            <HeartHandshake className="w-4 h-4" />
            <span>Connection Engine</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8">
            Empathy Through
            <br />
            <span className="text-pink-600 dark:text-pink-400">Deep Context.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto mb-10">
            Misunderstandings happen when contexts clash. LCC helps you map your emotional landscape and compare it with partners to find alignment.
          </p>
          <button 
            onClick={() => navigate('/register')}
            className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform"
          >
            Map Your Relationships
          </button>
        </div>
      </div>

      {/* Showcase */}
      <div className="max-w-7xl mx-auto px-6 mb-24">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="bg-pink-50 dark:bg-pink-900/10 p-8 rounded-3xl border border-pink-100 dark:border-pink-500/10">
            <Network className="w-10 h-10 text-pink-600 dark:text-pink-400 mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Social Graphing</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Visualize the key people in your life. Track how your interactions with them affect your mood and energy over time.
            </p>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/10 p-8 rounded-3xl border border-purple-100 dark:border-purple-500/10">
            <GitCompare className="w-10 h-10 text-purple-600 dark:text-purple-400 mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Value Alignment</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Securely compare your "Values & Beliefs" module with a partner without exposing the raw journal entries. See where you overlap.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/10 p-8 rounded-3xl border border-blue-100 dark:border-blue-500/10">
            <Zap className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Conflict Resolution</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Identify trigger patterns. "I tend to withdraw when stressed about money." LCC highlights these patterns to help partners understand.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
