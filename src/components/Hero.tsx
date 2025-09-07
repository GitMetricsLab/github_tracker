import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';

const Hero = () => {
  const [displayText, setDisplayText] = useState('');
  const [showSecondLine, setShowSecondLine] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fullText = 'Track GitHub Activity';

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      // Show second line after first line is complete
      const timer = setTimeout(() => {
        setShowSecondLine(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, fullText]);

  return (
    <>
      <style>{`
        @keyframes typewriter {
          from { width: 0; }
          to { width: 100%; }
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes slideInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        .typewriter-cursor {
          animation: blink 1s infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-slide-up {
          animation: slideInUp 0.8s ease-out forwards;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-gradient {
          background: linear-gradient(-45deg, #3b82f6, #8b5cf6, #06b6d4, #10b981);
          background-size: 400% 400%;
          animation: gradient 4s ease infinite;
        }
        
        .animate-shimmer {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>
      
      <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 px-6 py-16 overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-1/2 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-2 h-2 bg-blue-500 rounded-full opacity-60 animate-float"></div>
          <div className="absolute top-32 right-32 w-1 h-1 bg-purple-500 rounded-full opacity-40 animate-pulse"></div>
          <div className="absolute bottom-32 left-32 w-3 h-3 bg-indigo-500 rounded-full opacity-50 animate-bounce"></div>
          <div className="absolute bottom-20 right-20 w-1.5 h-1.5 bg-pink-500 rounded-full opacity-60 animate-float"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight min-h-[120px] md:min-h-[100px]">
              <div className="inline-block overflow-hidden">
                <span className="inline-block">
                  {displayText}
                  <span className="typewriter-cursor text-blue-600">|</span>
                </span>
              </div>
              <div className={`block mt-2 transition-all duration-1000 ease-out ${
                showSecondLine 
                  ? 'translate-y-0 opacity-100 scale-100' 
                  : 'translate-y-8 opacity-0 scale-95'
              }`}>
                <span className="text-blue-600 dark:text-blue-400 font-extrabold">
                  Like Never Before
                </span>
              </div>
            </h1>
            
            <div className={`transition-all duration-1000 delay-1000 ${
              showSecondLine ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up">
                Monitor and analyze GitHub user activity with powerful insights. Perfect for developers,
                project managers, and teams who want to understand contribution patterns and repository engagement.
              </p>
            </div>
            
            <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-1500 ${
              showSecondLine ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <button className="group relative bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-2xl dark:shadow-blue-900/50 flex items-center space-x-2 overflow-hidden">
                {/* Button background effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100"></div>
                
                {/* Button content */}
                <Search className="h-5 w-5 transform group-hover:rotate-12 transition-all duration-300 relative z-10" />
                <span className="relative z-10">Start Tracking</span>
                
                {/* Bottom border effect */}
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white dark:bg-blue-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                
                {/* Side glow effect */}
                <div className="absolute -inset-1 bg-blue-600 dark:bg-blue-500 rounded-lg blur opacity-30 group-hover:opacity-60 transition-opacity duration-300 -z-10"></div>
              </button>
              
              {/* Demo button (commented out in original, styled for completeness) */}
              <button className="group border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 flex items-center space-x-2 relative overflow-hidden opacity-50 cursor-not-allowed">
                <span>View Demo</span>
                <svg className="h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Additional decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 border border-blue-200 dark:border-blue-800 rounded-full opacity-20 animate-spin" style={{animationDuration: '20s'}}></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 border border-purple-200 dark:border-purple-800 rounded-full opacity-30 animate-pulse"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3e%3cpath d='m 60 0 l 0 60 l -60 0 z' fill='none' stroke='%23000000' stroke-width='1'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23grid)' /%3e%3c/svg%3e")`,
          }}></div>
        </div>
      </section>
    </>
  );
};

export default Hero;