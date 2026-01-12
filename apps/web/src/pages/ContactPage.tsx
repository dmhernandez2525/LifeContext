import { motion } from 'framer-motion';
import { Mail, MessageSquare, Twitter, Github } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6">Get in Touch</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Have questions about security, features, or the philosophy behind LCC? 
            We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-gray-900 border border-white/5 p-8 rounded-3xl">
              <h3 className="text-2xl font-bold mb-6">Connect Directly</h3>
              <div className="space-y-6">
                <a href="mailto:hello@lifecontext.ai" className="flex items-center gap-4 text-gray-400 hover:text-white transition-colors group">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                    <Mail className="w-6 h-6 group-hover:text-purple-400" />
                  </div>
                  <span className="text-lg">hello@lifecontext.ai</span>
                </a>
                
                <a href="#" className="flex items-center gap-4 text-gray-400 hover:text-white transition-colors group">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                    <Twitter className="w-6 h-6 group-hover:text-blue-400" />
                  </div>
                  <span className="text-lg">@LifeContextAI</span>
                </a>

                <a href="#" className="flex items-center gap-4 text-gray-400 hover:text-white transition-colors group">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                    <Github className="w-6 h-6 group-hover:text-white" />
                  </div>
                  <span className="text-lg">View on GitHub</span>
                </a>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-white/5 p-8 rounded-3xl">
              <div className="flex items-start gap-4">
                <MessageSquare className="w-8 h-8 text-purple-400 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Community Discord</h3>
                  <p className="text-gray-400 mb-4">
                    Join our community of early adopters discussing personal knowledge management, 
                    AI ethics, and digital longevity.
                  </p>
                  <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                    Join Server
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form className="bg-gray-900 border border-white/5 p-8 rounded-3xl space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
              <input 
                type="text" 
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Types your name context..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <input 
                type="email" 
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
              <textarea 
                rows={4}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Share your thoughts..."
              />
            </div>

            <button 
              type="button"
              className="w-full bg-white text-black font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
