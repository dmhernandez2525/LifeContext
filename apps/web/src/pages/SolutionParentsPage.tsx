import { useNavigate } from 'react-router-dom';
import { Baby, Camera, Heart, Shield } from 'lucide-react';

export default function SolutionParentsPage() {
  const navigate = useNavigate();

  return (
    <div className="pt-32 pb-24 bg-white dark:bg-gray-950 min-h-screen transition-colors duration-300">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-6 mb-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-4 py-1.5 rounded-full font-medium text-sm mb-6">
            <Baby className="w-4 h-4" />
            <span>For Parents & Families</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8">
            Tell Them Who You
            <br />
            <span className="text-blue-600 dark:text-blue-400">Really Were.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto mb-10">
            Your kids know you as "Parent". Give them the gift of knowing you as a person. Document your stories, lessons, and voice for them to have forever.
          </p>
          <button 
            onClick={() => navigate('/register')}
            className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform"
          >
            Start Your Archive
          </button>
        </div>
      </div>

      {/* Benefits */}
      <div className="max-w-7xl mx-auto px-6 mb-32">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Camera,
              title: 'Beyond Photos',
              desc: 'Photos show what you did. LCC captures how you felt, what you feared, and what you learned.'
            },
            {
              icon: Heart,
              title: 'Emotional Context',
              desc: 'Explain the "why" behind family decisions. Help them understand their lineage.'
            },
            {
              icon: Shield,
              title: 'Private & Secure',
              desc: 'Share only when you are ready. Or set up a "Legacy key" for after you are gone.'
            },
            {
              icon: Baby,
              title: 'Milestone Tracking',
              desc: 'Record your thoughts on their birthdays, graduations, and quiet moments in between.'
            }
          ].map((item, i) => (
            <div key={i} className="bg-gray-50 dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800">
              <item.icon className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-6" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
