import { useNavigate } from 'react-router-dom';
import { Database, FileText, Download, Clock } from 'lucide-react';

export default function LegacyBuildingPage() {
  const navigate = useNavigate();

  return (
    <div className="pt-32 pb-24 bg-white dark:bg-gray-950 min-h-screen transition-colors duration-300">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-6 mb-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-4 py-1.5 rounded-full font-medium text-sm mb-6">
            <Clock className="w-4 h-4" />
            <span>Built for Decades</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8">
            The Gift You Leave
            <br />
            <span className="text-amber-600 dark:text-amber-400">Behind.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto mb-10">
            A photo captures a face. LifeContext captures the philosophy, the voice, and the wisdom behind it. Build a searchable archive of who you truly were.
          </p>
          <button 
            onClick={() => navigate('/register')}
            className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform"
          >
            Start Your Archive
          </button>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="max-w-7xl mx-auto px-6 mb-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-12">
            {[
              {
                title: 'Structured Wisdom',
                desc: 'Answer hundreds of curated questions about your childhood, career, mistakes, and love. We guide you through documenting your entire life geometry.',
                icon: Database
              },
              {
                title: 'Future-Proof Export',
                desc: 'Don\'t leave a password-locked app. Export your entire legacy to open standard Markdown, Audio, and Video files that will work on computers 50 years from now.',
                icon: Download
              },
              {
                title: 'Contextual Search',
                desc: 'Your great-grandchildren won\'t just browse files—they\'ll ask questions. "What was grandpa\'s advice on heartbreak?" and get an instant answer in your voice.',
                icon: FileText
              }
            ].map((feature, i) => (
              <div key={i} className="flex gap-6">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center shrink-0">
                  <feature.icon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500/10 blur-[100px] rounded-full" />
            <div className="relative bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-6 border-b border-gray-200 dark:border-gray-800 pb-6">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div>
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                  <div className="h-3 w-20 bg-gray-100 dark:bg-gray-800 rounded" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded" />
                <div className="h-4 w-5/6 bg-gray-100 dark:bg-gray-800 rounded" />
                <div className="h-24 w-full bg-gray-100 dark:bg-gray-800 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
