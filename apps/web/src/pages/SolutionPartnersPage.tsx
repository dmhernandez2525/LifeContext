import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Zap, Users } from 'lucide-react';

export default function SolutionPartnersPage() {
  const navigate = useNavigate();

  return (
    <div className="pt-32 pb-24 bg-white dark:bg-gray-950 min-h-screen transition-colors duration-300">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-6 mb-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400 px-4 py-1.5 rounded-full font-medium text-sm mb-6">
            <Heart className="w-4 h-4" />
            <span>For Couples & Partners</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8">
            Understand Each Other's
            <br />
            <span className="text-pink-600 dark:text-pink-400">Context.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto mb-10">
            Love is easy. Understanding is hard. LCC helps you map your emotional triggers, values, and history so you can communicate with true empathy.
          </p>
          <button 
            onClick={() => navigate('/register')}
            className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform"
          >
             Map Your Relationship
          </button>
        </div>
      </div>

      {/* Feature Section */}
      <div className="max-w-7xl mx-auto px-6 mb-32">
        <div className="grid md:grid-cols-3 gap-8">
           {[
            {
              icon: MessageCircle,
              title: 'Conflict decoder',
              desc: 'Use AI to objectively analyze past conflicts (private to you) and find the underlying patterns.'
            },
            {
              icon: Users,
              title: 'Values Alignment',
              desc: 'Securely "intersect" your values curve with your partner to see where you align and where you differ.'
            },
            {
              icon: Zap,
              title: 'Trigger Mapping',
              desc: 'Share your "User Manual" with your partner so they know how to support you during stress.'
            }
          ].map((item, i) => (
            <div key={i} className="bg-pink-50 dark:bg-pink-900/10 p-8 rounded-3xl border border-pink-100 dark:border-pink-500/10">
              <item.icon className="w-10 h-10 text-pink-600 dark:text-pink-400 mb-6" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
