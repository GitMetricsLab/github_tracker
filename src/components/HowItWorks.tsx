import { motion } from 'framer-motion';
import { Search, Activity, BarChart3 } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Search Users',
    description: 'Enter GitHub usernames or search by name. Add them instantly to your tracking dashboard.',
    icon: Search,
    glow: '59,130,246',
    gradientFrom: 'rgba(59,130,246,0.12)',
    iconBg: 'bg-blue-500/10 dark:bg-blue-500/15',
    iconColor: 'text-blue-600 dark:text-blue-400',
    numberColor: 'text-blue-500',
    numberShadow: '59,130,246',
    numberBorder: 'rgba(59,130,246,0.25)',
    numberBg: 'rgba(59,130,246,0.06)',
    accentLine: 'rgba(59,130,246,0.7)',
    hoverBorder: 'rgba(59,130,246,0.3)',
    hoverShadow: '0 12px 40px rgba(59,130,246,0.10), 0 2px 12px rgba(59,130,246,0.06)',
    arrowColor: '99,120,230',
  },
  {
    number: '02',
    title: 'Monitor Activity',
    description: 'Watch real-time insights of commits, pull requests, issues, and other GitHub activities.',
    icon: Activity,
    glow: '139,92,246',
    gradientFrom: 'rgba(139,92,246,0.12)',
    iconBg: 'bg-violet-500/10 dark:bg-violet-500/15',
    iconColor: 'text-violet-600 dark:text-violet-400',
    numberColor: 'text-violet-500',
    numberShadow: '139,92,246',
    numberBorder: 'rgba(139,92,246,0.25)',
    numberBg: 'rgba(139,92,246,0.06)',
    accentLine: 'rgba(139,92,246,0.7)',
    hoverBorder: 'rgba(139,92,246,0.3)',
    hoverShadow: '0 12px 40px rgba(139,92,246,0.10), 0 2px 12px rgba(139,92,246,0.06)',
    arrowColor: '100,160,140',
  },
  {
    number: '03',
    title: 'Analyze Insights',
    description: 'Review detailed analytics, export reports, and gain valuable insights into development patterns.',
    icon: BarChart3,
    glow: '16,185,129',
    gradientFrom: 'rgba(16,185,129,0.12)',
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    numberColor: 'text-emerald-500',
    numberShadow: '16,185,129',
    numberBorder: 'rgba(16,185,129,0.25)',
    numberBg: 'rgba(16,185,129,0.06)',
    accentLine: 'rgba(16,185,129,0.7)',
    hoverBorder: 'rgba(16,185,129,0.3)',
    hoverShadow: '0 12px 40px rgba(16,185,129,0.10), 0 2px 12px rgba(16,185,129,0.06)',
    arrowColor: null,
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 65, damping: 18 },
  },
};

// Arrow bubble shown between cards (no line, just the circle+arrow)
const ArrowBubble = ({ color }) => (
  <motion.div
    className="flex-shrink-0 self-center"
    initial={{ opacity: 0, scale: 0.7 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay: 0.4, duration: 0.35, ease: 'easeOut' }}
  >
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center"
      style={{
        border: `1px solid rgba(${color}, 0.28)`,
        background: 'rgba(255,255,255,0.9)',
        boxShadow: `0 0 16px rgba(${color}, 0.18)`,
        backdropFilter: 'blur(8px)',
      }}
    >
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <path
          d="M2 6.5h9M8 3l3.5 3.5L8 10"
          stroke={`rgba(${color},0.85)`}
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  </motion.div>
);

// Down arrow for mobile
const DownArrowBubble = ({ color }) => (
  <motion.div
    className="flex justify-center my-1"
    initial={{ opacity: 0, scale: 0.7 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay: 0.35, duration: 0.3 }}
  >
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center"
      style={{
        border: `1px solid rgba(${color}, 0.28)`,
        background: 'rgba(255,255,255,0.9)',
        boxShadow: `0 0 16px rgba(${color}, 0.18)`,
        backdropFilter: 'blur(8px)',
      }}
    >
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <path
          d="M6.5 2v9M3 8l3.5 3.5L10 8"
          stroke={`rgba(${color},0.85)`}
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  </motion.div>
);

