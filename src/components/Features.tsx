import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { BarChart3, Users, Search, Zap, Shield, Globe } from 'lucide-react';
import { useRef, useState } from 'react';

const features = [
  {
    icon: BarChart3,
    title: 'Activity Analytics',
    description: 'Comprehensive charts showing commit patterns, contribution streaks, and repository activity over time.',
    iconBg: 'bg-blue-500/15 dark:bg-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    glow: '59,130,246',
    border: 'hover:border-blue-400/50 dark:hover:border-blue-500/50',
  },
  {
    icon: Users,
    title: 'Multi-User Tracking',
    description: 'Monitor multiple GitHub users simultaneously and compare contribution patterns side by side.',
    iconBg: 'bg-emerald-500/15 dark:bg-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    glow: '16,185,129',
    border: 'hover:border-emerald-400/50 dark:hover:border-emerald-500/50',
  },
  {
    icon: Search,
    title: 'Smart Search',
    description: 'Intelligent search with auto-suggestions to instantly find and add users to your dashboard.',
    iconBg: 'bg-violet-500/15 dark:bg-violet-500/20',
    iconColor: 'text-violet-600 dark:text-violet-400',
    glow: '139,92,246',
    border: 'hover:border-violet-400/50 dark:hover:border-violet-500/50',
  },
  {
    icon: Zap,
    title: 'Real-time Updates',
    description: 'Instant notifications when tracked users push commits, open PRs, or create repositories.',
    iconBg: 'bg-amber-500/15 dark:bg-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
    glow: '245,158,11',
    border: 'hover:border-amber-400/50 dark:hover:border-amber-500/50',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Public GitHub APIs only. Zero personal data stored, no authentication required from users.',
    iconBg: 'bg-rose-500/15 dark:bg-rose-500/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
    glow: '244,63,94',
    border: 'hover:border-rose-400/50 dark:hover:border-rose-500/50',
  },
  {
    icon: Globe,
    title: 'Export & Share',
    description: 'Export activity reports and share insights with your team through various formats and integrations.',
    iconBg: 'bg-cyan-500/15 dark:bg-cyan-500/20',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    glow: '6,182,212',
    border: 'hover:border-cyan-400/50 dark:hover:border-cyan-500/50',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 70, damping: 18 },
  },
};

const FeatureCard = ({ feature }: { feature: typeof features[0] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), {
    stiffness: 250,
    damping: 28,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), {
    stiffness: 250,
    damping: 28,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setHovered(false);
  };

  const Icon = feature.icon;

  return (
    <motion.div
      variants={cardVariants}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className={`group relative rounded-2xl border border-gray-200 dark:border-white/[0.08] ${feature.border}
        bg-white dark:bg-white/[0.03] backdrop-blur-md
        shadow-sm hover:shadow-2xl
        transition-colors duration-300 cursor-default overflow-hidden`}
    >
      {/* Strong ambient glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-400"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(ellipse at 50% 0%, rgba(${feature.glow},0.22) 0%, transparent 60%)`,
        }}
      />

      {/* Bottom glow puddle */}
      <div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 rounded-full pointer-events-none transition-opacity duration-400 blur-xl"
        style={{
          opacity: hovered ? 0.5 : 0,
          background: `rgba(${feature.glow}, 0.35)`,
        }}
      />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl pointer-events-none transition-opacity duration-300"
        style={{
          opacity: hovered ? 1 : 0,
          background: `linear-gradient(90deg, transparent, rgba(${feature.glow},0.8), transparent)`,
        }}
      />

      {/* Card content */}
      <div className="relative z-10 p-7 min-h-[230px] flex flex-col">
        {/* Icon */}
        <motion.div
          className={`${feature.iconBg} w-14 h-14 rounded-xl flex items-center justify-center mb-5`}
          animate={
            hovered
              ? { rotate: 8, scale: 1.12 }
              : { rotate: 0, scale: 1 }
          }
          transition={{ type: 'spring', stiffness: 350, damping: 16 }}
        >
          <Icon className={`h-6 w-6 ${feature.iconColor}`} />
        </motion.div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 tracking-tight leading-snug">
          {feature.title}
        </h3>

        {/* Description */}
        <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
};

const Features = () => {
  return (
    <section
      id="features"
      className="relative py-16 overflow-hidden transition-colors duration-300"
    >
      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.07]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Ambient blobs */}
      <div className="pointer-events-none absolute -top-48 -left-48 w-[500px] h-[500px] rounded-full bg-blue-400/10 dark:bg-blue-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-48 -right-48 w-[500px] h-[500px] rounded-full bg-violet-400/10 dark:bg-violet-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-300/5 dark:bg-indigo-500/5 blur-[80px]" />

      <div className="relative max-w-5xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-5 tracking-tight">
            Powerful Features
          </h2>

          {/* Premium pill subtitle — no eyebrow badge */}
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-blue-200 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-500/10 backdrop-blur-sm shadow-md shadow-gray-100 dark:shadow-none">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse flex-shrink-0" />
            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
              Everything you need to track, analyze, and understand GitHub activity patterns
            </p>
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse flex-shrink-0" />
          </div>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-fr"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;