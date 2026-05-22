import React from "react";
import { motion } from "framer-motion";
import { Lightbulb, Users, Settings, Search, ArrowRight, ExternalLink } from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Stat {
  value: string;
  label: string;
}

const features: Feature[] = [
  {
    icon: <Search size={24} className="text-blue-600 dark:text-blue-400" />,
    title: "Simple Issue Tracking",
    description: "Track your GitHub issues seamlessly with intuitive filters, global search parameters, and structural clarity.",
  },
  {
    icon: <Users size={24} className="text-blue-600 dark:text-blue-400" />,
    title: "Team Collaboration",
    description: "Collaborate with your product team in real-time. Assign issues, manage pipelines, and merge pull requests natively.",
  },
  {
    icon: <Settings size={24} className="text-blue-600 dark:text-blue-400" />,
    title: "Customizable Settings",
    description: "Tailor your issue boards, automation loops, and priority workflows to map exactly to your team's lifecycle.",
  },
];

const stats: Stat[] = [
  { value: "99.9%", label: "Uptime SLA" },
  { value: "10x", label: "Faster Issue Triaging" },
  { value: "24/7", label: "Automated Webhooks" },
  { value: "0ms", label: "Stale State Desync" },
];

const About: React.FC = () => {
  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen font-sans overflow-x-hidden selection:bg-blue-500/20 transition-colors duration-200">
      
      {/* 🌌 1. Enhanced Full-Width Hero Section */}
      <section className="relative w-full py-32 md:py-40 text-center px-4 overflow-hidden border-b border-slate-200/60 dark:border-slate-800/50 bg-white dark:bg-slate-950 flex flex-col items-center justify-center">
        <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[800px] h-[450px] bg-blue-500/10 dark:bg-blue-500/5 blur-[140px] rounded-full pointer-events-none" />

        <div className="relative w-full max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 z-10">
          <motion.span 
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold tracking-wider text-blue-700 dark:text-blue-400 uppercase bg-blue-50 dark:bg-blue-950/40 border border-blue-200/30 dark:border-blue-900/40 rounded-full shadow-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Our Identity
          </motion.span>
          
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] sm:leading-none max-w-5xl mx-auto bg-clip-text text-transparent bg-gradient-to-b from-slate-900 via-slate-950 to-slate-700 dark:from-white dark:via-white dark:to-slate-400"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Engineered to Solve <br className="hidden sm:inline" /> Development Chaos
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl max-w-3xl mx-auto text-slate-600 dark:text-slate-400 font-normal leading-relaxed md:leading-loose"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Welcome to <strong className="text-blue-600 dark:text-blue-400 font-semibold tracking-wide">GitHub Tracker</strong>. We build elegant orchestration layers that sit directly on top of your standard technical workflows.
          </motion.p>
        </div>
      </section>

      {/* 📊 2. High-Density Metrics / Performance Strip Section */}
      <section className="w-full bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-900/60 py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              className="space-y-2"
            >
              <h4 className="text-3xl md:text-4xl font-extrabold text-blue-600 dark:text-blue-500 tracking-tight">{stat.value}</h4>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🎯 3. Asymmetrical Mission Section */}
      <section className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-slate-50/30 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div 
            className="lg:col-span-5 space-y-4"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            {/* Added exact flex sizing to prevent icon box layout squishing */}
            <div className="w-12 h-12 min-w-[48px] min-h-[48px] bg-gradient-to-tr from-blue-600 to-sky-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 dark:shadow-blue-500/10 mb-2">
              <Lightbulb size={22} className="text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Our Continuous Mission
            </h2>
            <div className="h-1 w-20 bg-blue-600 dark:bg-blue-500 rounded-full" />
          </motion.div>

          <motion.div 
            className="lg:col-span-7 p-8 sm:p-10 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl shadow-sm space-y-6 relative group"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full transition-all group-hover:scale-110 pointer-events-none" />
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              We aim to provide an efficient and hyper-intuitive paradigm to manage public or private repositories, issues, and complex pull requests.
            </p>
            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Our philosophy is rooted in abstraction: stripping away cluttered interfaces so developers, engineering managers, and maintainers can maintain deep operational flow without losing visibility of administrative tracking elements.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 🚀 4. Full-Width Feature Grid Section */}
      <section className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900/40">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">What We Orchestrate</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm md:text-base">
              A precise architectural breakdown of the utility features engineered directly into your tracking layer.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                className="flex flex-col p-8 bg-slate-50/50 dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/60 shadow-sm relative overflow-hidden group"
                whileHover={{ y: -6, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.04)" }} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/30 rounded-xl mb-6 w-fit flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">{feature.description}</p>
                <div className="mt-auto pt-2 flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  Learn architecture <ArrowRight size={14} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🚀 5. Premium Full-Width CTA Section */}
      <section className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900/40">
        {/* Expanded width to max-w-7xl to dynamically match the proportions of the upper layout segments */}
        <div className="max-w-7xl mx-auto relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-10 sm:p-14 lg:p-16 text-center space-y-6 shadow-xl shadow-blue-500/10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/10 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="relative space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Ready to Master Your Workspaces?</h2>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              Connect your GitHub account today and unify your tracking metrics. Deploy natively inside cloud pipelines or self-host your secure stack instances instantly.
            </p>
          </div>
          
          <div className="relative pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-blue-600 font-bold text-sm rounded-xl shadow-md hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              Get Started Free <ArrowRight size={16} />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.03 }}
              className="w-full sm:w-auto px-6 py-3.5 bg-white/10 text-white border border-white/20 font-bold text-sm rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              View Repository <ExternalLink size={14} />
            </motion.button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;