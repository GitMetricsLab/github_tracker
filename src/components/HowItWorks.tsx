import { BarChart3, Activity, Search } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: 'Search Users',
      label: 'Discover',
      description: 'Enter GitHub usernames or search for users by name. Add them to your tracking dashboard.',
      icon: Search,
    },
    {
      number: 2,
      title: 'Monitor Activity',
      label: 'Observe',
      description: 'Watch insights of commits, pull requests, issues, and other GitHub activities.',
      icon: Activity,
    },
    {
      number: 3,
      title: 'Analyze Insights',
      label: 'Review',
      description: 'Review detailed analytics, export reports, and gain valuable insights into development patterns.',
      icon: BarChart3,
    }
  ];

  return (
    <section id="how-it-works" className="how-it-works-section relative overflow-hidden px-6 py-20 text-slate-900 md:py-24">
      <div className="how-it-works-ambient how-it-works-ambient-left" aria-hidden="true" />
      <div className="how-it-works-ambient how-it-works-ambient-right" aria-hidden="true" />
      <div className="how-it-works-grid-overlay" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-blue-200/80 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-blue-600 shadow-[0_10px_30px_rgba(79,124,255,0.08)] backdrop-blur-sm">
            Workflow pipeline
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600 md:text-lg">
            A clean three-step flow with a horizontal rhythm, subtle hierarchy, and just enough motion to feel polished.
          </p>
        </div>

        <div className="relative mt-14 md:mt-16">
          <div className="how-it-works-timeline-line pointer-events-none absolute left-6 right-6 top-7 hidden md:block" aria-hidden="true" />

          <ol className="relative grid gap-10 md:grid-cols-3 md:gap-8 lg:gap-10">
            {steps.map((step, index) => {
              const IconComponent = step.icon;

              return (
                <li
                  key={step.title}
                  className="group relative flex flex-col items-center text-center"
                >
                  <div className="workflow-step-marker relative z-10 flex h-14 w-14 items-center justify-center rounded-[1.25rem] border border-blue-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,250,255,0.9))] text-blue-600 shadow-[0_14px_30px_rgba(79,124,255,0.14)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_18px_34px_rgba(79,124,255,0.18)]">
                    <span className="text-[0.95rem] font-semibold tracking-[0.18em] text-blue-600">
                      {String(step.number).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-blue-100/80 bg-white/75 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500 shadow-[0_8px_20px_rgba(15,23,42,0.04)] backdrop-blur-sm">
                    <span className="workflow-step-icon inline-flex h-7 w-7 items-center justify-center rounded-full border border-blue-100 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(240,245,255,0.88))] text-blue-600 shadow-[0_8px_16px_rgba(79,124,255,0.08)] transition-transform duration-300 group-hover:scale-105">
                      <IconComponent className="h-3.5 w-3.5" />
                    </span>
                    <span>{step.label}</span>
                  </div>

                  <h3 className="mt-4 text-[1.35rem] font-semibold tracking-tight text-slate-900 md:text-[1.5rem]">
                    {step.title}
                  </h3>

                  <p className="mx-auto mt-3 max-w-[18rem] text-sm leading-7 text-slate-600 md:text-[0.98rem]">
                    {step.description}
                  </p>

                  {index < steps.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="how-it-works-step-link mt-8 hidden w-full md:block"
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
