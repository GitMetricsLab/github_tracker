import { motion } from 'framer-motion';
import { Search, LineChart, PieChart } from 'lucide-react';
import { useContext } from 'react';
import { ArrowDown, ArrowRight, BarChart3, Activity, Search } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import type { ThemeContextType } from '../context/ThemeContext';

const HowItWorks = () => {
  const themeContext = useContext(ThemeContext) as ThemeContextType | null;
  const mode = themeContext?.mode ?? 'light';

  const steps = [
    {
      icon: Search,
      title: 'Search Users',
      description: 'Enter GitHub usernames or search for users by name. Add them to your tracking dashboard with one click.'
      description: 'Enter GitHub usernames or search for users by name. Add them to your tracking dashboard.',
      icon: Search,
    },
    {
      icon: LineChart,
      title: 'Monitor Activity',
      description: 'Watch real-time insights of commits, pull requests, issues, and other GitHub activities across multiple users.'
      description: 'Watch insights of commits, pull requests, issues, and other GitHub activities.',
      icon: Activity,
    },
    {
      icon: PieChart,
      title: 'Analyze Insights',
      description: 'Review detailed analytics, export professional reports, and gain valuable insights into development patterns.'
      description: 'Review detailed analytics, export reports, and gain valuable insights into development patterns.',
      icon: BarChart3,
    }
  ];

  const sectionBgClass = mode === 'dark'
    ? 'bg-[#1e2130] text-white'
    : 'bg-gradient-to-b from-gray-50 via-white to-slate-100 text-gray-900';
  const cardSurfaceClass = mode === 'dark' ? 'bg-white/[0.04]' : 'bg-white';
  const cardBorderClass = mode === 'dark' ? 'border-white/10' : 'border-gray-200';
  const titleTextClass = mode === 'dark' ? 'text-white' : 'text-gray-900';
  const bodyTextClass = mode === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const connectorBubbleClass = mode === 'dark'
    ? 'rounded-full border border-blue-400/25 bg-[#1e2130] p-2 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.28)]'
    : 'rounded-full border border-blue-200 bg-white p-2 text-blue-600 shadow-[0_0_18px_rgba(59,130,246,0.14)]';
  const connectorLineClass = mode === 'dark'
    ? 'how-it-works-flow-line'
    : 'how-it-works-flow-line light';

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
    <section id="how-it-works" className={`relative overflow-hidden px-6 py-20 ${sectionBgClass}`}>
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${titleTextClass}`}>How It Works</h2>
          <p className={`text-lg md:text-xl max-w-2xl mx-auto ${bodyTextClass}`}>
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
        <div className="relative">
          <div className="pointer-events-none absolute left-0 right-0 top-28 hidden md:block">
            <div className="relative mx-auto h-10 max-w-6xl">
              <span className={`${connectorLineClass} absolute left-16 right-16 top-1/2 -translate-y-1/2`} />
              <span className={`absolute left-1/3 top-1/2 -translate-x-1/2 -translate-y-1/2 ${connectorBubbleClass}`}>
                <ArrowRight className="h-4 w-4" />
              </span>
              <span className={`absolute left-2/3 top-1/2 -translate-x-1/2 -translate-y-1/2 ${connectorBubbleClass}`}>
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>

          <div className="pointer-events-none absolute left-1/2 top-24 bottom-24 flex -translate-x-1/2 flex-col items-center justify-between md:hidden">
            <span className={connectorBubbleClass}>
              <ArrowDown className="h-4 w-4" />
            </span>
            <span className={connectorBubbleClass}>
              <ArrowDown className="h-4 w-4" />
            </span>
            <span className={`${connectorLineClass} vertical absolute left-1/2 top-0 h-full -translate-x-1/2`} />
          </div>

          <div className="grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;

              return (
                <article
                  key={index}
                  className={`group relative rounded-3xl border p-8 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:shadow-[0_24px_60px_rgba(46,89,255,0.18)] ${cardBorderClass} ${cardSurfaceClass} ${mode === 'dark' ? 'hover:bg-white/[0.06]' : 'hover:bg-white'}`}
                >
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-blue-400/20 bg-blue-500/10 shadow-[0_0_38px_rgba(46,89,255,0.35)] ring-1 ring-blue-400/15 transition-transform duration-300 group-hover:scale-105">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-blue-300/25 bg-blue-500 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_24px_rgba(46,89,255,0.38)]">
                      <span className="text-2xl font-bold leading-none">{step.number}</span>
                    </div>
                  </div>

                  <div className={`mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-full border shadow-[0_0_18px_rgba(46,89,255,0.2)] ${mode === 'dark' ? 'border-white/10 bg-white/5 text-blue-300' : 'border-blue-100 bg-blue-50 text-blue-600'}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>

                  <h3 className={`text-xl font-semibold mb-3 ${titleTextClass}`}>{step.title}</h3>
                  <p className={`text-sm md:text-base leading-relaxed ${bodyTextClass}`}>
                    {step.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
