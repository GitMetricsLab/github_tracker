import { BarChart3, Users, Search, Zap, Shield, Globe } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: BarChart3,
      title: 'Activity Analytics',
      description: 'Comprehensive charts and graphs showing commit patterns, contribution streaks, and repository activity over time.',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      icon: Users,
      title: 'Multi-User Tracking',
      description: 'Monitor multiple GitHub users simultaneously and compare their activity levels and contribution patterns.',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Quickly find and add users to your tracking list with intelligent search and auto-suggestions.',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Get instant notifications and updates when tracked users make new contributions or repositories.',
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'All data is fetched from public GitHub APIs. We don\'t store personal information or require GitHub access.',
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600'
    },
    {
      icon: Globe,
      title: 'Export & Share',
      description: 'Export activity reports and share insights with your team through various formats and integrations.',
      bgColor: 'bg-indigo-100',
      iconColor: 'text-indigo-600'
    }
  ];

  return (
    <section id="features" className="px-6 py-6 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to track, analyze, and understand GitHub activity patterns
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl hover:shadow-lg transition-all duration-300">
                <div className={`${feature.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-6`}>
                  <IconComponent className={`h-6 w-6 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
