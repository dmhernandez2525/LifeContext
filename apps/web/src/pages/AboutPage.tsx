import { motion } from 'framer-motion';
import { Brain, Heart, Shield, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="pt-20 sm:pt-24 pb-12 sm:pb-16">
      {/* Hero */}
      <section className="relative px-4 sm:px-6 py-10 sm:py-16 md:py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-5xl md:text-7xl font-bold mb-6 sm:mb-8"
          >
            We are building the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
              operating system for your soul.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed"
          >
            Life Context Compiler isn't just another productivity tool. It's a fundamental rethink of how we
            interact with our own consciousness, our loved ones, and our legacy.
          </motion.p>
        </div>
      </section>

      {/* Mission Grid */}
      <section className="px-4 sm:px-6 py-10 sm:py-16 md:py-20 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <div className="space-y-6 sm:space-y-8">
            <h2 className="text-2xl sm:text-3xl font-bold">Our Philosophy</h2>
            <div className="space-y-5 sm:space-y-6">
              <div className="flex gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Cognitive Extension</h3>
                  <p className="text-sm sm:text-base text-gray-400">
                    We believe technology should expand your mind, not distract it. LCC serves as a second brain
                    that deeply understands your context, values, and history.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-500/10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Radical Intimacy</h3>
                  <p className="text-sm sm:text-base text-gray-400">
                    True connection requires vulnerability and context. We build tools that help you understand
                    yourself so you can be better understood by others.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Sovereign Data</h3>
                  <p className="text-sm sm:text-base text-gray-400">
                    Your inner world belongs to you. We use zero-knowledge encryption to ensure that not even we
                    can access your compiled life context.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-4 md:mt-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 blur-3xl rounded-full" />
            <div className="relative bg-gray-900 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 h-full">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">The Team</h3>
              <p className="text-sm sm:text-base text-gray-400 mb-6 sm:mb-8">
                We are a small, dedicated team of developers, designers, and philosophers united by a single mission:
                to help humans flourish in the age of AI.
              </p>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-white/5 rounded-xl text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-800 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
                  </div>
                  <div className="font-bold text-sm sm:text-base">Daniel</div>
                  <div className="text-xs sm:text-sm text-gray-500">Founder</div>
                </div>
                <div className="p-3 sm:p-4 bg-white/5 rounded-xl text-center flex items-center justify-center">
                  <span className="text-gray-500 italic text-sm sm:text-base">Join us?</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
