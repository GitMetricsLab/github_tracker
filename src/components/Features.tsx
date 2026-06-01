import { BarChart3, Users, Search, Zap, Shield, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const Features = () => {
  const features = [
    {
      icon: BarChart3,
      title: 'Activity Analytics',
      description: 'Detailed insights into commits, pull requests, and code activity patterns with beautiful visualizations.',
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      darkBg: 'dark:bg-blue-900/20'
      description: 'Comprehensive charts and graphs showing commit patterns, contribution streaks, and repository activity over time.',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      hoverColor: 'hover:bg-blue-400/50 dark:hover:bg-blue-900/30',
      borderColor: 'hover:border-blue-200 dark:hover:border-blue-700'
    },
    {
      icon: Users,
      title: 'Multi-User Tracking',
      description: 'Track multiple users and compare contribution metrics side by side in real-time dashboards.',
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      darkBg: 'dark:bg-green-900/20'
      description: 'Monitor multiple GitHub users simultaneously and compare their activity levels and contribution patterns.',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      hoverColor: 'hover:bg-green-400/50 dark:hover:bg-green-900/30',
      borderColor: 'hover:border-green-200 dark:hover:border-green-700'
    },
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Advanced search and filtering to find specific repositories and contributions with ease.',
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      darkBg: 'dark:bg-purple-900/20'
      description: 'Quickly find and add users to your tracking list with intelligent search and auto-suggestions.',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      hoverColor: 'hover:bg-purple-400/50 dark:hover:bg-purple-900/30',
      borderColor: 'hover:border-purple-200 dark:hover:border-purple-700'
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Stay ahead with instant notifications on new contributions and repository changes as they happen.',
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      darkBg: 'dark:bg-orange-900/20'
    },
    {
      icon: Shield,
      title: 'Privacy Focused',
      description: 'Your data is safe. We use public APIs and never store sensitive personal information.',
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50',
      darkBg: 'dark:bg-red-900/20'
    },
    {
      icon: Globe,
      title: 'Global Insights',
      description: 'Understand development trends across different regions and open-source ecosystems.',
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      darkBg: 'dark:bg-indigo-900/20'
      description: 'Get instant notifications and updates when tracked users make new contributions or repositories.',
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      hoverColor: 'hover:bg-orange-400/50 dark:hover:bg-orange-900/30',
      borderColor: 'hover:border-orange-200 dark:hover:border-orange-700'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'All data is fetched from public GitHub APIs. We don\'t store personal information or require GitHub access.',
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
      hoverColor: 'hover:bg-red-400/50 dark:hover:bg-red-900/30',
      borderColor: 'hover:border-red-200 dark:hover:border-red-700'
    },
    {
      icon: Globe,
      title: 'Export & Share',
      description: 'Export activity reports and share insights with your team through various formats and integrations.',
      bgColor: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      hoverColor: 'hover:bg-indigo-400/50 dark:hover:bg-indigo-900/30',
      borderColor: 'hover:border-indigo-200 dark:hover:border-indigo-700'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="features" className="px-6 py-24 bg-white dark:bg-dark transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight"
          >
            Powerful Features
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Everything you need to track, analyze, and understand GitHub activity patterns
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="group p-8 rounded-3xl bg-gray-50 dark:bg-dark-lighter border border-gray-100 dark:border-dark-border hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300"
              >
                <div className={`${feature.bgColor} ${feature.darkBg} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`h-7 w-7 ${feature.iconColor}`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              <div key={index} className={`group h-72 w-full bg-gray-100 dark:bg-gray-800 ${feature.hoverColor} ${feature.borderColor} rounded-2xl shadow-md hover:shadow-2xl hover:shadow-blue-500/20 border dark:border-gray-800 transform hover:-translate-y-3 hover:scale-105 backdrop-blur-sm transition-all duration-300 ease-linear p-6`}>
                <div className={`${feature.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-6 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110`}>
                  <IconComponent className={`h-6 w-6 ${feature.iconColor}`} />
                </div>
                <h3 className="  text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-black dark:group-hover:text-white transition-colors duration-300">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-base font-semibold leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
