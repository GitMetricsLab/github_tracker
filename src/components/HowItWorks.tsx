import { motion } from 'framer-motion';
import { Search, LineChart, PieChart } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: 'Search Users',
      description: 'Enter GitHub usernames or search for users by name. Add them to your tracking dashboard with one click.'
    },
    {
      icon: LineChart,
      title: 'Monitor Activity',
      description: 'Watch real-time insights of commits, pull requests, issues, and other GitHub activities across multiple users.'
    },
    {
      icon: PieChart,
      title: 'Analyze Insights',
      description: 'Review detailed analytics, export professional reports, and gain valuable insights into development patterns.'
    }
  ];

  return (
    <section id="how-it-works" className="px-6 py-24 bg-gray-50 dark:bg-dark-lighter transition-colors duration-300 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight"
          >
            How It Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Get started in minutes with our simple three-step process
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="relative mb-8">
                  <div className="bg-blue-600 text-white w-20 h-20 rounded-3xl flex items-center justify-center mx-auto text-3xl font-bold shadow-xl shadow-blue-500/20 group-hover:rotate-6 transition-transform duration-300">
                    <IconComponent className="h-10 w-10" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-[calc(50%+60px)] w-[calc(100%-120px)] h-0.5 bg-gradient-to-r from-blue-200 to-transparent dark:from-blue-900"></div>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
