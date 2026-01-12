/**
 * PhilosophyPage - Why LifeContext avoids emotional attachment by design
 */
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HeartOff, 
  Database, 
  TrendingUp,
  Users,
  DollarSign,
  Eye,
  Lock,
  Zap
} from 'lucide-react';

export default function PhilosophyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <HeartOff className="w-4 h-4" />
            A Different Approach
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Why We <span className="text-red-500 line-through">Don't</span> Want You to Love Us
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Most apps want you emotionally attached. We intentionally don't. Here's why that matters.
          </motion.p>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-16 bg-white dark:bg-gray-800/50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            How the Attention Economy Works
          </h2>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
              The business model of most tech companies follows a simple pattern:
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">1. Capture Attention</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Design addictive features that keep you scrolling, clicking, engaging.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                  <Database className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">2. Harvest Data</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Every click, scroll, and pause is tracked to build a profile of you.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">3. Sell Access</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Advertisers pay to target you with messages designed to influence behavior.
                </p>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              <strong className="text-gray-900 dark:text-white">Emotional attachment is essential to this model.</strong> If you feel 
              connected to an app — if it feels like a friend, a companion, a therapist — you'll keep coming back. 
              You'll share more. You'll be more valuable to advertisers.
            </p>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            LifeContext is Different by Design
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                  <HeartOff className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                    We're a Tool, Not a Friend
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    LifeContext is a diary with superpowers — not a companion you bond with. We ask questions 
                    and surface insights, but we're not trying to be your therapist, your coach, or your emotional support app.
                    We're a <strong>tool for understanding yourself</strong>.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                  <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                    Your Data is FOR You, Not Us
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We use zero-knowledge encryption. We literally cannot read your data. We don't run ads. 
                    We can't sell your information because we don't have it. Your insights are <strong>yours alone</strong>.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                    Insights, Not Engagement
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We optimize for you understanding yourself better — not for you spending more time in the app. 
                    If you journal once a week and get value, that's success. We're not gamifying your personal growth 
                    with streaks and notifications.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                    Take Your Data and Leave
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Export everything, anytime, in open formats. Cancel and your data goes with you. 
                    We don't hold your memories hostage. <strong>Data portability is a feature, not a threat.</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Level the Playing Field */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Leveling the Playing Field
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Corporations have had teams of analysts understanding human behavior for decades. 
            We think individuals deserve the same power to understand themselves.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="text-left">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                What They Know About You
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• Your browsing patterns</li>
                <li>• Your purchase history</li>
                <li>• Your relationships</li>
                <li>• Your emotional triggers</li>
                <li>• Your vulnerabilities</li>
              </ul>
            </div>
            
            <div className="text-left">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-600" />
                What You Should Know
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• Your recurring patterns</li>
                <li>• Your growth over time</li>
                <li>• Your blind spots</li>
                <li>• Your values vs. actions</li>
                <li>• Your legacy story</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-10">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform"
            >
              Start Understanding Yourself
            </Link>
          </div>
        </div>
      </section>

      {/* Final Note */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <blockquote className="text-2xl font-medium text-gray-700 dark:text-gray-300 italic mb-4">
            "We don't want you to love LifeContext. We want you to love yourself more clearly."
          </blockquote>
          <p className="text-gray-500 dark:text-gray-400">— The LifeContext Team</p>
        </div>
      </section>
    </div>
  );
}
