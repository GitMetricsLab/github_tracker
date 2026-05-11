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
    },
    {
      icon: Users,
      title: 'Multi-User Tracking',
      description: 'Track multiple users and compare contribution metrics side by side in real-time dashboards.',
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      darkBg: 'dark:bg-green-900/20'
    },
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Advanced search and filtering to find specific repositories and contributions with ease.',
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      darkBg: 'dark:bg-purple-900/20'
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
