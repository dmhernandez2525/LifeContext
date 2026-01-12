import { Check, X, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PricingPage() {
  const navigate = useNavigate();

  return (
    <div className="pt-32 pb-24 px-6 bg-white dark:bg-gray-950 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
            Your data belongs to you. We charge for the convenience of synchronization and advanced AI features, not by selling your information.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-24">
          {/* Free Tier */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 relative">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Local Explorer</h3>
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Free</div>
            <p className="text-gray-600 dark:text-gray-400 mb-8 h-12">
              Perfect for getting started and compiling your personal context on a single device.
            </p>
            
            <button 
              onClick={() => navigate('/register')}
              className="w-full py-4 rounded-xl font-bold text-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mb-8"
            >
              Get Started
            </button>

            <ul className="space-y-4">
              {[
                'Unlimited local recordings',
                'Basic AI transcription (on-device)',
                'Manual data export',
                'Local-only encryption',
                '1 User Profile'
              ].map(feature => (
                <li key={feature} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                  <Check className="w-5 h-5 text-green-500 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
              <li className="flex items-start gap-3 text-gray-400 dark:text-gray-600">
                <X className="w-5 h-5 text-gray-400 dark:text-gray-600 shrink-0" />
                <span>Cloud Synchronization</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400 dark:text-gray-600">
                <X className="w-5 h-5 text-gray-400 dark:text-gray-600 shrink-0" />
                <span>Advanced Relationship Mapping</span>
              </li>
            </ul>
          </div>

          {/* Pro Tier */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border-2 border-purple-600 relative shadow-2xl shadow-purple-900/20">
            <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl uppercase tracking-wide">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Life Architect</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">$9.99</span>
              <span className="text-gray-500 dark:text-gray-400">/month</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-8 h-12">
              For those serious about legacy building, cross-device access, and deep relationship intelligence.
            </p>
            
            <button 
              onClick={() => navigate('/register')}
              className="w-full py-4 rounded-xl font-bold text-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors mb-8 shadow-lg shadow-purple-600/30"
            >
              Start 14-Day Free Trial
            </button>

            <ul className="space-y-4">
              {[
                'Everything in Local Explorer',
                'End-to-End Encrypted Cloud Sync',
                'Use on Unlimited Devices',
                'Advanced AI Insights (Model 4)',
                'Relationship Context Mapping',
                'Legacy Export Formatting',
                'Priority Support'
              ].map(feature => (
                <li key={feature} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                  <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-0.5">
                    <Check className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                  </div>
                  <span className="font-medium">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-8">
            {[
              {
                q: "Do you own my data?",
                a: "No. Never. Your data is encrypted on your device before it ever touches our sync servers. We literally cannot read it even if forced."
              },
              {
                q: "Can I export my data later?",
                a: "Yes. You can export your entire life context as a JSON or Markdown archive at any time. We believe in zero vendor lock-in."
              },
              {
                q: "How does the AI work if it's private?",
                a: "The AI processing happens in an isolated environment. The data is decrypted in memory for processing and immediately scrubbed. No data is used to train our models."
              }
            ].map((faq, i) => (
              <div key={i} className="border-b border-gray-200 dark:border-gray-800 pb-8">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  {faq.q}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed pl-7">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
