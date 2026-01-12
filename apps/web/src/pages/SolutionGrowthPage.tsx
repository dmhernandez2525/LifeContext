import { useNavigate } from 'react-router-dom';
import { Target, TrendingUp, Brain, Sparkles } from 'lucide-react';

export default function SolutionGrowthPage() {
  const navigate = useNavigate();

  return (
    <div className="pt-32 pb-24 bg-white dark:bg-gray-950 min-h-screen transition-colors duration-300">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-6 mb-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-4 py-1.5 rounded-full font-medium text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            <span>For Personal Growth</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8">
            Your Personal Context
            <br />
            <span className="text-purple-600 dark:text-purple-400">Engine.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto mb-10">
            You are not looking for advice. You are looking for clarity. LCC organizes your own data so you can see the patterns yourself.
          </p>
          <button 
            onClick={() => navigate('/register')}
            className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform"
          >
            Start Growing
          </button>
        </div>
      </div>

       {/* Feature Section */}
       <div className="max-w-7xl mx-auto px-6 mb-32">
        <div className="grid md:grid-cols-3 gap-8">
           {[
            {
              icon: Brain,
              title: 'Pattern Recognition',
              desc: 'Discover hidden cycles in your mood, energy, and motivation that you might miss in the moment.'
            },
            {
              icon: Target,
              title: 'Goal Alignment',
              desc: 'Ensure your daily actions align with your stated values. The AI gently nudges you when you drift.'
            },
            {
              icon: TrendingUp,
              title: 'Progress Tracking',
              desc: 'Look back at "You" from 5 years ago. LCC provides a clear view of your emotional and intellectual evolution.'
            }
          ].map((item, i) => (
            <div key={i} className="bg-purple-50 dark:bg-purple-900/10 p-8 rounded-3xl border border-purple-100 dark:border-purple-500/10">
              <item.icon className="w-10 h-10 text-purple-600 dark:text-purple-400 mb-6" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
