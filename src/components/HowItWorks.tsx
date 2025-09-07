import { Search, BarChart3, TrendingUp, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = [
    {
      number: 1,
      title: 'Search Users',
      description: 'Enter GitHub usernames or search for users by name. Add them to your tracking dashboard with intelligent auto-suggestions.',
      icon: Search,
      blueShade: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
      borderColor: 'border-blue-200 dark:border-blue-800',
      hoverBorderColor: 'hover:border-blue-300 dark:hover:border-blue-700'
    },
    {
      number: 2,
      title: 'Monitor Activity',
      description: 'Watch real-time insights of commits, pull requests, issues, and other GitHub activities with comprehensive analytics.',
      icon: BarChart3,
      blueShade: 'from-blue-500 to-blue-700',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
      borderColor: 'border-blue-200 dark:border-blue-800',
      hoverBorderColor: 'hover:border-blue-300 dark:hover:border-blue-700'
    },
    {
      number: 3,
      title: 'Analyze Insights',
      description: 'Review detailed analytics, export comprehensive reports, and gain valuable insights into development patterns and trends.',
      icon: TrendingUp,
      blueShade: 'from-blue-600 to-blue-800',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
      borderColor: 'border-blue-200 dark:border-blue-800',
      hoverBorderColor: 'hover:border-blue-300 dark:hover:border-blue-700'
    }
  ];

  return (
    <section id="how-it-works" className="px-6 py-20 bg-gradient-to-b from-blue-50 via-white to-blue-50 dark:from-blue-950 dark:via-gray-950 dark:to-blue-950 transition-colors duration-300 relative">
      
      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200 dark:bg-blue-900/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-blue-300 dark:bg-blue-800/50 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent dark:from-blue-400 dark:via-blue-500 dark:to-blue-600">
              How It Works
            </span>
          </h2>
          <p className="text-xl text-blue-700 dark:text-blue-300 max-w-3xl mx-auto leading-relaxed">
            Get started in minutes with our intuitive three-step process designed for developers and teams
          </p>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connection Lines */}
            <div className="absolute top-32 left-0 right-0 flex items-center justify-center">
              <div className="flex items-center space-x-8 w-full max-w-4xl">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-300 dark:via-blue-600 to-transparent opacity-60"></div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-300 dark:via-blue-600 to-transparent opacity-60"></div>
              </div>
            </div>

            {/* Steps */}
            <div className="grid grid-cols-3 gap-12 relative z-10">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div 
                    key={index}
                    className="group cursor-pointer"
                    onMouseEnter={() => setActiveStep(index)}
                  >
                    {/* Card */}
                    <div className={`relative p-8 rounded-3xl transition-all duration-300 
                      ${step.bgColor} backdrop-blur-sm
                      border-2 ${step.borderColor} ${step.hoverBorderColor}
                      hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1
                      ${activeStep === index ? 'shadow-2xl shadow-blue-500/10 -translate-y-1 border-blue-300 dark:border-blue-700' : 'shadow-lg'}`}>
                      
                      {/* Icon Container */}
                      <div className="relative mb-8">
                        <div className={`relative w-20 h-20 bg-gradient-to-r ${step.blueShade} rounded-2xl flex items-center justify-center mx-auto shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:shadow-blue-500/25 group-hover:scale-105`}>
                          <IconComponent className="h-10 w-10 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg transform -translate-x-6">
                          {step.number}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-4 transition-colors duration-300 group-hover:text-blue-800 dark:group-hover:text-blue-50">
                          {step.title}
                        </h3>
                        <p className="text-blue-700 dark:text-blue-300 leading-relaxed text-lg transition-colors duration-300 group-hover:text-blue-800 dark:group-hover:text-blue-200">
                          {step.description}
                        </p>
                      </div>

                      {/* Subtle decorative elements */}
                      <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${step.blueShade} opacity-5 dark:opacity-10 rounded-bl-3xl rounded-tr-3xl`}></div>
                      
                      {/* Bottom accent */}
                      <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r ${step.blueShade} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    </div>

                    {/* Arrow connector */}
                    {index < steps.length - 1 && (
                      <div className="absolute top-32 -right-6 transform translate-x-full">
                        <div className="w-10 h-10 bg-white dark:bg-blue-900 rounded-full border-2 border-blue-200 dark:border-blue-700 flex items-center justify-center shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105 hover:border-blue-300 dark:hover:border-blue-600">
                          <ArrowRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden space-y-12">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="relative">
                {/* Step Card */}
                <div className={`p-8 rounded-3xl ${step.bgColor} backdrop-blur-sm border-2 ${step.borderColor} shadow-lg hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 ${step.hoverBorderColor}`}>
                  <div className="flex items-start space-x-6">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className={`relative w-16 h-16 bg-gradient-to-r ${step.blueShade} rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25`}>
                        <IconComponent className="h-8 w-8 text-white" />
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {step.number}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-3">
                        {step.title}
                      </h3>
                      <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mobile connector */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center my-6">
                    <div className="w-px h-8 bg-gradient-to-b from-blue-300 dark:from-blue-600 to-transparent opacity-50"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 text-gray-700 dark:text-gray-300 font-semibold text-lg hover:text-gray-900 dark:hover:text-white transition-colors duration-300 cursor-pointer group">
            <span>Ready to get started?</span>
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;