/**
 * HelpPage - Documentation and help center
 * Embeds the voice-docs app or provides help resources
 */
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Book, 
  MessageCircleQuestion, 
  Video, 
  Shield, 
  Database,
  Mic,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

const HELP_SECTIONS = [
  {
    title: 'Getting Started',
    icon: Book,
    gradient: 'from-blue-500 to-cyan-500',
    items: [
      { label: 'Complete Onboarding', link: '/onboarding' },
      { label: 'Record Your First Entry', link: '/app/journal' },
      { label: 'Answer Life Questions', link: '/app/questions' },
    ]
  },
  {
    title: 'Voice Recording',
    icon: Mic,
    gradient: 'from-red-500 to-pink-500',
    items: [
      { label: 'How to Use Voice Mode', link: '#voice' },
      { label: 'Transcription Settings', link: '/app/settings' },
      { label: 'Brain Dump Tutorial', link: '/app/brain-dump' },
    ]
  },
  {
    title: 'Security & Privacy',
    icon: Shield,
    gradient: 'from-green-500 to-emerald-500',
    items: [
      { label: 'Zero-Knowledge Architecture', link: '/data-ownership' },
      { label: 'Emergency Access Setup', link: '/security/emergency' },
      { label: 'Storage Settings', link: '/settings/storage' },
    ]
  },
  {
    title: 'Data Reclamation',
    icon: Database,
    gradient: 'from-purple-500 to-pink-500',
    items: [
      { label: 'Browser Data Export', link: '/data-reclamation' },
      { label: 'GDPR Request Templates', link: '/data-reclamation/gdpr' },
      { label: 'Understanding Your Data', link: '/features/data-reclamation' },
    ]
  },
];

const FAQ = [
  {
    q: 'What happens if I lose my passcode?',
    a: 'Your data is encrypted with a key derived from your passcode. If you lose it, your data is GONE FOREVER. This is the price of true privacy - we cannot help you recover it.'
  },
  {
    q: 'Can you see my journal entries?',
    a: 'No. All your data is encrypted on YOUR device before storage. We never see your passcode, your encryption key, or your data. Zero-knowledge architecture means even if we wanted to, we couldn\'t.'
  },
  {
    q: 'How do GDPR requests work?',
    a: 'We provide pre-written templates for major platforms (Google, Meta, Amazon, etc.). You copy, customize with your info, and send. The data they return stays on YOUR device, encrypted.'
  },
  {
    q: 'Is this really free?',
    a: 'Basic features are free. Premium features (unlimited AI insights, calendar sync, priority support) are part of paid tiers. Data Reclamation is FREE during beta.'
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <MessageCircleQuestion className="w-4 h-4" />
            Help Center
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How Can We Help?
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find answers, tutorials, and resources to get the most out of LifeContext.
          </p>
        </motion.div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {HELP_SECTIONS.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.gradient} flex items-center justify-center mb-4`}>
                <section.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.items.map(item => (
                  <li key={item.label}>
                    <Link 
                      to={item.link} 
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-1"
                    >
                      <ChevronRight className="w-3 h-3" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            {FAQ.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
              >
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {item.q}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {item.a}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Video Tutorials Placeholder */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center">
          <Video className="w-12 h-12 text-white mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Video Tutorials Coming Soon
          </h2>
          <p className="text-purple-100 max-w-md mx-auto mb-6">
            Step-by-step video guides for every feature. Subscribe to get notified.
          </p>
          <button className="bg-white text-purple-600 px-6 py-3 rounded-xl font-medium hover:scale-105 transition-transform">
            Notify Me
          </button>
        </div>

        {/* Contact */}
        <div className="mt-16 text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Still need help?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We're here for you. Reach out via our contact page.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 font-medium hover:underline"
          >
            Contact Support
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
