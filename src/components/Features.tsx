import { BarChart3, Users, Search, Zap, Shield, Globe } from 'lucide-react';
import type { ReactNode } from 'react';

type TerminalHeadingProps = {
  title: string;
  as?: 'h2' | 'h3' | 'h4';
  className?: string;
  promptClassName?: string;
  titleClassName?: string;
  animated?: boolean;
};

type TerminalCardProps = {
  label: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  accent?: 'blue' | 'green';
};

const headingSizes: Record<NonNullable<TerminalHeadingProps['as']>, string> = {
  h2: 'text-3xl md:text-4xl',
  h3: 'text-xl md:text-2xl',
  h4: 'text-lg md:text-xl',
};

const TerminalHeading = ({
  title,
  as: HeadingTag = 'h2',
  className = '',
  promptClassName = '',
  titleClassName = '',
  animated = false,
}: TerminalHeadingProps) => {
  const chars = title.length + 2;

  return (
    <HeadingTag
      className={`inline-flex items-center gap-2 text-balance text-[#c9d1d9] ${headingSizes[HeadingTag]} ${className}`}
      style={animated ? ({ '--terminal-chars': chars } as React.CSSProperties) : undefined}
    >
      <span
        className={`font-["VT323"] text-[#58a6ff] ${animated ? 'terminal-typewriter inline-block' : ''} ${promptClassName}`}
      >
        &gt;
      </span>
      <span
        className={`font-["VT323"] tracking-[0.03em] ${animated ? 'terminal-typewriter inline-block' : ''} ${titleClassName}`}
      >
        {title}
      </span>
    </HeadingTag>
  );
};

const TerminalCard = ({
  label,
  children,
  className = '',
  contentClassName = '',
  accent = 'blue',
}: TerminalCardProps) => {
  const accentClasses = accent === 'green' ? 'text-[#3fb950] border-[#3fb950]/30' : 'text-[#58a6ff] border-[#58a6ff]/30';

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border border-[#30363d] bg-[#161b22] shadow-[0_12px_30px_rgba(1,4,9,0.22)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#58a6ff]/40 hover:shadow-[0_18px_38px_rgba(1,4,9,0.35)] ${className}`}
    >
      <div className="flex items-center justify-between gap-4 border-b border-[#30363d] bg-[#0d1117]/90 px-4 py-3">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#f85149]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#d29922]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#3fb950]/80" />
        </div>

        <div className={`flex items-center gap-2 font-["VT323"] text-sm uppercase tracking-[0.22em] ${accentClasses}`}>
          <span>{label}</span>
          <span className="terminal-card-cursor opacity-0 transition-opacity duration-200 group-hover:opacity-100">_</span>
        </div>
      </div>

      <div className={`relative px-5 py-5 sm:px-6 sm:py-6 ${contentClassName}`}>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        {children}
      </div>
    </article>
  );
};

const Features = () => {
  const features = [
    {
      icon: BarChart3,
      title: 'Activity Analytics',
      description: 'Comprehensive charts and graphs showing commit patterns, contribution streaks, and repository activity over time.',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      hoverColor: 'hover:bg-blue-400/50 dark:hover:bg-blue-900/30',
      borderColor: 'hover:border-blue-200 dark:hover:border-blue-700'
    },
    {
      icon: Users,
      title: 'Multi-User Tracking',
      description: 'Monitor multiple GitHub users simultaneously and compare their activity levels and contribution patterns.',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      hoverColor: 'hover:bg-green-400/50 dark:hover:bg-green-900/30',
      borderColor: 'hover:border-green-200 dark:hover:border-green-700'
    },
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Quickly find and add users to your tracking list with intelligent search and auto-suggestions.',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      hoverColor: 'hover:bg-purple-400/50 dark:hover:bg-purple-900/30',
      borderColor: 'hover:border-purple-200 dark:hover:border-purple-700'
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
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

  return (
    <section
      id="features"
      className="relative left-1/2 right-1/2 w-screen -mx-[50vw] overflow-hidden bg-[linear-gradient(to_bottom,#f8fafc_0%,#dbe7f5_20%,#0d1117_100%)] px-6 py-16 text-[#c9d1d9] transition-colors duration-300 sm:py-20"
      style={{
        boxShadow: '0 -40px 80px rgba(88,166,255,0.08), 0 40px 80px rgba(88,166,255,0.05)',
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(88,166,255,0.08),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(63,185,80,0.05),_transparent_28%)] pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#f8fafc]/75 via-[#dbe7f5]/20 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/70 to-transparent pointer-events-none" />
      <div className="mx-auto max-w-7xl relative">
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
          <p className="font-['VT323'] text-sm uppercase tracking-[0.32em] text-[#58a6ff] sm:text-base">
            &gt; initialize tracking capabilities
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-black md:text-4xl">
            Powerful Features
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#8b949e] sm:text-base">
            Everything you need to track, analyze, and understand GitHub activity patterns.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            const promptLabel = `feature-${String(index + 1).padStart(2, '0')}`;
            const titleTone = index % 2 === 0 ? 'blue' : 'green';
            return (
              <TerminalCard key={index} label={promptLabel} accent={titleTone} className="h-full">
                <div className="flex h-full flex-col gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#30363d] bg-[#0d1117] text-[#58a6ff] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-2">
                      <TerminalHeading
                        title={feature.title}
                        as="h3"
                        className="items-start"
                        titleClassName="text-[#f0f6fc]"
                      />
                      <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-[#8b949e]">
                        <span className="rounded-full border border-[#30363d] bg-[#0d1117] px-2.5 py-1 font-['VT323'] text-[#58a6ff]">
                          cmd
                        </span>
                        <span className="font-['VT323']">gh tracker --feature</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed text-[#8b949e] sm:text-[0.95rem]">
                    {feature.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between border-t border-[#30363d] pt-4 text-xs text-[#8b949e]">
                    <span className="font-['VT323'] uppercase tracking-[0.2em] text-[#3fb950]">ready</span>
                    <span className="font-['VT323'] text-[#58a6ff]">{feature.title.toLowerCase().replace(/\s+/g, '-')}</span>
                  </div>
                </div>
              </TerminalCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