const StepCard = ({ step, className = '' }) => {
  const Icon = step.icon;
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -5, scale: 1.018 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className={`group relative rounded-2xl border border-gray-300/70 dark:border-white/[0.14]
        bg-white/90 dark:bg-white/[0.04] backdrop-blur-md
        shadow-sm overflow-hidden cursor-default h-full
        transition-all duration-300 ${className}`}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = step.hoverBorder;
        e.currentTarget.style.boxShadow = step.hoverShadow;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      {/* Subtle top accent line on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${step.accentLine}, transparent)`,
        }}
      />

      <div className="relative z-10 p-9 min-h-[270px] flex flex-col">
        {/* Number badge + Icon row */}
        <div className="flex items-start justify-between mb-7">

          {/* Number inside rounded square */}
          <div
            className="rounded-xl px-4 py-2 select-none"
            style={{
              border: `1px solid ${step.numberBorder}`,
              background: step.numberBg,
              boxShadow: `0 0 20px rgba(${step.numberShadow},0.12), inset 0 1px 0 rgba(255,255,255,0.6)`,
            }}
          >
            <span
              className={`text-5xl font-black leading-none ${step.numberColor}`}
              style={{
                textShadow: `0 0 24px rgba(${step.numberShadow},0.45)`,
                opacity: 0.75,
              }}
            >
              {step.number}
            </span>
          </div>

          {/* Icon */}
          <motion.div
            className={`${step.iconBg} w-14 h-14 rounded-xl flex items-center justify-center`}
            whileHover={{ rotate: 7, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 350, damping: 16 }}
          >
            <Icon className={`h-6 w-6 ${step.iconColor}`} />
          </motion.div>
        </div>

        {/* Text */}
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3 tracking-tight leading-snug">
          {step.title}
        </h3>
        <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed">
          {step.description}
        </p>
      </div>
    </motion.div>
  );
};

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="relative w-full py-20 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-[#13151f] dark:via-[#171924] dark:to-[#13151f] transition-colors duration-300"
    >
      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Ambient blobs */}
      <div className="pointer-events-none absolute -top-40 right-10 w-96 h-96 rounded-full bg-violet-300/15 dark:bg-violet-500/8 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-40 left-10 w-96 h-96 rounded-full bg-blue-300/15 dark:bg-blue-500/8 blur-[110px]" />

      <div className="relative w-full max-w-5xl mx-auto px-6">

        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-5 tracking-tight">
            How It Works
          </h2>
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-blue-200 dark:border-blue-500/20 bg-blue-50/80 dark:bg-blue-500/10 backdrop-blur-sm shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse flex-shrink-0" />
            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
              Get started in minutes with our simple three-step process
            </p>
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse flex-shrink-0" />
          </div>
        </motion.div>

        {/* Desktop: cards + arrow bubbles in a flex row */}
        <motion.div
          className="hidden md:flex items-stretch gap-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {steps.map((step, i) => (
            <>
              <div key={step.number} className="flex-1 min-w-0 flex flex-col">
                <StepCard step={step} className="flex-1" />
              </div>
              {i < steps.length - 1 && (
                <ArrowBubble key={`arrow-${i}`} color={step.arrowColor} />
              )}
            </>
          ))}
        </motion.div>

        {/* Mobile: stacked cards + down arrows */}
        <motion.div
          className="flex flex-col md:hidden gap-0"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {steps.map((step, i) => (
            <>
              <motion.div key={step.number} variants={cardVariants}>
                <StepCard step={step} />
              </motion.div>
              {i < steps.length - 1 && (
                <DownArrowBubble key={`down-${i}`} color={step.arrowColor} />
              )}
            </>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default HowItWorks;