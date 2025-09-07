import { BarChart3, Users, Search, Zap, Shield, Globe } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: BarChart3,
      title: 'Activity Analytics',
      description: 'Comprehensive charts and graphs showing commit patterns, contribution streaks, and repository activity over time.',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      hoverColor: 'hover:bg-blue-50 dark:hover:bg-blue-900/50'
    },
    {
      icon: Users,
      title: 'Multi-User Tracking',
      description: 'Monitor multiple GitHub users simultaneously and compare their activity levels and contribution patterns.',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
      hoverColor: 'hover:bg-green-50 dark:hover:bg-green-900/50'
    },
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Quickly find and add users to your tracking list with intelligent search and auto-suggestions.',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
      hoverColor: 'hover:bg-purple-50 dark:hover:bg-purple-900/50'
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Get instant notifications and updates when tracked users make new contributions or repositories.',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      iconColor: 'text-orange-600 dark:text-orange-400',
      hoverColor: 'hover:bg-orange-50 dark:hover:bg-orange-900/50'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'All data is fetched from public GitHub APIs. We don\'t store personal information or require GitHub access.',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      iconColor: 'text-red-600 dark:text-red-400',
      hoverColor: 'hover:bg-red-50 dark:hover:bg-red-900/50'
    },
    {
      icon: Globe,
      title: 'Export & Share',
      description: 'Export activity reports and share insights with your team through various formats and integrations.',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      hoverColor: 'hover:bg-indigo-50 dark:hover:bg-indigo-900/50'
    }
  ];

  // Duplicate features array for seamless loop
  const duplicatedFeatures = [...features, ...features];

  return (
    <>
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .shimmer-effect {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          background-size: 200% 100%;
        }
        
        .dark .shimmer-effect {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
        }
        
        .group:hover .shimmer-effect {
          animation: shimmer 1.5s ease-in-out;
        }
      `}</style>

      <section id="features" className="px-6 py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 transition-colors duration-300 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Everything you need to track, analyze, and understand GitHub activity patterns with advanced insights and real-time monitoring
            </p>
          </div>

          {/* Marquee Container */}
          <div className="relative">
            {/* Marquee Track */}
            <div className="flex animate-marquee gap-8 py-4">
              {duplicatedFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={index}
                    className={`group min-w-[380px] bg-transparent p-8 rounded-3xl 
                      ${feature.hoverColor} transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 
                      backdrop-blur-sm relative overflow-hidden animate-float`}
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    {/* Shimmer effect overlay */}
                    <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon container with enhanced styling */}
                      <div className={`${feature.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 
                        group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg`}>
                        <IconComponent className={`h-8 w-8 ${feature.iconColor} group-hover:scale-110 transition-transform duration-300`} />
                      </div>
                      
                      {/* Title with gradient on hover */}
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-transparent 
                        group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 
                        group-hover:bg-clip-text transition-all duration-300">
                        {feature.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm group-hover:text-gray-700 
                        dark:group-hover:text-gray-200 transition-colors duration-300">
                        {feature.description}
                      </p>
                    </div>

                    {/* Decorative corner accent */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-transparent via-transparent 
                      to-blue-500/5 dark:to-blue-400/10 rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Bottom accent line */}
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.iconColor.replace('text-', 'from-')} 
                      to-transparent w-0 group-hover:w-full transition-all duration-500 rounded-full`}></div>
                  </div>
                );
              })}
            </div>
          </div>


        </div>

        {/* Background decorative elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/5 dark:bg-blue-400/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-purple-500/5 dark:bg-purple-400/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </section>
    </>
  );
};

export default Features;