import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Users, Settings, Search, Check, X } from "lucide-react";

const features = [
  {
    icon: <Search size={40} className="text-indigo-600 dark:text-indigo-400" />,
    title: "Simple Issue Tracking",
    description: "Track your GitHub issues seamlessly with intuitive filters and search options.",
    details: {
      description: "Optimize your productivity with a streamlined and powerful issue tracker. Filter, search, and manage your workload efficiently.",
      bullets: [
        { title: "Smart filtering", text: "Filter by author, label, assignee, state, and milestone." },
        { title: "Fast issue search", text: "Find any issue instantly with our optimized full-text indexing." },
        { title: "Organized workflows", text: "Keep track of your open, closed, and in-progress tasks easily." },
      ]
    }
  },
  {
    icon: <Users size={40} className="text-indigo-600 dark:text-indigo-400" />,
    title: "Team Collaboration",
    description: "Collaborate with your team in real-time, manage issues and pull requests effectively.",
    details: {
      description: "Empower your development team to work better together with deep GitHub integration and real-time coordination tools.",
      bullets: [
        { title: "Real-time updates", text: "Never miss a state change or comment with live updates synced to GitHub." },
        { title: "Shared discussions", text: "Collaborate on issues directly through structured discussions and threads." },
        { title: "Pull request coordination", text: "Link issues to pull requests and see status updates at a glance." },
      ]
    }
  },
  {
    icon: <Settings size={40} className="text-indigo-600 dark:text-indigo-400" />,
    title: "Customizable Settings",
    description: "Customize your issue tracking workflow to match your team's needs.",
    details: {
      description: "Tailor the platform to fit your individual preferences or your team's development workflows.",
      bullets: [
        { title: "Theme preferences", text: "Switch between dark mode, light mode, and system defaults." },
        { title: "Workflow customization", text: "Define custom columns, workflow states, and automated labels." },
        { title: "Notification controls", text: "Configure email, desktop, or in-app alerts for relevant issue updates." },
      ]
    }
  },
];

const About = () => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const handleCardClick = (idx: number) => {
    setActiveIdx((prev) => {
      const next = prev === idx ? null : idx;
      if (next !== null) {
        setTimeout(() => {
          if (detailRef.current) {
            detailRef.current.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
            });
          }
        }, 150);
      }
      return next;
    });
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 text-black dark:text-white min-h-screen">
      
      {/* Hero Section */}
      <section className="py-24 text-center relative overflow-hidden">
        <motion.h1 
          className="text-5xl font-extrabold mb-4 drop-shadow-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          About Us
        </motion.h1>
        <motion.p 
          className="text-xl max-w-xl mx-auto text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Welcome to <strong>GitHub Tracker</strong> — your smart solution to manage GitHub issues without chaos.
        </motion.p>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6 bg-white dark:bg-gray-900 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Lightbulb size={48} className="mx-auto text-indigo-600 dark:text-indigo-400 mb-4" />
          <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg max-w-3xl mx-auto text-gray-700 dark:text-gray-300 leading-relaxed">
            We aim to provide an efficient and user-friendly way to track GitHub issues and pull requests.
            Our goal is to make it easy for developers to stay organized and focused on their projects
            without getting bogged down by the details.
          </p>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-gray-50 dark:bg-gray-950">
        <h2 className="text-4xl font-bold text-center mb-12">What We Do</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {features.map((feature, idx) => {
            const isActive = activeIdx === idx;
            return (
              <motion.div
                key={idx}
                role="button"
                tabIndex={0}
                aria-expanded={isActive}
                aria-controls={`feature-detail-${idx}`}
                id={`feature-card-${idx}`}
                className={`p-8 bg-white dark:bg-gray-800 rounded-2xl border text-center cursor-pointer select-none transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
                  ${isActive 
                    ? "border-indigo-500 dark:border-indigo-400 shadow-lg shadow-indigo-500/10 dark:shadow-indigo-400/5 bg-indigo-50/10 dark:bg-indigo-950/20" 
                    : "border-gray-100 dark:border-gray-700 shadow-md hover:border-indigo-300 dark:hover:border-indigo-700"
                  }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.5, ease: "easeOut" }}
                whileHover={{ 
                  scale: 1.03, 
                  y: -5,
                  transition: { duration: 0.2, ease: "easeOut" } 
                }}
                onClick={() => handleCardClick(idx)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCardClick(idx);
                  }
                }}
              >
                <div className="mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Detailed Expandable Section */}
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {activeIdx !== null && (
              <motion.div
                ref={detailRef}
                id={`feature-detail-${activeIdx}`}
                role="region"
                aria-labelledby={`feature-card-${activeIdx}`}
                initial={{ height: 0, opacity: 0, y: 15 }}
                animate={{ height: "auto", opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: 10 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="overflow-hidden mt-10"
              >
                <div className="p-8 md:p-10 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl relative overflow-hidden">
                  {/* Premium visual gradient top bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
                  
                  {/* Close Button */}
                  <button
                    onClick={() => setActiveIdx(null)}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    aria-label="Close details"
                  >
                    <X size={20} />
                  </button>

                  {/* Content Layout */}
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                      {features[activeIdx].icon}
                    </div>
                    <div className="flex-1 w-full">
                      <h3 className="text-2xl font-bold mb-3">{features[activeIdx].title}</h3>
                      <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        {features[activeIdx].details.description}
                      </p>

                      {/* Bullet Points Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {features[activeIdx].details.bullets.map((bullet, bIdx) => (
                          <div 
                            key={bIdx} 
                            className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100/50 dark:border-gray-800"
                          >
                            <div className="mt-1 p-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full flex-shrink-0">
                              <Check size={14} className="stroke-[3]" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                {bullet.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 leading-normal">
                                {bullet.text}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default About;
