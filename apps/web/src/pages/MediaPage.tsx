import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

export default function MediaPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-sm font-medium text-red-300">
              Live Demo
            </span>
          </div>
          
          <h1 className="text-5xl font-bold mb-6">See LCC in Action</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Watch how Life Context Compiler transforms raw voice notes into a structured, 
            searchable, and secure digital legacy.
          </p>
        </motion.div>

            {/* Video Placeholder */}
        <div className="max-w-4xl mx-auto mb-24">
          <div className="aspect-video bg-gray-900 rounded-3xl border border-white/10 flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent z-10" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-gray-900 to-gray-950 group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 opacity-[0.03]" 
                 style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            
            <button className="relative z-20 w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-all hover:bg-white text-white hover:text-black shadow-2xl">
              <Play className="w-8 h-8 ml-1" />
            </button>
            
            <div className="absolute bottom-8 left-8 z-20">
              <h3 className="text-2xl font-bold mb-1">Product Walkthrough</h3>
              <p className="text-gray-300">A comprehensive tour of the dashboard and voice processing.</p>
            </div>
          </div>
        </div>

        {/* Press Assets */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Brand Assets</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-900/50 border border-white/5 p-6 rounded-2xl hover:border-white/10 transition-colors cursor-pointer">
              <div className="h-32 bg-black/40 rounded-xl mb-4 flex items-center justify-center border border-white/5">
                <span className="font-bold text-2xl">LCC</span>
              </div>
              <h3 className="font-bold mb-1">Logo Kit</h3>
              <p className="text-sm text-gray-400">Vector and raster formats of our logo.</p>
            </div>

            <div className="bg-gray-900/50 border border-white/5 p-6 rounded-2xl hover:border-white/10 transition-colors cursor-pointer">
              <div className="h-32 bg-black/40 rounded-xl mb-4 flex items-center justify-center border border-white/5 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20" />
                <div className="grid grid-cols-2 gap-2 p-4 w-full opacity-50">
                  <div className="bg-white/10 rounded h-12" />
                  <div className="bg-white/10 rounded h-12" />
                  <div className="col-span-2 bg-white/10 rounded h-8" />
                </div>
              </div>
              <h3 className="font-bold mb-1">Product Screenshots</h3>
              <p className="text-sm text-gray-400">High-res interface shots for press use.</p>
            </div>

            <div className="bg-gray-900/50 border border-white/5 p-6 rounded-2xl hover:border-white/10 transition-colors cursor-pointer">
              <div className="h-32 bg-black/40 rounded-xl mb-4 flex items-center justify-center border border-white/5">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black font-bold text-xs">A</div>
              </div>
              <h3 className="font-bold mb-1">Brand Guidelines</h3>
              <p className="text-sm text-gray-400">Colors, typography, and voice.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
