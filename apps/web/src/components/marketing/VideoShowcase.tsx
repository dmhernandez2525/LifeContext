import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Brain, Sparkles, Lock, Play } from 'lucide-react';

export default function VideoShowcase() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Simulated script for the demo
  const script = [
    { text: "I've been feeling really anxious about my career lately...", type: 'user' },
    { text: "Specifically that I'm drifting away from my core creative values.", type: 'user' },
    { text: "Processing context...", type: 'system' },
    { text: "I notice a pattern. You felt this way 4 years ago before your pivot.", type: 'ai' },
    { text: "Let's explore that connection.", type: 'ai' }
  ];

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % (script.length + 2)); // +2 for pause at end
    }, 2500);

    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <div className="relative w-full aspect-video bg-gray-950 rounded-3xl overflow-hidden border border-gray-800 shadow-2xl shadow-purple-900/20 group cursor-pointer" onClick={() => setIsPlaying(!isPlaying)}>
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black" />
      <div className="absolute inset-0 bg-[url('/marketing/grid.svg')] opacity-20" />
      
      {/* Abstract Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]" 
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -50, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" 
      />

      {/* Interface Container */}
      <div className="absolute inset-0 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-2xl">
          
          {/* Status Bar */}
          <div className="flex items-center justify-between mb-8 text-xs font-mono text-gray-500 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span>Recording...</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-3 h-3" />
              <span>AES-256 Encrypted</span>
            </div>
          </div>

          {/* Conversation Stream */}
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {script.slice(0, step).map((line, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  layout
                  className={`flex gap-4 ${line.type === 'ai' ? 'justify-start' : 'justify-end'}`}
                >
                  {line.type === 'ai' && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}
                  {line.type === 'system' && (
                    <div className="w-full flex justify-center py-2">
                      <div className="flex items-center gap-2 text-xs font-mono text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                        <Brain className="w-3 h-3 animate-pulse" />
                        <span>SYNTHESIZING CONTEXT...</span>
                      </div>
                    </div>
                  )}
                  {line.type !== 'system' && (
                    <div className={`max-w-[80%] p-4 rounded-2xl border backdrop-blur-sm ${
                      line.type === 'user' 
                        ? 'bg-white/5 border-white/10 text-gray-200 rounded-tr-sm' 
                        : 'bg-purple-900/20 border-purple-500/20 text-purple-100 rounded-tl-sm'
                    }`}>
                      <p className="leading-relaxed">{line.text}</p>
                    </div>
                  )}
                  {line.type === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                      <Mic className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {step < script.length && (
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: step === script.length || !isPlaying ? 0 : 1 }}
                 className="flex justify-center"
               >
                 <div className="flex gap-1">
                   {[1,2,3].map(i => (
                     <div key={i} className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s`}} />
                   ))}
                 </div>
               </motion.div>
            )}
          </div>

        </div>
      </div>

      {/* Play/Pause Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center border border-white/20 backdrop-blur-md"
          >
            <Play className="w-8 h-8 text-white ml-1" />
          </motion.div>
        </div>
      )}
    </div>
  );
}
