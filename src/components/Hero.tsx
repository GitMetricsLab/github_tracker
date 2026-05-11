import { Search, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative overflow-hidden px-6 py-24 md:py-32 bg-white dark:bg-dark transition-colors duration-300">
      {/* Background Glows */}
      <div className="bg-glow top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500 rounded-full animate-pulse-slow"></div>
      <div className="bg-glow bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-500 rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-sm font-medium mb-8"
          >
            <Sparkles className="h-4 w-4" />
            <span>Track Smarter. Build Better.</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-[1.1] tracking-tight"
          >
            Track GitHub Activity
            <span className="block text-gradient">Like Never Before</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Monitor and analyze GitHub user activity with powerful insights. Perfect for developers,
            project managers, and teams who want to understand contribution patterns.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Link
              to='/track'
              className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-full font-semibold transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center space-x-2"
            >
              <Search className="h-5 w-5" />
              <span>Start Tracking</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col items-center space-y-4"
          >
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <img
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-dark object-cover bg-gray-200"
                  src={`https://i.pravatar.cc/100?u=${i + 10}`}
                  alt={`User ${i}`}
                />
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-white dark:border-dark bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                +50
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Join <span className="text-gray-900 dark:text-white font-bold">500+ developers</span> already tracking
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
